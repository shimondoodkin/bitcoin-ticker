var d=new Date().toString();
var http = require('http');
var fs = require('fs');
var rest = require('restler');

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' , err);
  //process.exit(3);
});


rates={
 dollar:["USDILS=X",0,"1/1/2000","0:00pm"],
 euro:["EURILS=X",0,"1/1/2000","0:00pm"],
 bit2c: {"h":0,"l":0,"ll":0,"a":0,"av":0},
 bitgo: {"currentSellingPrice":0,"currentBuyingPrice":0,"amountAvalibleForSale":"0","amountAvalibleForBuy":0},
 bitcoinaverageUSD: { "24h_avg": 0, "ask": 0, "bid": 0, "last": 0, "timestamp": "Sun, 1 Jan 2000 00:00:00 -0000", "volume_btc": 0, "volume_percent": 0 },
 bitcoinaverageEUR: { "24h_avg": 0, "ask": 0, "bid": 0, "last": 0, "timestamp": "Sun, 1 Jan 2000 00:00:00 -0000", "volume_btc": 0, "volume_percent": 0 },
 bitstamp: {"high": "0", "last": "0", "timestamp": "0", "bid": "0", "vwap": "0", "volume": "0", "low": "0", "ask": "0"},
 btce:     {"ticker":{"high":0,"low":0,"avg":0,"vol":0,"vol_cur":0,"last":0,"buy":0,"sell":0,"updated":0,"server_time":0}},
}

update=function()
{
 try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=USDILS=X').on('complete', function(data) {  data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']'); if(typeof data=='object')rates.dollar=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=EURILS=X').on('complete', function(data) {  data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']'); if(typeof data=='object')rates.euro=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://www.bit2c.co.il/Exchanges/BtcNis/Ticker.json').on('complete', function(data) { if(typeof data=='object') rates.bit2c=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://www.bitgo.co.il/components/loadcontrol.aspx?cn=statspanel&json=true').on('complete', function(data) {  if(typeof data=='object')  rates.bitgo=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://api.bitcoinaverage.com/ticker/global/USD/').on('complete', function(data) { if(typeof data=='object') rates.bitcoinaverageUSD=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://api.bitcoinaverage.com/ticker/global/EUR/').on('complete', function(data) { if(typeof data=='object') rates.bitcoinaverageEUR=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://www.bitstamp.net/api/ticker/').on('complete', function(data) { if(typeof data=='object') Object.keys(data).forEach(function(a){data[a]=parseFloat(data[a])}); rates.bitstamp=data;  });  } catch(e){console.log(e.stack)}
 try{ rest.get('https://btc-e.com/api/2/btc_usd/ticker').on('complete', function(data) { data=JSON.parse(data); if(typeof data=='object') rates.btce=data;  });  } catch(e){console.log(e.stack)}
}
var index=fs.readFileSync(__dirname+'/index.html')
http.createServer(function (req, res) {
  if(req.url=='/rates'){  res.writeHead(200, {'Content-Type': 'text/javascript'}); res.end(JSON.stringify(rates, null, 2));}
  if(req.url=='/')     {  res.writeHead(200, {'Content-Type': 'text/html'}); res.end(index);}
  else                 {  res.writeHead(404, {'Content-Type': 'text/plain'}); res.end(':-), since '+d+'\n');}
}).listen(3333);

console.log('Server running at http://127.0.0.1:3333/');
var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });// uncomment to test
setInterval(update,1000);
