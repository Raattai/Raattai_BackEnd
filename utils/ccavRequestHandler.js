var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    crypto = require('crypto'),
    qs = require('querystring');
    
var orders = require('../utils/order.js');

exports.postReq = async function(request,response){    
    var body = '',
	workingKey = '3B2C2300169E9C59F83232DF4304D891',	//Put in the 32-Bit key shared by CCAvenues.
    merchantId=3168733,
	//accessCode = 'AVCT47LA95AS55TCSA',			//Put in the Access Code shared by CCAvenues.
	encRequest = '',
    orderId=0 // fetch from order collection	

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');
      	
    orderId = await orders.latestOrder(); 
    
    console.log(orderId)
    input = `merchant_id=${merchantId}&order_id=${orderId}&currency=${request.body.currency}&amount=${request.body.amount}&redirect_url=http://localhost:3000/ccavResponse&cancel_url=http://localhost:4200/shop/failure-payment&language=EN`		
    
    encRequest = ccav.encrypt(input, keyBase64, ivBase64);    
    response.json({key:encRequest});
   
   return; 
};
