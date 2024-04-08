import clientPromise from "@clientPromise";
import { ObjectId } from "mongodb";
import { sendOrderEmail } from '../../../utils/mailer'
import { validateToken } from "src/utils/validateToken";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("orders");
    let result;
    const token = req.cookies.get('token')?.value

    if (!await validateToken(token)) {
      return res.status(401).json("Forbidden access");
    }

    switch (req.method) {
      case "POST":
        result = await collection.insertOne({ ...req.body });
        result = await collection.findOne({ _id: result.insertedId });
        sendOrderEmail(result);
        break;
      case "PUT":
        const filter = { _id: new ObjectId(req.body._id) };
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
