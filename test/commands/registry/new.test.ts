import {expect, test} from '@oclif/test'

import { setMockCallback } from '../../../src/lib/client'
import { buildResponse, expectRequest } from '../../helpers/http'
const testToken = 'test-token'

describe('registry:new', () => {

  before(() => {

    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`)
      const path = new URL(req.url).pathname
      switch(path) {
        case '/' :
          return buildResponse({
            links: [{rel: 'registry', href: '/registry'}]
          })
        case '/registry' :
          return buildResponse({
            links: [{rel: 'register', href: '/registry/register'}]
          })
        case '/registry/register' :
          expectRequest(req, {
            path: '/registry/register',
            method: 'POST',
            body: {
              event: 'event-name',
              entity: 'entity-name',
            }
          })
          return buildResponse({
            status: 201,
            headers: {
              Location: '/registry/entities/entity-name/event-name',
            }
          })
        default :
          return new Response('{}', {status: 501})
      }

    }))

  })

  test
    .stdout()
    .command(['registry:new', '-n', 'entity-name', '-e', 'event-name', '-t', testToken])
    .it('creates a new event', (ctx) => {
      expect(ctx.stdout).to.contain('Created a new entity event')
      expect(ctx.stdout).to.contain('/registry/entities/entity-name/event-name')
    })
})
