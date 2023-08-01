import clientPromise from "../../../../mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");

  const collection = db.collection("products");

  if (req.method === "DELETE") {
    const response = await collection.deleteOne({
      _id: new ObjectId(req.body._id),
    });
    console.log(response);
    return res.status(200).json({ ...req.body });
  } else {
    return res.status(500).json("Hubo un error");
  }
}
