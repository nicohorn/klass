require('dotenv').config({ path: '.env.local' })

import clientPromise from "../mongodb";

async function replaceImageUrls() {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  const products = await collection.find({}).toArray();

  for (const product of products) {
    const imageUrls: string[] = product.img;
    if (imageUrls.every(url => !url.startsWith('http'))) { continue }
    const newImageUrls = imageUrls.map(url => {
      if (!url.startsWith('http')) { return url }
      return `/images/products/${url.split('/').pop()}`
    });
    await collection.updateOne({ _id: product._id }, { $set: { img: newImageUrls, oldImgs: imageUrls } });
  }
  console.log('finished')
}
replaceImageUrls()