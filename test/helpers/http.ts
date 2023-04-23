import {expect} from '@oclif/test'
import {Link} from 'ketting'

async function expectBody(message: Request|Response, body: any) {

  expect(await message.json()).to.deep.equal(body)

}

type RequestShape = {
  method:   string
  path?:    string
  headers?: Record<string, string>
  body?:    Record<string, any>
}

/**
 * Checks if a HTTP request roughly matches the expected shape.
 */
export async function expectRequest(request: Request, shape: RequestShape) {

  expect(request.method).to.equal(shape.method)
  if (shape.path !== undefined) {
    expect(new URL(request.url).pathname).to.equal(shape.path)
  }

  if (shape.headers) {
    for(const [key, value] of Object.entries(shape.headers)) {
      expect(request.headers.get(key)).to.equal(value)
    }
  }
  if ('body' in shape) {
    expectBody(request, shape.body)
  }

}


type ResponseOptions = {
  status?:  number
  body?:    Record<string, any>
  links?:   Omit<Link, 'context'>[]
  headers?: Record<string, string>
}

/**
 * A function to make building HTTP responses a bit easier.
 */
export function buildResponse(options: ResponseOptions): Response {

  const body = {
    ...options.body,
  }
  if (options.links) {
    body._links = {}
    for(const { rel, ...link} of options.links) {
      if (!(rel in body._links)) {
        body._links[rel] = []
      }
      body._links[rel].push(link)
    }
  }

  const resp = new Response(
    options.status === 204 ? null : JSON.stringify(body),
    {
      status: options.status ?? 200,
      headers: {
        'Content-Type': 'application/hal+json',
        ...options.headers,
      }
    },
  )

  return resp

}
