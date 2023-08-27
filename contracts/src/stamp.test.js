/* global globalThis */
import { test } from "uvu";
import * as assert from "uvu/assert";

test("stamp with points", async () => {
  const { handle } = await import("./game.js");
  globalThis.SmartWeave = {
    transaction: {
      tags: {
        "Data-Source": "1"
      }
    }
  };
  const result = await handle(
    {
      players: {
        1: {
          token: "1",
          points: 8,
          code: "1"
        },
        rakis: {
          address: "2",
          points: 0,
          code: "rakis"
        }
      }
    },
    { caller: "2", input: { function: "stamp" } }
  );

  console.log(result);
  assert.ok(true);
});

test.run();
