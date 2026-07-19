require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES CONFIGURATION

// Enable CORS with Credentials
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// DATABASE CONNECTION & UTILITIES
let db = null;
let client = null;

const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

async function connectDB() {
  try {
    client = new MongoClient(mongoUri);

    await client.connect();
    db = client.db(dbName);

    console.log(`Connected successfully to database: "${dbName}"`);

  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
}

// Utility to convert ID string to ObjectId safely or fallback to string
function getQueryId(idStr) {
  try {
    return new ObjectId(idStr);
  } catch (e) {
    return idStr;
  }
}

// Helper to sanitize regex special characters
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// AUTHENTICATION MIDDLEWARE (BetterAuth)

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token format' });
    }
    const token = authHeader.split(' ')[1];

    if (!db) {
      return res.status(500).json({ success: false, message: 'Database connection not initialized' });
    }

    // 1. Find session in the database
    const session = await db.collection('session').findOne({ token });
    if (!session) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid session token' });
    }

    // 2. Check session expiration
    if (new Date(session.expiresAt) < new Date()) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Session has expired' });
    }

    // 3. Find associated user (supporting string and ObjectId lookup)
    const user = await db.collection('user').findOne({
      $or: [
        { _id: session.userId },
        { _id: getQueryId(session.userId) }
      ]
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Associated user not found' });
    }

    // Attach user information to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error during authentication' });
  }
}

//  REST API ENDPOINTS

/** 1. Get (My Lessons) logged-in student **/
app.get('/api/lessons/my-lessons', authenticateUser, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const lessonsList = await db.collection('lessons')
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: lessonsList
    });
  } catch (err) {
    next(err);
  }
});

/** 2. Listing All Lessons (pagination, filters, sorting & latest toggle) **/
app.get('/api/lessons', async (req, res, next) => {
  try {
    const query = {};
    const { search, category, difficulty, sortBy, order, page, limit } = req.query;

    // 1. Search filter (title, shortDescription, fullDescription)
    if (search && search.trim() !== '') {
      const escapedSearch = escapeRegex(search.trim());
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [
        { title: searchRegex },
        { shortDescription: searchRegex },
        { fullDescription: searchRegex }
      ];
    }

    // 2. Filtering on category, difficulty
    if (category && category.trim() !== '') {
      query.category = category.trim();
    }
    if (difficulty && difficulty.trim() !== '') {
      query.difficulty = difficulty.trim();
    }

    // 3. Sorting options
    let sortOptions = {};
    const sortField = sortBy || 'date';
    const sortOrder = order === 'asc' ? 1 : -1;

    if (sortField === 'date' || sortField === 'createdAt') {
      sortOptions.createdAt = sortOrder;
    } else if (sortField === 'rating') {
      sortOptions.rating = sortOrder;
    } else if (sortField === 'price') {
      sortOptions.price = sortOrder;
    } else {
      sortOptions[sortField] = sortOrder;
    }

    // 4. Homepage / Latest toggle check (limit=latest gets the 4 most recent)
    let queryLimit = 8;
    let queryPage = 1;

    if (limit === 'latest') {
      queryLimit = 4;
      sortOptions = { createdAt: -1 }; // Force newest first
    } else {
      queryLimit = parseInt(limit, 10) || 8;
      queryPage = Math.max(1, parseInt(page, 10) || 1);
    }

    const skipCount = (queryPage - 1) * queryLimit;

    // Execute queries
    const totalDocs = await db.collection('lessons').countDocuments(query);
    const totalPages = Math.ceil(totalDocs / queryLimit) || 1;

    const lessonsList = await db.collection('lessons')
      .find(query)
      .sort(sortOptions)
      .skip(skipCount)
      .limit(queryLimit)
      .toArray();

    res.json({
      success: true,
      data: lessonsList,
      total: totalDocs,
      totalPages: totalPages,
      page: queryPage,
      limit: queryLimit
    });
  } catch (err) {
    next(err);
  }
});

/*** 3. Single Lessons Details API ***/
app.get('/api/lessons/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryId = getQueryId(id);

    const lesson = await db.collection('lessons').findOne({
      $or: [
        { _id: queryId },
        { _id: id }
      ]
    });

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({
      success: true,
      data: lesson
    });
  } catch (err) {
    next(err);
  }
});

/** 4. Upload API (Add Lesson) Protected **/
app.post('/api/lessons', authenticateUser, async (req, res, next) => {
  try {
    
    const { title, shortDescription, fullDescription, category, difficulty, imageUrl, imageUrls, role, author, profileImage } = req.body;

    if (!title || !shortDescription || !fullDescription || !category || !difficulty || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Bad Request: Title, shortDescription, fullDescription, category, difficulty, and imageUrl are required fields.'
      });
    }

    const resolvedImageUrl = imageUrl || (imageUrls && imageUrls[0]) || '';
    const resolvedImageUrls = imageUrls || (imageUrl ? [imageUrl] : []);

    const lessonDoc = {
      title: title.trim(),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      category: category.trim(),
      difficulty: difficulty.trim(),
      
      // Future-proof rating architecture (starts at 0)
      rating: 0, 
      totalRatings: 0,
      ratingSum: 0,

      imageUrl: resolvedImageUrl,
      imageUrls: resolvedImageUrls,
      name: req.user.name,
      profileImage: profileImage || req.user.image || '',
      author: author || req.user.name,
      role: role || 'Student', 
      userId: req.user._id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('lessons').insertOne(lessonDoc);

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: {
        _id: result.insertedId,
        ...lessonDoc
      }
    });
  } catch (err) {
    next(err);
  }
});

/** 5. My Lesson Edit Update **/
app.put('/api/lessons/:id', authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryId = getQueryId(id);

    const existing = await db.collection('lessons').findOne({
      $or: [
        { _id: queryId },
        { _id: id }
      ]
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (existing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to modify this lesson' });
    }

    const updates = { ...req.body };
    delete updates.createdAt;
    delete updates._id;
    delete updates.userId;

    if (updates.price !== undefined) {
      const priceNum = parseFloat(updates.price);
      updates.price = isNaN(priceNum) ? 0 : priceNum;
    }
    if (updates.rating !== undefined) {
      const ratingNum = parseFloat(updates.rating);
      updates.rating = isNaN(ratingNum) ? 5 : ratingNum;
    }

    updates.updatedAt = new Date();

    await db.collection('lessons').updateOne(
      { _id: existing._id },
      { $set: updates }
    );

    const updatedDoc = await db.collection('lessons').findOne({ _id: existing._id });

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedDoc
    });
  } catch (err) {
    next(err);
  }
});

/** 6. Delete Lesson **/
app.delete('/api/lessons/:id', authenticateUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryId = getQueryId(id);

    const existing = await db.collection('lessons').findOne({
      $or: [
        { _id: queryId },
        { _id: id }
      ]
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    if (existing.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You do not have permission to delete this lesson' });
    }

    await db.collection('lessons').deleteOne({ _id: existing._id });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// error finder
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Fluento Speak Backend Monolith listening on port ${PORT}`);
  });
});