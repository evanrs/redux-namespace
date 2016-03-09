import concat from 'lodash/concat';
import get from 'lodash/get';
import merge from 'lodash/merge';
import set from 'lodash/set';
import toPath from 'lodash/toPath';
import clone from 'lodash/clone';


export const BIND = 'BIND_NAMESPACE_NEXT';


export function namespaceReducer (state={}, action={}) {

  if (action.type === BIND) {
    let { payload: { namespace, key, value } } = action

    namespace = toPath(namespace);
    key = toPath(key);

    let changedPath = concat(namespace, key);
    let touchedPath = concat(namespace, '@@touched', key);
    let versionPath = concat(namespace, '@@version');

    if (value !== get(state, changedPath)) {
      let version = get(state, versionPath, 0) + 1;
      let fragment = set({}, namespace, get(state, namespace));

      clonePath(fragment, changedPath);
      clonePath(fragment, touchedPath);

      set(fragment, versionPath, version);
      set(fragment, changedPath, value);
      set(fragment, touchedPath, true);

      state = merge(clone(state), fragment)
    }
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
