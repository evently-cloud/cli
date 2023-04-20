import {expect, test} from '@oclif/test'

import { setMockCallback } from '../../../src/lib/client'
import { buildResponse } from '../../helpers/http'
const testToken = 'test-token'

describe('registry:list-events', () => {

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
            links: [
              {rel: 'register', href: '/registry/register'},
              {rel: 'entities', href: '/registry/entities'},
            ],
          })
        case '/registry/entities' :
          return buildResponse({
            links: [
              {rel: 'https://level3.rest/patterns/list#list-entry', href: '/registry/entities/article', name: 'article'},
              {rel: 'https://level3.rest/patterns/list#list-entry', href: '/registry/entities/author', name: 'author'},
            ],
          })
        case '/registry/entities/author' :
          return buildResponse({
            links: [
              {rel: 'https://level3.rest/patterns/list#list-entry', href: '/registry/entities/author/edit', name: 'Edit'},
              {rel: 'https://level3.rest/patterns/list#list-entry', href: '/registry/entities/author/delete', name: 'Delete'},
            ],
          })
        case '/registry/entities/author/delete' :
        case '/registry/entities/author/edit' :
          return buildResponse({})
        default :
          process.stderr.write(path)
          return new Response('{}', {status: 501})
      }

    }))

  })

  test
    .stdout()
    .command(['registry:list-events', '-t', testToken, '--entity', 'author'])
    .it('should list events', (ctx) => {
      expect(ctx.stdout).to.contain('/registry/entities/author/edit')
      expect(ctx.stdout).to.contain('/registry/entities/author/delete')
    })
})
