import { UserProfile } from "@auth0/nextjs-auth0/client"

export async function validateToken(token: string) {
  try {
    const response = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    console.log('val', response.status)
    const userInfo: UserProfile = await response.json()
    return userInfo
  } catch (error) {
    return undefined
  }
}