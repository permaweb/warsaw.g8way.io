import { AsyncReader } from "./utils.js";

const GAME_CONTRACT =
  import.meta.env.VITE_GAME_CONTRACT || "ySvP5anS61lrrbDD34EHIKi-UH6bt5GiEIukm0Ug4t0";

const { ask, lift } = AsyncReader;

/**
 * @param {string} tx - transactionId
 * @returns {AsyncReader}
 */
export function reset(code) {
  return ask(({ writeAction }) =>
    writeAction({
      contract: GAME_CONTRACT,
      input: {
        function: "slash",
        code
      }
    })
  ).chain(lift);
}
