import {
  REQUEST_ANIME_CHARACTERS,
  RECIEVE_ANIME_CHARACTERS_DATA,
  REQUEST_ANIME_CHARACTERS_FAILED,
} from 'actions/singleAnimeCreator';

/**
 * App's initial state, Redux will use these values
 * to bootstrap our app, before having a generated state.
 */
const initialAnimeCharacters = {
  isFeching: false,
  characters: [],
  error: false,
  errorMessage: '',
};

/**
 * Reducer - this part is in charge of changing the global state
 *
 * @param {Object=} state  - App's current state.
 * @param {object}  action - This has the action will be Fired.
 * @returns {Object} Returns the app's new state.
 */
export default function animeCharacters(state = initialAnimeCharacters, action) {
  switch (action.type) {
    case REQUEST_ANIME_CHARACTERS:
      return {
        ...state,
        isFeching: true,
        error: false,
      };
    case RECIEVE_ANIME_CHARACTERS_DATA:
      return {
        ...state,
        isFeching: false,
        characters: action.payload.characters,
        error: false,
      };
    case REQUEST_ANIME_CHARACTERS_FAILED:
      return {
        ...state,
        error: true,
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}
