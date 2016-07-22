'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngCookies',
  'ui.bootstrap'
])
.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
    
        // route to show our basic form (/form)
        .state('form', {
            url: '/form',
            templateUrl: 'app/form.html'
        })
		
		.state('form.customer', {
			url: '/customer',
			templateUrl: 'app/form-customer.html',
            controller: 'formController'
		})

		.state('form.customer.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
		})

		.state('form.isr', {
			url: '/isr',
			templateUrl: 'app/form-isr.html',
			controller: 'isrController'
		})

		.state('form.isr.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
		})
        
    // catch all route
    // send users to the form page 
    $urlRouterProvider.otherwise('/form/customer');
})

// our controller for the form
// =============================================================================
.controller('formController', ['$scope', '$state', '$http', '$cookies', 'CostService', 'EmailService', 'schoolYearFilter', function($scope, $state, $http, $cookies, costService, emailService, schoolYearFilter) {

	$http.get('json/states.json').success(function(data) { 
    	$scope.states = data;
	});
	$scope.$state = $state;
	$scope.cost = costService.cost;

	$scope.date = new Date();
	$scope.subjects = {'Math' :true, 'Science':true, 'Reading':true, 'English':true, 'Writing':true};
	$scope.summative = {
		'administrationWindow' : '',
		'calendarYear' : ''
	};
	$scope.periodic = {		
		'schoolYear' : ''
	};

	/**
	//Save Draft
	$scope.saveDraft = function(){
		localStorage.setItem('formData', angular.toJson($scope.formData));
		localStorage.setItem('summative', angular.toJson($scope.orders.summative));
		localStorage.setItem('periodic', angular.toJson($scope.orders.periodic));
	};**/

	$scope.printPage = function(){
		window.print();
	}

	$scope.notZero = function(type) {
	  return function(order) { return order[type].total; }
	};

	// we will store all of our form data in this object
	$scope.formData = {
		customer: {},
		summary:{
			discount:{}
		}
	};
	$scope.orders = {
		summative: {
			orders: []
		},
		periodic: {
			orders: []
		}
	}

/*	//Load saved draft if available
	var cookieFormData = localStorage.getItem('formData');
	if(cookieFormData){
		$scope.formData = angular.fromJson(cookieFormData);
	}

	var summativeData = localStorage.getItem('summative');
	if(summativeData){
		$scope.orders.summative = angular.fromJson(summativeData);
	}

	var periodicData = localStorage.getItem('periodic');
	if(periodicData){
		$scope.orders.periodic = angular.fromJson(periodicData);
	}*/

	$scope.updateTotals = function(){	
		$scope.formData.summary.total = 0.0;
		angular.forEach($scope.orders.summative.orders, function(order, key) {
			$scope.formData.summary.total += order.online.balance + order.paper.balance;
			if(order.cost.lateFee){
				$scope.formData.summary.total += order.cost.lateFee;
			}
		});
		
		angular.forEach($scope.orders.periodic.orders, function(order, key) {
			$scope.formData.summary.total += order.balance;
		});

		$scope.formData.summary.tax = 0.0;

		//TODO: Uncomment this code when ready to include sales tax
		/*if($scope.formData.billing && !$scope.formData.billing.taxExempt && $scope.cost.salesTax){
			var taxRate = $scope.cost.salesTax[$scope.formData.billing.address.zip];
			if(taxRate){
				$scope.formData.summary.taxRate = taxRate;
				$scope.formData.summary.tax = taxRate * $scope.formData.summary.total;
				$scope.formData.summary.totalWithTax = $scope.formData.summary.tax + $scope.formData.summary.total;
			}
		}*/
	};

	var getCost = function(administrationWindow, calendarYear, pricing){
		var returnCost;
		if(administrationWindow){
			angular.forEach(pricing.summative, function(cost){
				if(cost.year.toString() == calendarYear.toString() && cost.semester == administrationWindow){
					returnCost = cost;
				}
			});
		}
		else{
			returnCost = pricing.periodic[calendarYear];
		}	

		return returnCost;
	};
	
	$scope.addOrder = function(orders, calendarYear){
		var semAndYear = calendarYear.split(" ");
		var administrationWindow;
		if(semAndYear.length == 2){
			calendarYear = semAndYear[1];
			administrationWindow = semAndYear[0];
		}
		var alreadyInList = false;
		angular.forEach(orders, function(order, key) {
			alreadyInList = alreadyInList || (order.administrationWindow == administrationWindow && order.calendarYear == calendarYear);
		});
		if(!alreadyInList){
			var order = { reportsPerStudent:1 };
			if(administrationWindow){
				order.subjects = {};
				angular.copy($scope.subjects, order.subjects);	
			}		
			
			if(orders.length > 0){ //copy in the last order
				var lastOrder = orders[orders.length - 1];
				angular.copy(lastOrder, order);
			}

			order.cost = getCost(administrationWindow, calendarYear, $scope.cost.pricing);	
			
			//set window and year
			order.administrationWindow = administrationWindow;
			order.calendarYear = calendarYear;
			
			orders.push(order);		
			
			$scope.summative.error = null;
			$scope.periodic.error = null;
		}
		else{
			if(administrationWindow){
				$scope.summative.error = 'You have already placed ' + administrationWindow + ' ' + calendarYear + ' into the cart. Please proceed to the bottom to check-out.';
			}
			else{
				$scope.periodic.error = 'You have already placed ' + schoolYearFilter(calendarYear) + ' into the cart. Please proceed to the bottom to check-out.';
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
		if($scope.cost.pricing){
			angular.forEach($scope.orders.periodic.orders, function(order, key) {
				var onlineTotal = 0;
				angular.forEach(order.grade, function(grade, key) {
					if(grade.online !== null && !isNaN(grade.online)){
						onlineTotal += parseInt(grade.online);
					}
				});
				order.onlineTotal = onlineTotal;		

				order.overrideCost = false;
				if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.override)
				{
					order.cost = $scope.formData.summary.discount.special.pricing.periodic;
					if($scope.orders.summative.orders != null && $scope.orders.summative.orders.length > 0 && $scope.formData.summary.discount.special.pricing.periodicWithSummative){
						order.cost = $scope.formData.summary.discount.special.pricing.periodicWithSummative;
					}
					order.overrideCost = true;
				}

				//Discounts
				order.discounts = {};	
				if(!order.overrideCost) {
					order.cost = getCost(order.administrationWindow, order.calendarYear, $scope.cost.pricing);
					if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
						order.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "periodic", order.calendarYear);
					}
					if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.periodic){
						order.discounts.special = $scope.formData.summary.discount.special.periodic.discountPer;
					}		
				}

				order.price = order.cost;
				order.extendedPrice = order.price * order.onlineTotal;

				order.totalDiscountPerStudent = 0.0;
				for(discountType in order.discounts){
					order.totalDiscountPerStudent += order.discounts[discountType];
				}	
				order.totalDiscount = order.totalDiscountPerStudent * order.onlineTotal;

				order.finalPricePerStudent = order.price - order.totalDiscountPerStudent;
				order.balance = order.finalPricePerStudent * order.onlineTotal;
			});

			$scope.updateSummativeOrders();
		}
	};
		
	$scope.updateSummativeOrders = function(){
		if($scope.cost.pricing){
			angular.forEach($scope.orders.summative.orders, function(order, key) {
				var onlineTotal = 0;
				var gradeCount = 0;
				var paperTotal = 0;
				angular.forEach(order.grade, function(grade, key) {
					var countGrade = false;
					if(grade.online !== null && !isNaN(grade.online) && grade.online > 0){
						onlineTotal += parseInt(grade.online);
						countGrade = true;
					}
					if(grade.paper !== null && !isNaN(grade.paper) && grade.paper > 0){
						paperTotal += parseInt(grade.paper);
						countGrade = true;
					}
					if(countGrade){
						gradeCount++;
					}
				});
				order.online = {};
				order.paper = {};
				order.online.total = onlineTotal;
				order.paper.total = paperTotal;	

				var periodicOrder;
				angular.forEach($scope.orders.periodic.orders, function(periodic, periodicKey) {
					if((order.administrationWindow == 'Fall' && periodic.calendarYear == order.calendarYear) ||  (order.administrationWindow == 'Spring' && (parseInt(periodic.calendarYear) + 1) == order.calendarYear)){
						periodicOrder = periodic;
					}
				});

				order.overrideCost = false;
				if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.override)
				{
					order.cost = {};
					angular.extend(order.cost, $scope.formData.summary.discount.special.pricing.summative);
					order.overrideCost = true;
				}

				//Online portion
				order.online.discounts = {};
				if(!order.overrideCost) {
					order.cost = getCost(order.administrationWindow, order.calendarYear, $scope.cost.pricing);
					order.online.discounts.volume = costService.getVolumeDiscount(order.online.total + order.paper.total);
					order.online.discounts.multiGrade = costService.getMultigradeDiscount(gradeCount);
					if(periodicOrder && periodicOrder.onlineTotal > 0){
						order.online.discounts.periodic = costService.getPeriodicDiscount(order.online.total, periodicOrder.onlineTotal);
						order.online.periodicNumberApplied = Math.min(order.online.total, periodicOrder.onlineTotal);
					}
					if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
						order.online.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "summativeOnline", order.calendarYear, order.administrationWindow);
					}
					if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativeOnline){
						order.online.discounts.special = $scope.formData.summary.discount.special.summativeOnline.discountPer;
					}
				}

				order.online.price = order.cost.online + (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0) + (order.scoreLabels ? order.cost.labels : 0.0);
				order.online.extendedPrice = order.online.price * order.online.total;

				order.online.totalDiscountPerStudent = 0.0;
				for(discountType in order.online.discounts){
					order.online.totalDiscountPerStudent += order.online.discounts[discountType];
				}			

				order.online.totalDiscount = order.online.totalDiscountPerStudent * order.online.total;

				order.online.finalPricePerStudent = order.online.price - order.online.totalDiscountPerStudent;
				order.online.balance = order.online.finalPricePerStudent * order.online.total;

				//paper portion
				order.paper.discounts = {};
				if(!order.overrideCost) {
					order.cost = getCost(order.administrationWindow, order.calendarYear, $scope.cost.pricing);
					order.paper.discounts.volume = costService.getVolumeDiscount(order.paper.total + order.online.total);
					order.paper.discounts.multiGrade = costService.getMultigradeDiscount(gradeCount);
					if(periodicOrder && periodicOrder.onlineTotal > order.online.total){
						//Only apply what's left after the online portion is disounted
						order.paper.discounts.periodic = costService.getPeriodicDiscount(order.paper.total, periodicOrder.onlineTotal - order.online.total);
						order.paper.periodicNumberApplied = Math.min(order.paper.total, periodicOrder.onlineTotal - order.online.total);
					}
					if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
						order.paper.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "summativePaper", order.calendarYear, order.administrationWindow);
					}
					if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativePaper){
						order.paper.discounts.special = $scope.formData.summary.discount.special.summativePaper.discountPer;
					}
				}

				order.paper.price = order.cost.paper + (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0) + (order.scoreLabels ? order.cost.labels : 0.0);
				order.paper.extendedPrice = order.paper.price * order.paper.total;

				order.paper.totalDiscountPerStudent = 0.0;
				for(discountType in order.paper.discounts){
					order.paper.totalDiscountPerStudent += order.paper.discounts[discountType];
				}			

				order.paper.totalDiscount = order.paper.totalDiscountPerStudent * order.paper.total;

				order.paper.finalPricePerStudent = order.paper.price - order.paper.totalDiscountPerStudent;
				order.paper.balance = order.paper.finalPricePerStudent * order.paper.total;
			});
			$scope.updateTotals();
		}
	};
	
	$scope.addDiscountCode = function(code){
		$scope.formData.summary.discount = {
			special: costService.getSpecialDiscount(code)
		};
		$scope.formData.summary.discount.special.code = code.toUpperCase();

		$scope.updatePeriodicOrders();
	}
    
	// function to process the form
	$scope.processForm = function() {
		emailService.sendConfirmationEmail($scope.formData, $scope.orders, $scope.cost);
	};   


	$scope.$watch('orders.summative.orders', function(newValue, oldValue){
		$scope.updatePeriodicOrders();		
	}, true);

	$scope.$watch('orders.periodic.orders', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);	
	//update the orders once the cost resolves
	$scope.$watch('cost', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);
	//update the orders when the state changes
	$scope.$watch('formData.billing.address.state', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);
	//TODO: uncomment when adding back sales tax
	//Update sales tax when billing zip or taxExempt status changes
	// $scope.$watchCollection('[formData.billing.taxExempt, formData.billing.address.zip]', function(newValue, oldValue){
	// 	$scope.updateTotals();
	// }, true); 
}])

