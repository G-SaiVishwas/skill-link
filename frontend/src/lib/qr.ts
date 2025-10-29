// Generate QR code for SkillCard

export function generateQRCode(url: string): string {
  // For production, you'd use a library like qrcode.react or qrcode
  // For now, using a free QR code API
  const encodedUrl = encodeURIComponent(url)
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodedUrl}`
}

export function downloadQRCode(url: string, filename: string = 'skillcard-qr.png') {
  const qrCodeUrl = generateQRCode(url)
  const link = document.createElement('a')
  link.href = qrCodeUrl
  link.download = filename
  link.click()
}
