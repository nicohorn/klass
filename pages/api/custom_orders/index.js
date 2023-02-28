import clientPromise from "@clientPromise";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("custom_orders");
    let result;

    switch (req.method) {
      case "GET":
        return res.status(401).json("Forbidden access");
        break;
      case "POST":
        result = await collection.insertOne({ ...req.body });
        result = await collection.findOne({ _id: result.insertedId });

        break;
      case "PUT":
        const filter = { _id: ObjectId(req.body._id) };
        const updateDocument = {
          $set: {
            state: req.body.state,
          },
        };
        result = await collection.findOneAndUpdate(filter, updateDocument, {
          returnOriginal: false,
        });
        break;
      default:
        return res.status(405).json("Method not allowed");
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
}
