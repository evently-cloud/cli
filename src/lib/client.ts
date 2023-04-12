import { Client, bearerAuth, Resource } from 'ketting'
import {CLIError} from '@oclif/core/lib/parser/errors'
import {TokenAwareCommand} from './token-command'

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

  client = new Client(process.env.EVENTLY_BOOKMARK ?? 'https://preview.evently.cloud/')
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
 * Loops through a Ketting links with the level3 list-entry link and finds
 * the first resource that has the specified name property.
 *
 * If the resource was not found, this will throw an error.
 */
export async function followByName(parent: Resource, name: string): Promise<Resource> {

  const links = await parent.links('https://level3.rest/patterns/list#list-entry')
  for(const link of links) {
    if (link.name === name) {
      return parent.client.go(link)
    }
  }
  throw new Error(`Could not find an entry with name ${name} in collection ${parent.uri}`)

}


/**
 * Sets a callback that globally intercepts all HTTP traffic.
 *
 * This is used for unittesting.
 */
export function setMockCallback(cb: FetchMiddleware) {

  mockCallback = cb

}
