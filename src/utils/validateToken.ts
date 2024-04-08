import { UserProfile } from "@auth0/nextjs-auth0"

export async function validateToken(token: string) {
  try {
    const response = await fetch(
      "https://dev-5iz0oclpqjwsu4v1.us.auth0.com/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    const userInfo: UserProfile = await response.json()
    return userInfo
  } catch (error) {
    return undefined
  }
}