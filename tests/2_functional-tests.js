/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      let stock;
      let stocks;
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl'})
        .end(function(err, res){
          stock = res.body.stockData;
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'AAPL', 'should have stock');
          assert.property(res.body.stockData, 'price', 'should have price');
          assert.property(res.body.stockData, 'likes', 'should have likes');
          done();
        });
      });
      
      test('1 stock with like', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'AAPL', 'should have stock');
          assert.property(res.body.stockData, 'price', 'should have price');
          assert.equal(res.body.stockData.likes, ++stock.likes, 'should have likes + 1');
          done(); 
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'aapl', like: true})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData.stock, 'AAPL', 'should have stock');
          assert.property(res.body.stockData, 'price', 'should have price');
          assert.equal(res.body.stockData.likes, stock.likes, 'should have likes as before');
          done();
        });
      });
      
      test('2 stocks', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft']})
        .end(function(err, res){
          stocks = res.body.stockData;
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'GOOG', 'should have first stock');
          assert.equal(res.body.stockData[1].stock, 'MSFT', 'should have second stock');
          assert.property(res.body.stockData[0], 'price', 'should have first price');
          assert.property(res.body.stockData[1], 'price', 'should have second price');
          assert.property(res.body.stockData[0], 'rel_likes', 'should have first likes');
          assert.property(res.body.stockData[1], 'rel_likes', 'should have second likes');
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog', 'msft'], like: true})
        .end(function(err, res){
          stocks = res.body.stockData;
          assert.equal(res.status, 200);
          assert.equal(res.body.stockData[0].stock, 'GOOG', 'should have first stock');
          assert.equal(res.body.stockData[1].stock, 'MSFT', 'should have second stock');
          assert.property(res.body.stockData[0], 'price', 'should have price');
          assert.property(res.body.stockData[1], 'price', 'should have price');
          assert.equal(res.body.stockData[0].rel_likes, 0, 'should have first likes');
          assert.equal(res.body.stockData[1].rel_likes, 0, 'should have second likes');
          done();
        });
      });
      
    });

});
