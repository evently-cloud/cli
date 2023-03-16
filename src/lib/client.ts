import { Client, bearerAuth } from 'ketting';
import {CLIError} from "@oclif/core/lib/parser/errors"
import {TokenAwareCommand} from "./token-command"

const NOT_SET = "NOT-SET"

/**
 * This is our memoized client
 */
let client: Client|null = null;

/**
 * Sets up and returns a fully initialized Ketting client.
 */
export function getClient(): Client {

  if (!client) {
    throw new Error('Client was not yet initialized');
  }
  return client;

}

/**
 * Sets up a Ketting client for the first time.
 */
export function initClient(token: string): Client { 

  if (token === TokenAwareCommand.flags.token.default || !token) {
    throw new CLIError("missing access token", {
      message: "Evently access token missing.",
      suggestions: [
        "Pass as a flag (--token or -t)",
        `Set the ${TokenAwareCommand.flags.token.env} environment variable to the access token.`
      ]
    })
  }

  client = new Client('https://preview.evently.cloud/');
  client.use(bearerAuth(token));

  return client;

}



