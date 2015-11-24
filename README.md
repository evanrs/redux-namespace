Redux Namespace
=============

Namespace component state into Redux store

## Installation

```js
npm install --save redux-namespace
```

```js
import { createStore, combineReducers } from 'redux';
import namespace from 'redux-namespace';


const store = createStore(combineReducers({namespace}));
```

## Usage

```js
import React from 'react'
import namespace from 'redux-namespace';

@namespace.connect('your/component/namespace')
class Form extends React.Component {
  static propTypes = {...@namespace.shape}
  _onSubmit() {
    this.props.dispatch({type: 'SAVE', payload: this.namespace})
  }
  render () {
    let {select, assign} = this.props;
    return (
      <form onSumbit={e => this._onSubmit()}/>
        <input value={select('email') onChange={assign('email')}/>
        <input value={select('password') onChange={assign('password')}/>
      </form>
    )
  }
}
```

## License

MIT