.controller('trainingController', ['$scope', '$state', '$http', '$cookies', 'TrainingCostService', 'EmailService', 'schoolYearFilter', function($scope, $state, $http, $cookies, trainingCostService, emailService, schoolYearFilter) {
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

}])

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

}])

.factory('CostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/cost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    	cost.pricing = response.data.pricing;
		cost.discounts = response.data.discounts;
		cost.periodicCalendarYears = Object.keys(response.data.pricing.periodic);
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
	});

	//todo: uncomment this code when ready to include sales tax
	/*$http.get('json/salesTax.json').then(function(response) { 
    	cost.salesTax = response.data;
	});*/

	$http.get('json/coupons.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
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
		if(cost.discounts){
			discountAmount = cost.discounts.periodic.discountPer;
		}

		if(periodicAmount < summativeAmount){
			discountAmount = discountAmount * periodicAmount / summativeAmount
		}

		return discountAmount;
	};

	var getStateDiscount = function(state, type, year, semester){
		var discountAmount = 0;
		
		if(cost.discounts && cost.discounts.state && cost.discounts.state[state]){
			discountAmount = cost.discounts.state[state][type];
			if(semester){
				var limit = cost.discounts.state[state]['summativeLimit'];

				if(limit){
					var allowed = false;

					angular.forEach(limit, function(limited) {
						if(limited.year == year && limited.semester == semester){
							allowed = true;
						}
					});
					if(!allowed){
						discountAmount = 0;
					}
				}
			}
			else{
				var limit = cost.discounts.state[state]['periodicLimit'];
				if(limit && limit.indexOf(year) == -1){
					discountAmount = 0;
				}
			}
		}

		return discountAmount;
	};

	var checkMaxUses = function(couponCode, discountAmount){
		$http.get('json/couponUses.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    		var couponUses = response.data;
    		var upperCaseCouponCode = couponCode.toUpperCase();
    		if(couponUses[upperCaseCouponCode] && couponUses[upperCaseCouponCode].length >= discountAmount.maxUses){
				discountAmount.error = "Maximum uses exceeded for code " + couponCode.toUpperCase();
    		}
		});
	}

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
		else{
			if(discountAmount.maxUses != undefined){
				checkMaxUses(couponCode, discountAmount);
			}
		}
		return discountAmount;
	};

	return {
		'cost':cost,
		'getVolumeDiscount':getVolumeDiscount,
		'getMultigradeDiscount':getMultigradeDiscount,
		'getPeriodicDiscount':getPeriodicDiscount,
		'getSpecialDiscount':getSpecialDiscount,
		'getStateDiscount': getStateDiscount
	}
}])

