import concat from 'lodash/concat';
import get from 'lodash/get';
import mergeWith from 'lodash/mergeWith';
import set from 'lodash/set';
import unset from 'lodash/unset';
import toPath from 'lodash/toPath';
import clone from 'lodash/clone';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';


export const BIND = 'BIND_NAMESPACE_NEXT';
export const RESET = 'RESET_NAMESPACE_NEXT';
export const DEFAULTS = 'DEFAULTS_NAMESPACE_NEXT';

const actionTypes = { BIND, RESET, DEFAULTS };

export function namespaceReducer (state={}, action={}) {
  if (includes(actionTypes, action.type)) {
    let { payload: { namespace, key, value } } = action

    namespace = toPath(namespace);
    key = toPath(key);

    let changedPath = concat(namespace, key);
    let touchedPath = concat(namespace, '@@touched', key);
    let versionPath = concat(namespace, '@@version');

    let fragment = set({}, namespace, get(state, namespace));

    clonePath(fragment, changedPath);
    clonePath(fragment, touchedPath);

    let version = get(state, versionPath, 0);
    let current = get(state, changedPath);
    let touched = get(state, touchedPath);

    if (action.type === BIND && value !== current) {
      version = version + 1;
      current = value;
      touched = true;
    }

    if (action.type === DEFAULTS && ! touched) {
      version = version + 1;
      current = value;
      touched = false;
    }

    if (action.type === RESET) {
      version = 0;
      current = void 0;
      touched = false;
    }

    set(fragment, versionPath, version);
    set(fragment, touchedPath, touched);
    set(fragment, changedPath, current);

    state = mergeWith(clone(state), fragment, (a, b, p, c) => {
      if (isNil(b)) {
        unset(c, p);
      }
    })
  }



  return state;
}


function clonePath (target, path) {
  path.forEach((key, idx, col) => {
    key = col.slice(0, idx);
    set(target, key, clone(get(target, key)))
  })

  return target;
}
