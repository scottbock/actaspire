angular.module('myApp').factory('TaxService', ['$http', function ($http) {

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
		'validateAddress':validateAddress,
		'calculateTax': calculateTax
	}
}]);