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
        ({ select: (key, __ = state) => result(state, key, __) }))
      class NamespaceBridge extends Component {
        render () {
          let props = {
            // namespace defers to props
            ...this.props.select(),
            ...this.props,
            assign: (key, ...args) =>
                      args.length === 0 ?
                        props.assign.bind(this, key)
                      : props.select(key) !== args[0] ?
                          props.dispatch(_assign(key, args[0])).payload.value
                        : args[0]
          }
          return React.isValidElement(WrappedComponent) ?
            React.cloneElement(WrappedComponent, props) : <WrappedComponent {...props}/>
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
