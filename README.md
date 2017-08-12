Redux Namespace
=============

Dead simple tool moving component local state to a Redux store namespace.

```shell
npm install --save redux-namespace
```

## Motivation
Transient state like toggles and form input require too much boiler plate.

[`redux-namespace`](https://www.npmjs.com/package/redux-namespace)
helps you connect your component with a trivial key value store. This solves the
far–too–painful/should–be–easier problems with managing view state after routing.

### Why store component state outside the component?
To get the incredible time traveling super powers and retained transients provided
from having complete hydration of your app state. Time travel is fun, play with [this](http://todo.cmyk.nyc).

Redux Namespace builds on [React Redux](https://www.npmjs.com/package/react-redux/),
but provides new methods: `assign`, `cursor` and `select` to go with `dispatch`.

* Calling `assign(key, value)` puts a value in your namespace and `select(key)` gets
it out.
* Calling `select()` with no parameters returns the entire namespace.
* Calling `cursor(key)` returns a nested namespace.

Connecting your components with their own namespace is trivial. Use it like
React Redux, but forget about writing the selectors.

```js
namespace.connect('recipe/editor')(Component)
```

## Setup

```js
npm install --save redux-namespace
```

#### Attach the Reducer
```js
import { createStore, combineReducers } from 'redux';
import namespace from 'redux-namespace';

const store = createStore(combineReducers({namespace}));
```

## Usage

```js
import * as namepsace from 'redux-namespace';

const Form = namespace.connect('form', 'signin')((props) => {
  let { form } = props;
  return (
    <View>
      <TextInput
        value={form.select('email')} onChange={form.assign('email')}/>

      <TextInput
        value={form.select('password')} onChange={form.assign('password')}/>

      <TouchableHighlight onPress={e => dispatch(someAction(form.select()))}>
        <Text>Submit</Text>
      </TouchableHighlight>
    </View>
  )
})

```

```js
import { connect, shape } from 'redux-namespace'

@connect('productsList', (props) => props.productId || 'new')
class Form extends Component {
  static propTypes = {
    productsList: shape
  }

  render () {
    let { ns } = this.props;
    return (
      <form onSumbit={() => dispatch(someAction(ns.select()))}/>
        <input
          value={ns.select('product.name')}
          onChange={ns.assigns('product.name', 'target.value')}/>
        <input
          value={select('product.price')}
          onChange={ns.assigns('produce.price', 'target.value')}/>
      </form>
    )
  }
}
```


#### Routing
```js
<Route path='free-pizza'
  component={ namespace.connect('pizza-surplus')(Component) }/>
```

##### You get a namespace, and you get a namespace … !
Automatically wrap your routes by assigning them after they're made.
```js
let routes = [
  <Route/>
  <Route/>
  <Route/>
]

routes = routes.map(route => namespace.connect(route.path)(route))
```

#### Lazy binding… sort of
```js
@namespace.connect('recipes')
class RecipeEditor extends React.Component {
  static propTypes = {...namespace.shape}

  render () {
    let document = namespace.connect(`recipes/${select('currentId')}`);
    let autosave = namespace.connect(`recipes/${select('currentId')}/autosave`);
    let groceries = namespace.connect('groceries');

    let Loader = document(Await)
    let Autosave = document(autosave(DebouncedSave))

    return (
      <Loader>
        <Autosave/>
        { map(React.createElement,
            map(document, [
              Menu,
              WYSIWYG,
              Editor,
              WordCount,
              groceries(VegetableCount),
              groceries(CalorieCount),
              groceries(CountChoculaCount)
            ]))
          }
      </Loader>
    )
  }
}
```


### Skip writing actions
Using the `namespace.BIND` constant you can write new reducers to work with
your events without adding more plumbing.

```js
function (state, action) {
  if (action.type === namespace.BIND) {
    let {namespace, key, value} = action.payload;

    switch (namespace) {
      case 'app/signup':
        state[namespace][key].error = validate(key, value.field);
        break;

      case 'my/easter/egg':
        if (key === 'menuToggle')
          if (++state.finalCountdown > 5)
            state.surpriseCatGif = true
        break;
    }

    // I'm not sure which is more esoteric, the previous example or this one
    if (state.namespace[namespace][ttl] > new Date() - state[ttl][action.namespace][key])
      delete state.namespace[namespace][key];
  }

  return state;
}
```

Although you probably shouldn't do this often, it's faster than scaffolding
the additional constants and action creators. Beware, with great power comes greater side effects…
that we probably should avoid unless we liked Angular 1—better known as Whoopsie Daisy.


## License

MIT
