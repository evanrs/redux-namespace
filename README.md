Redux Namespace
=============

Move your component local state into your Redux store under.
```js
namespace.connect('component/path')(Component)
```

## Motivation
Transient state, like toggles and form input, requires too much boiler plate.

Redux Namespace helps you connect your component with a trivial key value store.
To solve the some the of the basic problems of view state after routing.

You can use Redux Namespace relies on React Redux for connecting to the store and
returns two new methods `select` and `assign`. To put a value in the namespace
you call `assign(key, value)`, to get it back call `select(key)`. And, to get
all the values in the namespace call `select()` without any parameters.

To connect your components with their own namespace use `namespace.connect`.
```js
export namespace.connect('route/namespace')(Component)
```

#### Why store component state outside the component?
To get the incredible time traveling super powers provided by complete hydration
in your app state. Time travel is fun, play with [this](http://todo.cmyk.nyc).

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

// If decorators are your thing
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

// Or, if decorators aren't your thing
export namespace.connect('component/namespace')(Form)
```

## License

MIT
