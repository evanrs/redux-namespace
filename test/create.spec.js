import expect from 'expect';
import { createStore, combineReducers } from 'redux';

import { create } from '../src/create';
import { namespaceReducer } from '../src/reducer';

function createTest () {
  const store = createStore(combineReducers({
    namespace: namespaceReducer
  }))

  return {
    store, ns: create('test', store)
  }
}

describe('create', () => {
  it('should return a namespace', () => {
    const { ns } = createTest()
    const methods = Object.keys(ns)

    expect(methods).toContain('assign')
    expect(methods).toContain('assigns')
    expect(methods).toContain('cursor')
    expect(methods).toContain('dispatch')
    expect(methods).toContain('defaults')
    expect(methods).toContain('select')
    expect(methods).toContain('selects')
    expect(methods).toContain('touched')
    expect(methods).toContain('reset')
    expect(methods).toContain('resets')
    expect(methods).toContain('version')
  })

  it('should assign values', () => {
    const { ns, store } = createTest()

    ns.assign('foo', 'bar')

    expect(store.getState().namespace.test.foo).toEqual('bar')
  })

  it('should select values', () => {
    const { ns } = createTest()

    ns.assign('foo.bar', { baz: 'bop'})

    expect(ns.select('foo.bar.baz')).toEqual('bop')
  })

  it('should create cursors', () => {
    const { ns, store } = createTest()
    const cursor = ns.cursor('cursed')

    cursor.assign('foo.bar', { baz: 'bop'})
    cursor.assign('some.array[0]', { and: [{ nested: 'value' }]})
    cursor.assign('some.array[1]', { or: 'not' })
    cursor.assign('some.array', [])

    expect(ns.select('cursed.foo.bar.baz')).toEqual('bop')
    expect(cursor.select('foo.bar.baz')).toEqual('bop')

    ns.assign('cursed.bar', 'baz')
    expect(cursor.select('bar')).toEqual('baz')
  })

  it('should version along path', () => {
    const { ns } = createTest()

    expect(ns.version()).toEqual(0)

    ns.assign('foo', {})
    expect(ns.version()).toEqual(1)
    expect(ns.version('foo')).toEqual(1)
    expect(ns.cursor('foo').version()).toEqual(1)

    ns.assign('foo.bar', true)
    expect(ns.version()).toEqual(2)
    expect(ns.version('foo')).toEqual(2)
    expect(ns.version('foo.bar')).toEqual(1)
    expect(ns.cursor('foo').version()).toEqual(2)
    expect(ns.cursor('foo').version('bar')).toEqual(1)

    ns.assign('foo', {})
    expect(ns.version()).toEqual(3)
    expect(ns.version('foo')).toEqual(3)
    expect(ns.version('foo.bar')).toEqual(0)

    ns.assign('foo', { bar: true });
    expect(ns.version('foo')).toEqual(4)
    expect(ns.version('foo.bar')).toEqual(0)
  })

  it('should be touched along path', () => {
    const { ns } = createTest()

    expect(ns.touched()).toEqual(0)

    ns.assign('foo.bar', true)
    expect(ns.touched()).toEqual(1)
    expect(ns.touched('foo')).toEqual(1)
    expect(ns.touched('foo.bar')).toEqual(1)

    ns.assign('foo', {})
    expect(ns.touched('foo')).toEqual(2)
    expect(ns.touched('foo.bar')).toEqual(0)
  })

  it('should reset', () => {
    const { ns, store } = createTest();

    ns.assign('foo', {});
    ns.assign('foo.bar', {});
    ns.reset('foo');
    expect(ns.version('foo')).toEqual(0);

    ns.assign('foo', {});
    expect(ns.version('foo')).toEqual(1);
    expect(ns.touched('foo')).toEqual(1);
  })

  it('should set defaults', () => {
    const { ns, store } = createTest();

    ns.defaults('foo', {});
    expect(ns.touched('foo')).toEqual(0);
    expect(ns.version('foo')).toEqual(1);

    ns.defaults('foo.bar', {});
    expect(ns.touched('foo')).toEqual(0);
    expect(ns.version('foo')).toEqual(2);
    expect(ns.touched('foo.bar')).toEqual(0);
    expect(ns.version('foo.bar')).toEqual(1);
  })

  it('should map over an object', () => {
    const { ns, store } = createTest();

    ns.assign({ 'bop': 1, 'baz': 2 });
    expect(ns.version('bop')).toEqual(1)
    expect(ns.touched('baz')).toEqual(1)
  })
})
