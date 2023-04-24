import {expect, test} from '@oclif/test'

import { setMockCallback } from '../../../src/lib/client'
import { buildResponse, expectRequest } from '../../helpers/http'
const testToken = 'test-token'

for(const appendType of ['fact', 'serial', 'atomic']) {

  const appendTypeRel = appendType === 'fact' ? 'factual' : appendType

  describe(`append:${appendType}`, () => {

    before(() => {
      process.stdin.isTTY = false
      setMockCallback( (async (req: Request) => {

        expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`)
        const path = new URL(req.url).pathname
        switch(path) {
          case '/' :
            return buildResponse({
              links: [{rel: 'append', href: '/append'}]
            })
          case '/append' :
            return buildResponse({
              links: [{rel: appendTypeRel, href: '/append/foo'}]
            })
          case '/append/foo':
            await expectRequest(req, {
              path: '/append/foo',
              method: 'POST',
              body: {
                foo: 'bar',
              }
            })
            return buildResponse({
              status: 201,
              headers: {
                location: 'https://example/mad-facts',
              }
            })
          default :
            return new Response('{}', {status: 501})
        }

      }))

    })

    test
      .stdout()
      .command([`append:${appendType}`, '-t', testToken, '-b', '{"foo": "bar"}'])
      .it('should work with JSON', (ctx) => {
        expect(ctx.stdout).to.contain('https://example/mad-facts')
      })
    test
      .stdout()
      .command([`append:${appendType}`, '-t', testToken, '-b', '{foo: "bar"}'])
      .it('should work with JSON5', (ctx) => {
        expect(ctx.stdout).to.contain('https://example/mad-facts')
      })

    /**
     * These tests are skipped because oclif/test doesn't fully mock
     * process.stdin
     */
    test
      .skip()
      .stdout()
      .command([`append:${appendType}`, '-t', testToken])
      .stdin('{foo: "bar"}')
      .it('should read from stdin', (ctx) => {
        expect(ctx.stdout).to.contain('https://example/mad-facts')
      })

    /**
     * These tests are skipped because oclif/test doesn't fully mock
     * process.stdin
     */
    test
      .skip()
      .stdout()
      .stdin('{wrong: "Also wrong!"}')
      .command([`append:${appendType}`, '-t', testToken])
      .it('should error handle errors', (ctx) => {
        expect(ctx.stdout).to.contain('Error')
      })

  })

}
