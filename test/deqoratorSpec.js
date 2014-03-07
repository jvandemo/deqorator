var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    events = require('events'),
    Deqorator = require('../lib/deqorator');

chai.use(sinonChai);

describe('Deqorator', function(){

    var deqorator;

    it('should be a constructor function', function () {
        expect(typeof Deqorator).to.equal('function');
    });

    describe('instance', function () {

        beforeEach(function(){
            deqorator = new Deqorator();

        });

        it('should inherit from EventEmitter', function () {
            expect(deqorator).to.be.instanceof(events.EventEmitter);
        });

        it('should store middleware correctly', function () {
            var middleware1 = function(){};
            var middleware2 = function(){};
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            expect(deqorator.middleware[0].handler).to.equal(middleware1);
            expect(deqorator.middleware[1].handler).to.equal(middleware2);
        });

        it('should execute middleware in the correct order', function (done) {
            var item = {};
            var middleware1 = function(item, next){
                item.hello = 'world';
                next();
            };
            var middleware2 = function(item, next){
                expect(item.hello).to.equal('world');
                next();
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.on('complete', function(item){
                console.log('Complete: ' + item);
                done();
            });
            deqorator.decorate(item);
        });

        it('should emit a complete event when finished', function (done) {
            this.timeout(500);
            var item = {};
            var middleware1 = function(item, next){
                next();
            };
            var middleware2 = function(item, next){
                next();
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.on('complete', function(item){
                done();
            });
            deqorator.decorate(item);
        });

    });

});