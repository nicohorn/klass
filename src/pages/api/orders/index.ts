import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "@clientPromise";
import { ObjectId } from "mongodb";
import { sendOrderEmail } from "src/utils/mailer";
import { productPrice } from "src/utils/productPrice";
import { ProductType } from "src/utils/types";

export type Order = {
  _id: string,
  userId: string,
  clientName: string,
  clientEmail: string,
  products: {
    _id: string,
    name: string,
    img: string[],
    id: string,
    size: string,
    color_1: string,
    color_2: string,
    style: string,
    model: string,
    price: number,
    count: number
  }[],
  total: number,
  createdAt: string,
  state: string
}

async function POST(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const orders = db.collection("orders");
  const products = db.collection("products");
  const session = await getSession(req, res);

  const body: Order = req.body

  if (!session || session.user.sub !== body.userId) {
    return res.status(401).json({error: "Unauthorized"});
  }

  for (const product of body.products) {
    const productData: ProductType|null = await products.findOne({ _id: new ObjectId(product._id) });
    if (!productData) {
      return res.status(400).json({error: "Product not found"});
    }
    if (productPrice(productData, product) !== product.price) {
      return res.status(400).json({error: "Price is incorrect"});
    }
  }

  body.total = body.products.reduce((sum, p) => sum + p.price * p.count, 0);
  body.createdAt = new Date().toISOString();
  body.state = "pending";

  const result = await orders.insertOne(body);
  sendOrderEmail(result);
  return res.status(200).json(result);
}

async function PUT(req, res) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("orders");
  const session = await getSession(req, res);

  const body: Order = req.body

  if (!session || session.user.sub !== body.userId) {
    return res.status(401).json({error: "Unauthorized"});
  }

  const filter = { _id: new ObjectId(body._id) };
  const updateDocument = {
    $set: {
      state: body.state,
    },
  };
  const result = await collection.findOneAndUpdate(filter, updateDocument, {
    returnOriginal: false,
  });
  return res.status(200).json(result);
}

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case "POST":
        return POST(req, res);
      case "PUT":
        return PUT(req, res);
      default:
        return res.status(405).json({error: "Method not allowed"});
    }
  } catch (err) {
    return res.status(500).json({error: "Server error"});
  }
}
