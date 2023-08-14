import clientPromise from "../../../../mongodb";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");

  const collection = db.collection("products");

  if (req.method === "PUT") {
    const response = await collection.findOneAndUpdate(
      { _id: new ObjectId(req.body.productId) },
      {
        $set: {
          ...req.body.product,
        },
      }
    );

    console.log(response);

    return res.status(200).json(req.body.product);
  } else {
    return res.status(500).json("Hubo un error");
  }
}
