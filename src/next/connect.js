import { Component, PropTypes, createElement } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import invariant from 'invariant'
import toPath from 'lodash/toPath';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import memoize from 'lodash/memoize';
import constant from 'lodash/constant'
import result from 'lodash/result'
import filter from 'lodash/filter'
import shallowCompare from 'preact-shallow-compare'

import { create } from './create'


const storeShape = PropTypes.shape({
  subscribe: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  getState: PropTypes.func.isRequired
});

const nameShape = PropTypes.shape({
  version: PropTypes.func.isRequired,
  toPath: PropTypes.func.isRequired
})

const connectNamespace = memoize(create, (path) => `${path}`);

export function connect(namespace, key) {
  invariant(isString(namespace) || isFunction(namespace),
    `Expected "namespace" to be of type string or function`
  );

  if (! isFunction(namespace)) {
    namespace = constant(namespace)
  }

  return function wrapWithComponent (WrappedComponent) {
    class Connect extends Component {
      constructor(props, context) {
        super(...arguments);

        this.store = props.store || context.store

        invariant(this.store,
          `Could not find "store" in either the context or ` +
          `props of "${this.constructor.displayName}". `
        )

        this.namespace = this.getNamespace(props)
        this.state = {
          version: this.namespace.version()
        }
      }

      componentDidMount() {
        if (! this.unsubscribe) {
          this.unsubscribe =
            this.store.subscribe(this.handleChange.bind(this));
          this.handleChange();
        }
      }

      componentWillReceiveProps(props) {
        this.namespace = this.getNamespace(props);
      }

      shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      componentWillUpdate(nextProps, nextState) {
        if (nextState.version !== this.state.version) {
          this.namespace = this.getNamespace(nextProps)
        }
      }

      componentWillUnmount() {
        if (this.unsubscribe) {
          // comma operator, because why not?
          this.unsubscribe = this.unsubscribe(), null;
        }
      }

      getNamespace(props = this.props) {
        let segments = filter([
          ...result(props, 'namespace.toPath', []),
          namespace(props),
          isFunction(key) && `/${key(props)}`
        ])

        return connectNamespace(toPath(segments), this.store);
      }

      handleChange() {
        if (! this.unsubscribe) {
          return
        }

        const prev = this.state.version
        const next = this.namespace.version();


        if (prev !== next) {
          this.setState({ version: next })
        }
      }

      render() {
        return createElement(WrappedComponent, { ...this.props, [namespace(this.props)]: this.namespace })
      }
    }

    Connect.displayName = `Namespace@${namespace}`
    Connect.contextTypes = {
      store: storeShape
    }
    Connect.propTypes = {
      store: storeShape,
      namespace: nameShape
    }

    return hoistStatics(Connect, WrappedComponent)
  }
}
