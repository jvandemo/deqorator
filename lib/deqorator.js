var exports = module.exports = Deqorator;

function Deqorator() {
    this.middleware = [];
    this.isBusy = false;
    this.buffer = [];
};

Deqorator.prototype.use = function (fn) {
    this.middleware.push({
        handler: fn
    });
};

Deqorator.prototype.decorate = function(item, fnToRunWhenDone){
    this.buffer.push({
        item: item,
        fnToRunWhenDone: fnToRunWhenDone
    });
    this._decorate();
};

Deqorator.prototype._decorate = function(){
    if(this.isBusy){
        return;
    }
    if(this.buffer.length > 0){
        var entry = this.buffer.shift();
        this._process(entry)
    }
};

Deqorator.prototype._process = function (entry) {

    var index = 0,
        middleware = this.middleware,
        queue = this;

    queue.isBusy = true;

    function next(err) {
        var layer;

        layer = middleware[index++];

        // If an error is passed or there are no more layers to handle, we're done
        if ((!layer) || err) {
            if (typeof entry.fnToRunWhenDone === 'function') {
                entry.fnToRunWhenDone(err, entry.item);
            }
            queue.isBusy = false;
            index = 0;
            return queue._decorate();
        }

        try {
            var handler = layer.handler;
            if (typeof handler === 'function') {
                handler(err, entry.item, next);
            }
        } catch (err) {
            next(err);
        }
    }

    next();
};