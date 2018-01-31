import { NavigationActions } from 'react-navigation';

import * as AUTH_ACTION from '../constants/auth';

import { AppNavigator } from '../containers/AppNavigator';

const NAVIGATE = 'Navigation/NAVIGATE';
const BACK = 'Navigation/BACK';

const initialState = AppNavigator.router.getStateForAction(NavigationActions.init());

/* const firstAction = AppNavigator.router.getActionForPathAndParams("Main");
 *
 * initialState = AppNavigator.router.getStateForAction(
 *     firstAction,
 *     initialState
 * );
 * */
const nav = (state = initialState, action) => {
  let nextState;
  switch (action.type) {
    case BACK:
      return AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state,
      );
    case NAVIGATE:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({
        routeName: action.routeName,
        params: action.params,
      }), state);

    case AUTH_ACTION.LOGIN_SUCCESS:
    case AUTH_ACTION.SAVE_PROFILE_SUCCESS:
    case AUTH_ACTION.CERTIFICATION_SUCCESS:
      return AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state,
      );
    case AUTH_ACTION.TOKEN_LOGIN_FAILURE:
      return AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state,
      );
    case AUTH_ACTION.LOGOUT_SUCCESS:
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.back(),
        state,
      );
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
        state,
      );
      break;
    default:
      return state;
  }
  return nextState || state;
};
export default nav;
