import flow from 'lodash/flow';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import mapValues from 'lodash/mapValues';
import property from 'lodash/property';
import result from 'lodash/result';
import toPath from 'lodash/toPath';

import { BIND, DEFAULTS, RESET } from './reducer';


export function assign (namespace, key, value) {
  if (! key)
    return (key, value) =>
      assign(namespace, key, value);

  let action = (value) => ({
    type: BIND, payload: { namespace, key, value } })

  if ([...arguments].length < assign.length)
    return action;

  return action(value);
}

export function defaults (namespace, key, value) {
  return {
    type: DEFAULTS,
    payload: { namespace, key, value }
  }
}

export function reset (namespace, key) {
  return {
    type: RESET,
    payload: { namespace, key }
  }
}

export function create (namespace, store) {
  const { dispatch, getState } = store;

  const selectNamespace =
    property(['namespace', ...toPath(namespace)])

  const getNamespace =
    flow(getState, selectNamespace);

  function selector(key, __) {
    return arguments.length > 0 ?
      result(getNamespace(), key, __) : getNamespace() || {}
  }

  function dispatcher(target, value) {
    return (
      // curry or assign many
      arguments.length === 1 ?
      // curry assign with target
        isString(target) ?
          dispatcher.bind(this, target)
      // TODO interpret array as property.path
      // map target ({key: value}) => assign
      : mapValues(target, (value, key) => dispatcher(key, value))
    // deferred selector
    : isFunction(value) ?
      (...args) => dispatcher(target, value(...args))
    // memoize
    : selector(target) !== value ?
      ( dispatch(assign(namespace, target, value))
      , value )
    : value
    )
  }

  const ns = {
    assign: dispatcher,
    assigns(key, selector) {
      return dispatcher(key, (value, ...args) =>
          isString(selector) ? result(value, selector)
        : isFunction(selector) ? selector(value, ...args)
        : value
      )
    },
    cursor(path) {
      let nspath = toPath([toPath(namespace), toPath(path)])
      let cursor = create(nspath, store);

      return cursor;
    },
    dispatch,
    defaults(key, value) {
      if (isObject(key)) {
        dispatch(defaults(namespace, void 0, key));

        return key;
        // return mapValues(key, (value, key) => ns.defaults(key, value))
      }

      dispatch(defaults(namespace, key, value));

      return value;
    },
    select: selector,
    selects() {
      return selector.bind(null, ...arguments);
    },
    touched(key) {
      return selector(['@@touched', ...toPath(key)], false);
    },
    reset(key) {
      let value;

      if (! key) {
        value = selector();

        dispatch(reset(namespace))
      }
      else {
        value = selector(key);

        dispatch(reset(namespace, key))
      }

      return value;
    },
    resets(key) {
      return ns.reset.bind(ns, key);
    },
    version() {
      return selector('@@version', 0)
    }
  }

  return ns;
}
