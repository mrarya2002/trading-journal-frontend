import {jwtDecode} from "jwt-decode"

interface DecodedToken {
  exp: number; // expiry in seconds
}

export function isTokenValid(token: string): boolean {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const now = Date.now() / 1000; // convert ms → seconds
    return decoded.exp > now;
  } catch {
    return false; // invalid token format
  }
}
