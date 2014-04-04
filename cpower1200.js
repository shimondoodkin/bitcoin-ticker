
/*
Data	Value	Length(Byte)	Description
Start code	0xa5	1	The start of a packet
Packet type	0x68/0xE8	1	Recognition of this type of packet
Send packet： 0x68
Return packet： 0xE8
Card type	0x32	1	Fixed type code
Card ID	0x01~0xFE, 0xFF	1	Control card ID, the screen No, valid values are as follows: 1 ~ 254: the specified card ID, 0xFF: that group address, unconditionally receiving data
Command code (CMD)	See Command list To perform the specified command
Additional information/ confirmation mark	0或1	1	The meaning of bytes in the packet is sent, "Additional Information", is a packet plus instructions, and now only use the lowest:
bit 0: whether to return a confirmation, 1 to return and 0 not to return
bit1 ~ bi7: reserved, set to 0
Packet data	CC 。。。。。。	Variable-length	Data
Packet data checksum 
	0x0000~0xffff	2	Two bytes, checksum。 Lower byte in the former。The sum of each byte from " Packet type " to “ Packet data” content
End code	0xae	1	The end of a packet（Package tail）

*/
packet={
  start:'\u00a5'
 ,packetType: {
    send:'\u0068'
  ,'return':'\u00e8'
 }
 ,cardType:'\u0032'
 ,cardId:function(id){ return String.fromCharCode(id);} // 1~254
 ,commandCode:{
    testConnection:'\u0001'
   ,queryAndSetNetworkParameter:'\u003c'
   ,queryAndSetIdAndBoundRate:'\u003e'
   ,subCommand:'\u007b'
   ,restartHardware:'\u002d'
   ,restartAPP:'\u00fe'
   ,writeFileOpen:'\u0030'
   ,writeFileWrite:'\u0032'
   ,writeFileClose:'\u0033'
   ,quickWriteFileOpen:'\u0050'
   ,quickWriteFileWrite:'\u0051'
   ,quickWriteFileClose:'\u0052'
   ,timeQueryAndSet:'\u0047'
   ,brightnessQueryAndSet:'\u0046'
   ,queryVersionInfo:'\u002e'
   ,powerOnOrOffInfo:'\u0045'
   ,powerOnOrOffControl:'\u0076'
   ,queryTemperature:'\u0075'
   ,removeFile:'\u002c'
   ,queryFreeDiskSpace:'\u0029'
  }
 ,requireConfirmation:{
   yes : '\u0001'
  ,no: '\u0000'
 }
 ,packetData:{
   escape:function(data){return data.replace(/\u00aa/g,'\u00aa\u000a').replace(/\u00a5/g,'\u00aa\u0005').replace(/\u00ae/g,'\u00aa\u000e')}
  ,unescape:function(data){return data.replace(/\u00aa\u0005/g,'\u00a5').replace(/\u00aa\u000e/g,'\u00ae').replace(/\u00aa\u000a/g,'\u00aa')}
  ,lengthcode:function(data,ordinal,total){
      if(ordinal===undefined)ordinal=0;
      if(total===undefined)total=0;
      return String.fromCharCode(data.length&0xFF,data.length>>8) //LL LH	0x0000~0xffff	2	Two bytes, the length of the "CC ……" part content . Lower byte in the former
     +String.fromCharCode(ordinal)//Packet number PO 	0x00~0x255	1	When the packet sequence number is equal to when the last packet sequence number, indicating that this is the last one package.
     +String.fromCharCode(total)//Last packet number TP	0x00~0x255	1	The total number of packages minus 1.
     +data//Packet data	CC ……	Variable-length	Command sub-code and data
  }
  ,unlengthcode:function(data,ret){
      var length=data.charCodeAt(0)|(data.charCodeAt(1)<<8);
      var ordinal=data.charCodeAt(2)
      var total=data.charCodeAt(3)
      var content=data.substring(4,4+length);
      var rest=data.substring(4+length,data.length);
      ret.lengthcodeLength=length;
      ret.lengthcodeOrdinal=ordinal;
      ret.lengthcodeTotal=total;
      ret.lengthcodeData=content;
      ret.lengthcodeDataTail=rest;
  }
  ,commandsubcode:{
     // GENERAL:
     divisionOfDisplayWindowArea:'\u0001'
    ,toSendTextDataToASpecifiedWindow:'\u0002'
    ,toSendImageDataToTheSpecifiedWindow:'\u0003'
    ,staticTextDataSentToTheSpecifiedWindow:'\u0004'
    ,toSendClockDataToTheSpecifiedWindow:'\u0005'
    ,exitShowToReturnToPlayWithinTheProgram:'\u0006'
    ,saveOrClearTheData:'\u0007'
    ,selectPlayStoredProgramSingleByte:'\u0008'
    ,selectPlayTStoredProgramDoubleByte:'\u0009'
    ,setVariableValue:'\u000A'
    ,selectPlaySingleStoredProgramAndSetTheVariableValue:'\u000B'
    ,setGlobalDisplayArea:'\u000C'
    ,pushUserVariableData:'\u000D'
    ,setTimerControl:'\u000E'
    ,setTheGlobalDisplayAreaAndVariableValues:'\u000F'
    ,sendPureTextToTheSpecifiedWindow:'\u0012'
    ,sendInstantText:'\u0074'
    //PROGRAM TEMPLATE
    ,setProgramTemplateCommand:'\u0081'
    ,inOrOutProgramTemplateCommand:'\u0082'
    ,queryProgramTemplateCommand:'\u0083'
    ,deleteProgramCommand:'\u0084'
    ,sendTextToSpecialWindow:'\u0085'
    ,sendPictureToSpecialWindow:'\u0086'
    ,clockOrTemperatureDisplayInTheSpecifiedWindowOfTheSpecifiedProgram:'\u0087'
    ,sendAloneProgram:'\u0088'
    ,queryProgramInformation :'\u0089'
    ,setProgramProperty:'\u008a'
    ,setPlayPlan:'\u008b'
    ,deletePlayPlan:'\u008c'
    ,queryPlayPlan:'\u008d'
   }
 }
 ,checksum:function(data){var sum=0;for(var i=0;i<data.length;i++){sum+=data.charCodeAt(i);if(sum>0xFFFF)sum=sum-0xFFFF;} return String.fromCharCode(sum&0xFF,sum>>8); }//input data is everything between Start and End
 ,end:'\u00ae'
}

