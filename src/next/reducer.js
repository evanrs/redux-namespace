import clone from 'lodash/clone';
import concat from 'lodash/concat';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import mergeWith from 'lodash/mergeWith';
import set from 'lodash/set';
import toPath from 'lodash/toPath';
import unset from 'lodash/unset';


export const BIND = 'BIND_NAMESPACE_NEXT';
export const DEFAULTS = 'DEFAULTS_NAMESPACE_NEXT';
export const RESET = 'RESET_NAMESPACE_NEXT';

const actionTypes = { BIND, RESET, DEFAULTS };


export function namespaceReducer (state={}, action={}) {

  if (includes(actionTypes, action.type)) {
    let { payload: { namespace, key, value } } = action

    namespace = toPath(namespace);
    key = toPath(key);

    let changedPath = concat(namespace, key);

    let versions = { ...state['@@versions'] };
    let version = versions[changedPath] || 0;

    let toucheds = { ...state['@@toucheds'] };
    let touched = toucheds[changedPath] || 0;

    let fragment = clonePath(
      set({}, namespace, get(state, namespace)),
      changedPath
    );
    let current = get(fragment, changedPath);

    if (action.type === BIND && value !== current) {
      current = value;
      touched = touched + 1;
      version = version + 1;
    }

    if (action.type === DEFAULTS && ! touched) {
      current = value;
      touched = 0;
      version = version + 1;
    }

    if (action.type === RESET) {
      current = void 0;
      touched = 0;
      version = 0;
    }

    set(fragment, changedPath, current);

    state = mergeWith(clone(state), fragment, (a, b, p, c) => {
      if (isNil(b)) {
        unset(c, p);
      }
    })

    if (touched !== toucheds[changedPath]) {
      state['@@toucheds'] = setVersionAlongPath(toucheds, changedPath, touched ? 1 : 0);
    }

    if (version !== versions[changedPath]) {
      state['@@versions'] = setVersionAlongPath(versions, changedPath);
    }
  }

  return state;
}


function setVersionAlongPath (versions, path, increment=1) {
  versions = { ...versions };

  let pathRegex = new RegExp('^' + path + '\..+');

  Object.keys(versions).
    filter((key) => pathRegex.test(key)).
    map((key) =>
      unset(versions, key))

  path.reduce((paths, path) => {
    paths = paths.concat(path);
    versions[paths] = (versions[paths] || 0) + increment;

    return paths;
  }, [])

  return versions;
}


function clonePath (target, path) {
  path.forEach((key, idx, col) => {
    key = col.slice(0, idx);
    set(target, key, clone(get(target, key)))
  })

  return target;
}
