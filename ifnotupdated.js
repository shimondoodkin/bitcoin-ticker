//example
//var monitor=require('./ifnotupdated')(20000,function(){console.log('there was no update in last 20 seconds') })
//monitor.update();

module.exports=function(timeout_ms,cb,check_every_ms)
{
 check_every_ms=check_every_ms||1000;
 var o=
 {
  cb:cb
  ,lastupdated:new Date().getTime()
  ,update:function() { o.lastupdated=new Date().getTime(); }
 };
 setInterval(function()
 {
  var d=new Date().getTime()
  if(d-o.lastupdated>timeout_ms)
  {
   o.lastupdated=new Date().getTime();
   try{o.cb()}catch(e){}
  }
 },check_every_ms);
 return o;
}