//Data Position	Data Items	Length(Byte)	Description
//0x0000	Confirmation message	1	0 Failed；1 Successful.

returnpacket={
 confirmationMessage:{	
    failed:'\u0000'
  , successful:'\u0001'
 }
}

var keysbyvalues_cache_key=[];
var keysbyvalues_cache=[];
function keysbyvalues_cached(inobj)
{
 var i=keysbyvalues_cache_key.indexOf(inobj);
 if(i!=-1) return keysbyvalues_cache[i];
 var obj={};Object.keys(inobj).forEach(function(key){var value=inobj[key];obj[value]=key});
 keysbyvalues_cache_key.push(inobj);
 keysbyvalues_cache.push(obj);
 return obj;
}

var parsepacket=exports.parsepacket=function(data)
{
  if(data.length<2) throw new Error('packet length too short');
  
  var ret={};
  
  if(data[0]!=packet.start) throw new Error('packet start missing');
  if(data[data.length-1]!=packet.end) throw new Error('packet end missing, last char is not packet end');
  var body=packet.packetData.unescape(data.substring(1,data.length-3))
  var checksum=data.substring(data.length-3,data.length-1)
  if(checksum!=packet.checksum(body)) throw new Error('packet checksum decode error '+(body.h()));  
  var c=0;
  
  if(body[c]==packet.packetType.send)ret.packetType='send';
  else if(body[c]==packet.packetType['return'])ret.packetType='return';
  else throw new Error('packet type missing');
  c++;

  if(body[c]!=packet.cardType) throw new Error('packet cardType not 0x32');
  c++;
    
  ret.cardId=body[c].charCodeAt(0);
  c++;

  ret.commandCode=body[c];
  var cm=keysbyvalues_cached(packet.commandCode)[body[c]];
       if(cm!==undefined)ret.commandCodeName=cm;
  else throw new Error('packet commandCode unknown');
  c++;
  
       if((body.charCodeAt(c)&0x01)==packet.requireConfirmation.yes.charCodeAt(0)) ret.requireConfirmation='yes';
  else if((body.charCodeAt(c)&0x01)==packet.requireConfirmation.no.charCodeAt(0)) ret.requireConfirmation='no';  
  else throw new Error('packet confirmation settings is unknown '+c+ ' '+ (body[c].h()) );
  c++;
  
  ret.packetData=body.substring(c,body.length);


 if(ret.packetType=='return')
 {
        if(ret.commandCode==packet.commandCode.testConnection) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.queryAndSetNetworkParameter) parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.queryAndSetIdAndBoundRate) parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.restartHardware) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.restartAPP) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.writeFileOpen) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.writeFileWrite) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.writeFileClose) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.quickWriteFileOpen) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.quickWriteFileWrite) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.quickWriteFileClose) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.timeQueryAndSet) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.brightnessQueryAndSet) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.queryVersionInfo) parseversionpacket(ret);
   else if(ret.commandCode==packet.commandCode.powerOnOrOffInfo) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.powerOnOrOffControl) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.queryTemperature) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.removeFile) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.queryFreeDiskSpace) ;//parseconfirmationpacket(ret);
   else if(ret.commandCode==packet.commandCode.subCommand)
   {
    //parseconfirmationpacket(ret);
    packet.packetData.unlengthcode(ret.packetData,ret);// MISSING  DEVELOPMENT: lengthcode data should be accumulateed and flushed at end to the subcommand, and if a next packet arraves without the previous packet exists in the faccomulated packets, an erroir packet should be created to ask retransmission of missed previous packet(s)

    ret.commandsubcode=ret.lengthcodeData[0];//first byte is subcommand  code
    var cm=keysbyvalues_cached(packet.packetData.commandsubcode)[ret.commandsubcode];
         if(cm!==undefined)ret.commandsubcodeName=cm;
    else throw new Error('packet commandsubcode unknown');
    
         if(ret.commandCode==packet.commandCode.writeFileOpen) parseconfirmationpacket(ret);
    else if(ret.commandCode==packet.commandCode.writeFileOpen) parseconfirmationpacket(ret); 

   }
 }
   
 return ret;
}

