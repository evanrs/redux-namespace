import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import result from 'lodash/result';
import flow from 'lodash/flow';
import property from 'lodash/property';

import { BIND } from './reducer';

export function assign(namespace, key, value) {
  if (! key)
    return (key, value) =>
      assign(namespace, key, value);

  let action = (value) => ({
    type: BIND, payload: { namespace, key, value } })

  if ([...arguments].length < assign.length)
    return action;

  return action(value);
}

export function create(namespace, store) {
  const { dispatch, getState } = store;
  const getNamespace =
    flow(getState, property(`namespace.${namespace}`));

  const ns = {
    assign: assign(namespace),
    select(key, __) {
      return arguments.length > 0 ?
        result(getNamespace(), key, __) : getNamespace() || {}
    }
  }

  function dispatcher(target, value) {
    return (
      // curry or assign many
      arguments.length === 1 ?
      // curry assign with target
        isString(target) ?
          dispatcher.bind(this, target)
      // map target ({key: value}) => assign
      : ( Object.keys(target).map((key) =>
            dispatcher(key, target[key]))
        , target )
    // deferred selector
    : isFunction(value) ?
      (...args) => dispatcher(target, value(...args))
    // memoize
    : ns.select(target) !== value ?
      ( dispatch(ns.assign(target, value))
      , value )
    : value
    )
  }

  return {
    assign: dispatcher,
    assigns(key, selector) {
      return dispatcher(key, (value, ...args) =>
          isString(selector) ? result(value, selector)
        : isFunction(selector) ? selector(value, ...args)
        : value
      )
    },
    dispatch,
    select: ns.select,
    selects() {
      return select.bind(null, ...arguments);
    },
    touched(key) {
      return ns.select(['@@touched'].concat(key), false);
    }
  }
}
