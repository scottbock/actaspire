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

		.state('form.confirmation', {
			url: '/confirmation',
			templateUrl: 'app/confirmation.html'
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
	$scope.subjects = {'Math' :true, 'Science':true, 'Reading':true, 'English':true, 'Writing':true};
	$scope.summative = {
		'administrationWindow' : '',
		'calendarYear' : ''
	};
	$scope.periodic = {		
		'schoolYear' : ''
	};

	$scope.saveDraft = function(){
		localStorage.setItem('formData', angular.toJson($scope.formData));
		localStorage.setItem('summative', angular.toJson($scope.orders.summative));
		localStorage.setItem('periodic', angular.toJson($scope.orders.periodic));
	};

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
	}

	$scope.updateTotals = function(){	
		$scope.formData.summary.total = 0.0;
		angular.forEach($scope.orders.summative.orders, function(order, key) {
			$scope.formData.summary.total += order.online.balance + order.paper.balance;
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

			if(administrationWindow){
				angular.forEach($scope.cost.pricing.summative, function(cost){
					if(cost.year == calendarYear && cost.semester == administrationWindow){
						order.cost = cost;
					}
				});
			}
			else{
				order.cost = $scope.cost.pricing.periodic[calendarYear];
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
		if($scope.cost.pricing){
			angular.forEach($scope.orders.periodic.orders, function(order, key) {
				var onlineTotal = 0;
				angular.forEach(order.grade, function(grade, key) {
					if(grade.online !== null && !isNaN(grade.online)){
						onlineTotal += parseInt(grade.online);
					}
				});
				order.onlineTotal = onlineTotal;		

				order.price = order.cost;
				order.extendedPrice = order.price * order.onlineTotal;

				//Discounts
				order.discounts = {};
				if($scope.formData.billing && $scope.formData.billing.address && $scope.formData.billing.address.state){
					order.discounts.state = costService.getStateDiscount($scope.formData.billing.address.state, "periodic", order.calendarYear);
				}
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
					if(grade.online !== null && !isNaN(grade.online)){
						onlineTotal += parseInt(grade.online);
						countGrade = true;
					}
					if(grade.paper !== null && !isNaN(grade.paper)){
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

				//Online portion
				order.online.price = order.cost.online + (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0) + (order.scoreLabels ? order.cost.labels : 0.0);
				order.online.extendedPrice = order.online.price * order.online.total;

				order.online.discounts = {};
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

				order.online.totalDiscountPerStudent = 0.0;
				for(discountType in order.online.discounts){
					order.online.totalDiscountPerStudent += order.online.discounts[discountType];
				}			

				order.online.totalDiscount = order.online.totalDiscountPerStudent * order.online.total;

				order.online.finalPricePerStudent = order.online.price - order.online.totalDiscountPerStudent;
				order.online.balance = order.online.finalPricePerStudent * order.online.total;

				//paper portion
				order.paper.price = order.cost.paper + (order.individualReports ? (order.reportsPerStudent * order.cost.isr) : 0.0) + (order.scoreLabels ? order.cost.labels : 0.0);
				order.paper.extendedPrice = order.paper.price * order.paper.total;

				order.paper.discounts = {};
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
		$scope.updateSummativeOrders();		
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

.factory('CostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/cost.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
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

	$http.get('json/coupons.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
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
		$http.get('json/couponUses.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
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

		//TODO: uncomment for tax exempt	
		// if(formData.billing.taxExempt){
		// 	emailBody += '\n\nTax Exempt: Y';
		// }	

		angular.forEach(orders.summative.orders, function(order, key) {
			if(order.online.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Online:';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += ' ' + subject;
					} 
				});
				if(order.individualReports){
					emailBody += '\nPrinted Individual Reports: ' + order.reportsPerStudent + ' Per Student';
				}
				if(order.scoreLabels){
					emailBody += '\nAdd Printed Score Labels: Y';
				}
				emailBody += '\n' + order.online.total + ' Students X ' + currencyFilter(order.online.finalPricePerStudent) + ' = ' + currencyFilter(order.online.balance);
			}
		});

		angular.forEach(orders.summative.orders, function(order, key) {
			if(order.paper.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Paper:';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += ' ' + subject;
					} 
				});	
				if(order.individualReports){
					emailBody += '\nPrinted Individual Reports: ' + order.reportsPerStudent + ' Per Student';
				}			
				if(order.scoreLabels){
					emailBody += '\nAdd Printed Score Labels: Y';
				}
				emailBody += '\n' + order.paper.total + ' Students X ' + currencyFilter(order.paper.finalPricePerStudent) + ' = ' + currencyFilter(order.paper.balance);
			}
		});

		angular.forEach(orders.periodic.orders, function(order, key) {
			if(order.onlineTotal){
				emailBody += '\n\n' + schoolYearFilter(order.calendarYear) + ' Periodic Order Online';
				emailBody += '\n' + order.onlineTotal + ' Students X ' + currencyFilter(order.finalPricePerStudent) + ' = ' + currencyFilter(order.balance);
			}
		});

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			emailBody += '\n\nDiscount Code: ' + formData.summary.discount.special.code;
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

		return fileContent += formData.comments + rowDelim;
	};

	var buildCsvFile = function(formData, orders, cost){
        var fileContent = 'NS Name,Internal ID,Date,line ,School / Customer,Grade,Quantity,Item,Test Administration,Test Admin Year,Test Mode,Item Rate,Amount,English,Mathematics,Reading,Science,Writing,Group Order,Group Creator Name,Name,Job Title,Contact email,Test Coordinator Name,Test Coordinator Email,Test Coordinator Phone,Backup Coordinator Name,Backup Coordinator Email,Backup Coordinator Phone,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,City,State,Zip,Terms And Conditions,Discount Code,Memo\n';

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
						+ 'ACT Aspire Printed Individual Student Reports' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
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
						+ 'ACT Aspire Printed Score Labels' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
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
						+ 'ACT Aspire Printed Individual Student Reports' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
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
						+ 'ACT Aspire Printed Score Labels' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
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
		$state.go('form.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildEmail(formData, orders);
		postData.csv = buildCsvFile(formData, orders, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date().getTime() + '.csv';
		postData.csvFileName = postData.csvFileName.replace(/[/\\\\]/g, '');;

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			$http.get('json/couponUses.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
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


