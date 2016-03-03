import { Component, PropTypes, createElement } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'
import result from 'lodash/result';

import { create } from './create'


const storeShape = {
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
};

export function connect(namespace) {
  return function wrapWithComponent (WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        super(props, context)
        this.store = props.store || context.store

        invariant(this.store,
          `Could not find "store" in either the context or ` +
          `props of "${this.constructor.displayName}". `
        )

        this.childProps = create(namespace, this.store)
        this.state = {
          namespace: result(this.store.getState(), `namespace.${namespace}`, {}),
          version: 0
        }
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe(this.handleChange.bind(this))
      }

      componentWillUnmount() {
        this.unsubscribe()
        this.unsubscribe = null
      }

      componentWillUpdate(nextProps, nextState) {
        if (nextState.version !== this.state.version) {
          this.childProps = {
            ...this.childProps,
            version: nextState.version
          }
        }
      }

      handleChange() {
        if (! this.unsubscribe) {
          return
        }

        const prev = this.state.namespace
        const next = result(this.store.getState(), `namespace.${namespace}`, prev)

        if (prev !== next) {
          this.setState({
            namespace: next,
            version: this.state.version + 1
          })
        }
      }

      render() {
        return createElement(WrappedComponent, { ...this.props, [namespace]: this.childProps })
      }
    }

    Connect.displayName = `Namespace@${namespace}`
    Connect.contextTypes = {
      store: storeShape
    }
    Connect.propTypes = {
      store: storeShape
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
