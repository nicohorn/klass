import { json } from "stream/consumers";
import clientPromise from "../../../../mongodb";
import type { ProductType } from "src/utils/types";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products2");

  if (req.method === "POST") {
    console.log(req.body);
    await collection.insertOne({ ...req.body });
    return res.status(200).json({ ...req.body });
  } else {
    return res.status(200).json("Hubo un error");
  }
}
