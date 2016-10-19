angular.module('myApp').factory('TaxService', ['$http', function ($http) {	

	var getTaxRateByZip = function(APIKey, country, postal, callback) {
		// country = validateCountry(country);
		// if (country === "ERR"){
		// 	errorDeath(errors.BAD_COUNTRY_ZIP,arguments)
		// }
		// if((postal.length > 10)||(postal.length < 5)){
		// 	errorDeath(errors.ZIP_ERROR,arguments);
		// 	};

		//build request url
		var requri = "https://taxrates.api.avalara.com/postal?country=" + encodeURIComponent(country);
	    requri += "&postal=" + encodeURIComponent(postal);
		requri += "&apikey=" + encodeURIComponent(APIKey);	

		$http.get(requri).then(callback);
	}

	var uploadCert = function(file, callback, errorCallback) {
		// var requri = "http://api.certcapture.com/v2/certificates";

		var requri = "../../wp-json/wp/v2/uploadCert/";

		// var requri = 'http://localhost:8888/wordpress/wp-content/plugins/act-aspire-order-form/upload_cert.php';

		var fd = new FormData();
		fd.append('file', file);

		$http.post(requri, fd, {
			transformRequest: angular.identity,
			headers: {'Content-Type': undefined}
		}).then(callback, errorCallback);

	}

	var calculateTax = function(billingAddress, totalAmount, callback, errorCallback){

		var uri = '../../wp-json/wp/v2/calculateTax/';

		var data = {
			"Commit": "false",
			"CustomerCode": "CustomerCode",
			"Addresses": [
				{
					"AddressCode": "01",
					"Line1": billingAddress.line1,
					"Line2": billingAddress.line2,
					"City": billingAddress.city,
					"Region": billingAddress.state,
					"Country": "US",
					"PostalCode": billingAddress.zip
				}
			],
			"Lines": [
				{
					"LineNo": "1",
					"DestinationCode": "01",
					"Amount": totalAmount
				}
			]
		};

		var req = {
			method: 'POST',
			url: uri,
			data: data
		}

		$http(req).then(callback, errorCallback);
	}


	var validateAddress= function(billingAddress, callback, errorCallback){

		var uri = '../../wp-json/wp/v2/validateAddress';

		uri += '?Line1=' + encodeURIComponent(billingAddress.line1);
		if(billingAddress.line2) {
			uri += '&Line2=' + encodeURIComponent(billingAddress.line2);
		}
		uri += '&City=' + encodeURIComponent(billingAddress.city);
		uri += '&Region=' + encodeURIComponent(billingAddress.state);
		uri += '&PostalCode=' + encodeURIComponent(billingAddress.zip);

		var req = {
			method: 'GET',
			url: uri
		}

		$http(req).then(callback, errorCallback);

	}

	return {
		'getTaxRateByZip':getTaxRateByZip,
		'uploadCert':uploadCert,
		'validateAddress':validateAddress,
		'calculateTax': calculateTax
	}
}]);