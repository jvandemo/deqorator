var chai = require('chai'),
    expect = chai.expect,
    sinonChai = require('sinon-chai'),
    sinon = require('sinon'),
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
            var middleware1 = function(err, item, next){
                item.hello = 'world';
                next();
            };
            var middleware2 = function(err, item, next){
                expect(item.hello).to.equal('world');
                next();
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.decorate(item, function(err, item){
                console.log('Complete: ' + item);
                done();
            });
        });


        it('pass the item correctly in the chain of middleware handlers', function (done) {
            var original = {};
            var middleware1 = function(err, item, next){
                expect(item).to.equal(original);
                next();
            };
            var middleware2 = function(err, item, next){
                expect(item).to.equal(original);
                next();
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.decorate(original, function(err, item){
                done();
            });
        });

        it('provide a partially decorated item if an error is raised', function (done) {
            this.timeout(500);
            var item = {};
            var middleware1 = function(err, item, next){
                item.one = 'done';
                next();
            };
            var middleware2 = function(err, item, next){
                next('some error');
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.decorate(item, function(err, item){
                expect(err).to.equal('some error');
                expect(item.one).to.equal('done');
                done();
            });
        });

        it('skip remaining middleware layers if an error is raised', function (done) {
            this.timeout(500);
            var item = {};
            var middleware1 = function(err, item, next){
                item.one = 'done';
                next('some error');
            };
            var middleware2 = function(err, item, next){
                item.two = 'done';
                next();
            };
            deqorator.use(middleware1);
            deqorator.use(middleware2);
            deqorator.decorate(item, function(err, item){
                expect(err).to.equal('some error');
                expect(item.one).to.equal('done');
                expect(item.two).to.not.equal('done');
                done();
            });
        });

    });

});