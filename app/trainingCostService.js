angular.module('myApp').factory('TrainingCostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/trainingcost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    	cost.training = response.data.training;
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
		cost.validThrough = response.data.validThrough;
    	cost.currentSemester = response.data.currentSemester;
    	cost.currentYear = response.data.currentYear;
	});

	return {
		'cost':cost
	}
}]);