import concat from 'lodash/concat';
import get from 'lodash/get';
import merge from 'lodash/merge';
import set from 'lodash/set';
import toPath from 'lodash/toPath';


export const BIND = 'BIND_NAMESPACE_NEXT';

export function namespaceReducer (state={}, action={}) {

  if (action.type === BIND) {
    let { payload: { namespace, key, value } } = action

    namespace = toPath(namespace);
    key = toPath(key);

    let valuePath = concat(namespace, key);
    let touchPath = concat(namespace, '@@touched', key);

    if (value !== get(state, valuePath)) {
      state =
        merge(
          set({}, namespace, {}),
          state,
          set({}, valuePath, value),
          set({}, touchPath, true))
    }
  }


  return state;
}