//parseconfirmationpacket(packet.commandCode.queryAndSetIdAndBoundRate,returnpacket.confirmationMessage.successful)

var parseconfirmationpacket=function(ret)
{
 //var ret=parsepacket(packetreturn(packet.commandCode.queryAndSetIdAndBoundRate,returnpacket.confirmationMessage.successful))
 var data=ret.packetData;
 var c=0;
      if(data[c]==returnpacket.confirmationMessage.successful)ret.confirmationMessage='successful';
 else if(data[c]==returnpacket.confirmationMessage.failed)ret.confirmationMessage='failed';
 else if(data[c]==returnpacket.confirmationMessage.failed)ret.confirmationMessage='failed';
 else throw new Error('packet confirm message not correct');
 c++;
 delete ret.packetData
 return ret;
}
// echo / test command
//2014-03-30 00:21:07.651 T A5 "h2" 01 01 01 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F " !" 22 "#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~" 7F 80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F 90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F A0 A1 A2 A3 A4 AA 05 A6 A7 A8 A9 AA 0A AB AC AD AA 0E AF B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF C0 C1 C2 C3 C4 C5 C6 C7 C8 C9 CA CB CC CD CE CF D0 D1 D2 D3 D4 D5 D6 D7 D8 D9 DA DB DC DD DE DF E0 E1 E2 E3 E4 E5 E6 E7 E8 E9 EA EB EC ED EE EF F0 F1 F2 F3 F4 F5 F6 F7 F8 F9 FA FB FC FD FE FF 1D 80 AE 
//2014-03-30 00:21:07.744 R A5 E8 "2" 01 01 01 00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F 10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F " !" 22 "#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~" 7F 80 81 82 83 84 85 86 87 88 89 8A 8B 8C 8D 8E 8F 90 91 92 93 94 95 96 97 98 99 9A 9B 9C 9D 9E 9F A0 A1 A2 A3 A4 AA 05 A6 A7 A8 A9 AA 0A AB AC AD AA 0E AF B0 B1 B2 B3 B4 B5 B6 B7 B8 B9 BA BB BC BD BE BF C0 C1 C2 C3 C4 C5 C6 C7 C8 C9 CA CB CC CD CE CF D0 D1 D2 D3 D4 D5 D6 D7 D8 D9 DA DB DC DD DE DF E0 E1 E2 E3 E4 E5 E6 E7 E8 E9 EA EB EC ED EE EF F0 F1 F2 F3 F4 F5 F6 F7 F8 F9 FA FB FC FD FE FF 9D 80 AE

var parsesubcommandpacket=function(ret)
{
 //Data-position  Data-Items  Length(byte)  Description
 var data=ret.packetData;
 var c=0;
 //0x0000    0x00            1    Reserved
 c++;
 //0x0001    Card type code  1    Controller type code
 ret.ControllerTypeCode=data.charCodeAt(c);c++;
 //0x0002    Logic version   1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.logicVersionMinor=t&0x03;
 //                               Bit4~7: The major version.
 ret.logicVersionMajor=t>>3;
 c++;
 //0x0003    Bios version    1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.biosVersionMinor=t&0x03;
 //                               Bit4~7: The major version.
 ret.biosVersionMajor=t>>3;
 c++;
//0x0004    Reserved        1
c++;    
//0x0005    Reserved        1
c++;    
//0x0006    Reserved        1
c++;    
//0x0007    APP version     1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.appVersionMinor=t&0x03;
 //                              Bit4~7: The major version.
 ret.appVersionMajor=t>>3;
 c++;    
//0x0008    Reserved       Variable-length    
 ret.packetDataTail=data.substring(c); 
 delete ret.packetData
 return ret;
}


var parseversionpacket=function(ret)
{
 //Data-position  Data-Items  Length(byte)  Description
 var data=ret.packetData;
 var c=0;
 //0x0000    0x00            1    Reserved
 c++;
 //0x0001    Card type code  1    Controller type code
 ret.ControllerTypeCode=data.charCodeAt(c);c++;
 //0x0002    Logic version   1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.logicVersionMinor=t&0x03;
 //                               Bit4~7: The major version.
 ret.logicVersionMajor=t>>3;
 c++;
 //0x0003    Bios version    1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.biosVersionMinor=t&0x03;
 //                               Bit4~7: The major version.
 ret.biosVersionMajor=t>>3;
 c++;
//0x0004    Reserved        1
c++;    
//0x0005    Reserved        1
c++;    
//0x0006    Reserved        1
c++;    
//0x0007    APP version     1    Bit0~3: The minor version.
 var t=data.charCodeAt(c);
 ret.appVersionMinor=t&0x03;
 //                              Bit4~7: The major version.
 ret.appVersionMajor=t>>3;
 c++;    
//0x0008    Reserved       Variable-length    
 ret.packetDataTail=data.substring(c); 
 delete ret.packetData
 return ret;
}


