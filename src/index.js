export const BIND = 'BIND_NAMESPACE';

export function assign(namespace, key, value) {
  if (! key)
    return (key, value) =>
      assign(namespace, key, value);

  let action = (value) => ({
    type: BIND, payload: { namespace, key, value } })

  if (! value)
    return action;

  return action(value);
}

export function createConnect(React, ReactRedux) {
  const { Component, PropTypes } = React;

  return function connectNamespace(namespace, initial={}) {
    let _assign = assign(namespace);
    return WrappedComponent =>
      @ReactRedux.connect(state => state[namespace] || initial)
      class Connector extends Component {
        render () {
          return <WrappedComponent {...{
            ...this.props,
            assign: key => value =>
              this.props.dispatch(_assign(key, value)),
            select: key => this.props[key],
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

export function reducer (state={}, { type, payload: { namespace, key, value } }) {
  if (action.type === BIND)
    state[namespace][key] = value;

  return state;
}
