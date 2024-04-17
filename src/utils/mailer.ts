import nodemailer from 'nodemailer'
import { Order } from './types'

export const sendOrderEmail = async (order: Order) => {
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
      <p>Ya casi estamos, pero antes, necesitamos que selecciones la forma de pago y de envío para terminar la compra:</p>
      <div style="display: flex;">
        <div style="min-width: 30%;">
          <h2>Opciones de pago:</h2>
          <img src="https://klass.tienda/icons/money.jpg" alt="Money" style="width: 100px;">
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
          <h2>Opciones de envío:</h2>
          <img src="https://klass.tienda/icons/truck.png" alt="Truck" style="width: 100px;">
        </div>
        <ul>
          <li>
            Retiro : $0
            <ul>
              <li>Rosario,SF - Depósito en Jujuy 3287, portón negro</li>
              <li>Crespo,ER - Fábrica en Francisco Sagemuller 590</li>
            </ul>
          </li>
          <li>
            Envío con instalación: se coordina el día y horario previamente.
            <ul>
              <li>Rosario, SF - ciudad $18.200 / alrededores hasta 20km - $25.200</li>
              <li>Santa Fe, SF - ciudad $18.200 /  alrededores hasta 20km - $25.200</li>
              <li>Paraná, ER - ciudad $15.200</li>
              <li>*Consultar por otras localidades</li>
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
  const response = await transporter.sendMail(mailOptions)
  console.log({ mail: response })
}
