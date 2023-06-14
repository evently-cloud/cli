import {expect, test} from '@oclif/test'

import { setMockCallback } from '../../../src/lib/client'
import { buildResponse, expectRequest } from '../../helpers/http'
const testToken = 'test-token'

describe('selector:replay', async () => {

  before(() => {
    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`)
      const path = new URL(req.url).pathname
      let hasNext = false
      switch(path) {
        case '/' :
          return buildResponse({
            links: [{rel: 'selectors', href: '/s'}]
          })
        case '/s' :
          return buildResponse({
            links: [
              {rel: 'replay', href: '/s/r'},
            ],
          })
        case '/s/r' : {
          await expectRequest(req, {
            method: 'POST',
          })
          const body = await req.json()

          const records = []
          switch(body.entity) {
            case 'entity-test1' :
              records.push({
                entity: body.entity,
                key: 'key1',
                event: 'event1',
                eventId: 'eventID1',
                timestamp: '20230610T232900Z',
                meta: {},
                data: {},
              })
              break
            case 'entity-test2' :
              records.push({
                entity: body.entity,
                key: 'key1',
                event: 'event1',
                eventId: 'eventID1',
                timestamp: '20230610T232900Z',
                meta: {},
                data: {after: body.after},
              })
              break
            case 'entity-test3' :
              hasNext = true
              records.push({
                entity: body.entity,
                key: 'key1',
                event: 'event1',
                eventId: 'eventID1',
                timestamp: '20230610T232900Z',
                meta: {},
                data: {},
              })
              break
          }
          return buildResponse({
            headers: {
              'Content-Type': 'application/x-ndjson',
            },
            rawBody: [
              ...records,
              {
                _links: hasNext ? { next: { href: 'https://example/?next'}} : { }
              },
            ].map(line => JSON.stringify(line)).join('\n')
          })
        }
        default:
          return buildResponse({status: 501})

      }

    }))

  })

  test
    .stdout()
    .command(['selector:replay', '-t', testToken, '-n', 'entity-test1', '-k', 'key1', '-k', 'key2'])
    .it('Should succeed with basic arguments', (ctx) => {
      expect(ctx.stdout).to.contain('Entity')
      expect(ctx.stdout).to.contain('entity-test1')
      expect(ctx.stdout).to.contain('Key')
      expect(ctx.stdout).to.contain('key1')
      expect(ctx.stdout).to.contain('No more data')
    })
  test
    .stdout()
    .command(['selector:replay', '-t', testToken, '-n', 'entity-test2', '-k', 'key2', '--after', '123123'])
    .it('Should pass on the --after argument', (ctx) => {
      expect(ctx.stdout).to.contain('123123')
    })
  test
    .stdout()
    .command(['selector:replay', '-t', testToken, '-n', 'entity-test3', '-k', 'key3'])
    .it('Should show the next link URL', (ctx) => {
      expect(ctx.stdout).to.contain('https://example/?next')
    })

})

