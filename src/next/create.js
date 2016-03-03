import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import result from 'lodash/result';
import flow from 'lodash/flow';
import property from 'lodash/property';
import mapValues from 'lodash/mapValues';

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
    flow(getState, property(['namespace', namespace]));

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
    select: selector,
    selects() {
      return selector.bind(null, ...arguments);
    },
    touched(key) {
      return selector(['@@touched'].concat(key), false);
    }
  }
}
