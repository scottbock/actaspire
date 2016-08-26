angular.module('myApp')
.controller('isrController', ['$scope', '$state', '$http', '$cookies', 'IsrCostService', 'EmailService', 'schoolYearFilter', function($scope, $state, $http, $cookies, isrCostService, emailService, schoolYearFilter) {
	$scope.cost = isrCostService.cost;
	$scope.date = new Date();
	$http.get('json/states.json').success(function(data) { 
    	$scope.states = data;
	});
	$scope.$state = $state;

	$scope.formData = {};

	$scope.selectReport = function(report, reportGroup){
		angular.forEach(reportGroup.reports, function(report, key) {
			if(reportGroup.selectedReport != report.number){
				report.amount = undefined;
			}
		});
	}

	$scope.getTotal = function(){
	    var total = 0;
	    if($scope.cost.reportGroups){
		    for(var i = 0; i < $scope.cost.reportGroups.length; i++){
		        var reportGroup = $scope.cost.reportGroups[i];
		        for(var j = 0; j < reportGroup.reports.length; j++){
		        	var report = reportGroup.reports[j];
		        	if(report.amount){
		        		total += (report.amount * report.cost);
		        	}
		        } 
		    }
		    if($scope.formData){
				$scope.formData.total = total;
		    }
		}	    
	    return total;
	};	

	// function to process the form
	$scope.processForm = function() {
		emailService.sendIsrConfirmationEmail($scope.formData, $scope.cost);
	};

}]);