var  packetsend=function(command,data)
{
 var body=
   packet.packetType.send //packet.packetType.return;
  +packet.cardType
  +packet.cardId(1) // 1~254
  +command // queryAndSetIdAndBoundRate
  +packet.requireConfirmation.yes
  +data
  
 return  packet.start
        +packet.packetData.escape(body)
        +packet.checksum(body)
        +packet.end
}

var packetreturn=function(command,data)
{
 var body=
   packet.packetType.return
  +packet.cardType
  +packet.cardId(1) // 1~254
  +command
  +packet.requireConfirmation.yes;
  +data
  
 return  packet.start
        +packet.packetData.escape(body)
        +packet.checksum(body)
        +packet.end
}


String.prototype.h=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return (x<16?'0':'')+x.toString(16)}).join(' ').toUpperCase() }
String.prototype.b=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return ('00000000'.substring(x.toString(2).length))+x.toString(2)}).join(' ') }
//test functions:
exports.setNetworkParameter=function()
{
 function ip(a){ var a=a.split('.').map(function(a){return parseInt(a,10)}); return String.fromCharCode.apply(String,a) }
 var data=                  //Data Position	Data Items	Length(Byte)	Description
 '\u0000'                   //0x0000            0       1	0: Set network parameter
 +ip('192.168.1.222')       //0x0001	IP Address   	4	IP Address
 +ip('192.168.1.1')         //0x0005	Gateway	        4	Gateway
 +ip('255.255.255.0')       //0x0009	Subnet mask  	4	Subnet mask
 +String.fromCharCode(5200>>8,5200&0xff) //0x000d	IP port number	2	IP port number
 +'\u00ff\u00ff\u00ff\u00ff'//0x000f	Network ID code	4	Network ID code
 return packetsend(packet.commandCode.queryAndSetNetworkParameter,data);
}

//send  // A5 68 32 01 3C 01 00 C0 A8 01 DE C0 A8 01 01 FF FF FF 00 14 50 FF FF FF FF E6 0B AE
//reply // A5 E8 32 01 3C 01 01 59 01 AE
//parsepacket(packetreturn(packet.commandCode.queryAndSetNetworkParameter,returnpacket.confirmationMessage.successful))
//packetreturn(packet.commandCode.queryAndSetNetworkParameter,returnpacket.confirmationMessage.successful).h()

//Data Position	Data-Items	Length(Byte)	Description
// 0x0000    	 0	    	    1   0: Set controller ID and baud rate
// 0x0001	ID number	        1	1~254
// 0x0002	Baud rate number	1	0: 115200  
//                                  1: 57600
//                                  2: 38400
//                                  3: 19200
//                                  4: 9600
//                                  5: 4800
//                                  6: 2400

exports.setControllerIdAndBaudRate=function(){
 
var data=                   //Data Position	Data-Items	Length(Byte)	Description
  '\u0000'                  // 0x0000    	 0	    	    1   0: Set controller ID and baud rate
 +String.fromCharCode(1)    // 0x0001	ID number	        1	1~254
 +String.fromCharCode(1)    // 0x0002	Baud rate number	1	0: 115200  
                            //                                  1: 57600
                            //                                  2: 38400
                            //                                  3: 19200
                            //                                  4: 9600
                            //                                  5: 4800
                            //                                  6: 2400
 return packetsend(packet.commandCode.queryAndSetIdAndBoundRate,data); 
}

/*
Formatted text data format
Rich3 Text
Each character is 3 bytes, the specific meaning of each byte are as follows:
Byte no	Byte data
    1	      Said the color and font size: 4bits (1-7) represent the color (red green yellow blue purple cyan white), low 4bits (= 0 indicates that 8-point text; = 2 16-point text; = 3 24-point text; = 4 32point text; = 5 40-point text; = 6 48-point text; = 7 56-point text).
    2	      High byte of the text encoding. For single-byte characters, the value is 0.
    3	      Low byte of the text encoding. For single-byte characters, the value of its ASCII code.
*/
//rich3('rr','21','TT').b()// posible set size and color for each char 
//rich3('r','2','TTT').b()// or for the first letter for all
var rich3=function(color,size,letters)
{
 var colorcodes={r:0,g:1,y:2,b:3,p:4,c:5,w:6};
 //red=1 green=2 yellow=3 blue=4 purple=5 cyan=6 white=7
 //8px=0 12px=1 16px=2 24px=3 32px=4 40px=5 48px=6 56px=7
 var text='';
 if(letters.length!=size.length&&size.length!=1) throw new Error('letters and size not same length, letters length='+letters.length+' size length='+size.length)
 if(letters.length!=color.length&&color.length!=1) throw new Error('letters and color not same length, letters length='+letters.length+' color length='+color.length)
 if(letters.length!=size.length&&size.length==1)  for(var i=size.length,v=size[0]; i<letters.length; i++ )size+=v;
 if(letters.length!=color.length&&color.length==1)  for(var i=color.length,v=color[0]; i<letters.length; i++ )color+=v;
 for(var i=0;i<letters.length; i++ )
 {
  text+=String.fromCharCode(
     (parseInt(size[i])<<4)|colorcodes[color[i]],
     (letters.charCodeAt(i)>>8)&0xff
    ,
     letters.charCodeAt(i) & 0xff
    );
 }
 return text;  
}

