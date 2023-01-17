import clientPromise from "@clientPromise";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("orders");

  if (req.method === "GET") {
    return res.status(401).json("Forbidden access");
  } else if (req.method === "POST") {
    const insert = await collection.insertOne({ ...req.body });
    const result = await collection.findOne({ _id: insert.insertedId });
    console.log("api", result);

    return res.status(200).json(result);
  } else if (req.method === "PUT") {
    console.log("API ORDERS UPDATE");

    const filter = { _id: ObjectId(req.body._id) };
    const updateDocument = {
      $set: {
        state: req.body.state,
      },
    };

    console.log(filter, updateDocument);

    const result = await collection.findOneAndUpdate(filter, updateDocument, {
      returnOriginal: false,
    });

    return res.status(200).json(result);
  }
}
