import clientPromise from "../../../../mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  if (req.method === "POST") {
    const response = await collection.insertOne({ ...req.body });
    const result = await collection.findOne({ _id: response.insertedId });
    return res.status(200).json(result);
  } else {
    return res.status(200).json("Hubo un error");
  }
}
