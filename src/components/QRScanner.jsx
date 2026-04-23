import { useEffect, useRef, useState } from 'react'

function QRScanner({ onResult, onError }) {
  const scannerRef = useRef(null)
  const regionId = 'qr-reader-region'
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    let html5QrCode
    let cancelled = false

    async function setupScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        html5QrCode = new Html5Qrcode(regionId)
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => onResult(decodedText),
          () => {},
        )
      } catch (error) {
        onError(error?.message ?? 'Unable to access camera.')
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }

    setupScanner()

    return () => {
      cancelled = true
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {})
      }
    }
  }, [onError, onResult])

  return (
    <section className="card">
      <h2>Scan Student QR</h2>
      <p>Allow camera permission and align the college ID QR code in frame.</p>
      {initializing && <p className="helper">Starting camera...</p>}
      <div id={regionId} className="scanner-region" />
    </section>
  )
}

export default QRScanner
