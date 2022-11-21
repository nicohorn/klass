import clientPromise from "../../../mongodb.js";

//Needed to use the ID field in mongodb (special type);
var ObjectId = require("mongodb").ObjectId;

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  //We extract the id from the url query.
  const productId = req.query;

  if (req.method === "GET") {
    console.log("api", req.query);
    const findResult = await collection
      .find({ _id: ObjectId(productId.apiId) })
      .toArray();
    console.log("Found documents =>", findResult);
    //res.send(findResult);
    return res.status(200).json(findResult);
  } else if (req.method === "POST") {
    const insert = await collection.insertOne({ ...req.body });
    const result = await collection.findOne({ _id: insert.insertedId });
    console.log(result);

    return "done";
  }
}
