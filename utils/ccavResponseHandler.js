var http = require("http"),
  fs = require("fs"),
  ccav = require("./ccavutil.js"),
  crypto = require("crypto"),
  qs = require("querystring");
var order_res =  require("../routes/order.js")
exports.postRes = function (request, response) {
  var ccavEncResponse = "",
    ccavResponse = "",
    workingKey = "3B2C2300169E9C59F83232DF4304D891", //Put in the 32-Bit key shared by CCAvenues.
    ccavPOST = "";

  //Generate Md5 hash for the key and then convert in base64 string
  var md5 = crypto.createHash("md5").update(workingKey).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");
  console.log(request.body);
  let encryption = request.body.encResp;
  console.log(encryption);
  ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
  console.log("response", ccavResponse);

  let removeAmber = ccavResponse.split("&");
  console.log(removeAmber);
  let temp = {};
  for (var i = 0; i < removeAmber.length; i++) {
    console.log(removeAmber[i].split("="));
    subSplit = removeAmber[i].split("=");
    temp[subSplit[0]] = subSplit[1];
  }
  console.log(temp);
  const result =  order_res.to_store_order_transaction(temp)
  response.redirect(
      `http://localhost:4200/shop/success-payment?id=${result._id}`
    );

  //store the  transaction details and redirect with order id to front end. 
		/*logic to b done
		*/

//   request.on("data", function (data) {
//     ccavEncResponse += data;
//     ccavPOST = qs.parse(ccavEncResponse);
//     var encryption = ccavPOST.encResp;
//     console.log("encrytption", encryption);
//     ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
//     console.log("response", ccavResponse);
//   });

//   request.on("end", function () {
//     var pData = "";
//     pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
//     pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
//     pData = pData.replace(/&/gi, "</td></tr><tr><td>");
//     pData = pData + "</td></tr></table>";
//     htmlcode =
//       '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
//       pData +
//       "</center><br></body></html>";
//     //response.writeHeader(200, {"Content-Type": "text/html"});
//     //response.write(htmlcode);
//     response.redirect(
//       "http://localhost:4200/shop/success-payment?id=6645e094ff607d97a7c6ae71"
//     );
//     response.end();
//   });
};



// {
  // order_id: '2',
  // tracking_id: '313011438410',
  // bank_ref_no: 'bsde9a9ffc1c52',
  // order_status: 'Success',
  // failure_message: '',
  // payment_mode: 'Credit Card',
  // card_name: 'Visa',
  // status_code: 'null',
  // status_message: 'Transaction is Successful',
  // currency: 'INR',
  // amount: '40000.00',
  // billing_name: 'null',
  // billing_address: '',
  // billing_city: '',
  // billing_state: '',
  // billing_zip: '',
  // billing_country: '',
  // billing_tel: 'null',
  // billing_email: 'null',
  // delivery_name: '',
  // delivery_address: '',
  // delivery_city: '',
  // delivery_state: '',
  // delivery_zip: '',
  // delivery_country: '',
  // delivery_tel: '',
  // merchant_param1: '',
  // merchant_param2: '',
  // merchant_param3: '',
  // merchant_param4: '',
  // merchant_param5: '',
  // vault: 'N',
  // offer_type: 'null',
  // offer_code: 'null',
  // discount_value: '0.0',
  // mer_amount: '40000.00',
  // eci_value: 'null',
  // retry: 'N',
  // response_code: '',
  // billing_notes: '',
  // trans_date: '18/05/2024 14:26:40',
  // bin_country: 'UNITED STATES'
// }