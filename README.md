Deqorator
=========

A queued decorator for Node.js to easily decorate objects using middleware.

## What is deqorator used for?

Suppose you have an object and you want to decorate it with data (e.g. fill properties with data from several database queries).

Instead of nesting all kinds of callbacks, deqorator allows you to easily create a reusable decorator using one or more middleware handlers.

## Quick demo

First create a decorator:

```javascript
var deqorator = new Deqorator();
```

Then add as many middleware handlers as you like:


    deqorator.use(function(item, next){

        // You can make changes to item
        item.middleware1 = "done";
        next();
    });

Asynchronous callbacks are supported, just call `next()` when finished:

    deqorator.use(function(item, next){

        // Some asynchronous call
        setTimeout(function(){
            next();
        }, 1000);
    });

Each middleware handler is passed the item and is processed in the order you add it to the `deqorator`:

    deqorator.use(function(item, next){

        // The changes from the previous middleware handler are available here
        console.log(item.middleware1); // done
        next();
    });

Once you have defined all the middleware for the deqorator, you can use it to decorate as many objects as you like:

    var item = {},
        item2 = {};

    deqorator.decorate(item);
    deqorator.decorate(item2);

When the decorator has finished decorating an object, it will let you know and hand you the completed item:

    deqorator.on('complete', function(item){
        console.log('Completed: ' + JSON.stringify(item));
    });

## Method of operation

There is no need to worry about asynchronous behavior:

- all middleware handlers are processed in the order you define them.
- all objects are decorated in the order you decorate them.

So a scenario like this:

    deqorator.use(middleware1);
    deqorator.use(middleware2);
    deqorator.use(middleware3);

    deqorator.decorate(item1);
    deqorator.decorate(item2);
    deqorator.decorate(item3);

will be handled like this:


1. `middleware1` function called with `item1`
2. `middleware2` function called with `item1`
3. `middleware3` function called with `item1`
- `middleware1` function called with `item2`
- `middleware2` function called with `item2`
- `middleware3` function called with `item2`
- `middleware1` function called with `item3`
- `middleware2` function called with `item3`
- `middleware3` function called with `item3`

## Change log

### v0.1.0

- Initial version