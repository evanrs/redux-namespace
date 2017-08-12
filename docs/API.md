# API
Redux namespace provides tools to read and write to any path in your redux store. Use at your own risk, but enjoy yourself too 🙂

# Namespace

## `create()`
Creates a namespace at the given path—a cursor into your redux store for setting and getting values. But really, it's easier to just use the `connect` decorator.
```js
create(path: String, store: ReduxStore): namespace
```

## `select()`
Selects from the namespace at the given path or returns the `defaultValue`
```js
ns.select(path: String, defaultValue: any): any
```

## `selects()`
Returns `select` bound to the namespace and given path
```js
ns.selects(path: String): ns::select(path)
```

## `assign()`
Assign is a curried method accepting several static or resolved value types.

##### Sets a value
```js
ns.assign(pathMap: String|Object, value: any): value
```

##### Will set a value, returns curried method
```js
ns.assign(pathMap: String|Object): ns::assign(path, ...args)
```

##### Will set the value returned by this function.
Returns a method curried to assign the target with value returned by the given method and arguments.
```js
ns.assign(pathMap: String|Object, resolve: Function): (...args) => resolve(...args)
```

## `assigns()`
Returns a bound `ns::assign` for the given path or pathMap
```js
ns.assign(pathMap: String|Object, resolve?: String|Function): ns::assign(pathMap, resolve?)
```

## `cursor()`
Returns a namespace instance for the given path, a cursor.
```js
ns.cursor(key: String): ReduxNamepsace
```

## `defaults()`
Sets default values for the namespace.
```js
ns.defaults(value: Object):
```

Sets default at a path.
```js
ns.defaults(path: String, value: any):
```

## `reset()`
Resets namespace version, sets defaults, untouches, and returns previous value.
```js
ns.reset(path?: String): any
```

## `resets()`
Returns `reset` bound to the namespace and given path
```js
ns.resets(path: String): ns::reset(path)
```

## `touched()`
Returns true for modified values, false otherwise.
```js
ns.touched(path?: String): Boolean
```

## `version()`
Returns the current version of the namespace
```js
ns.version(path?: String): Number
```


## `dispatch()`
Standard redux dispatch

---
