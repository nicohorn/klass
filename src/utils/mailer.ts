import nodemailer from 'nodemailer'
import { OrderType } from './types'

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


export const sendOrderEmail = (order: OrderType) => {
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
      <p>Ya casi estamos, pero antes, necesitamos que selecciones la forma de pago y de envío para terminar la compra:</p>
      <div style="display: flex;">
        <div style="min-width: 30%;">
          <h2>Formas de pago:</h2>
          <img src="" alt="Money">
        </div>
        <ul>
          <li>Seña del 50% y el 50% restante a 25 días cuando se entrega, efectivo / transferencia</li>
          <li>10% de descuento abonando en 1 solo pago en efectivo / transferencia</li>
          <li>1 pago con tarjeta de crédito sin recargo</li>
          <li>
            Tarjeta Visa o Mastercard, programa CUOTA SIMPLE
            <ul>
              <li>3 cuotas con 14% de interés</li>
              <li>6 cuotas con 30% de interés</li>
          </li>
        </ul>
      </div>
      <div style="display: flex;">
        <div style="min-width: 30%;">
          <h2>Formas de envío:</h2>
          <img src="" alt="Truck">
        </div>
        <ul>
          <li>Retiro del depósito: en Jujuy 3287 portón negr, Rosario, SF - $0</li>
          <li>
            Dentro de rosario
            <ul>
              <li>Envío simple: $8.500</li>
              <li>Envío con servicio de armado: $15.200</li>
            </ul>
          </li>
        </ul>
      </div>
      <p>
        <b>Elegí la opción</b> que más te convenga y respondenos por este medio para completar la compra, y no te olvides de que tu pedido será confeccionado especialmente para vos, nuestro plazo de fabricación es de 25 días.
      </p>
      <p>
        Cualquier duda podés escribirnos a <a href="mailto:contacto.klass@gmail.com"><b>contacto.klass@gmail.com</b></a> o por WhatsApp al <b>+54 9 3435035388</b>
      </p>
    </body>
    </html>
    `,
    cc: process.env.EMAIL
  }
  transporter.sendMail(mailOptions)
}
