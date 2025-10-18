export async function callLogAPI(logData: {
  message: string | object
  type?: 'info' | 'error' | 'warn'
  filekoin: string
}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    await fetch(`${baseUrl}/api/logproxy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // send clean name; server will normalize and append .csv if needed
        filekoin: logData.filekoin,
        log:
          typeof logData.message === 'string'
            ? logData.message
            : JSON.stringify(logData.message),
        type: logData.type || 'info',
        timestamp: new Date().toISOString(),
      }),
    })
  } catch (err) {
    console.error('Error sending log to /api/logproxy:', err)
  }
}
