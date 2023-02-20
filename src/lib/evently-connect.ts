import {CLIError} from "@oclif/core/lib/parser/errors"
import {fetch, RequestInit, Response} from "undici"


export async function sendToEvently(token:    string,
                                    path:     string,
                                    request?: RequestInit): Promise<Response> {
  const options = {
    ...request,
    keepalive:  true,
    headers:    {
      ...request?.headers,
      authorization: `Bearer ${token}`
    }
  }

  try {
    const result = await fetch(`https://preview.evently.cloud${path}`, options)

    if (result.status === 401) {
      // todo pretty-print error
      throw new CLIError(`401 Unauthorized, WWW-Authenticate: ${result.headers.get("www-authenticate")}`)
    }
    return result
  } catch (err) {
    console.error(err)
    throw err
  }
}
