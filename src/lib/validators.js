export function normalizePrn(input) {
  return (input ?? '').trim().toUpperCase()
}

export function isValidPrn(prn) {
  return /^[A-Z0-9]{8,20}$/.test(normalizePrn(prn))
}

export function validateStrongPassword(password) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password)
}

export function extractPrnFromQr(rawText) {
  const text = (rawText ?? '').trim()
  if (!text) return ''

  if (isValidPrn(text)) return normalizePrn(text)

  const match = text.match(/(?:prn[:=\s]+)([a-z0-9]+)/i)
  if (match?.[1]) return normalizePrn(match[1])

  const fallback = text.match(/[A-Z0-9]{8,20}/i)
  return fallback ? normalizePrn(fallback[0]) : ''
}
