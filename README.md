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

#### Native
```js
import React, {View, Text, TextInput, TouchableHighlight, } from 'react-native'
import namespace from 'redux-namespace/native';

@namespace.connect('component/namespace')
class Form extends React.Component {
  static propTypes = {...@namespace.shape}

  render () {
    let {select, assign, dispatch} = this.props;
    return (
      <View>
        <TextInput
          value={select('email')} onChange={assign('email')}/>

        <TextInput
          value={select('password')} onChange={assign('password')}/>

        <TouchableHighlight onPress={e => dispatch(someAction(select()))}>
          <Text>Submit</Text>
        </TouchableHighlight>
      </View>
    )
  }
}
```

#### Web
```js
import React from 'react'
import namespace from 'redux-namespace';

@namespace.connect('component/namespace')
class Form extends React.Component {
  static propTypes = {...@namespace.shape}

  render () {
    let {select, assign, dispatch} = this.props;
    return (
      <form onSumbit={() => dispatch(someAction(select()))}/>
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
