var d=new Date().toString();
var http = require('http');
var url = require('url');
var fs = require('fs');
var rest = require('restler');
var async = require('async');

var e=require('./email')

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' , err.stack);

  sendemaillog('index.js uncaughtException', err.stack);

  //process.exit(3);
});

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

var prev_ils=0,prev_usd=0;
update=function(cb)
{
 async.parallel( //faster
 //async.series(// slower
 [
   function(cb){try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=USDILS=X').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();}  try{data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']');} catch(e){console.log(e.stack)} if(typeof data=='object')rates.dollar=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('http://download.finance.yahoo.com/d/quotes.csv?e=.csv&f=sl1d1t1&s=EURILS=X').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();}  try{data=JSON.parse("["+data.trim().replace(/""/,"\\\"")+']');} catch(e){console.log(e.stack)} if(typeof data=='object')rates.euro=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitsofgold.co.il/api/btc').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object') rates.bitsofgold=data; cb();  });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bit2c.co.il/Exchanges/BtcNis/Ticker.json').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object') rates.bit2c=data; cb();  });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitgo.co.il/components/loadcontrol.aspx?cn=statspanel&json=true').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();}  if(typeof data=='object')  rates.bitgo=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://api.bitcoinaverage.com/ticker/global/USD/').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object') rates.bitcoinaverageUSD=data;  }); cb(); } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://api.bitcoinaverage.com/ticker/global/EUR/').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object') rates.bitcoinaverageEUR=data;  }); cb();  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://www.bitstamp.net/api/ticker/').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object') Object.keys(data).forEach(function(a){data[a]=parseFloat(data[a])}); rates.bitstamp=data; cb(); });  } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://btc-e.com/api/2/btc_usd/ticker').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} try{data=JSON.parse(data);} catch(e){console.log(e.stack)} if(typeof data=='object') rates.btce=data;  }); cb(); } catch(e){console.log(e.stack);cb();} }
  ,function(cb){try{ rest.get('https://bitpay.com/api/rates').on('complete', function(data) { if(data instanceof Error){console.log(data.stack);return cb();} if(typeof data=='object')
{
var d=[];
if(data.length && data[prev_usd].code=='USD' && data[prev_ils].code=='ILS') 
{
 d=[data[prev_usd],data[prev_ils]];
}
else
for(var c,i=0;i<data.length;i++)
{
c=data[i];
if(c.code=='USD'){d.push(c);prev_usd=i}
if(c.code=='ILS'){d.push(c);prev_ils=i}
}
 rates.bitpay=d;
}
 cb(); });  } catch(e){console.log(e.stack);cb();} }

 ],cb
 )
}

var Canvas = require((require('os').arch()=='arm'?'./arm_node_modules/':'')+'canvas')
  , Font = Canvas.Font
  , mcanvas = new Canvas(20,20)
  , mctx = mcanvas.getContext('2d');
var GifEncoder = require('gif-encoder');

var fontarr=false;
function loadfonts(ctx)
{
 if (!Font) throw new Error('Need to compile with font support');
 if(fontarr===false){ fontarr=[];fs.readdirSync(__dirname+'/fonts').forEach(function(a){
var file= __dirname+'/fonts/'+a;
var namea=a.toLowerCase().split('.');
var name=namea[0]
if(namea[namea.length-1]=='ttf')
{
var font = new Font(name, file);
  //font.addFace(fontFile('PfennigBold.ttf'),   'bold');
  //font.addFace(fontFile('PfennigItalic.ttf'), 'normal', 'italic');
  //font.addFace(fontFile('PfennigBoldItalic.ttf'), 'bold', 'italic');
 fontarr.push(font);
}
});}
 if(ctx)
 for(var i=0;i<fontarr.length;i++)
 {
  ctx.addFont(fontarr[i]);
 }
}
loadfonts(mctx);

var rateshtml=fs.readFileSync(__dirname+'/rates.html')
http.createServer(function (req, res) {
  if(req.url=='/rates'){  res.writeHead(200, {'Content-Type': 'text/javascript'}); res.end(JSON.stringify(rates, null, 2));}
  if(req.url=='/')     {  res.writeHead(200, {'Content-Type': 'text/html'}); res.end(rateshtml);}
  if(req.url=='/image')     {

mctx.antialias = 'none';
mctx.font = '14px Impact';
var te = mctx.measureText('Awesome!');
te.height=
 te.emHeightAscent//: 8,
+te.emHeightDescent;//: 2,

te.top=
 te.emHeightAscent //: 8
-te.actualBoundingBoxAscen//: 7

var canvas = new Canvas(te.width,te.height)
  , ctx = canvas.getContext('2d');

  ctx.antialias = 'none';
  ctx.font = '14px Impact';
  ctx.fillText("Awesome!", te.actualBoundingBoxLeft,te.emHeightAscent);
  res.writeHead(200, {'Content-Type': 'image/gif'}); 

//var stream = canvas.createPNGStream();

// Create a 10 x 10 gif
var gif = new GifEncoder(canvas.width, canvas.height);

// using an rgba array of pixels [r, g, b, a, ... continues on for every pixel]
// This can be collected from a <canvas> via context.getImageData(0, 0, width, height).data
//var pixels = [0, 0, 0, 255/*, ...*/];

// Collect output
//var file = require('fs').createWriteStream('img.gif');
gif.pipe(res);

// Write out the image into memory
gif.writeHeader();
gif.addFrame(ctx.getImageData(0,0,canvas.width,canvas.height).data);
// gif.addFrame(pixels); // Write subsequent rgba arrays for more frames
gif.finish();

}
  else                 {  res.writeHead(404, {'Content-Type': 'text/plain'}); res.end(':-), since '+d+'\n');}
}).listen(3333);