//this method works, the other 3 methods of setting text are not finished.

exports.sendTextDataToASpecifiedWindow=function(options) // send temporary message i guess
{
 if( undefined===options.text)options.text="";
 if( undefined===options.color)options.color="r";
 if( undefined===options.size)options.size="3";
 if( undefined===options.window)options.window=0;
 if( undefined===options.align)options.align='left';
 if( undefined===options.speed)options.speed=76;
 if( undefined===options.stay)options.stay=3;//seconds
 if( undefined===options.effect)options.effect=specialEffectForTextAndPictureOrderdNames.indexOf("Continuous scroll to left")

 var data=                  // Send text data to a specified window：CC=0x02: 
                            // Data-Items	Value	Length(byte)	Description
  '\u0002'                  // CC      	    0x02	1	Description This is a text data packet
 +String.fromCharCode(options.window)    // Window No 0x00~0x07	1	The window sequence number, valid values 0 ~ 7.
 +String.fromCharCode(options.effect)  // Mode	           1	1	Refer to Special effect for text and picture
 +Alignment[options.align]            // Alignment	0～2    1	0: Left-aligned 
                            //                           1: Horizontal center 
                            //                           2: Right-aligned
 +String.fromCharCode(100-options.speed)   // Speed	  1～100    1	The smaller the value, the faster
 +String.fromCharCode(options.stay>>8,options.stay&0xff) // Stay time 0x0000~0xffff	2	High byte in the former. Unit: second.s
 +rich3(options.color,options.size,options.text)    // String	Variable-length	Every 3 bytes to represent a character. Refer to Rich3 text of Formatted text data format.
 
 return packetsend( packet.commandCode.subCommand, packet.packetData.lengthcode(data,0,0) );
}

//no
var sendStaticText=function()
{
 var data=                  // Send static text：CC=0x04:  
                            // Data-Items	Value	Length(byte)	Description
  '\u0004'                  //CC	0x04	1	Description of the data packet is static text
 +String.fromCharCode(0)    //Window NO	0x00~0x07	1	Window sequence number, valid values 0 to 7
 +String.fromCharCode(1)    //Data type	1	1	0x01: Simple text data
 +String.fromCharCode(1)    //The level of alignment	0~2	1	0: left Alignment
                            //                                  1: center Alignment
                            //                                  2: right Alignment
+String.fromCharCode(10>>8,10&0xff)     //Display area X	0x0000~0xffff	2	The X coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(10>>8,10&0xff)     //Display area Y	0x0000~0xffff	2	The Y coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(64>>8,64&0xff) //Display area width	0x0000~0xffff	2	The width of display area。High byte in the former.
+String.fromCharCode(64>>8,64&0xff) //Display area height	0x0000~0xffff	2	The height of display area。High byte in the former.
+String.fromCharCode( 1 | (0<<3)  )     //Font		1	Bit0~3: font size
                            //                      Bit4~6: font style
                            //                      Bit7:   Reserved
 +String.fromCharCode(255)  //Text color R	0~255	1	The red color component
 +String.fromCharCode(0)    //Text color G	0~255	1	The green color component
 +String.fromCharCode(0)    //Text color B	0~255	1	The blue color component
 "hello!\0"//Text		Variable-length	Text string to the end of 0x00.

 return packetsend( packet.commandCode.subCommand, packet.packetData.lengthcode(data,0,0) );
}

