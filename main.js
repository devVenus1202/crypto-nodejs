var crypto_js = require('crypto-js');
var crypto = require('crypto');

var keyString = 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY';
var dateStamp = '20120215';
var regionName = 'XXX';
var serviceName = 'YYY';

/**
 *  I will offer 2 solutions.
 * 
 * 1. crypto_js.HmacSHA256 is used in example.
 *     
 */
var kDate = crypto_js.HmacSHA256(dateStamp, 'AWS4' + keyString); 
var hashInBase64 = crypto_js.enc.Base64.stringify(kDate);    // This function should be added. 
console.log("Base64Code: " + hashInBase64);


/**
 * 2. crypto.createHmac is useful.
 * 
 * 
 * @param {*} crypto 
 * @param {*} plainText 
 * @param {*} keyString 
 */

var cryptoHmacSha256 = function(crypto, plainText, keyString) {
    return crypto.createHmac('SHA256', 'AWS4'+ keyString).update(dateStamp).digest('base64');
}

var hash = cryptoHmacSha256(crypto, dateStamp, keyString);
console.log("Base64Code: " + hash);

/**
 * redefine example function with 2th solution.
 * @param {*} Crypto 
 * @param {*} key 
 * @param {*} dateStamp 
 * @param {*} regionName 
 * @param {*} serviceName 
 */
var getSignatureKey = function(Crypto, key, dateStamp, regionName, serviceName) {
    var kDate = cryptoHmacSha256(Crypto, dateStamp, "AWS4" + key);
    var kRegion = cryptoHmacSha256(Crypto, regionName, kDate);
    var kService = cryptoHmacSha256(Crypto, serviceName, kRegion);
    var kSigning = cryptoHmacSha256(Crypto, "aws4_request", kService);
    return kSigning;
}

console.log("SingingResult:  " + getSignatureKey(crypto,keyString,dateStamp,regionName,serviceName));

/**
 * 
 * 
 *  Here is a java code.
 *  This result is same with above function.
    try {
        String keyString = "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY";
        String dateStamp = "20120215";

        Mac hmacSha256 = Mac.getInstance("HmacSHA256");
        SecretKeySpec keySpec = new SecretKeySpec(keyString.getBytes(), "HmacSHA256");
        hmacSha256.init(keySpec);

        String hash = Base64.encodeToString(hmacSha256.doFinal(dateStamp.getBytes()), Base64.DEFAULT);
        Log.e("beadict", hash);
    } catch (Exception e){
        System.out.println("Error");
    }
 * 
 */
