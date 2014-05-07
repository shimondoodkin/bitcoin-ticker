// /dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0

var serialPort = require((require('os').arch()=='arm'?'./arm_node_modules/':(process.platform=='win32'?'./win_node_modules/':''))+"serialport");
var SerialPort = serialPort.SerialPort
serials={};

serialstart=function ()
{
serialPort.list(function (err, ports)
{
 ports.forEach(function(port)
 {
  console.log(port);
  if(port.pnpId.indexOf('Prolific')!=-1||port.manufacturer.indexOf('Prolific')!=-1)
  {
   var myserial = new SerialPort(port.comName, { baudrate: 115200,disconnectedCallback:function(){console.log('disconnected')}});
   serials[port.comName.replace(/\//g,'')]=myserial;
   myserial.on('close', function(a){console.log('serial closed',a,myserial.path);  })

   myserial.on('error', function(a){console.log('serial error',a,myserial.path);})
   myserial.on("open", function ()
   {
    console.log('serial open',myserial.path);
    myserial.on('data', function(data)
    {
     console.log('data received: ' ,arguments,myserial.path);
     serialreceive(data,myserial)
    });
/*
    myserial.write("ls\n", function(err, results)
    {
     console.log('err ' + err);
     console.log('results ' + results);
    });
*/
   });
  }
 });
});
}

String.prototype.h=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return (x<16?'0':'')+x.toString(16)}).join(' ').toUpperCase() }
String.prototype.b=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return ('00000000'.substring(x.toString(2).length))+x.toString(2)}).join(' ') }


serialreceive=function(data)
{
    console.log('data received: ' + (data.toString('binary').h()));
}

serialwrite=function(data,cb)
{
   try {
	var myserial=serials[Object.keys(serials)[0]];  
    myserial.write(new Buffer(data,'binary'), function(err, results)
    {
     if(err)console.log('err ' , err.stack);
     console.log('wrote bytes' + results);
	 myserial.drain(function(){
	  if(cb)cb();
	 })
    });
   }
   catch (e)
   {
    // Error means port is not available for listening.
	 console.log(e.stack)
   }
}

var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });