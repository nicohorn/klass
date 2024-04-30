import { getEmailContent } from "src/services/admin"

type AdminEmailProps = {
  content: string
}

export default function AdminEmail({ content }: AdminEmailProps) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const content = e.target.content.value
    const res = await fetch('/api/email', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })
    if (res.ok) {
      alert('Email actualizado')
    } else {
      alert('Error al actualizar el email')
    }
  }
  return (
    <main className="container mx-auto text-white">
      <h1>Editar email</h1>
      <form action="/api/email" method="post" onSubmit={handleSubmit} className="flex flex-col">
        <textarea className="text-black" name="content" id="" cols={30} rows={10} defaultValue={content}></textarea>
        <button type="submit">Guardar cambios</button>
      </form>
    </main>
  )
}

export async function getStaticProps() {
  const content = await getEmailContent()
  return { props: { content } }
}