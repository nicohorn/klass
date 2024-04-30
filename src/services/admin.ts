import clientPromise from "@clientPromise";

export async function getEmailContent() {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("email");

  const result: { content: string } = await collection.findOne({});
  return result?.content ?? ''
}

export async function updateEmailContent(content: string) {
  const client = await clientPromise;
  const db = client.db("klass_ecommerce");
  const collection = db.collection("email");

  const updateDocument = {
    $set: {
      content,
    }
  };
  const result = await collection.findOneAndUpdate({}, updateDocument, {
    returnOriginal: false,
    upsert: true
  });
  return result;
}