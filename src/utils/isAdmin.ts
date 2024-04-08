// This is a horrible solution. Just stays here because it works in the meantime
export const isAdmin = (userId: any) => {
  const admins = [
    process.env.NEXT_PUBLIC_ADMIN1,
    process.env.NEXT_PUBLIC_ADMIN2,
  ]
  return userId && admins.includes(userId)
}