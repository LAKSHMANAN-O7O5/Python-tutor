import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import https from 'https'

function readApiKey() {
  try {
    const content = fs.readFileSync('.env', 'utf-8')
    const match = content.match(/GEMINI_API_KEY=([^\r\n]+)/)
    return match ? match[1].trim() : ''
  } catch {
    return ''
  }
}

// Custom Vite middleware plugin to proxy Gemini securely
function geminiProxyPlugin() {
  return {
    name: 'gemini-proxy',
    configureServer(server) {
      const apiKey = readApiKey()
      console.log('[gemini-proxy] API key loaded, length:', apiKey.length)

      server.middlewares.use('/api/gemini', (req, res) => {
        let body = ''

        // Handle CORS preflight
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          })
          res.end()
          return
        }

        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          const bodyBuffer = Buffer.from(body, 'utf-8')

          // Forward to Gemini 1.5 Flash
          const options = {
            hostname: 'generativelanguage.googleapis.com',
            port: 443,
            path: `/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
            method: req.method,
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': bodyBuffer.length,
            },
          }

          const proxyReq = https.request(options, (proxyRes) => {
            console.log('[gemini-proxy] Upstream status:', proxyRes.statusCode)
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            })
            proxyRes.pipe(res)
          })

          proxyReq.on('error', (e) => {
            console.error('[gemini-proxy] Error:', e.message)
            res.writeHead(500)
            res.end(JSON.stringify({ error: e.message }))
          })

          proxyReq.write(bodyBuffer)
          proxyReq.end()
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), geminiProxyPlugin()],
})
