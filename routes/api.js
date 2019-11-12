/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var StockHandler = require('../controllers/stockHandler');
const CONNECTION_STRING = process.env.DB;

module.exports = function (app) {
  var stockHandler = new StockHandler();
  
  //MongoDb connection pooling
  var db;
  MongoClient.connect(CONNECTION_STRING, function(err, database) {
    if (err) throw err;
    db = database;
  });
  
  app.route('/api/stock-prices')
    .get(async function (req, res){
          try { 
              let ip = stockHandler.getIp(req, db);
              if (Array.isArray(req.query.stock) && !req.query.like) {
                  let price1 = await stockHandler.getPrice(req.query.stock[0]);
                  let price2 = await stockHandler.getPrice(req.query.stock[1]);
                  if(isNaN(price1) || isNaN(price2)) {
                    res.send("there is no information about this stock/stock does not exist")
                  }
                  let info1 = await stockHandler.getOneWithoutLike(req.query.stock[0], db);
                  let info2 = await stockHandler.getOneWithoutLike(req.query.stock[1], db);
                  res.send({"stockData":[{"stock":(info1[0].stock),"price":price1,"rel_likes":info1[0].likes - info2[0].likes},
                                         {"stock":(info2[0].stock),"price":price2,"rel_likes":info2[0].likes - info1[0].likes}]});
              } else if (Array.isArray(req.query.stock) && req.query.like) {
                  let price1 = await stockHandler.getPrice(req.query.stock[0]);
                  let price2 = await stockHandler.getPrice(req.query.stock[1]);
                  if(isNaN(price1) || isNaN(price2)) {
                    res.send("there is no information about this stock/stock does not exist")
                  }
                  let info1 = await stockHandler.getOneWithLike(req.query.stock[0], db, ip);
                  let info2 = await stockHandler.getOneWithLike(req.query.stock[1], db, ip);
                  res.send({"stockData":[{"stock":(info1[0].stock),"price":price1,"rel_likes":info1[0].likes - info2[0].likes},
                                         {"stock":(info2[0].stock),"price":price2,"rel_likes":info2[0].likes - info1[0].likes}]});
              } else if (req.query.stock && !Array.isArray(req.query.stock) && !req.query.like) {
                  let price = await stockHandler.getPrice(req.query.stock);
                  if(isNaN(price)) {
                    res.send("there is no information about this stock/stock does not exist")
                  }
                  let info = await stockHandler.getOneWithoutLike(req.query.stock, db);
                  res.json({"stockData":{"stock":(info[0].stock),"price":price,"likes":info[0].likes}});
              } else if (req.query.stock && !Array.isArray(req.query.stock) && req.query.like) {
                  let price = await stockHandler.getPrice(req.query.stock);
                  if(isNaN(price)) {
                    res.send("there is no information about this stock/stock does not exist")
                  }
                  let info = await stockHandler.getOneWithLike(req.query.stock, db, ip);
                  res.json({"stockData":{"stock":(info[0].stock),"price":price,"likes":info[0].likes}});
              }
            } catch(err) {
              console.log(err);
            }

    });
    
};
