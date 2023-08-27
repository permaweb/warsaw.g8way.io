import { compose, prop, propEq, find, values } from "ramda";

/* global ContractAssert ContractError SmartWeave */

//const propEq = (k, v) => (o) => o[k] === v;

const functions = { register, stamp, slash, reset, evolve, setAdmin };

/**
 * @typedef Player
 * @property {string} token
 * @property {string} code
 * @property {string} handle
 * @property {string} avatar
 * @property {string} bio
 * @property {string} address
 * @property {number} points
 */

/**
 * @typedef {Object} State
 * @property {Record<string, Player>[]} players
 * @property {string} name
 * @property {string} creator
 * @property {boolean} canEvolve
 * @property {string} [evolve]
 * @property {string} description
 */

export async function handle(state, action) {
  if (Object.keys(functions).includes(action.input.function)) {
    return functions[action.input.function](state, action);
  }
  throw new ContractError(`${action.input.function} function not implemented!`);
}

function stamp(state, action) {
  const place = compose(
    prop("value"),
    find(propEq("Data-Source", "name"))
  )(SmartWeave.transaction.tags);

  const points = compose(prop("points"), find(propEq(place, "token")), values)(state.players);

  let player = find(
    (p) => propEq(action.caller, "address", p) && propEq(0, "points", p),
    values(state.players)
  );

  if (!player) {
    return { state };
  }
  if (!points) {
    return { state };
  }

  if (!player.score) {
    player.score = 0;
  }
  player.score += points;
  state.players[player.code] = player;
  return { state };
}

/**
 * @param {State} state
 * @param {{input: {code: string, token: string, avatar: string, handle: string, bio: string, points: number}, caller: string}} action
 */
async function register(state, action) {
  ContractAssert(action.input.code, "QR Code is Required!");
  ContractAssert(
    action.input.token && action.input.token.length === 43,
    "Player Token Contract Id is required!"
  );
  ContractAssert(action.caller && action.caller.length === 43, "caller is invalid");
  ContractAssert(action.input.avatar, "avatar id is required!");
  //ContractAssert(action.input.bio, "bio is required!");
  ContractAssert(action.input.handle, "user is required!");

  const _state = typeof state === "string" ? JSON.parse(state) : Object.assign({}, state);

  const code = action.input.code;
  const address = action.caller;
  const token = action.input.token;
  const avatar = action.input.avatar;
  const bio = action.input?.bio ? action.input.bio : "";
  const points = action.input?.points ? action.input.points : 0;

  if (_state.players[code]) {
    throw new ContractError("Player already registered!");
  }

  // readContractState of token is owned by the address
  const contract = await SmartWeave.contracts.readContractState(action.input.token);

  if (contract.balances[address] > 0) {
    _state.players[code] = {
      address,
      token,
      admin: false,
      code,
      avatar,
      handle: action.input.handle,
      bio,
      points
    };
  }

  return { state: _state };
}

/**
 * @param {State} state
 * @param {{input: {code: string}, caller: string}} action
 */
function slash(state, action) {
  ContractAssert(action.input.code, "QR Code is Required!");
  ContractAssert(action.caller && action.caller.length === 43, "caller is invalid!");

  const _state = typeof state === "string" ? JSON.parse(state) : Object.assign({}, state);

  // if caller is admin then allow slash
  const caller = Object.values(_state.players).find(propEq("address", action.caller));
  if (caller && caller.admin) {
    delete _state.players[action.input.code];
  }

  // if caller is creator then allow slash
  if (action.caller === _state.creator) {
    delete _state.players[action.input.code];
  }

  return { state: _state };
}

/**
 * @param {State} state
 * @param {{caller: string, input: {name: string, description: string}}} action
 */
function reset(state, action) {
  ContractAssert(action.input.name, "Name is Required!");
  ContractAssert(action.caller && action.caller.length === 43, "caller is invalid!");

  const _state = typeof state === "string" ? JSON.parse(state) : Object.assign({}, state);
  if (_state.creator === action.caller) {
    _state.players = {};
    _state.name = action.input.name;
    _state.description = action.input.description || "swag game";
  }
  return { state: _state };
}

/**
 * @param {State} state
 * @param {{caller: string, input: { value: string}}}
 */
function evolve(state, action) {
  ContractAssert(action.input.value, "Contract-Src value is Required!");
  const _state = typeof state === "string" ? JSON.parse(state) : Object.assign({}, state);
  if (_state.canEvolve) {
    if (_state.creator === action.caller) {
      _state.evolve = action.input.value;
    }
  }
  return { state: _state };
}

/**
 * @param {State} state
 * @param {{caller: string, input: {token: string, address: string}}} action
 */
function setAdmin(state, action) {
  ContractAssert(action.input.token, "Player Token is Required!");
  ContractAssert(action.input.address, "Player Address is Required!");
  ContractAssert(action.caller && action.caller.length === 43, "caller is invalid!");

  const _state = typeof state === "string" ? JSON.parse(state) : Object.assign({}, state);

  const isAdmin = Object.values(_state.players).find(propEq("address", action.caller)).admin;
  const player = Object.values(_state.players).find(
    (p) => p.address === action.input.address && p.token === action.input.token
  );

  if (isAdmin && player) {
    _state.players[player.code] = { ...player, admin: true };
  }

  return { state: _state };
}
