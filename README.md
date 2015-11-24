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

  render () {
    let {select, assign, dispatch} = this.props;
    return (
      <form onSumbit={() => dispatch(submitAction(this.props.namepsace))}/>
        <input
          value={select('email')}
          onChange={e => assign('email', e.target.value)}/>
        <input
          value={select('password')}
          onChange={e => assign('password', e.target.value)}/>
      </form>
    )
  }
}
```

## License

MIT
