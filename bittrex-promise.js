"use-strict";
const hmacSHA512 = require("crypto-js/hmac-sha512.js");
const rP = require("request-promise");
/*
    Implements the usage of the Bittrex API using promises and JSON.
*/

class BittrexApi {
    constructor(settings) {
        this._apiSecret = settings.apiSecret;
        this._apiKey = settings.apiKey;

        // Default is a json response using v1.1 of the Bittrex API
        this._json = settings.json || true ;
        this._version = settings.version || "v1.1";
        this._baseUrl = settings.baseUrl || `https://bittrex.com/api/${this._version}`;
    }

    _getNonce() {
        return Math.floor(new Date().getTime() / 1000);
    } 

    _getSigning(uri) {
        return hmacSHA512(uri,this._apiSecret);
    }

/*
    Public API
    "Public information available without an API key"
*/

    getTicker(market) {
        let options = {
            uri: `${this._baseUrl}/public/getticker?market=${market}`,
            json: this._json
        };

        return rP(options);
    }

    getMarkets() {
        let options = {
            uri: `${this._baseUrl}/public/getmarkets`,
            json: this._json
        };
        return rP(options);
    }

    getCurrencies() {
        let options = {
            uri: `${this._baseUrl}/public/getcurrencies`,
            json: this._json
        };
        return rP(options); 
    }

    getMarketSummaries() {
        let options = {
            uri: `${this._baseUrl}/public/getmarketsummaries`,
            json: this._json
        };
        return rP(options); 
    }    

    getOrderBook(market, type, depth = 20) {
        if(depth > 50) { 
            depth = 50;
        }
        let fullUri = `${this._baseUrl}/public/getorderbook?market=${market}&type=${type}&depth=${depth}`;
        let options = {
            uri: fullUri,
            json: this._json
        };
        return rP(options);
    }

    getMarketHistory(market) {
        let options = {
            uri: `${this._baseUrl}/public/getmarkethistory?market=${market}`,
            json: this._json
        };
        return rP(options);
    }

    /*
        MARKET APIs
        "Used to place a buy order in a specific market. Use buylimit to place limit orders. Make sure you have the proper permissions set on your API keys for this call to work"
    */

    getOpenOrders(market) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/market/getopenorders?nonce=${nonce}&apiKey=${this._apiKey}`;
        if(market) {
            fullUri += `&market=${market}`;
        }
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);
    }

    cancelOpenOrder(uuid) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/market/cancel?nonce=${nonce}&apiKey=${this._apiKey}&uuid=${uuid}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);
    }

    marketBuyLimit(market, quantity, rate) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/market/buylimit?nonce=${nonce}&apiKey=${this._apiKey}&market=${market}&quantity=${quantity}&rate=${rate}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);
    }
    
    marketSellLimit(market, quantity, rate) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/market/selllimit?nonce=${nonce}&apiKey=${this._apiKey}&market=${market}&quantity=${quantity}&rate=${rate}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);      
    }
   



/*
    Account API
    "For managing your account"

*/

    getBalances() {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getbalances?nonce=${nonce}&apiKey=${this._apiKey}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };

        return rP(options);
    }

    getBalance(currency) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getbalance?nonce=${nonce}&apiKey=${this._apiKey}&currency=${currency}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };

        return rP(options);
    }

    getDepositAddress(currency) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getdepositaddress?nonce=${nonce}&apiKey=${this._apiKey}&currency=${currency}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };

        return rP(options);
    }

    // account/withdraw

    getOrder(uuid) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getorder?nonce=${nonce}&apiKey=${this._apiKey}&uuid=${uuid}`;
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };

        return rP(options);
    } 
    
    // Used to retrieve your order history
    getOrderHistory(market = "default") {
        //build the full URI
        let nonce = this._getNonce();

        //maybe a better way to do this is create an object with query params and API endpoint, call out to
        //class method that buiilds the URI for you and returns it.
        let fullUri = `${this._baseUrl}/account/getorderhistory?nonce=${nonce}&apiKey=${this._apiKey}&count=100`;
        if(market !== "default") {
            fullUri += `&market=${market}`;
        }
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apiSign: sign}
        };

        return rP(options);
    }

    getWithdrawalHistory(currency) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getwithdrawalhistory?nonce=${nonce}&apiKey=${this._apiKey}&currency=${currency}`; 
        let sign = this._getSigning(fullUri);

        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);       
    }

    getDepositHistory(currency) {
        let nonce = this._getNonce();
        let fullUri = `${this._baseUrl}/account/getdeposithistory?nonce=${nonce}&apiKey=${this._apiKey}&currency=${currency}`; 
        let sign = this._getSigning(fullUri);
        let options = {
            uri: fullUri,
            json: this._json,
            headers: {apisign: sign}
        };
        return rP(options);       
    }
    

}

module.exports = BittrexApi;
