var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
    deqorator = require('../lib/deqorator');

chai.use(sinonChai);

describe('deqorator', function(){

    var decorator;

    it('should be an object', function () {
        expect(deqorator).to.be.an.object;
    });

    describe('Decorator property', function () {

        it('should be a constructor function', function () {
            expect(deqorator.Decorator).to.be.a.function;
        });

    });

    describe('createDecorator() method', function () {

        it('should be a function', function () {
            expect(deqorator.createDecorator).to.be.a.function;
        });

        it('should return an instance of deqorator.Decorator', function () {
            expect(deqorator.createDecorator()).to.be.instanceof(deqorator.Decorator);
        });

    });

    describe('decorator instance', function () {

        beforeEach(function(){
            decorator = deqorator.createDecorator();

        });

        it('should store middleware correctly', function () {
            var middleware1 = function(){};
            var middleware2 = function(){};
            decorator.use(middleware1);
            decorator.use(middleware2);
            expect(decorator.middleware[0].handler).to.equal(middleware1);
            expect(decorator.middleware[1].handler).to.equal(middleware2);
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
            decorator.use(middleware1);
            decorator.use(middleware2);
            decorator.decorate(item, function(err, item){
                done();
            });
        });


        it('pass the item correctly in the chain of middleware handlers', function (done) {
            var original = {};
            var middleware1 = function(item, next){
                expect(item).to.equal(original);
                next();
            };
            var middleware2 = function(item, next){
                expect(item).to.equal(original);
                next();
            };
            decorator.use(middleware1);
            decorator.use(middleware2);
            decorator.decorate(original, function(err, item){
                done();
            });
        });

        it('provide a partially decorated item if an error is raised', function (done) {
            this.timeout(500);
            var item = {};
            var middleware1 = function(item, next){
                item.one = 'done';
                next();
            };
            var middleware2 = function(item, next){
                next('some error');
            };
            decorator.use(middleware1);
            decorator.use(middleware2);
            decorator.decorate(item, function(err, item){
                expect(err).to.equal('some error');
                expect(item.one).to.equal('done');
                done();
            });
        });

        it('skip remaining middleware layers if an error is raised', function (done) {
            this.timeout(500);
            var item = {};
            var middleware1 = function(item, next){
                item.one = 'done';
                next('some error');
            };
            var middleware2 = function(item, next){
                item.two = 'done';
                next();
            };
            decorator.use(middleware1);
            decorator.use(middleware2);
            decorator.decorate(item, function(err, item){
                expect(err).to.equal('some error');
                expect(item.one).to.equal('done');
                expect(item.two).to.not.equal('done');
                done();
            });
        });

    });

});