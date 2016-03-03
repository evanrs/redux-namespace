import result from 'lodash/result';


export const BIND = 'BIND_NAMESPACE_NEXT';

export function namespaceReducer (state={}, action={}) {
  if (action.type === BIND) {
    let { payload: { namespace, key, value } } = action

    let prev = result(state, namespace, {});
    let touched = result(prev, '@@touched', {});
    let next = {
      ...prev, [key]: value, ['@@touched']: { ...touched, [key]: true } };

    state = { ...state, [namespace]: next };
  }

  return state;
}
