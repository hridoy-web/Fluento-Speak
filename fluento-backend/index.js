require('dotenv').config();
const { Groq } = require('groq-sdk');
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

/** 3. Homepage Latest Lessons **/
app.get('/api/lessons/latest-home', async (req, res, next) => {
  try {
    const latestLessons = await db.collection('lessons')
      .find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .toArray();

    res.json({
      success: true,
      data: latestLessons
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch latest home data",
      error: err.message
    });
  }
});

/*** 4. Single Lessons Details API ***/
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

/** . Upload API (Add Lesson) Protected **/
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

// Groq api
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.post('/api/ai/chat-partner', async (req, res) => {
  try {
    const { message, chatHistory } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

const systemInstruction = `তুমি হলে "Fluento Speak" অ্যাপের একজন অত্যন্ত ফ্রেন্ডলি, বুদ্ধিমান এবং প্রফেশনাল AI English Coach, যার নাম "Fluento AI"। তোমার কথাবার্তা হবে একদম স্বাভাবিক, সুন্দর এবং প্রফেশনাল মানুষের মতো।

নিচের নিয়মগুলো তোমাকে অবশ্যই ১০০% কঠোরভাবে মেনে চলতে হবে:

১. ভাষার নিখুঁত ব্যবহার (No Banglish):
   - ইউজার যেভাবে ইচ্ছা (বাংলা, ইংলিশ বা বাংলিশ) প্রশ্ন করুক না কেন, তুমি অবশ্যই উত্তর দেবে খাঁটি বাংলা বর্ণমালায় (যেমন: "আপনি কেমন আছেন?") অথবা সহজ ইংরেজিতে।
   - কখনোই ইংরেজি হরফে বাংলা (Banglish) লিখবে না। প্রতিটা ইংরেজি লাইনের পর তার বাংলা অর্থ ব্র্যাকেটে লিখে দেবে।

২. লাইন ব্রেক ও সুন্দর স্পেসিং (Line Break & Alignment):
   - টানা কোনো লম্বা প্যারাগ্রাফ লিখবে না। 
   - প্রতিটা বাক্য বা পয়েন্টের মাঝে অবশ্যই ১টি করে ফাঁকা লাইন (Double Line Break) দেবে, যাতে চ্যাটে দেখতে সুন্দর ও পড়তে সহজ লাগে। সুন্দর ইমোজি ব্যবহার করবে।

৩. ফালতু টপিক বাদ দেওয়া (Strict Rule):
   - স্টুডেন্ট যদি ইংরেজি শেখা বাদে অন্য কোনো হাবিজাবি বিষয়ে কথা বলতে চায়, তবে সরাসরি বলবে: "সময় নষ্ট না করে চলুন আমরা ইংলিশ প্র্যাকটিস করি!" এবং সাথে সাথেই প্র্যাকটিস করার জন্য একটা ছোট ইংরেজি প্রশ্ন করবে।

৪. বিস্তারিত ও রিয়েল-লাইফ এক্সাম্পল:
   - ইংরেজি নিয়ে যা-ই শেখাবে, তা বাস্তব জীবনের উদাহরণসহ পরিষ্কার ও সুন্দর ফরম্যাটে (Bullet points, Bold text) গুছিয়ে বোঝাবে।

৫. ইন্টারঅ্যাক্টিভ ক্লোজিং:
   - প্রতিটি উত্তরের শেষে অবশ্যই সুন্দর ও ছোট একটি ইংরেজি প্রশ্ন করবে, যেন স্টুডেন্ট উত্তর দিয়ে ইংরেজি প্র্যাকটিস চালিয়ে যেতে পারে।`;

    const messages = [
      { role: "system", content: systemInstruction }
    ];

    if (chatHistory && Array.isArray(chatHistory)) {
      const optimizedHistory = chatHistory.slice(-6);
      optimizedHistory.forEach(h => {
        if (h.role && h.text) {
          messages.push({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.text
          });
        }
      });
    }

    messages.push({ role: "user", content: message });

    const freeModelsToTry = [
      "deepseek-r1-distill-llama-70b",
      "llama-3.3-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma2-9b-it"
    ];

    let reply = "";
    let lastError = null;

    for (const modelName of freeModelsToTry) {
      try {
        console.log(`Trying Groq model: ${modelName}...`);
        const completion = await groq.chat.completions.create({
          model: modelName,
          messages: messages,
          temperature: 0.5,
          max_tokens: 1500,
        });

        reply = completion.choices[0]?.message?.content || '';
        if (reply) {
          reply = reply.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
          console.log(`Successfully generated response using model: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`Model ${modelName} failed, trying next fallback model... Error:`, err.message);
        lastError = err;
      }
    }

    if (!reply) {
      throw lastError || new Error("All Groq free models failed.");
    }

    res.status(200).json({ success: true, reply: reply.trim() });
  } catch (err) {
    console.error("Groq API Error:", err);
    res.status(500).json({ success: false, message: err?.message || "Server error" });
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