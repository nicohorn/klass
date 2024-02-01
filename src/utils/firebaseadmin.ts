import { jwtVerify, importX509 } from 'jose'
const publicKeys = fetch('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com').then(r => r.json())

export const validateToken = async (token: string) => {
  const keys: { [key: string]: string } = await publicKeys
  for (const kid of Object.values(keys)) {
    try {
      const pKey = await importX509(kid, 'RS256')
      const { payload } = await jwtVerify(token, pKey)
      return payload as unknown as { user_id: string }
    } catch (e) {
      console.log('error', e)
    }
  }
  return undefined
}

