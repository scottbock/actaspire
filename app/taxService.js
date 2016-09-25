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

	return {
		'getTaxRateByZip':getTaxRateByZip
	}
}]);