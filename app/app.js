'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngCookies'
])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'app/form.html',
            controller: 'formController'
        })
		
		.state('form.customer', {
			url: '/customer',
			templateUrl: 'app/form-customer.html'
		})
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/customer');
})

// our controller for the form
// =============================================================================
.controller('formController', ['$scope', '$http', '$cookies', 'CostService', 'EmailService', 'schoolYearFilter', function($scope, $http, $cookies, costService, emailService, schoolYearFilter) {

	$http.get('json/states.json').success(function(data) { 
    	$scope.states = data;
	});

	$scope.cost = costService.cost;

	$scope.date = new Date();
	$scope.currentYear = $scope.date.getFullYear();
	$scope.administrationWindows = ['Fall', 'Spring'];		
	$scope.calendarYears = [$scope.currentYear, $scope.currentYear + 1, $scope.currentYear + 2, $scope.currentYear + 3, $scope.currentYear + 4];
	$scope.subjects = {'Math' :true, 'Science':true, 'Reading':true, 'English':true, 'Writing':true};
	$scope.summative = {
		'administrationWindow' : '',
		'calendarYear' : ''
	};
	$scope.periodic = {		
		'schoolYear' : ''
	};

	$scope.saveDraft = function(){
		$cookies.putObject('formData', $scope.formData);
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

	var cookieFormData = $cookies.getObject('formData');
	if(cookieFormData){
		$scope.formData = cookieFormData;
	}
	
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

		var summativeOnlineTotalGrades = 0, summativePaperTotalGrades = 0, periodicTotalGrades = 0;
		angular.forEach(gradeTotals, function(grade, key) {
			if(grade.summativeOnline > 0){
				summativeOnlineTotalGrades++;
			}
			if(grade.summativePaper > 0) {
				summativePaperTotalGrades++;
			}
			if(grade.periodic > 0){
				periodicTotalGrades ++;
			}
		});

		var discount = {
			volume: {
				summativePaper: costService.getVolumeDiscount(summativePaperTotal),
				summativeOnline: costService.getVolumeDiscount(summativeOnlineTotal)
			},
			multiGrade: {
				summativePaper: costService.getMultigradeDiscount(summativePaperTotalGrades),
				summativeOnline: costService.getMultigradeDiscount(summativeOnlineTotalGrades),
				periodic: costService.getMultigradeDiscount(periodicTotalGrades)
			},
			periodic: {
				summativePaper: costService.getPeriodicDiscount(summativePaperTotalGrades, periodicTotalGrades),
				summativeOnline: costService.getPeriodicDiscount(summativeOnlineTotalGrades, periodicTotalGrades)
			},
			special: $scope.formData.summary.discount ? $scope.formData.summary.discount.special : undefined
		};
		$scope.formData.summary.discount = discount;
	};
	
	$scope.addOrder = function(orders, calendarYear, administrationWindow){
		var alreadyInList = false;
		angular.forEach(orders, function(order, key) {
			alreadyInList = alreadyInList || (order.administrationWindow == administrationWindow && order.calendarYear == calendarYear);
		});
		if(!alreadyInList){
			var order = {};
			if(administrationWindow){
				order.subjects = {};
				angular.copy($scope.subjects, order.subjects);	
			}			
			
			if(orders.length > 0){ //copy in the last order
				var lastOrder = orders[orders.length - 1];
				angular.copy(lastOrder, order);
			}			
			
			//set window and year
			order.administrationWindow = administrationWindow;
			order.calendarYear = calendarYear;
			
			orders.push(order);		
			
			$scope.summative.error = null;
			$scope.periodic.error = null;
		}
		else{
			if(administrationWindow){
				$scope.summative.error = administrationWindow + ' ' + calendarYear + ' already exists';
			}
			else{
				$scope.periodic.error = calendarYear + ' already exists';
			}
		}		
	};
	
	$scope.removeOrder = function(orders, order){
		var index = orders.indexOf(order);
		if (index > -1) {
				orders.splice(index, 1);
		}			
	};	

	$scope.$watch('formData.periodic.orders', function(newValue, oldValue){
		var orders = newValue;
		angular.forEach(orders, function(order, key) {
			var onlineTotal = 0;
			var paperTotal = 0;
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					onlineTotal += parseInt(grade.online);
				}
			});
			order.onlineTotal = onlineTotal;		
		});
		$scope.updateTotals();
	}, true);	
		
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
	
	$scope.addDiscountCode = function(code){
		$scope.formData.summary.discount.special = costService.getSpecialDiscount(code);
		$scope.formData.summary.discount.special.code = code.toUpperCase();
	}
    
	// function to process the form
	$scope.processForm = function() {
		emailService.sendConfirmationEmail($scope.formData);
	};    
}])

.factory('CostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/cost.json').then(function(response) { 
    	cost.pricing = response.data.pricing;
		cost.discounts = response.data.discounts;
    	cost.coupons = response.data.coupons;
	});

	var getVolumeDiscount = function(amount){
		var discountAmount = 0;
		if(cost.discounts){
			angular.forEach(cost.discounts.volume, function(discount, key) {
				if(amount >= discount.min && (!discount.max || amount <= discount.max)){
					discountAmount = discount.discountPer;
				}
			});
		}
		return discountAmount;
	};

	var getMultigradeDiscount = function(amount){
		var discountAmount = 0;
		if(cost.discounts){
			angular.forEach(cost.discounts.multigrade, function(discount, key) {
				if(amount >= discount.min && (!discount.max || amount <= discount.max)){
					discountAmount = discount.discountPer;
				}
			});
		}
		return discountAmount;
	};

	var getPeriodicDiscount = function(summativeAmount, periodicAmount){
		var discountAmount = 0;
		if(periodicAmount > 0 && cost.discounts){
			discountAmount = cost.discounts.periodic.discountPer;
		}
		return discountAmount;
	};

	var getSpecialDiscount = function(couponCode){
		var discountAmount = {};
		if(cost.coupons){
			angular.forEach(cost.coupons, function(coupon, key) {
				if(key.toUpperCase() === couponCode.toUpperCase()){
					discountAmount = coupon;
				}
			});
		}

		if(jQuery.isEmptyObject(discountAmount)){
			discountAmount.error = "No matching coupon for code " + couponCode.toUpperCase();
		}
		return discountAmount;
	};

	return {
		'cost':cost,
		'getVolumeDiscount':getVolumeDiscount,
		'getMultigradeDiscount':getMultigradeDiscount,
		'getPeriodicDiscount':getPeriodicDiscount,
		'getSpecialDiscount':getSpecialDiscount
	}
}])

.factory('EmailService', ['$http', function ($http) {
	var buildEmail = function(formData){
		return 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for your ACT Aspire Order' + 
			'\n\nSincerely,\nYour ACT Aspire Team\nemail@email.email\nXXX-XXX-XXXX';
	};

	var url = 'http://localhost:8888/wordpress/wp-json/wp/v2/sendEmail/';
	var sendConfirmationEmail = function(formData){
		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = 'scottbock@yahoo.com';
		postData.message = buildEmail(formData);
		$http.post(url, postData, {}).then(
			function(){
				alert('success');
			}, 
			function(){
				alert('failure');
			}
		);
	};

	return {
		'sendConfirmationEmail':sendConfirmationEmail
	}
}])

.filter('schoolYear', function() {

  return function(year) {

    // Ensure that the passed in data is a number
    if(isNaN(year) || year < 1) {
      return number;

    } else {
      var schoolYearStart = parseInt(year);
      return schoolYearStart + ' - ' + (schoolYearStart + 1)
    }
  }
});


