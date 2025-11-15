import { gzipSync, zstdCompressSync } from 'node:zlib'
import { setHeader } from '#imports'

const testPayload = {
	foo: 'bar',
}

export default defineEventHandler((event) => {
	const encoding = event.headers.get('accept-encoding')
	let encodingToUse = null
	if (encoding?.includes('gzip')) encodingToUse = 'gzip'
	if (encoding?.includes('zstd')) encodingToUse = 'zstd'

	let body = Buffer.from(JSON.stringify(testPayload))

	if (encodingToUse) {
		// Compress the payload and set the appropriate headers
		setHeader(event, 'Content-Encoding', encodingToUse)
		setHeader(event, 'Content-Type', 'application/json')

		if (encodingToUse === 'gzip') {
			body = gzipSync(body)
		} else if (encodingToUse === 'zstd') {
			body = zstdCompressSync(body)
		}

		return body
	}

	return body
})
