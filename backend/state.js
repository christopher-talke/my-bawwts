import _ from "lodash";

let state = {
  twitch: {
    plays: [],
    alreadyIn: false,
  },
};

async function getState() {
  return state;
}

async function setState(object) {
  state = {
    ...state,
    ...object,
  };

  return state;
}

export { getState, setState };
