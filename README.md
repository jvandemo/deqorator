Deqorator
=========

A very lightweight queued decorator for Node.js to easily decorate objects using middleware.

[![Build Status](https://travis-ci.org/jvandemo/deqorator.png?branch=master)](https://travis-ci.org/jvandemo/deqorator)

## What is deqorator used for?

Suppose you have an object and you want to decorate it with data (e.g. fill properties with data from several database queries).

Instead of nesting all kinds of callbacks, deqorator allows you to easily create a reusable decorator using one or more middleware handlers.

## Quick demo

First create a decorator:

```javascript
var deqorator = new Deqorator();
```

Then add as many middleware handlers as you like:

```javascript
deqorator.use(function(err, item, next){

    // The item to decorate is passed from middleware to middleware
    // and you can make changes to it
    item.middleware1 = "done";
    next();
});
```

Asynchronous callbacks are supported, just call `next()` when finished:

```javascript
deqorator.use(function(err, item, next){

    // Some asynchronous call
    setTimeout(function(){
        next();
    }, 1000);
});
```

If you want to raise an error, just call `next()` with an error and all subsequent middleware handlers are skipped:

```javascript
deqorator.use(function(err, item, next){

    // This will skip all middleware handlers after this one
    next('Halt immediately!')
});
```

Each middleware handler is passed the item and is processed in the order you add it to the `deqorator`:

```javascript
deqorator.use(function(err, item, next){

    // The changes from the previous middleware handler are available here
    console.log(item.middleware1); // done
    next();
});
```

Once you have defined all the middleware for the deqorator, you can use it to decorate as many objects as you like.

The callback of the `decorate()` function is called when the object has been completely decorated or when an error was raised:

```javascript
var item = {};

deqorator.decorate(item, function(err, item){

    // Error handler
    if(err){

        // The partially decorated item is available in case of an error
        console.log(item);

        console.log('Oops, something went wrong while decorating the object');
        return;
    }

    // The completely decorated item is available here if all went well
    console.log(item);
});
```

## Method of operation

There is no need to worry about asynchronous behavior:

- all middleware handlers are processed in the order you define them.
- all objects are decorated in the order you decorate them.

So a scenario like this:

```javascript
var item1 = {},
    item2 = {},
    item3 = {},
    deqorator = new Deqorator(),
    middleware1 = function(err, item, next){ ... },
    middleware2 = function(err, item, next){ ... },
    middleware3 = function(err, item, next){ ... };

deqorator.use(middleware1);
deqorator.use(middleware2);
deqorator.use(middleware3);

deqorator.decorate(item1, function(err, item){ ... });
deqorator.decorate(item2, function(err, item){ ... });
deqorator.decorate(item3, function(err, item){ ... });
```

will be processed like this:

1. `item1` is decorated:
    1. `middleware1` function called with `item1`
    2. `middleware2` function called with `item1`
    3. `middleware3` function called with `item1`
    4. if a `decorate` callback is defined, it is called with `(null, item1)`
    5. if an error occurs in one of the middleware handlers and a `decorate` callback is defined, it is immediately called with `(err, item1)` and subsequent middleware handlers are skipped
2. `item2` is decorated:
    1. `middleware1` function called with `item2`
    2. `middleware2` function called with `item2`
    3. `middleware3` function called with `item2`
    4. if a `decorate` callback is defined, it is called with `(null, item2)`
    5. if an error occurs in one of the middleware handlers and a `decorate` callback is defined, it is immediately called with `(err, item2)` and subsequent middleware handlers are skipped
3. `item3` is decorated:
    1. `middleware1` function called with `item3`
    2. `middleware2` function called with `item3`
    3. `middleware3` function called with `item3`
    4. if a `decorate` callback is defined, it is called with `(null, item3)`
    5. if an error occurs in one of the middleware handlers and a `decorate` callback is defined, it is immediately called with `(err, item3)` and subsequent middleware handlers are skipped

## Change log

### v0.2.0

- Added error handling
- Updated documentation
- Added additional unit tests

### v0.1.0

- Initial version
