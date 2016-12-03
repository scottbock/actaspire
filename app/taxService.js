angular.module('myApp').factory('TaxService', ['$http', function ($http) {

	var calculateTax = function(billingAddress, orders, callback, errorCallback){

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

			]
		};

		var lineNo = 1;
		var summativeAndPeriodicTaxCode = "SE020000";

		angular.forEach(orders.summative.orders, function(order, key) {
			var onlineCost = (order.cost.online - order.online.totalDiscountPerStudent) * order.online.total;
			var paperCost = (order.cost.paper - order.paper.totalDiscountPerStudent) * order.paper.total;
			var onlineISR = ((order.cost.isr) * order.online.total * order.reportsPerStudent);
			var paperISR = ((order.cost.isr) * order.paper.total * order.reportsPerStudent);
			var onlineLabel = ((order.cost.labels) * order.online.total);
			var paperLabel = ((order.cost.labels) * order.paper.total);

			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": onlineCost,
				"TaxCode": summativeAndPeriodicTaxCode
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": paperCost,
				"TaxCode": summativeAndPeriodicTaxCode
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": paperISR
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": onlineISR
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": paperLabel
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": onlineLabel
			});
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": order.cost.lateFee
			});
		});

		angular.forEach(orders.periodic.orders, function(order, key) {
			data.Lines.push({
				"LineNo": lineNo++,
				"DestinationCode": "01",
				"Amount": (order.cost - order.totalDiscountPerStudent) * order.onlineTotal,
				"TaxCode": summativeAndPeriodicTaxCode
			});
		});


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