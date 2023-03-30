import {expect, test} from '@oclif/test'

import { setMockCallback } from '../../../src/lib/client'
import { buildResponse } from '../../helpers/http'
const testToken = 'test-token'

describe('registry:delete', () => {

  it('should delete events', async () => {

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
        default :
          return new Response('{}', {status: 501})
      }

    }))

    await test
      .stdout()
      .command(['registry:delete', '-t', testToken, '-n', 'article',  '-e', 'new-comment'])
      .it('deletes an event', (ctx) => {
        expect(ctx.stdout).to.contain('Deleted entity event type')
        expect(ctx.stdout).to.contain('/registry/entities/article/new-comment')
      })
  })
})
