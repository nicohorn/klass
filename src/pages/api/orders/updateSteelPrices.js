import clientPromise from "@clientPromise";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("klass_ecommerce");
    const collection = db.collection("products");
    let result;

    const products = await collection.find({ steel: true }).toArray();
    const promiseAll = products.map(async (product) => {
      await collection.findOneAndUpdate(
        { _id: product._id },
        {
          $set: {
            base_price: Number(
              Math.ceil((product.base_price * req.body) / 5) * 5
            ),
          },
        }
      );
    });
    const rackCeibo = await collection.findOneAndUpdate(
      { name: "Rack Ceibo" },
      {
        $set: {
          base_price: 1,
        },
      }
    );
    console.log(products);
    result = await Promise.all(promiseAll);

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json("Server error");
  }
}
