import {expect, test} from "@oclif/test"


describe("ledger", () => {
  // @ts-ignore
  global.mockEvently.intercept({
    path: "/ledgers",
    method: "GET",
    headers: {
      authorization: "Bearer test-token"
    }
  }).reply(200, {
    name: "test-ledger",
    count: 10_000
  })

  test
  .stdout()
  .command(["ledger", "--token", "test-token"])
  .it("runs ledger cmd", (ctx) => {
    expect(ctx.stdout).to.contain("10,000")
  })
})
