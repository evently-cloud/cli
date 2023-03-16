import {expect, test} from "@oclif/test"

const testToken = "test-token"
const ledgerMark = "a-ledger-mark"


describe("ledger:reset", () => {

  it('should work', () => {

    // @ts-ignore
    global.mockEvently.intercept({
      path: "/ledgers/reset",
      method: "POST",
      headers: {
        authorization: `Bearer ${testToken}`
      },
      // resets the whole ledger
      body:   "{}"
    }).reply(204, null)

    test
      .stdout()
      .command(["ledger:reset", "-t", testToken])
      .it("resets ledger fully", (ctx) => {
        expect(ctx.stdout).to.contain("fully")
      })

    // @ts-ignore
    global.mockEvently.intercept({
      path: "/ledgers/reset",
      method: "POST",
      headers: {
        authorization: `Bearer ${testToken}`,
        "Content-Type": "application/json"
      },
      // resets ledger after the mark
      body:   `{"after":"${ledgerMark}"}`
    }).reply(204, null)

    test
      .stdout()
      .command(["ledger:reset", "-t", testToken, "-a", ledgerMark])
      .it("resets ledger after mark", (ctx) => {
        expect(ctx.stdout).to.contain("after")
      })

  });
})
