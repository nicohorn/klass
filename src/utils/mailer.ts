import nodemailer from 'nodemailer'
import { Order } from './types'
import { getEmailContent } from 'src/services/admin'

export const sendOrderEmail = async (order: Order) => {
  const content = await getEmailContent()
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.GMAIL_PASSWORD
    }
  })
  const mailOptions = {
    from: process.env.EMAIL,
    to: order.clientEmail,
    subject: 'Recepción de pedido web - Klass',
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Recepción de pedido web - Klass</title>
    </head>
    <body style="font-family: Arial, Helvetica, sans-serif;">
      <h1>Hola ¡Recibimos tu pedido!</h1>
      ${order.products.map(product => `
        <div style="border-bottom: 1px solid gray;">
          <h4>${product.count}x ${product.name}</h4>
          <p>Tamaño: ${product.size}</p>
          <p>Color 1: ${product.color_1}</p>
          <p>Color 2: ${product.color_2}</p>
          <p style="text-align: right;"><i>$${product.price}</i></p>
        </div>
      `)}
      ${content}
    </body>
    </html>
    `,
    cc: process.env.EMAIL
  }
  const response = await transporter.sendMail(mailOptions)
  console.log({ mail: response })
}
