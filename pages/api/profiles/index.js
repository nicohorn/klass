import clientPromise from "@clientPromise";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("profiles");

  if (req.method === "GET") {
    return res.status(200).json(await collection.find({}).toArray());
  } else if (req.method === "POST") {
    const insert = await collection.insertOne({ ...req.body });
    const result = await collection.findOne({ _id: insert.insertedId });

    return res.status(200).json(result);
  }
}
