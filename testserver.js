var d=new Date().toString();
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var rest = require('restler');
var async = request('async');

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' , err);
  //process.exit(3);
});

var etags={};
httpget=function(uurl,parsejson,cb) /// doesnot calls cb on error or on update not required, for simplicity
{
 var purl=url.parse(uurl);
var options = {
  hostname: purl.host,
  port: purl.port?purl.port:(purl.protocol=='http'?80:443),
  path: purl.path,
  method: 'GET',
  headers: {'User-Agent': 'basic http get'}
};


if(etags[uurl]) options.headers['If-None-Match']=etags[uurl];

var req = (purl.protocol=='http'?http:https).request(options, function(res) {
//  console.log("statusCode: ", res.statusCode);
//  console.log("headers: ", res.headers);
  if( res.headers.etag )
    etags[uurl]=res.headers.etag
  var data='';
  res.on('data', function(d) {
    data+=d;
  });
  res.on('end', function() {
   if(res.statusCode!=200)
     cb(new Error("status not 200,status is "+res.statusCode));
   else if(parsejson) cb(null,JSON.parse(data));
   else cb(null,data);
   cb=function(){};
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
  cb(e);cb=function(){};
});

}

rates={
 dollar:["USDILS=X",0,"1/1/2000","0:00pm"],
 euro:["EURILS=X",0,"1/1/2000","0:00pm"],
 bitsofgold: {buy:0,sell:0},
 bit2c: {"h":0,"l":0,"ll":0,"a":0,"av":0},
 bitgo: {"currentSellingPrice":0,"currentBuyingPrice":0,"amountAvalibleForSale":"0","amountAvalibleForBuy":0},
 bitcoinaverageUSD: { "24h_avg": 0, "ask": 0, "bid": 0, "last": 0, "timestamp": "Sun, 1 Jan 2000 00:00:00 -0000", "volume_btc": 0, "volume_percent": 0 },
 bitcoinaverageEUR: { "24h_avg": 0, "ask": 0, "bid": 0, "last": 0, "timestamp": "Sun, 1 Jan 2000 00:00:00 -0000", "volume_btc": 0, "volume_percent": 0 },
 bitstamp: {"high": "0", "last": "0", "timestamp": "0", "bid": "0", "vwap": "0", "volume": "0", "low": "0", "ask": "0"},
 btce:     {"ticker":{"high":0,"low":0,"avg":0,"vol":0,"vol_cur":0,"last":0,"buy":0,"sell":0,"updated":0,"server_time":0}},
 bitpay: [{"code":"USD","name":"US Dollar","rate":0},{"code":"ILS","name":"Israeli Shekel","rate":0}]
}

update=function(cb)
{
 async.serial(
 [
   function(cb){try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=USDILS=X').on('complete', function(data) {  data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']'); if(typeof data=='object')rates.dollar=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=EURILS=X').on('complete', function(data) {  data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']'); if(typeof data=='object')rates.euro=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitsofgold.co.il/api/btc').on('complete', function(data) { if(typeof data=='object') rates.bitsofgold=data; cb();  });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bit2c.co.il/Exchanges/BtcNis/Ticker.json').on('complete', function(data) { if(typeof data=='object') rates.bit2c=data; cb();  });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitgo.co.il/components/loadcontrol.aspx?cn=statspanel&json=true').on('complete', function(data) {  if(typeof data=='object')  rates.bitgo=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://api.bitcoinaverage.com/ticker/global/USD/').on('complete', function(data) { if(typeof data=='object') rates.bitcoinaverageUSD=data;  }); cb(); } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://api.bitcoinaverage.com/ticker/global/EUR/').on('complete', function(data) { if(typeof data=='object') rates.bitcoinaverageEUR=data;  }); cb();  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitstamp.net/api/ticker/').on('complete', function(data) { if(typeof data=='object') Object.keys(data).forEach(function(a){data[a]=parseFloat(data[a])}); rates.bitstamp=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://btc-e.com/api/2/btc_usd/ticker').on('complete', function(data) { data=JSON.parse(data); if(typeof data=='object') rates.btce=data;  }); cb(); } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://bitpay.com/api/rates').on('complete', function(data) { if(typeof data=='object') rates.bitpay=data.filter(function(a){return a.code=='USD'||a.code=='ILS'}); cb(); });  } catch(e){console.log(e.stack);cb();} }
 ],cb
 )
}

var index=fs.readFileSync(__dirname+'/index.html')
http.createServer(function (req, res) {
  if(req.url=='/rates'){  res.writeHead(200, {'Content-Type': 'text/javascript'}); res.end(JSON.stringify(rates, null, 2));}
  if(req.url=='/')     {  res.writeHead(200, {'Content-Type': 'text/html'}); res.end(index);}
  else                 {  res.writeHead(404, {'Content-Type': 'text/plain'}); res.end(':-), since '+d+'\n');}
}).listen(3333);

console.log('Server running at http://127.0.0.1:3333/');
var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });// uncomment to test

update(function(){setTimeout(update,1000);});
