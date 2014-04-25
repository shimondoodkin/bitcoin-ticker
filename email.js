var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "freeposter3@gmail.com",
        pass: "freeposter"
    }
});

sendemaillog=function()
{
var text=require('util').inspect(arguments);
// setup e-mail data with unicode symbols
var mailOptions = {
    from: "bitcoin-ticker-log <freeposter3@gmail.com>", // sender address
    to: "freeposter3+bitcoin-ticker-log@gmail.com", // list of receivers
    subject: "bitcoin ticker log", // Subject line
    text: text, // plaintext body
    html: text.replace(/\n/g,'<br>') // html body
}

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
    }else{
        console.log("Message sent: " + response.message);
    }

    // if you don't want to use this transport object anymore, uncomment following line
    smtpTransport.close(); // shut down the connection pool, no more messages
});

}
