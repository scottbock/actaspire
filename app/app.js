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
		angular.forEach($scope.formData.summative.orders, function(order, key) {
			var total	
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					gradeTotals[key].summativeOnline += parseInt(grade.online);
				}
				if(!isNaN(grade.paper)){
					gradeTotals[key].summativePaper += parseInt(grade.paper);
				}
			});

				// <td>{{order.onlineTotal * (cost.pricing.summative.online + ((order.individualReports ? (order.reportsPerStudent * cost.pricing.summative.isr + (order.scoreLabels ? cost.pricing.summative.labels : 0.0)) : 0.0))) | currency}}
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

	$scope.updatePeriodicOrders = function(){
		angular.forEach($scope.formData.periodic.orders, function(order, key) {
			var onlineTotal = 0;
			var paperTotal = 0;
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					onlineTotal += parseInt(grade.online);
				}
			});
			order.onlineTotal = onlineTotal;		

			order.price = $scope.cost.pricing.periodic;
			order.extendedPrice = order.price * order.onlineTotal;

			//Discounts
			order.discounts = {};
			if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.periodic){
				order.discounts.special = $scope.formData.summary.discount.special.periodic.discountPer;
			}
			order.totalDiscountPerStudent = 0.0;
			for(discountType in order.discounts){
				order.totalDiscountPerStudent += order.discounts[discountType];
			}			

			order.totalDiscount = order.totalDiscountPerStudent * order.onlineTotal;

			order.finalPricePerStudent = order.price - order.totalDiscountPerStudent;
			order.balance = order.finalPricePerStudent * order.onlineTotal;
		});

		$scope.updateSummativeOrders();
	};

	$scope.$watch('formData.periodic.orders', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);	
		
	$scope.updateSummativeOrders = function(){
		angular.forEach($scope.formData.summative.orders, function(order, key) {
			var onlineTotal = 0;
			var onlineGrades = 0;
			var paperTotal = 0;
			var paperGrades = 0;
			angular.forEach(order.grade, function(grade, key) {
				if(!isNaN(grade.online)){
					onlineTotal += parseInt(grade.online);
					onlineGrades ++;
				}
				if(!isNaN(grade.paper)){
					paperTotal += parseInt(grade.paper);
					paperGrades ++;
				}
			});
			order.online = {};
			order.paper = {};
			order.online.total = onlineTotal;
			order.paper.total = paperTotal;	

			//Online portion
			order.online.price = $scope.cost.pricing.summative.online + ((order.individualReports ? (order.reportsPerStudent * $scope.cost.pricing.summative.isr + (order.scoreLabels ? $scope.cost.pricing.summative.labels : 0.0)) : 0.0));
			order.online.extendedPrice = order.online.price * order.online.total;

			order.online.discounts = {};
			order.online.discounts.volume = costService.getVolumeDiscount(order.online.total);
			order.online.discounts.multiGrade = costService.getMultigradeDiscount(onlineGrades);
			order.online.discounts.periodic = 0.0;  //TODO: Figure this out
			if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativeOnline){
				order.onlline.discounts.special = $scope.formData.summary.discount.special.summativeOnline.discountPer;
			}

			order.online.totalDiscountPerStudent = 0.0;
			for(discountType in order.online.discounts){
				order.online.totalDiscountPerStudent += order.online.discounts[discountType];
			}			

			order.online.totalDiscount = order.online.totalDiscountPerStudent * order.online.total;

			order.online.finalPricePerStudent = order.online.price - order.online.totalDiscountPerStudent;
			order.online.balance = order.online.finalPricePerStudent * order.online.total;

			//paper portion
			order.paper.price = $scope.cost.pricing.summative.paper + ((order.individualReports ? (order.reportsPerStudent * $scope.cost.pricing.summative.isr + (order.scoreLabels ? $scope.cost.pricing.summative.labels : 0.0)) : 0.0));
			order.paper.extendedPrice = order.paper.price * order.paper.total;

			order.paper.discounts = {};
			order.paper.discounts.volume = costService.getVolumeDiscount(order.paper.total);
			order.paper.discounts.multiGrade = costService.getMultigradeDiscount(paperGrades);
			order.paper.discounts.periodic = 0.0;  //TODO: Figure this out
			if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativePaper){
				order.onlline.discounts.special = $scope.formData.summary.discount.special.summativePaper.discountPer;
			}

			order.paper.totalDiscountPerStudent = 0.0;
			for(discountType in order.paper.discounts){
				order.paper.totalDiscountPerStudent += order.paper.discounts[discountType];
			}			

			order.paper.totalDiscount = order.paper.totalDiscountPerStudent * order.paper.total;

			order.paper.finalPricePerStudent = order.paper.price - order.paper.totalDiscountPerStudent;
			order.paper.balance = order.paper.finalPricePerStudent * order.paper.total;
		});
	};

	$scope.$watch('formData.summative.orders', function(newValue, oldValue){
		$scope.updateSummativeOrders();		
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
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for your ACT Aspire Order\n\n';


			angular.forEach($scope.formData.summative.orders, function(order, key) {
				emailBody += order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Online\n';

				// costPerStudent = $scope.cost.pricing.summative.online + ((order.individualReports ? (order.reportsPerStudent * cost.pricing.summative.isr + (order.scoreLabels ? cost.pricing.summative.labels : 0.0)) : 0.0))) - ($scope.formData.summary.discount.volume.summativeOnline + $scope.formData.summary.discount.multiGrade.summativeOnline + $scope.formData.summary.discount.periodic.summativeOnline + $scope.formData.summary.discount.special.summativeOnline.discountPer))
				// totatlCost;
				var costPerStudent = $scope.cost.pricing.summative.online;
				var totalCost = order.onlineTotal * costPerStudent;

				emailBody += order.onlineTotal + ' students X ' + costPerStudent + ' per student = ' + totalCost;

			});

			angular.forEach($scope.formData.summative.orders, function(order, key) {

			});

			angular.forEach($scope.formData.periodic.orders, function(order, key) {

			});

			emailBody += '\n\nSincerely,\nYour ACT Aspire Team\nemail@email.email\nXXX-XXX-XXXX';

		return emailBody;
	};

	var url = '../../wp-json/wp/v2/sendEmail/';
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


