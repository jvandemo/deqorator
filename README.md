Deqorator
=========

A queued decorator for Node.js to easily decorate objects using middleware.

## Quick demo

First create a decorator and an item to work with:

```javascript
var deqorator = new Deqorator();
```

Then add as many middleware handlers as you like:


    deqorator.use(function(item, next){

        // You can make changes to item
        item.middleware1 = "done";
        next();
    });

Each middleware handler is passed the item and is processed in the order you add them:

    deqorator.use(function(item, next){

        // The changes from the previous middleware handler are available here
        console.log(item.middleware1); // done
        next();
    });

Once you have defined all the middleware, you can start decorating objects:

    var item = {},
        item2 = {};

    deqorator.decorate(item);
    deqorator.decorate(item2);

When the decorator has finished, it will let you know and hand you the completed item:

    deqorator.on('complete', function(item){
        console.log('Completed: ' + JSON.stringify(item));
    });

## Method of operation

There is no need to worry about asynchronous behavior:

- all middleware handlers are processed in the order you define them.
- all objects are decorated in the order you decorate them.

So a scenario like this:

    deqorator.use(middleware1)
    deqorator.use(middleware2)
    deqorator.use(middleware3)

    deqorator.decorate(item1)
    deqorator.decorate(item2)
    deqorator.decorate(item3)

will be handled like this:

- `middleware1` called with `item1`
- `middleware2` called with `item1`
- `middleware3` called with `item1`
- `middleware1` called with `item2`
- `middleware2` called with `item2`
- `middleware3` called with `item2`
- `middleware1` called with `item3`
- `middleware2` called with `item3`
- `middleware3` called with `item3`

## Change log

### v0.1.0

- Initial version