import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({});

// Replace the placeholder in the URI with the actual password
const uri = process.env.DATABASE;

// Create a MongoClient with serverApi options
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
