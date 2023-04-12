import {expect, test} from '@oclif/test'
import * as fs from 'fs'
import { buildResponse, expectRequest } from '../../helpers/http'

const tempDir = './tmp/test'
const ledgerFile = `${tempDir}/test-download.ndjson`
const testToken = 'test-token'
const firstEventId = '0005d5813bf9c4498e2a8b74e95bff80'

import { setMockCallback } from '../../../src/lib/client'

describe('ledger:download', async () => {

  before(() => {

    if (fs.existsSync(ledgerFile)) {
      fs.rmSync(ledgerFile)
    } else {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, {recursive: true})
      }
    }

    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`)
      const path = new URL(req.url).pathname
      switch(path) {
        case '/ledgers/download' : {

          expectRequest(req, {
            path: '/ledgers/download',
            method: 'POST',
            headers: {
              'Prefer': 'return=representation',
            }
          })

          const body = await req.json()

          if (body.after === undefined) {
            return buildResponse({
              body: {
                entity:    'test',
                key:       'first-event-key',
                event:     'tested',
                eventId:   firstEventId,
                timestamp: '2022-01-14T02:05:17.275209Z',
                meta:      {
                  actor: 'Evently CLI Tester'
                },
                data:      {
                  tested:      true,
                  description: 'This first event is for validating ledger downloads.'
                }
              }
            })
          }
          if (body.after === firstEventId) {
            return buildResponse({
              body: {
                entity:    'test',
                key:       'second-event-key',
                event:     'tested',
                eventId:   '0005d5814ce488843dc5de3ee95bff80',
                timestamp: '2022-01-14T02:10:01.096324Z',
                meta:      {
                  actor: 'Evently CLI Tester'
                },
                data:      {
                  tested:      true,
                  description: 'This is a second event after the initial download.'
                }
              }
            })
            break
          } else {
            throw new Error('Unexpected body')
          }
        }
        case '/' :
          return buildResponse({
            links: [{rel: 'ledgers', href: '/ledgers'}]
          })
        case '/ledgers' :
          return buildResponse({
            links: [{rel: 'download', href: '/ledgers/download'}]
          })
        default :
          return new Response('{}', {status: 501})
      }

    }))

  })

  test
    .stdout()
    .command(['ledger:download', '--file', ledgerFile, '-t', testToken])
    .it('downloads full ledger', (ctx) => {

      expect(ctx.stdout).to.contain('Downloading ledger fully')
      expect(ctx.stdout).to.contain('Validated 1 ledger event')
    })

  test
    .stdout()
    .command(['ledger:download', '--file', ledgerFile, '--token', testToken])
    .it('downloads ledger after the first event', (ctx) => {
      expect(ctx.stdout).to.contain(`Downloading ledger after eventId ${firstEventId}`)
      expect(ctx.stdout).to.contain('Validated 2 ledger events')
    })

})