//no
var sendInstantStaticText=function()
{
 var data=                  // Send static text：CC=0x04:  
                            // Data-Items	Value	Length(byte)	Description
  '\u0004'                  //CC	0x04	1	Description of the data packet is static text
 +String.fromCharCode(0)    //Window NO	0x00~0x07	1	Window sequence number, valid values 0 to 7
 +String.fromCharCode(1)    //Data type	1	1	0x01: Simple text data
 +String.fromCharCode(1)    //The level of alignment	0~2	1	0: left Alignment
                            //                                  1: center Alignment
                            //                                  2: right Alignment
+String.fromCharCode(10>>8,10&0xff)     //Display area X	0x0000~0xffff	2	The X coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(10>>8,10&0xff)     //Display area Y	0x0000~0xffff	2	The Y coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(64>>8,64&0xff) //Display area width	0x0000~0xffff	2	The width of display area。High byte in the former.
+String.fromCharCode(64>>8,64&0xff) //Display area height	0x0000~0xffff	2	The height of display area。High byte in the former.
+String.fromCharCode( 1 | (0<<3)  )     //Font		1	Bit0~3: font size
                            //                      Bit4~6: font style
                            //                      Bit7:   Reserved
 +String.fromCharCode(255)  //Text color R	0~255	1	The red color component
 +String.fromCharCode(0)    //Text color G	0~255	1	The green color component
 +String.fromCharCode(0)    //Text color B	0~255	1	The blue color component
 "hello!"//Text		Variable-length	Text string to the end of 0x00.

 return packetsend( packet.commandCode.subCommand, packet.packetData.lengthcode(data,0,0) );
}

//no
//Send text to the specified window of the specified program：CC=0x85:
var sendStaticText=function()
{
 var data=                  // Send static text：CC=0x04:  
                            // Data-Items	Value	Length(byte)	Description
 '\u0085'                  //CC	0x04	1	Description of the data packet is static text
 +String.fromCharCode(0)    //Window NO	0x00~0x07	1	Window sequence number, valid values 0 to 7
 +String.fromCharCode(1)    //Data type	1	1	0x01: Simple text data
 +String.fromCharCode(1)    //The level of alignment	0~2	1	0: left Alignment
                            //                                  1: center Alignment
                            //                                  2: right Alignment
+String.fromCharCode(10>>8,10&0xff)     //Display area X	0x0000~0xffff	2	The X coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(10>>8,10&0xff)     //Display area Y	0x0000~0xffff	2	The Y coordinate of upper left corner of the display area。Upper left corner of the window relative
+String.fromCharCode(64>>8,64&0xff) //Display area width	0x0000~0xffff	2	The width of display area。High byte in the former.
+String.fromCharCode(64>>8,64&0xff) //Display area height	0x0000~0xffff	2	The height of display area。High byte in the former.
+String.fromCharCode( 1 | (0<<3)  )     //Font		1	Bit0~3: font size
                            //                      Bit4~6: font style
                            //                      Bit7:   Reserved
 +String.fromCharCode(255)  //Text color R	0~255	1	The red color component
 +String.fromCharCode(0)    //Text color G	0~255	1	The green color component
 +String.fromCharCode(0)    //Text color B	0~255	1	The blue color component
 "hello!"//Text		Variable-length	Text string to the end of 0x00.

 return packetsend( packet.commandCode.subCommand, packet.packetData.lengthcode(data,0,0) );
}

//no
//Send text to the specified window of the specified program：CC=0x85:
var sendWindowText=function()
{
//Data Item	Value	Lenght(byte)	Description
 var data='\u0085'                  //CC	0x85	1	Describe the package is the data which to send text to the specified window of the specified program
//Append code		4	The user’s append code, high byte previous.
 +String.fromCharCode(1)    //Program No		1	Valid value:1~100
 +String.fromCharCode(1)    //Window No		1	Valid value:1～10 , Invalid when out of program template definition.
 +String.fromCharCode(0)    //Property		1	Bit0~3: Text type 0：Common Text ; 1：Format Text
                            //                  Bit4: Display format. 0: default format  1:specify format
                            //                  Bit5~7: Reserved
//Show format
 +String.fromCharCode(0,0)  //  (Note：When the “Property " display format is zero, do not need this data )	Stay time/
//  Scroll times	2	Stay time/Scroll times: High byte first。When the show effect is scroll , it means scroll times(0 scroll one times,1 scroll two times,…) , for others , it means stay time, unit is second. 
+String.fromCharCode(24)  //	Speed	1	The smaller the faster
+String.fromCharCode(2|0<<4)//	Font size	1	Bit 0~3:Font size,  Font size code
//                    Bit 4~6:Font style , Font style code
//
 +String.fromCharCode(0)    //	Font color.	1	Font color.。Text color code
//
 +String.fromCharCode(15)    //	Show effect	1	Show effect。Special effect for text and picture
//
 +String.fromCharCode(1)    //	Text alignment	1	Text alignment and line space
//                        Bit0~1: the horizontal alignment (
//                                   0: Left-aligned 
//                                   1: Horizontal center 
//                                   2: Right- aligned)
//                        Bit2~3: vertical alignment (
//                                   0:Top-aligned
//                                   1:Vertically center,
//                                   2: Bottom- aligned)
//                        Bit4~7: Line space 0~15point
 +String.fromCharCode(0)    //	Reserved	1	Reserved，fill in 0
 +"hello"//  Text		Variable-length	Text data according to different types of text, the text type to see the definition of the " Property ".
                //  Common Text : The text string, the end to 0x00
                            //  Format text : The first byte is 0x01, the followed Rich3 text, a detailed description see Formatted text data format
 //'\u0001'+rich('r','1','Hello')
 return packetsend( packet.commandCode.subCommand, packet.packetData.lengthcode(data,0,0) );
}




