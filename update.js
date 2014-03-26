var https = require('https');
var fs = require('fs');

getlastcommit=function(cb) /// doesnot calls cb on error or on update not required, for simplicity
{

var options = {
  hostname: 'api.github.com',
  port: 443,
  path: '/repos/shimondoodkin/bitcoin-ticker/commits?page=1&per_page=1',
  method: 'GET',
  headers: {'User-Agent': 'check repo updated by @shimondoodkin'}
};
if(fs.existsSync('selfupdate_lastmodified_etag.txt')) options.headers['If-None-Match']=fs.readFileSync('selfupdate_lastmodified_etag.txt')

var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
//  console.log("headers: ", res.headers);
  if( res.headers.etag )
    fs.writeFileSync( 'selfupdate_lastmodified_etag.txt',res.headers.etag );
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

updategit=function(){

var exec = require('child_process').exec,
    child;

 child1 = exec('git fetch origin',  function (error1, stdout1, stderr1) {
    console.log('stdout1: ' + stdout1);console.log('stderr1: ' + stderr1);
    if (error1 !== null) { console.log('exec error1: ' , error1);  }
    else
    {//1

 child2 = exec('git checkout master',  function (error2, stdout2, stderr2) {
    console.log('stdout2: ' + stdout2);console.log('stderr2: ' + stderr2);
    if (error2 !== null) { console.log('exec error2: ' + error2);  }
    else
    {//2


 child3 = exec('git reset --hard origin/master',  function (error3, stdout3, stderr3) {
    console.log('stdout3: ' + stdout3);console.log('stderr3: ' + stderr3);
    if (error3 !== null) { console.log('exec error3: ' + error3);  }
    else
    {//3



    }});//3


    }});//2


    }});///1


}

getlastcommit(function(data){
  getgitheadhash(function(hash)
  {
   console.log("'"+hash+"'","'"+data[0].sha+"'");
  });
});


var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });

