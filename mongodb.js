import { MongoClient } from "mongodb";

//Connection URI
const uri =
  "mongodb+srv://admin:qYQa9imxh2rdfm4U@cluster0.bdyfh.mongodb.net/klass_ecommerce";
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Add Mongo URI to .env.local");
}

client = new MongoClient(uri);
clientPromise = client.connect();

export default clientPromise;
