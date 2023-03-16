import {expect, test} from "@oclif/test"
import * as fs from "fs"
import { pipeline } from 'stream/promises';

const tempDir = "./tmp/test"
const ledgerFile = `${tempDir}/test-download.ndjson`
const testToken = "test-token"
const firstEventId = "0005d5813bf9c4498e2a8b74e95bff80"
import { Request, Response } from 'node-fetch';

import { setMockCallback, initClient } from '../../../src/lib/client';

describe("ledger:download", async () => {

  it('should work', () => {

    if (fs.existsSync(ledgerFile)) {
      fs.rmSync(ledgerFile)
    } else {
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, {recursive: true})
      }
    }

    setMockCallback( (async (req: Request) => {

      expect(req.headers.get('Authorization')).to.equal(`Bearer ${testToken}`);
      const path = new URL(req.url).pathname;
      switch(path) {
        case '/ledgers/download' :
          expect(req.method).to.equal('POST');
          expect(req.headers.get('Prefer')).to.equal('return=representation');
          return new Response(
            JSON.stringify({
              entity:    "test",
              key:       "first-event-key",
              event:     "tested",
              eventId:   firstEventId,
              timestamp: "2022-01-14T02:05:17.275209Z",
              meta:      {
                actor: "Evently CLI Tester"
              },
              data:      {
                tested:      true,
                description: "This first event is for validating ledger downloads."
              }
            }),
            {
              status: 200
            }
          );
          break;
        case '/' : 
          return new Response(
            JSON.stringify({
              _links: {
                ledgers: { href: '/ledgers' },
              }
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/hal+json'
              },
            }
          );
        case '/ledgers' :
          return new Response(
            JSON.stringify({
              _links: {
                download: { href: '/ledgers/download' },
              }
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/hal+json'
              },
            }
          );
          
        default :
          return new Response('{}', {status: 501});
      }

    }) as any);


    /*
    const client = initClient(testToken);
    const state = await client.go().get();
    console.log(state.links.getAll());
    throw new Error('foo');
    */

    test
      .stdout()
      .command(["ledger:download", "--file", ledgerFile, "-t", testToken])
      .it("downloads full ledger", (ctx) => {
        expect(ctx.stdout).to.contain("Downloading ledger fully")
        expect(ctx.stdout).to.contain("Validated 1 ledger event")
      })

    // @ts-ignore
    global.mockEvently.intercept({
      path: "/ledgers/download",
      method: "POST",
      headers: {
        authorization: `Bearer ${testToken}`,
        prefer:        "return=representation"
      },
      // this is the full download
      body:   `{"after":"${firstEventId}"}`
    }).reply(200, {
      entity:    "test",
      key:       "second-event-key",
      event:     "tested",
      eventId:   "0005d5814ce488843dc5de3ee95bff80",
      timestamp: "2022-01-14T02:10:01.096324Z",
      meta:      {
        actor: "Evently CLI Tester"
      },
      data:      {
        tested:      true,
        description: "This is a second event after the initial download."
      }
    })

    test
      .stdout()
      .command(["ledger:download", "--file", ledgerFile, "--token", testToken])
      .it("downloads ledger after the first event", (ctx) => {
        expect(ctx.stdout).to.contain(`Downloading ledger after eventId ${firstEventId}`)
        expect(ctx.stdout).to.contain("Validated 2 ledger events")
      })

  });
})
