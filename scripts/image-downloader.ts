import https from 'https'
import fs from 'fs'
require('dotenv').config({ path: '.env.local' })
import clientPromise from "../mongodb";

function downloadImage(url: string) {
  return new Promise((resolve) => {
    if (!url.startsWith('http')) { return resolve(true) }
    const file = fs.createWriteStream(`public/images/products/${url.split('/').pop()}`);
    https.get(url, function(response) {
      response.pipe(file);
      file.on('finish', function() {
        file.close();
        resolve(true);
      });
    });
  })
}

async function downloadImages() {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("products");

  const products = await collection.find({}).toArray();

  for (const product of products) {
    const imageUrls: string[] = product.img;
    await Promise.all(imageUrls.map(imageUrl => downloadImage(imageUrl)));
  }
  console.log('Images downloaded');
}
downloadImages();