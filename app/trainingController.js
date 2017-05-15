angular.module('myApp').controller('trainingController', ['$scope', '$state', '$http', '$cookies', 'TrainingCostService', 'EmailService', 'schoolYearFilter', function($scope, $state, $http, $cookies, trainingCostService, emailService, schoolYearFilter) {
	$scope.cost = trainingCostService.cost;
	$scope.date = new Date();
	$http.get('json/states.json').success(function(data) { 
    	$scope.states = data;
	});
	$scope.$state = $state;

	$scope.formData = {

	};

	$scope.trainingOrders = [];

	$scope.addTraining = function(training){
		var order;
		angular.forEach($scope.trainingOrders, function(trainingOrder, key) {
			if(training.title == trainingOrder.title){
				order = trainingOrder;
			}
		});
			

		if(!order){
			order = {};
			angular.copy(training, order);
			order.quantity = 0;
			order.preferredTime = "AM";
			$scope.trainingOrders.push(order);
		}   
		

		order.quantity++;
	}

	$scope.removeTraining = function(training){
		var index = $scope.trainingOrders.indexOf(training);

		if (index > -1) {
		    $scope.trainingOrders.splice(index, 1);
		}
	}

 	$scope.dateOptions = {
   		formatYear: 'yy',
    	maxDate: new Date(2020, 5, 22),
    	minDate: new Date(),
    	startingDay: 1
  	};

	$scope.openCalendar = function(training) {
	    training.opened = true;
	};

	$scope.getTotal = function(){
	    var total = 0;
	    for(var i = 0; i < $scope.trainingOrders.length; i++){
	        var training = $scope.trainingOrders[i];
	        total += (training.quantity * training.cost);
	    }
	    if($scope.formData){
			$scope.formData.total = total;
	    }	    
	    return total;
	};	

	// function to process the form
	$scope.processForm = function() {
		emailService.sendTrainingConfirmationEmail($scope.formData, $scope.trainingOrders, $scope.cost);
	};

}]);