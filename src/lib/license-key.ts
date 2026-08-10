import { LICENSE_KEY_PREFIX, LICENSE_KEY_SEGMENTS, LICENSE_KEY_SEGMENT_LENGTH } from "./constants"

const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

export function generateLicenseKey(): string {
  const segments: string[] = []
  for (let i = 0; i < LICENSE_KEY_SEGMENTS; i++) {
    let segment = ""
    for (let j = 0; j < LICENSE_KEY_SEGMENT_LENGTH; j++) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0]! % CHARSET.length
      segment += CHARSET[randomIndex]
    }
    segments.push(segment)
  }
  return `${LICENSE_KEY_PREFIX}-${segments.join("-")}`
}
