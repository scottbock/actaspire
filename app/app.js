'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'form.html',
            controller: 'formController'
        })
		
		.state('form.customer', {
			url: '/customer',
			templateUrl: 'form-customer.html'
		})		
        
		.state('form.group', {
			url: '/group',
			templateUrl: 'form-group.html'
		})

		.state('form.comprehensive', {
			url: '/comprehensive',
			templateUrl: 'form-comprehensive.html'
		})

		.state('form.summative', {
			url: '/summative',
			templateUrl: 'form-summative.html'
		})

		.state('form.periodic', {
			url: '/periodic',
			templateUrl: 'form-periodic.html'
		})

		.state('form.implementation', {
			url: '/implementation',
			templateUrl: 'form-implementation.html'
		})	
		
		.state('form.billing', {
			url: '/billing',
			templateUrl: 'form-billing.html'
		})	
		
      
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/customer');
})

// our controller for the form
// =============================================================================
.controller('formController', function($scope) {

	$scope.currentYear = new Date().getFullYear();
	$scope.administrationWindows = ['Fall', 'Spring'];		
	$scope.calendarYears = [$scope.currentYear, $scope.currentYear + 1, $scope.currentYear + 2, $scope.currentYear + 3, $scope.currentYear + 4];
	$scope.summative = {
		'administrationWindow' : $scope.administrationWindows[0],
		'calendarYear' : $scope.calendarYears[0]
	};

	// we will store all of our form data in this object
	$scope.formData = {
		customer: {},
		summative: {
			orders: []
		},
		periodic: {
			orders: []
		},
		summary:{
			grade:{},
			summativeOnlineTotal:0,
			summativePaperTotal:0,
			periodicTotal:0,
			summativeOnlinePrice:0,
			summativePaperPrice:0,
			periodicPrice:0
		}
	};
	
	$scope.updateTotals = function(){
		var summativeOnlineTotal = 0;
		var summativePaperTotal = 0;
		var periodicTotal = 0;
		var gradeTotals = {
			'3':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'4':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'5':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'6':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'7':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'8':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'9':{'summativeOnline':0, 'summativePaper':0, 'periodic':0},
			'10':{'summativeOnline':0, 'summativePaper':0, 'periodic':0}
		};
		
		angular.forEach($scope.formData.summative.orders, function(order, key) {
			summativeOnlineTotal += order.onlineTotal;
			summativePaperTotal += order.paperTotal;		
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					gradeTotals[key].summativeOnline += parseInt(grade.online);
				}
				if(!isNaN(grade.paper)){
					gradeTotals[key].summativePaper += parseInt(grade.paper);
				}
			});
		});
		
		angular.forEach($scope.formData.periodic.orders, function(order, key) {
			periodicTotal += order.onlineTotal;
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					gradeTotals[key].periodic += parseInt(grade.online);
				}
			});
		});
		
		$scope.formData.summary.summativeOnlineTotal = summativeOnlineTotal;
		$scope.formData.summary.summativePaperTotal = summativePaperTotal;
		$scope.formData.summary.periodicTotal = periodicTotal;
		
		$scope.formData.summary.grade = gradeTotals;
		
		//TODO Retrieve based on amounts and subjects
		$scope.formData.summary.summativeOnlinePrice = 28.50;
		$scope.formData.summary.summativePaperPrice = 30.50;
		$scope.formData.summary.periodicPrice = 32.00;
	};
	
	$scope.addOrder = function(orders, administrationWindow, calendarYear){
		var alreadyInList = false;
		angular.forEach(orders, function(order, key) {
			alreadyInList = alreadyInList || (order.administrationWindow == administrationWindow && order.calendarYear == calendarYear);
		});
		if(!alreadyInList){
			var order = {};
			
			if(orders.length > 0){ //copy in the last order
				var lastOrder = orders[orders.length - 1];
				angular.copy(lastOrder, order);
			}			
			
			//set window and year
			order.administrationWindow = administrationWindow;
			order.calendarYear = calendarYear;
			
			orders.push(order);		
			
			$scope.summative.error = null;
		}
		else{
			$scope.summative.error = administrationWindow + ' ' + calendarYear + ' already exists';
		}		
	};
	
	$scope.removeOrder = function(orders, order){
		var index = orders.indexOf(order);
		if (index > -1) {
				orders.splice(index, 1);
		}			
	};		
		
	$scope.$watch('formData.summative.orders', function(newValue, oldValue){
		var orders = newValue;
		angular.forEach(orders, function(order, key) {
			var onlineTotal = 0;
			var paperTotal = 0;
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					onlineTotal += parseInt(grade.online);
				}
				if(!isNaN(grade.paper)){
					paperTotal += parseInt(grade.paper);
				}
			});
			order.onlineTotal = onlineTotal;
			order.paperTotal = paperTotal;			
		});
		$scope.updateTotals();
	}, true);
	
	$scope.addDiscountCode = function(){
		//call service to validate and retrieve info for discount code

		//if invalid set error message
		//if valid apply discount
		$scope.formData.discount = {'code':$scope.discountCode, 'percentage':10, 'amount':25};
		
		$scope.discountCode = null;		
	}
    
	// function to process the form
	$scope.processForm = function() {

	};    
});


