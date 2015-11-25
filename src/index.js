import result from 'lodash.result';

export const BIND = 'BIND_NAMESPACE';

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

export function createConnect(React, ReactRedux) {
  const { Component, PropTypes } = React;

  return function connectNamespace(namespace, initial={}) {
    let _assign = assign(namespace);
    return WrappedComponent =>
      @ReactRedux.connect(({ namespace: { [namespace]: state } }) =>
        ({ select: (key, _default) => result(state, key, _default) }))
      class NamespaceBridge extends Component {
        render () {
          return <WrappedComponent {...{
            ...this.props,
            assign: key => value =>
              this.props.dispatch(_assign(key, value))
          }}/>
        }
      }
  }
}

export function createShape({PropTypes}) {
  return {
    namespace: PropTypes.string.isRequired,
    assign: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  }
}

export function reducer (state={}, action={}) {
  if (action.type === BIND) {
    let { payload: { namespace, key, value } } = action
    state[namespace] = {
      ...state[namespace], ...{[key]: value}}

  }

  return state;
}
