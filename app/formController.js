angular.module('myApp')// our controller for the form
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
			var order = { reportsPerStudent:1, scoreLabelsPerStudent: 1 };
			if(administrationWindow){
				order.subjects = {};
				angular.copy($scope.subjects, order.subjects);	
			}		
			
			if(orders.length > 0){ //copy in the last order
				var lastOrder = orders[orders.length - 1];
				angular.copy(lastOrder, order);
				order.preferredDate = ''
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

				var periodicOrder = {};
				angular.forEach($scope.orders.periodic.orders, function(periodic, periodicKey) {
					if((order.administrationWindow == 'Fall' && periodic.calendarYear == order.calendarYear) ||  (order.administrationWindow == 'Spring' && (parseInt(periodic.calendarYear) + 1) == order.calendarYear)){
						periodicOrder = periodic;
					}
				});

				var summativeForSamePeriodic = {online:{}, paper:{}};
				angular.forEach($scope.orders.summative.orders, function(otherSummative, periodicKey) {
					if((order.administrationWindow == 'Fall' && otherSummative.administrationWindow == 'Spring' && parseInt(order.calendarYear) == parseInt(otherSummative.calendarYear) - 1)
						|| (order.administrationWindow == 'Spring' && otherSummative.administrationWindow == 'Fall' && parseInt(order.calendarYear) == parseInt(otherSummative.calendarYear) + 1)){
						summativeForSamePeriodic = otherSummative;
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
						order.online.discounts.periodic = costService.getPeriodicDiscount(order.online.total, periodicOrder.onlineTotal, summativeForSamePeriodic.online.total);
						order.online.periodicNumberApplied = costService.getPeriodicNumberApplied(order.online.total, periodicOrder.onlineTotal, summativeForSamePeriodic.online.total);
					}
					if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
						order.online.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "summativeOnline", order.calendarYear, order.administrationWindow);
					}
					if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativeOnline){
						order.online.discounts.special = $scope.formData.summary.discount.special.summativeOnline.discountPer;
					}
				}

				order.online.price = order.cost.online
					+ (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0)
          + (order.scoreLabels ? (order.scoreLabelsPerStudent * order.cost.labels) : 0.0);
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
						order.paper.discounts.periodic = costService.getPeriodicDiscount(order.paper.total, periodicOrder.onlineTotal - (order.online.total + (summativeForSamePeriodic.online.total ? summativeForSamePeriodic.online.total : 0)), summativeForSamePeriodic.paper.total);
						order.paper.periodicNumberApplied = costService.getPeriodicNumberApplied(order.paper.total, periodicOrder.onlineTotal - (order.online.total + (summativeForSamePeriodic.online.total ? summativeForSamePeriodic.online.total : 0)), summativeForSamePeriodic.paper.total);
					}
					if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
						order.paper.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "summativePaper", order.calendarYear, order.administrationWindow);
					}
					if($scope.formData.summary.discount.special && $scope.formData.summary.discount.special.summativePaper){
						order.paper.discounts.special = $scope.formData.summary.discount.special.summativePaper.discountPer;
					}
				}

				order.paper.price = order.cost.paper
					+ (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0)
          + (order.scoreLabels ? (order.scoreLabelsPerStudent * order.cost.labels) : 0.0);
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
}]);