console.log('Server running at http://127.0.0.1:3333/');


Number.prototype.formatMoney = function(c, d, t){
var n = this,
    c = isNaN(c = Math.abs(c)) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

ratestext=function()
{
  var p=2;
  var text1='Bitcoin'
  if(rates.bitcoinaverageUSD.ask) text1='BTC/USD '+(rates.bitcoinaverageUSD.ask).formatMoney(p, '.', ',')+'  '
  
  var p=3;
  var text2=''
  if(rates.bitsofgold.sell) text2+=     'Bits of Gold '+(rates.bitsofgold.sell/1000).formatMoney(p, '.', ',')+'  '
  if(rates.bit2c.ll) text2+=     'Bit2c '+(rates.bit2c.ll/1000).formatMoney(p, '.', ',')+'  '
//  if(rates.bitgo.currentSellingPrice) text2+=     'BitGo '+(rates.bitgo.currentSellingPrice/1000).formatMoney(p, '.', ',')+'  '
//  if(rates.bitcoinaverageUSD.ask) text2+=     'BitcoinAverage '+(rates.bitcoinaverageUSD.ask*rates.dollar[1]/1000).formatMoney(p, '.', ',')+'  '
//  if(rates.bitstamp.ask) text2+=     'Bitstamp '+(rates.bitstamp.ask*rates.dollar[1]/1000).formatMoney(p, '.', ',')+'  '
//  if(rates.btce.ticker.sell) text2+=     'Btc-e '+(rates.btce.ticker.sell*rates.dollar[1]/1000).formatMoney(p, '.', ',')+'  ' 
//  if(rates.bitpay.filter(function(a){return a.code=='ILS'})[0].rate) text2+=     'Bitpay '+(rates.bitpay.filter(function(a){return a.code=='ILS'})[0].rate/1000).formatMoney(p, '.', ',')+'  '
/*
  var p=2;
  var text2='Bits of Gold '+(rates.bitsofgold.sell/1000).formatMoney(p, '.', ',')+'   '+
           'Bit2c '+(rates.bit2c.ll/1000).formatMoney(p, '.', ',')+'   '+
           'Bit Go '+(rates.bitgo.currentSellingPrice/1000).formatMoney(p, '.', ',')+'   '
*/
/*
  var p=5;
  var text2='Bits of Gold '+(rates.bitsofgold.sell/1000).formatMoney(p, '.', ',')+'   '+
           'Bit2c '+(rates.bit2c.ll/1000).formatMoney(p, '.', ',')+'   '+
           'BitGo '+(rates.bitgo.currentSellingPrice/1000).formatMoney(p, '.', ',')+'  '+
           'Bitcoin Average '+(rates.bitcoinaverageUSD.ask/1000).formatMoney(p, '.', ',')+' USD='+(rates.bitcoinaverageUSD.ask*rates.dollar[1]/1000).formatMoney(p, '.', ',')+' ILS  '+
           'Bitcoin Average '+(rates.bitcoinaverageEUR.ask/1000).formatMoney(p, '.', ',')+' EUR='+(rates.bitcoinaverageEUR.ask*rates.euro[1]/1000).formatMoney(p, '.', ',')+' ILS  '+
           'Bitstamp '+(rates.bitstamp.ask/1000).formatMoney(p, '.', ',')+' USD='+(rates.bitstamp.ask*rates.dollar[1]/1000).formatMoney(p, '.', ',')+' ILS  '+
           'Btc-e '+(rates.btce.ticker.sell/1000).formatMoney(p, '.', ',')+' USD='+(rates.btce.ticker.sell*rates.dollar[1]/1000).formatMoney(p, '.', ',')+' ILS  ' +
           'Bitpay '+(rates.bitpay.filter(function(a){return a.code=='USD'})[0].rate/1000).formatMoney(p, '.', ',')+' USD='+(rates.bitpay.filter(function(a){return a.code=='ILS'})[0].rate/1000).formatMoney(p, '.', ',')+' ILS  '
*/
var r={text1 :text1,text2:text2}
 console.log(r)
 return r;
}

cp=require('./cpower1200.js')
var prevtext={text1:'',text2:''};
ledtext=function(options,cb)
{
try{
   function t1(cb)
   {
    if(options.text1&&prevtext.text1!=options.text1)
    {
     cp.serialwrite(cp.sendTextDataToASpecifiedWindow({window:0, text:options.text1, effect: cp.effect.indexOf('Draw') ,align:'center' }),cb);
     prevtext.text1=options.text1
    }
    else cb();
   }

   function t2(cb)
   {
    if(options.text2&&prevtext.text2!=options.text2)
    {
     cp.serialwrite(cp.sendTextDataToASpecifiedWindow({window:1, text:options.text2 }));
	prevtext.text2=options.text2
    }
    else cb();
   }

   t1(function(){

    t2(function(){

      //if(cp.serial)cp.serial.close();
      if(cb)cb();

    });

   });
   
 }catch(err){ if(err)console.log('err ', err.stack);}
}

var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });// uncomment to test


function run()
{
 update(function(){ledtext(ratestext());console.log('done');setTimeout(run,30000);});
}
run()
