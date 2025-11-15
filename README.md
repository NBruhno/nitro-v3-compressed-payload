This is a reproduction of an issue I've run into in nitro v3 when I try to respond with a compressed payload. I have tested it in h3 v1, h3 v2, nitro v2 and nitro v3, all using just about the same method of returning a compressed payload (only the method for getting and setting the headers as well as the routing is different) and only in the latest alpha (1) of nitro v3 does it fail to be properly decoded on the client side. This is either because I am misusing the library or a possible regression from nitro v2 to nitro v3.

All examples serve the result to http://localhost:3000

Expected response is a JSON payload;

```json
{
  "foo": "bar"
}
```

To run each project;

First run `pnpm i`

I used node 24 to test the examples, so if you don't already have a node version manager I suggest something like `fnm`
or you can do what I usually do and set pnpm to control the node version by setting `useNodeVersion: 24.10.0` in `pnpm-workspace.yaml`.

* `pnpm -F h3js-v1-compressed-payload dev`
* `pnpm -F h3js-v2-compressed-payload dev`
* `pnpm -F nitro-v2-compressed-payload dev`
* `pnpm -F nitro-v3-compressed-payload dev`

All examples but the `nitro-v3-compressed-payload` work, returning a `net::ERR_CONTENT_DECODING_FAILED` in e.g. Chrome.

When using `curl` it closes the connection and claims there are bites left to read.
I am no expert on the matter so I don't exactly know what that means.
But if the payload is sufficiently large, curl does not print the whole compressed payload.

```
$ curl --verbose http://localhost:3000

* Host localhost:3000 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:3000...
* Connected to localhost (::1) port 3000
> GET / HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/8.5.0
> Accept: */*
>
< HTTP/1.1 200 OK
< connection: keep-alive
< content-encoding: gzip
< content-length: 33
< content-type: application/json
< date: Sat, 15 Nov 2025 13:20:47 GMT
< keep-alive: timeout=5
< vary: Accept-Encoding
<
* transfer closed with 20 bytes remaining to read
* Closing connection
curl: (18) transfer closed with 20 bytes remaining to read
{"foo":"bar"}%     
```
