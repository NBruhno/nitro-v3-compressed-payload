import { Buffer } from 'node:buffer'
import { gzipSync, zstdCompressSync } from 'node:zlib'
import { H3, serve } from 'h3'

const testPayload = {
	foo: 'bar',
}

const app = new H3().get('/', (event) => {
	// Get accepted encoding and tier it
	const encoding = event.req.headers.get('accept-encoding')
	let encodingToUse = null
	if (encoding?.includes('gzip')) encodingToUse = 'gzip'
	if (encoding?.includes('zstd')) encodingToUse = 'zstd'

	let body = Buffer.from(JSON.stringify(testPayload))

	if (encodingToUse) {
		// Compress the payload and set the appropriate headers
		event.res.setHeader('Content-Encoding', encodingToUse)
		event.res.headers.append('Content-Type', 'application/json')

		if (encodingToUse === 'gzip') {
			body = gzipSync(body)
		} else if (encodingToUse === 'zstd') {
			body = zstdCompressSync(body)
		}

		return body
	}

	return body
})

serve(app, { port: 3000 })
