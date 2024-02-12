import { ObjectId } from "mongodb";
import clientPromise from "../../../../mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("promotions");

  if (req.method === "DELETE") {
    const response = await collection.deleteOne({
      _id: new ObjectId(req.body._id),
    });
    return res.status(200).json(response);
  } else {
    return res.status(200).json("Hubo un error");
  }
}
