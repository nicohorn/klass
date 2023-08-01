import clientPromise from "../../../../mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  if (req.method === "POST") {
    await collection.insertOne({ ...req.body });
    return res.status(200).json({ ...req.body });
  } else {
    return res.status(200).json("Hubo un error");
  }
}
