import { gzipSync, zstdCompressSync } from 'node:zlib'
import { defineHandler } from 'nitro/h3'

const testPayload = {
	foo: 'bar',
}

export default defineHandler((event) => {
	const encoding = event.req.headers.get('accept-encoding')
	let encodingToUse = null
	if (encoding?.includes('gzip')) encodingToUse = 'gzip'
	if (encoding?.includes('zstd')) encodingToUse = 'zstd'

	let body = Buffer.from(JSON.stringify(testPayload))

	if (encodingToUse) {
		// Compress the payload and set the appropriate headers
		event.res.headers.set('Content-Encoding', encodingToUse)
		event.res.headers.set('Content-Type', 'application/json')

		if (encodingToUse === 'gzip') {
			body = gzipSync(body)
		} else if (encodingToUse === 'zstd') {
			body = zstdCompressSync(body)
		}

		return body
	}

	return body
})