////////////////////////////
var fontSizeCode={
 font8px:0
,font12px:1
,font16px:2
,font24px:3
,font32px:4
,font40px:5
,font48px:6
,font56px:7
}

var fontStyleCode={
defaultstyle:0
,style1:1
,style2:2
,style3:3
,style4:4
,style5:5
,style6:6
,style7:7
}

var Alignment={
left:'\u0000' 
,center:'\u0001'
,right:'\u0002'
}

var specialEffectForTextAndPictureOrderdNames=exports.effect=
["Draw" // 0
,"Open from left" // 1
,"Open from right" // 2
,"Open from center(Horizontal)" // 3
,"Open from center(Vertical)" // 4
,"Shutter(vertical)" // 5
,"Move to left" // 6
,"Move to right" // 7
,"Move up" // 8
,"Move down" // 9
,"Scroll up" // 10
,"Scroll to left" // 11
,"Scroll to right" // 12
,"Flicker" // 13
,"Continuous scroll to left" // 14
,"Continuous scroll to right" // 15
,"Shutter(horizontal)" // 16
,"Clockwise open out" // 17
,"Anticlockwise open out" // 18
,"Windmill" // 19
,"Windmill（anticlockwise）" // 20
,"Rectangle forth" // 21
,"Rectangle entad" // 22
,"Quadrangle forth" // 23
,"Quadrangle endtad" // 24
,"Circle forth" // 25
,"Circle endtad" // 26
,"Open out from left up corner" // 27
,"Open out from right up corner" // 28
,"Open out from left bottom corner" // 29
,"Open out from right bottom corner" // 30
,"Bevel open out" // 31
,"AntiBevel open out" // 32
,"Enter into from left up corner" // 33
,"Enter into from right up corner" // 34
,"Enter into from left bottom corner" // 35
,"Enter into from lower right corner" // 36
,"Bevel enter into" // 37
,"AntiBevel enter into" // 38
,"Horizontal zebra crossing" // 39
,"Vertical zebra crossing" // 40
,"Mosaic(big)" // 41
,"Mosaic(small)" // 42
,"Radiation(up)" // 43
,"Radiation(downwards)" // 44
,"Amass" // 45
,"Drop" // 46
,"Combination(Horizontal)" // 47
,"Combination(Vertical)" // 48
,"Backout" // 49
,"Screwing in" // 50
,"Chessboard(horizontal)" // 51
,"Chessboard(vertical)" // 52
,"Continuous scroll up" // 53
,"Continuous scroll down" // 54
,"Reserved" // 55
,"Reserved" // 56
,"Gradual bigger(up)" // 57
,"Gradual smaller(down)" // 58
,"Reserved" // 59
,"Gradual bigger(vertical)" // 60
,"Flicker(horizontal)" // 61
,"Flicker(vertical)" // 62
,"Snow" // 63
,"Scroll down" // 64
,"Scroll from left to right" // 65
,"Open out from top to bottom" // 66
,"Sector expand" // 67
,"Reserved" // 68
,"Zebra crossing (horizontal)" // 69
,"Zebra crossing (Vertical)" // 70
]

/*

Text color code
1-byte color value 
Max 8 colors. One bit for one basic color.
Bit 0: red color
Bit 1: green color
Bit 2: blue color
Other: not used
Example: 
Color value	Color
1	Red
2	Green
3	Yellow
4	Blue
7	White

3-byte color value
RGB color, one byte for one basic color. It can express all kinds of color. Use each one byte to represent red、green、blue.
Byte 1: Red value of the color
Byte 2: Green value of the color
Byte 3: Blue value of the color

Picture effect code
Code	Picture effect
0	Center
1	Zoom
2	Stretch
3	tile


	
When the random effect is expressed by one byte , the value is 255(0xFF) , when it is expressed by two bytes , the value is 32768(0x8000).

Clock format and display content
Clock format：
Represent by one byte：
bit 0: Signal timing(0: 12signal timing；1: 24 signal timing)
bit 1: Year by bit(0: 4 bit；1: 2 bit)
bit 2: Line folding(0: single-row；1: multi-row)
bit 3~5: Reserved(set to 0)
bit 6: Show time scale ”Hour scale、Minute scale”
bit 7: Reserved(set to 0)

Clock display content：
Represent by one byte：
Ascertain the display content by bit:
bit 7: pointer
bit 6: week
bit 5: second
bit 4: minute
bit 3: hour
bit 2: day
bit 1: month
bit 0: year

Simple picture data format 
Data composition：
Data head	Red data(optional)	Green data(optional)	Blue data(optional)

Data head description：
	0	1	2	3	4	5	6	7
0x00	identify	width	height	property	Reserved
Description：
	Data name	Data size(byte)	Description
Identify	2	Set to “I1”。
Width	2	The width of the picture, low byte previous(little endian)
Height	2	The height of the picture,low byte previous(little endian)
Property	1	The gray-scale and color of the picture
Bit0: Whether exist red data, exist when 1.
Bit1: Whether exist green data, exist when 1.
Bit2: Whether exist blue data, exist when 1.
Bit3: Reserved, set to 0.
Bit4~7: Gray-scale, only support 0 and 7 now. 
   0: 2 levels gray, Each lattic data use 1 bit.
   7: 256 levels gray, Each lattic data use 8 bit.
Each line of the picture data is aligned by byte. As for 2 levels gray picture, when the line data is not enough for 8 bit, add 0.
Reserved	1	Set 0

Data description：
		The color of the data is order by red、green、blue. If the identify bit of the property is 0, the color data is not exist.
        For one color data, order by ” left to right, top to bottom”. First put the data to the first line, then second line and so on. 

Formatted text data format
Rich3 Text
Each character is 3 bytes, the specific meaning of each byte are as follows:
Byte no	Byte data
1	Said the color and font size: 4bits (1-7) represent the color (red green yellow blue purple cyan white), low 4bits (= 0 indicates that 8-point text; = 2 16-point text; = 3 24-point text; = 4 32point text; = 5 40-point text; = 6 48-point text; = 7 56-point text).
2	High byte of the text encoding. For single-byte characters, the value is 0.
3	Low byte of the text encoding. For single-byte characters, the value of its ASCII code.

*/
////////////////////////////
// /dev/serial/by-id/usb-Prolific_Technology_Inc._USB-Serial_Controller_D-if00-port0

