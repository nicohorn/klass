import { MongoClient } from "mongodb";

//Connection URI
const uri = process.env.MONGODB_URI;

let client;
/** MongoDB connection
 * @param clientPromise
 * it returns the reference to the database. */
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

client = new MongoClient(uri);

clientPromise = client.connect();

export default clientPromise;

// "mongodb+srv://admin:qYQa9imxh2rdfm4U@cluster0.bdyfh.mongodb.net/klass_ecommerce";
