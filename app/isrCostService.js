angular.module('myApp').factory('IsrCostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/isrCost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
		cost.reportGroups = response.data.reportGroups;
    cost.currentSemester = response.data.currentSemester;
		cost.currentYear = response.data.currentYear;
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
		cost.deadline = response.data.deadline;
	});

	return {
		'cost':cost
	}
}]);