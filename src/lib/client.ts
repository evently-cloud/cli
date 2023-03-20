import { Client, bearerAuth } from 'ketting'
import {CLIError} from '@oclif/core/lib/parser/errors'
import {TokenAwareCommand} from './token-command'

const NOT_SET = 'NOT-SET'

/**
 * This is our memoized client
 */
let client: Client|null = null

type FetchMiddleware = (req: Request) => Promise<Response> | Response;
let mockCallback: FetchMiddleware | null = null

/**
 * Sets up and returns a fully initialized Ketting client.
 */
export function getClient(): Client {

  if (!client) {
    throw new Error('Client was not yet initialized')
  }
  return client

}

/**
 * Sets up a Ketting client for the first time.
 */
export function initClient(token: string): Client {

  if (token === TokenAwareCommand.flags.token.default || !token) {
    throw new CLIError('missing access token', {
      message: 'Evently access token missing.',
      suggestions: [
        'Pass as a flag (--token or -t)',
        `Set the ${TokenAwareCommand.flags.token.env} environment variable to the access token.`
      ]
    })
  }

  client = new Client('https://preview.evently.cloud/')
  client.use(bearerAuth(token))
  client.use( async( req, next) => {

    if (mockCallback) {
      return mockCallback(req)
    } else {
      return next(req)
    }

  })

  return client

}

/**
 * Sets a callback that globally intercepts all HTTP traffic.
 *
 * This is used for unittesting.
 */
export function setMockCallback(cb: FetchMiddleware) {

  mockCallback = cb

}