exports.queryVersionInfo=function()
{
 var data=                  //Data Position	Data Items	Length(Byte)	Description
 '\u0000'                   //0x0000            0       1	0: Reserved
 return packetsend(packet.commandCode.queryVersionInfo,data);
}

exports.queryFreeDiskSpace=function()
{
 var data=                  //Data Position	Data Items	Length(Byte)	Description
 '\u0000'                   //0x0000            0       1	0: Reserved
 return packetsend(packet.commandCode.queryFreeDiskSpace,data);
}

exports.serialstart=function(cb)
{
var serialPort = require((require('os').arch()=='arm'?'./arm_node_modules/':'')+"serialport");
var SerialPort = serialPort.SerialPort
var have=false;
if(!cb)cb=function(have){console.log(have?'serial found':'serial not found');};

serialPort.list(function (err, ports)
{
 ports.forEach(function(port)
 {
  console.log(port);
  if(port.pnpId.indexOf('Prolific')!=-1||port.manufacturer.indexOf('Prolific')!=-1)
  {
   have=true
   if(exports.serial) exports.serial.close();
   myserial = new SerialPort(port.comName, { baudrate: 115200});
   exports.serial=myserial;
   myserial.on('close', function(a){console.log('serial closed',a); exports.serial=null; myserial=null; })
   myserial.on('error', function(a){console.log('serial error',a.stack); try{myserial.close();}catch(e){} exports.serial=null; myserial=null;})
   myserial.on("open", function ()
   {
    console.log('serial open');
    myserial.on('data', function(data)
    {
     //console.log('arguments: ' ,arguments);
     serialreceive(data)
    });
    cb(have);
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
 if(!have)cb(have)
});
}

String.prototype.h=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return (x<16?'0':'')+x.toString(16)}).join(' ').toUpperCase() }
String.prototype.b=function(){ return this.valueOf().split('').map(function(a){ var x= a.charCodeAt(0); return ('00000000'.substring(x.toString(2).length))+x.toString(2)}).join(' ') }

var buf='';
var serialreceive=function(data)
{
    buf+=data.toString('binary');
    console.log('data received: ' + (buf.h()));    
    while(true)
    {
     var started=false,cmdbuf='';
     var start=buf.indexOf('\u00a5');
     if(start!=-1)
     {
       buf=buf.substring(start);//discard before start
       var end=buf.indexOf('\u00ae');
       if(end!=-1)
       {
        end++;
        cmdbuf=buf.substring(0,end);
        buf=buf.substring(end);
        receivecmd(cmdbuf);
       }
       else
        break;
     }
     else
        break;
     console.log('data received2: ' + (buf.h()),started);
    }
}


var receivecmd=function(buf)
{
 console.log('cmd received: ' + (buf.h()));
 var ret=parsepacket(buf);
 console.log('cmd parsed: ',ret);
};

exports.serialwrite=function(data,cb)
{
    myserial.write(new Buffer(data,'binary'), function(err, results)
    {
     if(err)console.log('err ', err.stack);
      console.log('serial bytes to write: ' + results);
     myserial.drain(function(){
      console.log('serial drained - bytes wrote');
       if(cb)cb();
     })
    });
}

////////////////////////////
//var  repl = require("repl");repl.start({ useGlobal:true,  useColors:true, });

 //serialwrite(queryVersionInfo())
//console.log(packet.packetData.unlengthcode(packet.packetData.lengthcode('test')));
