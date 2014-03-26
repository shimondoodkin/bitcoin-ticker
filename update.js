// git self update mechanizm
// =========================
// usage:
// add to cron every five minutes run crontab -e, and add a line:  */5 * * * * node /root/pathmyapp/update.js
// in your app add a dummy argument mynodeapp
//
// dependencies: git
// ~~~~~~~~~~~~~~~
// licence: MIT/BSD 2 close
// Copyright (c) 20 Shimon Doodkin
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var https = require('https');
var fs = require('fs');

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' , err);
  process.exit(3);
});


getlastcommit=function(cb) /// doesnot calls cb on error or on update not required, for simplicity
{

var options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/shimondoodkin/bitcoin-ticker/commits?page=1&per_page=1',
  method: 'GET',
  headers: {'User-Agent': 'check repo updated by @shimondoodkin'}
};
if(fs.existsSync(__dirname+'/selfupdate_lastmodified_etag.txt')) options.headers['If-None-Match']=fs.readFileSync(__dirname+'/selfupdate_lastmodified_etag.txt')

var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
//  console.log("headers: ", res.headers);
  if( res.headers.etag )
    fs.writeFileSync( __dirname+'/selfupdate_lastmodified_etag.txt',res.headers.etag );
  var data='';
  res.on('data', function(d) {
    data+=d;
  });
  res.on('end', function() {
   if(res.statusCode!=200) return;
  /*  
  [{"sha": "ef4ed7ae7f442fc83e76931a11bfbc551ec5afe1"
    "commit": {
      "author": {
        "name": "Shimon Doodkin",
        "email": "helpmepro1@gmail.com",
        "date": "2014-01-11T15:25:49Z"
      "committer": {
        "name": "Shimon Doodkin",
        "email": "helpmepro1@gmail.com",
        "date": "2014-01-11T15:25:49Z"
      "url": "https://api.github.com/repos/shimondoodkin/nodejs-clone-extend/git/commits/ef4ed7ae7f442fc83e76931a11bfbc551ec5afe1",
      "comment_count": 0
    },
    "url": 
 */
   if(cb)cb(JSON.parse(data));
   //process.stdout.write(JSON.parse(data)[0].commit.committer.date);
  });
});
req.end();

req.on('error', function(e) {
  console.error(e);
});
}

getgitheadhash=function(cb)
{
 var exec = require('child_process').exec,
    child;

 child = exec('git rev-parse HEAD',
  function (error, stdout, stderr) {
     cb(stdout.trim());
    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
 });
}

updategit=function(cb){

var exec = require('child_process').exec,
    child;

 console.log(">>> git fetch origin");

 child1 = exec('git fetch origin',  function (error1, stdout1, stderr1) {
    console.log('stdout1: ' + stdout1);console.log('stderr1: ' + stderr1);
    if (error1 !== null) { console.log('exec error1: ' , error1);  }
    else
    {//1

 console.log(">>> git checkout");
 child2 = exec('git checkout',  function (error2, stdout2, stderr2) {
    console.log('stdout2: ' + stdout2);console.log('stderr2: ' + stderr2);
    if (error2 !== null) { console.log('exec error2: ' + error2);  }
    else
    {//2

 console.log(">>> git reset --hard origin/master");
 child3 = exec('git reset --hard origin/master',  function (error3, stdout3, stderr3) {
    console.log('stdout3: ' + stdout3);console.log('stderr3: ' + stderr3);
    if (error3 !== null) { console.log('exec error3: ' + error3);  }
    else
    {//3

     console.log("git checkout reset done")
     cb();

    }});//3


    }});//2


    }});///1


}

killmyapp=function(cb)// this function should be tested
{
 var exec = require('child_process').exec,
    child;

 // when you run your aplication add a dummy argument that identifies your application.

 child = exec('ps aux | grep mynodeapp',
  function (error, stdout, stderr) {

    //console.log('stdout: ' + stdout);
    //console.log('stderr: ' + stderr);
     var lines=stdout.trim().split('\n') //split by lines
     var linesfiltered=lines.filter(function(a){return a.indexOf('grep')==-1})// remove myself
     var cols=linesfiltered.map(function(a){return a.split(/\s\s+/)})//split by cols
     var onlyids=cols.map(function(a){return a[1]})
    
     var i=0,l=onlyids.length;
     function loop(){ // simple async loop
      console.log('killing: ',linesfiltered[i])
      process.kill(onlyids[i], 'SIGTERM');
      i++; 
      if(i<l) {setTimeout(loop,500); } else cb();
     }
     if(i<l)loop(); else cb();

    if (error !== null) {
      console.log('exec error: ' + error);
    }
 });
}

runmyapp=function(cb)
{
 var fs = require('fs');
 var cp = require('child_process');
 var child = cp.spawn(__dirname+'/run.sh', [], { detached: true, stdio: [ 'ignore', 'ignore', 'ignore' ] });
 child.unref();
 cb();
}

//if(false)// uncomment to test
getlastcommit(function(data){
  getgitheadhash(function(hash)
  {
    console.log("local hash: '"+hash+"'"," remote hash:'"+data[0].sha+"'");
    if(hash!=data[0].sha)
    {
      console.log("will update");
      updategit(function(){
        killmyapp(function(){
            console.log("kill done");
          runmyapp(function(){
            console.log("run done");
            process.exit(0)
          });
        })
      });
    }
  });
});


//var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });// uncomment to test

