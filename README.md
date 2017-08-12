Redux Namespace
=============

Dead simple tool moving component local state into a Redux namespace.

```shell
npm install --save redux-namespace
```

## Motivation
Got transient state without a home? Do your components lose it when they unmount? Are you swimming in a pool of reducers that do one thing? Then Redux Namespace is for you, because all those problems are tedious and boring, and you have better things to do!

[`redux-namespace`](https://www.npmjs.com/package/redux-namespace) it's a key value store, with depth.

## Usage

```js
yarn add redux-namespace
```

#### Attach the Reducer
```js
import { createStore, combineReducers } from 'redux';
import { reducer } from 'redux-namespace';

const store = createStore(combineReducers({namespace: reducer}));
```


#### Connect your components
This is probably too easy. Just name your namespace, then `select` and `assign` how you like.
```js
connect('pizza')(({ pizza }) =>
  <input 
    value={pizza.select('delivery.time') 
    onChange={pizza.assign('delivery.time', 'target.value')) />)
```
Let's look at that again.
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
But _you_ know what's up, `assign` is returning a function. A funtion that sets the path you give it to the value it gets. 

But it's not always that easy, sometimes we have to be picky.
```js
<input onChange={ns.assigns('email', 'target.value')}/>
```
And sometimes we have to be even pickier than that.
```js
<CustomInput onChange={ns.assigns('email', (event, value) => value)}/>
```

How about lists? We can pick a value from props, or pass it a string. So `connect('list', 'item')` will become a prop called `list`, but its values will be assigned to `list.item`.
```js
import { connect, shape } from 'redux-namespace'

@connect('list', (props) => props.id || 'new')
class ProductForm extends Component {
  static propTypes = {
    productsList: shape
  }

  render () {
    let { list: ns } = this.props;
    return (
      <form onSumbit={() => ns.dispatch(someAction(ns.select()))}/>
        <input
          value={ns.select('product.name')}
          onChange={ns.assigns('product.name', 'target.value')}/>
        <input
          value={ns.select('product.price')}
          onChange={ns.assigns('product.price', 'target.value')}/>
      </form>
    )
  }
}
```

But you don't have to manage it in one place. You can create a cursor—a pointer to one part of your namespace. It has all the same functions, but applied to its own descendant path.
```js

const productList = [
  { id: 1, name: '🦄', price: '🌈' },
  { id: 2, name: '🐿', price: '🥜' },
  { id: 3, name: '🐮', price: '🌾' },
]

@connect('productsList')
const ProductManager = (props) => 
  <div>
    {productList.map((product) => {
        // This will alway return the same cursor
        const cursor = props.productList.cursor(product.id);
        
        // We don't need to set it everytime, but it's safe to
        cursor.defaults(product);
        
        return <ProductForm product={cursor}/>
      }
    )}
  </div>
```

You can also `reset` your namespace, see if it was `touched` and track its `version`. See [the full API here](https://github.com/evanrs/redux-namespace/blob/master/docs/API.md).

It's not the Redux reducer we need, but it's the one I wrote, so have fun with it. ✌️

## Psst.
Know how to make it the reducer we need? 

Get in touch, let's make it work!