.factory('TrainingCostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/trainingcost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    	cost.training = response.data.training;
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
	});

	return {
		'cost':cost
	}
}])

.factory('IsrCostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/isrCost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    	cost.reportGroups = response.data.reportGroups;
    	cost.currentSemester = response.data.currentSemester;
    	cost.currentYear = response.data.currentYear;
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
	});

	return {
		'cost':cost
	}
}])

.factory('EmailService', ['$http', 'currencyFilter', 'dateFilter', 'schoolYearFilter', '$state', '$cookies', function ($http, currencyFilter, dateFilter, schoolYearFilter, $state, $cookies) {

	var buildEmail = function(formData, orders){
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for your ACT Aspire Order' +
			'\n\nContact: ' + formData.customer.firstName + ' ' + formData.customer.lastName + ', ' + formData.customer.jobTitle + ', ' + formData.customer.organization +
			'\nEmail: ' + formData.customer.email;
		if(formData.customer.groupOrder){
			emailBody += '\n\nGroup Order: Y' + '\nGroup Contact Name: ' + formData.customer.groupContact;
		}
			
		emailBody += '\n\nTest Coordinator: ' + formData.implementationContact.name + ', ' + formData.implementationContact.email + ', ' + formData.implementationContact.phone;
		emailBody += '\n\nBackup Contact: ' + formData.backupContact.name + ', ' + formData.backupContact.email + ', ' + formData.backupContact.phone;

		emailBody += '\n\nBilling Contact: ' + formData.billingContact.name + ', ' + formData.billingContact.email + ', ' + formData.billingContact.phone;
		emailBody += '\n' + formData.billing.address.line1;
		if(formData.billing.address.line2){
			emailBody += '\n' + formData.billing.address.line2;
		}
		emailBody += '\n' + formData.billing.address.city + ', ' + formData.billing.address.state + ' ' + formData.billing.address.zip;

		if(formData.billing.purchaseOrderNumber){
			emailBody += '\nPurchase Order #: ' + formData.billing.purchaseOrderNumber;
		}

		//TODO: uncomment for tax exempt	
		// if(formData.billing.taxExempt){
		// 	emailBody += '\n\nTax Exempt: Y';
		// }	

		angular.forEach(orders.summative.orders, function(order, key) {
			if(order.online.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Online (';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += subject + ', ';
					} 
				});
				emailBody = emailBody.substring(0, emailBody.length - 2);

				emailBody += ')\n' + currencyFilter(order.cost.online) + '\t\tList Price';
				if(order.individualReports){
					emailBody += '\n' + currencyFilter(order.reportsPerStudent * order.cost.isr) + '\t\tPrinted Individual Reports';
				}
				if(order.scoreLabels){
					emailBody += '\n' + currencyFilter(order.cost.labels) + '\t\tPrinted Score Labels';
				}
				if(order.online.discounts.volume){
					emailBody += '\n(' + currencyFilter(order.online.discounts.volume) + ')\t\tDiscount - Volume';
				}
				if(order.online.discounts.multiGrade){
					emailBody += '\n(' + currencyFilter(order.online.discounts.multiGrade) + ')\t\tDiscount - 4 or more Grades';
				}
				if(order.online.discounts.periodic){
					emailBody += '\n(' + currencyFilter(order.online.discounts.periodic) + ')\t\tDiscount - Bundle';
				}
				if(order.online.discounts.state){
					emailBody += '\n(' + currencyFilter(order.online.discounts.state) + ')\t\tDiscount - State';
				}
				if(order.online.discounts.special){
					emailBody += '\n(' + currencyFilter(order.online.discounts.special) + ')\t\tDiscount - Coupon Code';
				}
				emailBody += '\n----------\n' + currencyFilter(order.online.finalPricePerStudent) + '\t\tEffective Price';
				emailBody += '\n----------\n' + currencyFilter(order.online.balance) + '\t\tTotal (' + currencyFilter(order.online.finalPricePerStudent) + ' X ' + order.online.total + ' Students)\n';
				if(order.cost.lateFee){
					emailBody += currencyFilter(order.cost.lateFee) + ' Late Fee\n';
				}
				emailBody += '==========';

			}
		});

		angular.forEach(orders.summative.orders, function(order, key) {
			if(order.paper.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Paper (';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += subject + ', ';
					} 
				});
				emailBody = emailBody.substring(0, emailBody.length - 2);

				emailBody += ')\n' + currencyFilter(order.cost.paper) + '\t\tList Price';
				if(order.individualReports){
					emailBody += '\n' + currencyFilter(order.reportsPerStudent * order.cost.isr) + '\t\tPrinted Individual Reports';
				}
				if(order.scoreLabels){
					emailBody += '\n' + currencyFilter(order.cost.labels) + '\t\tPrinted Score Labels';
				}
				if(order.paper.discounts.volume){
					emailBody += '\n(' + currencyFilter(order.paper.discounts.volume) + ')\t\tDiscount - Volume';
				}
				if(order.paper.discounts.multiGrade){
					emailBody += '\n(' + currencyFilter(order.paper.discounts.multiGrade) + ')\t\tDiscount - 4 or more Grades';
				}
				if(order.paper.discounts.periodic){
					emailBody += '\n(' + currencyFilter(order.paper.discounts.periodic) + ')\t\tDiscount - Bundle';
				}
				if(order.paper.discounts.state){
					emailBody += '\n(' + currencyFilter(order.paper.discounts.state) + ')\t\tDiscount - State';
				}
				if(order.paper.discounts.special){
					emailBody += '\n(' + currencyFilter(order.paper.discounts.special) + ')\t\tDiscount - Coupon Code';
				}
				emailBody += '\n----------\n' + currencyFilter(order.paper.finalPricePerStudent) + '\t\tEffective Price';
				emailBody += '\n----------\n' + currencyFilter(order.paper.balance) + '\t\tTotal (' + currencyFilter(order.paper.finalPricePerStudent) + ' X ' + order.paper.total + ' Students)\n==========';

			}
		});

		angular.forEach(orders.periodic.orders, function(order, key) {
			if(order.onlineTotal){
				emailBody += '\n\n' + schoolYearFilter(order.calendarYear) + ' Periodic Order Online';

				emailBody += '\n' + currencyFilter(order.price) + '\t\tList Price';
				if(order.discounts.state){
					emailBody += '\n(' + currencyFilter(order.discounts.state) + ')\t\tDiscount - State';
				}
				if(order.discounts.special){
					emailBody += '\n(' + currencyFilter(order.discounts.special) + ')\t\tDiscount - Coupon Code';
				}
				emailBody += '\n----------\n' + currencyFilter(order.finalPricePerStudent) + '\t\tEffective Price';
				emailBody += '\n----------\n' + currencyFilter(order.balance) + '\t\tTotal (' + currencyFilter(order.finalPricePerStudent) + ' X ' + order.onlineTotal + ' Students)\n==========';
			}
		});

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			emailBody += '\n\nCoupon Code: ' + formData.summary.discount.special.code;
		}
		
		emailBody += '\n\nTotal: ' + currencyFilter(formData.summary.total);
		if(formData.summary.tax){
			emailBody += ' + ' + currencyFilter(formData.summary.tax) + ' (' + formData.summary.taxRate + ' Sales Tax) = ' + currencyFilter(formData.summary.totalWithTax);
		}

		if(formData.comments){
			emailBody += '\n\nAdditional Comments:\n' + formData.comments;
		}

		emailBody += '\n\nI agree to ACT Aspire\'s Terms and Conditions: Y' + '\n\nSignature: ' + formData.customer.signature;

		emailBody += '\n\nSincerely,\nYour ACT Aspire Team\nOrders@actaspire.org\n1-855-730-0400';

		return emailBody;
	};

	var yesNo = function(bool){
		if(bool){
			return 'Yes';
		}
		return 'No';
	};

	var colDelim = '","'
        ,rowDelim = '"\r\n'
        ,today = dateFilter(new Date(), 'MM/dd/yy');

	var writeCommonData = function(formData){
		var fileContent = yesNo(formData.customer.groupOrder) + colDelim;
		if(formData.customer.groupOrder){
			fileContent += formData.customer.groupContact + colDelim;
		}
		else{
			fileContent += colDelim;
		}
		fileContent += formData.customer.firstName + ' ' + formData.customer.lastName + colDelim
			+ formData.customer.jobTitle + colDelim
			+ formData.customer.email + colDelim
			+ formData.implementationContact.name + colDelim
			+ formData.implementationContact.email + colDelim
			+ formData.implementationContact.phone + colDelim
			+ formData.backupContact.name + colDelim
			+ formData.backupContact.email + colDelim
			+ formData.backupContact.phone + colDelim
			+ formData.billingContact.name + colDelim
			+ formData.billingContact.email + colDelim
			+ formData.billingContact.phone + colDelim
			+ formData.billing.address.line1 + colDelim;

		if(formData.billing.address.line2){
			fileContent += formData.billing.address.line2 + colDelim
		}
		else{
			fileContent += colDelim;
		}
		if(formData.billing.purchaseOrderNumber){
			fileContent += formData.billing.purchaseOrderNumber + colDelim
		}
		else{
			fileContent += colDelim;
		}

		fileContent +=	formData.billing.address.city + colDelim
			+ formData.billing.address.state + colDelim
			+ formData.billing.address.zip + colDelim
			+ yesNo(formData.acceptTerms) + colDelim;
			// + yesNo(formData.billing.taxExempt) + colDelim;

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			fileContent += formData.summary.discount.special.code + colDelim;
		}
		else {
			fileContent += colDelim;
		}

		return fileContent += (formData.comments || '') + rowDelim;
	};

	var revRecDate = function(year, administrationWindow)
	{
		if('Spring' == administrationWindow) {
			return '1/1/' + year;
		}
		else {
			return '7/1/' + year;
		}
	}

	var buildCsvFile = function(formData, orders, cost){
        var fileContent = 'NS Name,Internal ID,Date,line ,School / Customer,Grade,Quantity,Item,Test Administration,Test Admin Year,Test Mode,Rev Rec,Rev Rec Date,Item Rate,Amount,English,Mathematics,Reading,Science,Writing,Group Order,Group Creator Name,Name,Job Title,Contact email,Test Coordinator Name,Test Coordinator Email,Test Coordinator Phone,Backup Coordinator Name,Backup Coordinator Email,Backup Coordinator Phone,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,Purchase Order #,City,State,Zip,Terms And Conditions,Discount Code,Memo\n';

        angular.forEach(orders.summative.orders, function(order, key) {
        	if(order.online.total){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					if(grade.online){
						fileContent += ',,"' + today + colDelim 
							+ (index++) + colDelim
							+ formData.customer.organization + colDelim
							+ gradeKey + colDelim
							+ grade.online + colDelim
							+ 'Summative Test' + colDelim
							+ order.administrationWindow + colDelim
							+ order.calendarYear + colDelim
							+ 'Online' + colDelim
							+ 'Summative Test Rev Rec Template' + colDelim
							+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
							+ (order.cost.online - order.online.totalDiscountPerStudent) + colDelim
							+ ((order.cost.online - order.online.totalDiscountPerStudent) * grade.online) + colDelim
							+ yesNo(order.subjects.English) + colDelim
							+ yesNo(order.subjects.Math) + colDelim
							+ yesNo(order.subjects.Reading) + colDelim
							+ yesNo(order.subjects.Science) + colDelim
							+ yesNo(order.subjects.Writing) + colDelim
							+ writeCommonData(formData);
					}
				});

				//ISR
				if(order.individualReports){
					fileContent += ',,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.online.total * order.reportsPerStudent) + colDelim
						+ 'Individual Score Reports 1x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
						+ (order.cost.isr) + colDelim
						+ ((order.cost.isr) * order.online.total * order.reportsPerStudent) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Math) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);
				}

				//Score Label
				if(order.scoreLabels){
					fileContent += ',,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.online.total) + colDelim
						+ 'Score Labels 1x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
						+ (order.cost.labels) + colDelim
						+ ((order.cost.labels) * order.online.total) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Math) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);					
				}

			}
		});

		angular.forEach(orders.summative.orders, function(order, key) {
			if(order.paper.total){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					if(grade.paper){
						fileContent += ',,"' + today + colDelim 
							+ (index++) + colDelim
							+ formData.customer.organization + colDelim
							+ gradeKey + colDelim
							+ grade.paper + colDelim
							+ 'Summative Test' + colDelim
							+ order.administrationWindow + colDelim
							+ order.calendarYear + colDelim
							+ 'Paper' + colDelim
							+ 'Summative Test Rev Rec Template' + colDelim
							+ revRecDate(order.calendarYear, order.administrationWindow)+ colDelim
							+ (order.cost.paper - order.paper.totalDiscountPerStudent) + colDelim
							+ ((order.cost.paper - order.paper.totalDiscountPerStudent) * grade.paper) + colDelim
							+ yesNo(order.subjects.English) + colDelim
							+ yesNo(order.subjects.Math) + colDelim
							+ yesNo(order.subjects.Reading) + colDelim
							+ yesNo(order.subjects.Science) + colDelim
							+ yesNo(order.subjects.Writing) + colDelim
							+ writeCommonData(formData);
					}	
				});

				
				//ISR
				if(order.individualReports){
					fileContent += ',,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.paper.total * order.reportsPerStudent) + colDelim
						+ 'Individual Score Reports 1x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim	
						+ (order.cost.isr) + colDelim
						+ ((order.cost.isr) * order.paper.total * order.reportsPerStudent) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Math) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);
				}

				//Score Label
				if(order.scoreLabels){
					fileContent += ',,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.paper.total) + colDelim
						+ 'Score Labels 1x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
						+ (order.cost.labels) + colDelim
						+ ((order.cost.labels) * order.paper.total) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Math) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);					
				}
			}
		});

		angular.forEach(orders.periodic.orders, function(order, key) {
			if(order.onlineTotal){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					if(grade.online){
						fileContent += ',,"' + today + colDelim 
							+ (index++) + colDelim
							+ formData.customer.organization + colDelim
							+ gradeKey + colDelim
							+ grade.online + colDelim
							+ 'Periodic' + colDelim
							+ 'School Year' + colDelim
							+ schoolYearFilter(order.calendarYear) + colDelim
							+ 'Online' + colDelim
							+ 'Periodic Test Rev Rec Template' + colDelim
							+ revRecDate(order.calendarYear)+ colDelim
							+ (order.cost - order.totalDiscountPerStudent) + colDelim
							+ ((order.cost - order.totalDiscountPerStudent) * grade.online) + colDelim
							+ yesNo(true) + colDelim
							+ yesNo(true) + colDelim
							+ yesNo(true) + colDelim
							+ yesNo(true) + colDelim
							+ yesNo(true) + colDelim
							+ writeCommonData(formData);
					}
				});
			}
		});

		//Late Fee
		angular.forEach(orders.summative.orders, function(order, key) {
        	if(order.cost.lateFee){
				fileContent += ',,"' + today + colDelim 
					+ 0 + colDelim
					+ formData.customer.organization + colDelim
					+ 0 + colDelim
					+ 1 + colDelim
					+ 'Late Fee' + colDelim
					+ order.administrationWindow + colDelim
					+ order.calendarYear + colDelim + colDelim + colDelim + colDelim
					+ order.cost.lateFee + colDelim
					+ order.cost.lateFee + colDelim
					+ yesNo(true) + colDelim
					+ yesNo(true) + colDelim
					+ yesNo(true) + colDelim
					+ yesNo(true) + colDelim
					+ yesNo(true) + colDelim
					+ writeCommonData(formData);
			}
		});

		return fileContent;
		
	};

	var url = '../../wp-json/wp/v2/sendEmail/';

	var postConfirmationEmail = function(postData, formData){
		$http.post(url, postData, {}).then(
			function(){
				formData.submitComplete = true;
				formData.submitSuccess = true;
				localStorage.removeItem('formData');
				localStorage.removeItem('summative');
				localStorage.removeItem('periodic');
			}, 
			function(){
				formData.submitComplete = true;
				formData.submitSuccess = false;
			}
		);
	}
	var sendConfirmationEmail = function(formData, orders, cost){
		$state.go('form.customer.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildEmail(formData, orders);
		postData.csv = buildCsvFile(formData, orders, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date().getTime() + '.csv';
		postData.csvFileName = postData.csvFileName.replace(/[/\\\\]/g, '');;

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			$http.get('json/couponUses.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
	    		var couponUses = response.data;
	    		if(!couponUses){
	    			couponUses = {};
	    		}
	    		if(!couponUses[formData.summary.discount.special.code]){
					couponUses[formData.summary.discount.special.code] = new Array();
	    		}
				couponUses[formData.summary.discount.special.code].push(formData.customer.firstName + ' ' + formData.customer.lastName + ', ' + formData.customer.jobTitle + ', ' + formData.customer.organization);

				postData.couponUses = angular.toJson(couponUses, true);
				postConfirmationEmail(postData, formData);
			});
		}
		else{
			postConfirmationEmail(postData, formData);
		}
	};

	var buildTrainingEmail = function(formData, trainingOrders){
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for your ACT Aspire Order' +
			'\n\nContact: ' + formData.customer.firstName + ' ' + formData.customer.lastName + ', ' + formData.customer.jobTitle + ', ' + formData.customer.organization +
			'\nEmail: ' + formData.customer.email;

		emailBody += '\n\nBilling Contact: ' + formData.billingContact.name + ', ' + formData.billingContact.email + ', ' + formData.billingContact.phone;
		emailBody += '\n' + formData.billing.address.line1;
		if(formData.billing.address.line2){
			emailBody += '\n' + formData.billing.address.line2;
		}
		emailBody += '\n' + formData.billing.address.city + ', ' + formData.billing.address.state + ' ' + formData.billing.address.zip;

		angular.forEach(trainingOrders, function(training, key) {
			emailBody += '\n\n' + training.mode + ': ' + training.title;
			emailBody += '\n' + training.quantity + ' X ' + currencyFilter(training.cost) + ' = ' + currencyFilter(training.quantity * training.cost);
		});
		
		emailBody += '\n\nTotal: ' + currencyFilter(formData.total);

		emailBody += '\n\nI agree to ACT Aspire\'s Terms and Conditions: Y' + '\n\nSignature: ' + formData.customer.signature;

		emailBody += '\n\nSincerely,\nYour ACT Aspire Team\nOrders@actaspire.org\n1-855-730-0400';

		return emailBody;
	};

	var buildTrainingCsvFile = function(formData, trainingOrders, cost){
		var fileContent = 'NS Name,Internal ID,Date,line,School / Customer,Training Description,Length (hours),Mode,Capacity,Preferred Date,Preferred Year,Preferred Time,Price,Quantity,Total\n';

		var index = 0;
        angular.forEach(trainingOrders, function(training, key) {

			fileContent += ',,"' + today + colDelim 
				+ (index++) + colDelim
				+ formData.customer.organization + colDelim
				+ training.title + colDelim
				+ training.duration + colDelim
				+ training.mode + colDelim
				+ (training.maxParticipants * training.quantity) + colDelim
				+ (training.preferredDate.getMonth() + 1) + ' - ' + training.preferredDate.getDate() + colDelim
				+ training.preferredDate.getFullYear() + colDelim
				+ training.preferredTime + colDelim
				+ currencyFilter(training.cost) + colDelim
				+ training.quantity + colDelim
				+ currencyFilter(training.cost * training.quantity) + rowDelim;

				// + writeCommonData(formData);
		});

		return fileContent;
	}

	var sendTrainingConfirmationEmail = function(formData, trainingOrders, cost){
		$state.go('form.training.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildTrainingEmail(formData, trainingOrders);
		postData.csv = buildTrainingCsvFile(formData, trainingOrders, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date().getTime() + '.csv';
		postData.csvFileName = postData.csvFileName.replace(/[/\\\\]/g, '');;

		postConfirmationEmail(postData, formData);
	};	

	var buildIsrEmail = function(formData, reportGroups){
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for your ACT Aspire Order' +
			'\n\nContact: ' + formData.customer.firstName + ' ' + formData.customer.lastName + ', ' + formData.customer.jobTitle + ', ' + formData.customer.organization +
			'\nEmail: ' + formData.customer.email;

		emailBody += '\n\nBilling Contact: ' + formData.billingContact.name + ', ' + formData.billingContact.email + ', ' + formData.billingContact.phone;
		emailBody += '\n' + formData.billing.address.line1;
		if(formData.billing.address.line2){
			emailBody += '\n' + formData.billing.address.line2;
		}
		emailBody += '\n' + formData.billing.address.city + ', ' + formData.billing.address.state + ' ' + formData.billing.address.zip;

		angular.forEach(reportGroups, function(reportGroup, key) {
			angular.forEach(reportGroup.reports, function(report, key){
				if(report.amount){
					emailBody += '\n\n' + reportGroup.name + ' ' + report.number + 'x';
					emailBody += '\n' + report.amount + ' X ' + currencyFilter(report.cost) + ' = ' + currencyFilter(report.amount * report.cost);	
				}
			});
		});
		
		emailBody += '\n\nTotal: ' + currencyFilter(formData.total);

		emailBody += '\n\nI agree to ACT Aspire\'s Terms and Conditions: Y' + '\n\nSignature: ' + formData.customer.signature;

		emailBody += '\n\nSincerely,\nYour ACT Aspire Team\nOrders@actaspire.org\n1-855-730-0400';

		return emailBody;
	};

	var buildIsrCsvFile = function(formData, cost){
		var fileContent = 'NS Name,Internal ID,Grade,Date,line,School / Customer,Report Description,Price,Quantity,Total,Special Notes,Rev Rec,Rev Rec Date,Name,Job Title,Contact email,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,City,State,Zip,Terms And Conditions\n';

		var index = 0;
        angular.forEach(cost.reportGroups, function(reportGroup, key) {
        	angular.forEach(reportGroup.reports, function(report, key) {
        		if(report.amount){
					fileContent += ',,0,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ reportGroup.name + ' ' + report.number + 'x' + colDelim
						+ currencyFilter(report.cost) + colDelim
						+ report.amount + colDelim
						+ currencyFilter(report.cost * report.amount ) + colDelim
						+ formData.comments + colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(cost.currentYear, cost.currentSemester) + colDelim
						+ formData.customer.firstName + ' ' + formData.customer.lastName + colDelim
						+ formData.customer.jobTitle + colDelim
						+ formData.customer.email + colDelim
						+ formData.billingContact.name + colDelim
						+ formData.billingContact.email + colDelim
						+ formData.billingContact.phone + colDelim
						+ formData.billing.address.line1 + colDelim;

					if(formData.billing.address.line2){
						fileContent += formData.billing.address.line2 + colDelim
					}
					else{
						fileContent += colDelim;
					}

					fileContent +=	formData.billing.address.city + colDelim
						+ formData.billing.address.state + colDelim
						+ formData.billing.address.zip + colDelim
						+ yesNo(formData.acceptTerms) + rowDelim;
						// + yesNo(formData.billing.taxExempt) + colDelim;
				}	
			});

		});

		return fileContent;
	}

	var sendIsrConfirmationEmail = function(formData, cost){
		$state.go('form.isr.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildIsrEmail(formData, cost.reportGroups);
		postData.csv = buildIsrCsvFile(formData, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date().getTime() + '.csv';
		postData.csvFileName = postData.csvFileName.replace(/[/\\\\]/g, '');;

		postConfirmationEmail(postData, formData);
	};	

	return {
		'sendConfirmationEmail':sendConfirmationEmail,
		'sendTrainingConfirmationEmail': sendTrainingConfirmationEmail,
		'sendIsrConfirmationEmail': sendIsrConfirmationEmail
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


