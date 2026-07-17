import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  secret: process.env.BETTER_AUTH_SECRET,
});
