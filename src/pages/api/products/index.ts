import clientPromise from "../../../../mongodb";
import type { ProductType } from "src/utils/types";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  if (req.method === "GET") {
    const findResult = await collection
      .find({})
      .sort({ categories: 1 })
      .toArray();

    return res.status(200).json(findResult);
  } else if (req.method === "POST") {
    const insert = await collection.insertOne({ ...(req.body as ProductType) });
    const result = await collection.findOne({ _id: insert.insertedId });

    return "done";
  }
}
