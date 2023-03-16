import {expect, test} from "@oclif/test"

import { setMockCallback } from '../../../src/lib/client';
import { buildResponse, expectRequest } from '../../helpers/http';
const testToken = "test-token"

describe("ledger", () => {
  it('should work', () => {

    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`);
      const path = new URL(req.url).pathname;
      switch(path) {

        case '/ledgers' :
          return buildResponse({
            body: {
              name: "test-ledger",
              count: 10_000
            },
          });
        default :
          return new Response('{}', {status: 501});
      }

    }));

    test
    .stdout()
    .command(["ledger", "--token", "test-token"])
    .it("runs ledger cmd", (ctx) => {
      expect(ctx.stdout).to.contain("10,000")
    })
  });
})
