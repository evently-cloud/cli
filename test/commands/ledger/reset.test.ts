import {expect, test} from "@oclif/test"

import { setMockCallback } from '../../../src/lib/client';
import { buildResponse, expectRequest } from '../../helpers/http';
const testToken = "test-token"
const ledgerMark = "a-ledger-mark"

describe("ledger:reset", () => {

  it('should work', () => {

    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`);
      const path = new URL(req.url).pathname;
      switch(path) {
        case '/' :
          return buildResponse({
            links: [{rel: 'ledgers', href: '/ledgers'}]
          });
        case '/ledgers' :
          return buildResponse({
            links: [{rel: 'download', href: '/ledgers/reset'}]
          });
        case '/ledgers/reset' :
          expectRequest(req, {
            path: '/ledgers/reset',
            method: 'POST',
            body: {
              after: ledgerMark,
            }
          });
          return buildResponse({
            status: 204,
          });
        default :
          return new Response('{}', {status: 501});
      }

    }));

    test
      .stdout()
      .command(["ledger:reset", "-t", testToken])
      .it("resets ledger fully", (ctx) => {
        expect(ctx.stdout).to.contain("fully")
      })


    test
      .stdout()
      .command(["ledger:reset", "-t", testToken, "-a", ledgerMark])
      .it("resets ledger after mark", (ctx) => {
        expect(ctx.stdout).to.contain("after")
      })

  });
})
