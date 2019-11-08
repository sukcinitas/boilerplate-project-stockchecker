const fetch = require("node-fetch");

function StockHandler() {
  this.getPrice = async function(stockName) {
    let price;
    await fetch(
      // `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockName}&apikey=236VR1A35SFQBBZ2`
      `https://repeated-alpaca.glitch.me/v1/stock/${stockName}/quote`
    )
      .then(response => response.json())
      .then(data => {
        // price = Number(data["Global Quote"]["05. price"]).toFixed(2) || "could not get the price";
        price = Number(data.latestPrice).toFixed(2) || "could not get the price";
      });
    return price;
  };

  this.getIp = function(req) {
    return req.header("x-forwarded-for")
      ? req.header("x-forwarded-for").split(",")[0] : "";
  };

  this.getOneWithoutLike = async function(stock, db) {
    stock = stock.toUpperCase();
    try {
      if (await db.collection("stock").findOne({ _id: stock })) {
        console.log("exists");
      } else {
        await db.collection("stock").insert({ _id: stock, ips: [] });
      }
      let result = await db
        .collection("stock")
        .aggregate([
          { $match: { _id: stock } },
          { $project: { _id: 0, stock: "$_id", likes: { $size: "$ips" } } }
        ])
        .toArray();
      return result;
    } catch (err) {
      console.log(err);
    }
  };

  this.getOneWithLike = async function(stock, db, ip) {
    stock = stock.toUpperCase();
    try {
      if (await db.collection("stock").findOne({ _id: stock })) {
      } else {
        await db.collection("stock").insert({ _id: stock, ips: [] });
      }
      await db
        .collection("stock")
        .update({ _id: stock }, { $addToSet: { ips: ip } });
      var result = await db
        .collection("stock")
        .aggregate([
          { $match: { _id: stock } },
          { $project: { _id: 0, stock: "$_id", likes: { $size: "$ips" } } }
        ])
        .toArray();
      return result;
    } catch (err) {
      console.log(err);
    }
  };
}
module.exports = StockHandler;
