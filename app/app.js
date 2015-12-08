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
		$cookies.put('formData', angular.toJson($scope.formData));
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
			discount:{}
		}
	};

	var cookieFormData = $cookies.get('formData');
	if(cookieFormData){
		$scope.formData = angular.fromJson(cookieFormData);
	}

	$scope.updateTotals = function(){	
		$scope.formData.summary.total = 0.0;
		angular.forEach($scope.formData.summative.orders, function(order, key) {
			$scope.formData.summary.total += order.online.balance + order.paper.balance;
		});
		
		angular.forEach($scope.formData.periodic.orders, function(order, key) {
			$scope.formData.summary.total += order.balance;
		});

		$scope.formData.summary.tax = 0.0;
		if($scope.formData.billing && !$scope.formData.billing.taxExempt && $scope.cost.salesTax){
			var taxRate = $scope.cost.salesTax[$scope.formData.billing.address.zip];
			if(taxRate){
				$scope.formData.summary.taxRate = taxRate;
				$scope.formData.summary.tax = taxRate * $scope.formData.summary.total;
				$scope.formData.summary.totalWithTax = $scope.formData.summary.tax + $scope.formData.summary.total;
			}
		}
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
		if($scope.cost.pricing){
			angular.forEach($scope.formData.periodic.orders, function(order, key) {
				var onlineTotal = 0;
				angular.forEach(order.grade, function(grade, key) {
					if(grade.online !== null && !isNaN(grade.online)){
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
		}
	};
		
	$scope.updateSummativeOrders = function(){
		if($scope.cost.pricing){
			angular.forEach($scope.formData.summative.orders, function(order, key) {
				var onlineTotal = 0;
				var onlineGrades = 0;
				var paperTotal = 0;
				var paperGrades = 0;
				angular.forEach(order.grade, function(grade, key) {
					if(grade.online !== null && !isNaN(grade.online)){
						onlineTotal += parseInt(grade.online);
						onlineGrades ++;
					}
					if(grade.paper !== null && !isNaN(grade.paper)){
						paperTotal += parseInt(grade.paper);
						paperGrades ++;
					}
				});
				order.online = {};
				order.paper = {};
				order.online.total = onlineTotal;
				order.paper.total = paperTotal;	

				var periodicOrder;
				angular.forEach($scope.formData.periodic.orders, function(periodic, periodicKey) {
					if((order.administrationWindow == 'Fall' && periodic.calendarYear.indexOf(order.calendarYear) == 0) ||  (order.administrationWindow == 'Spring' && periodic.calendarYear.indexOf(order.calendarYear) == 7)){
						periodicOrder = periodic;
					}
				});

				//Online portion
				order.online.price = $scope.cost.pricing.summative.online + ((order.individualReports ? (order.reportsPerStudent * $scope.cost.pricing.summative.isr + (order.scoreLabels ? $scope.cost.pricing.summative.labels : 0.0)) : 0.0));
				order.online.extendedPrice = order.online.price * order.online.total;

				order.online.discounts = {};
				order.online.discounts.volume = costService.getVolumeDiscount(order.online.total);
				order.online.discounts.multiGrade = costService.getMultigradeDiscount(onlineGrades);
				if(periodicOrder && periodicOrder.onlineTotal > 0){
					order.online.discounts.periodic = costService.getPeriodicDiscount(order.online.total, periodicOrder.onlineTotal);
					order.online.periodicNumberApplied = Math.min(order.online.total, periodicOrder.onlineTotal);
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
				order.paper.price = $scope.cost.pricing.summative.paper + ((order.individualReports ? (order.reportsPerStudent * $scope.cost.pricing.summative.isr + (order.scoreLabels ? $scope.cost.pricing.summative.labels : 0.0)) : 0.0));
				order.paper.extendedPrice = order.paper.price * order.paper.total;

				order.paper.discounts = {};
				order.paper.discounts.volume = costService.getVolumeDiscount(order.paper.total);
				order.paper.discounts.multiGrade = costService.getMultigradeDiscount(paperGrades);
				if(periodicOrder && periodicOrder.onlineTotal > order.online.total){
					//Only apply what's left after the online portion is disounted
					order.paper.discounts.periodic = costService.getPeriodicDiscount(order.paper.total, periodicOrder.onlineTotal - order.online.total);
					order.paper.periodicNumberApplied = Math.min(order.paper.total, periodicOrder.onlineTotal - order.online.total);
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
		emailService.sendConfirmationEmail($scope.formData, $scope.cost);
	};   


	$scope.$watch('formData.summative.orders', function(newValue, oldValue){
		$scope.updateSummativeOrders();		
	}, true);

	$scope.$watch('formData.periodic.orders', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);	
	//update the orders once the cost resolves
	$scope.$watch('cost', function(newValue, oldValue){
		$scope.updatePeriodicOrders();
	}, true);

	//Update sales tax when billing zip or taxExempt status changes
	$scope.$watchCollection('[formData.billing.taxExempt, formData.billing.address.zip]', function(newValue, oldValue){
		$scope.updateTotals();
	}, true); 
}])

.factory('CostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/cost.json').then(function(response) { 
    	cost.pricing = response.data.pricing;
		cost.discounts = response.data.discounts;
	});

	$http.get('json/salesTax.json').then(function(response) { 
    	cost.salesTax = response.data;
	});

	$http.get('json/coupons.json').then(function(response) { 
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
		'getSpecialDiscount':getSpecialDiscount
	}
}])

.factory('EmailService', ['$http', 'currencyFilter', 'dateFilter', function ($http, currencyFilter, dateFilter) {
	var buildEmail = function(formData){
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
	
		if(formData.billing.taxExempt){
			emailBody += '\n\nTax Exempt: Y';
		}	

		angular.forEach(formData.summative.orders, function(order, key) {
			if(order.online.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Online:';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += ' ' + subject;
					} 
				});
				if(order.individualReports){
					emailBody += '\nPrinted Individual Reports: ' + order.reportsPerStudent + ' Per Student';
					if(order.scoreLabels){
						emailBody += '\nAdd Printed Score Labels: Y';
					}
				}
				emailBody += '\n' + order.online.total + ' Students X ' + currencyFilter(order.online.finalPricePerStudent) + ' = ' + currencyFilter(order.online.balance);
			}
		});

		angular.forEach(formData.summative.orders, function(order, key) {
			if(order.paper.total){
				emailBody += '\n\n' + order.administrationWindow + ' ' + order.calendarYear + ' Summative Order Paper:';
				angular.forEach(order.subjects, function(checked, subject){
					if(checked){
						emailBody += ' ' + subject;
					} 
				});	
				if(order.individualReports){
					emailBody += '\nPrinted Individual Reports: ' + order.reportsPerStudent + ' Per Student';
					if(order.scoreLabels){
						emailBody += '\nAdd Printed Score Labels: Y';
					}
				}			
				emailBody += '\n' + order.paper.total + ' Students X ' + currencyFilter(order.paper.finalPricePerStudent) + ' = ' + currencyFilter(order.paper.balance);
			}
		});

		angular.forEach(formData.periodic.orders, function(order, key) {
			if(order.onlineTotal){
				emailBody += '\n\n' + order.calendarYear + ' Periodic Order Online';
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
			+ formData.billing.address.line1 + colDelim
			+ formData.billing.address.line2 + colDelim
			+ formData.billing.address.city + colDelim
			+ formData.billing.address.state + colDelim
			+ formData.billing.address.zip + colDelim
			+ yesNo(formData.billing.taxExempt) + rowDelim;

		return fileContent;
	};

	var buildCsvFile = function(formData, cost){
        var fileContent = ',PID,Internal ID,Date,line ,School / Customer,Grade,Quantity,Item,Test Administration,Test Admin Year,Test Mode,Item Rate,Amount,English,Mathematics,Reading,Science,Writing,Group Order,Group Creator Name,Name,Job Title,Contact email,Test Coordinator Name,Test Coordinator Email,Test Coordinator Phone,Backup Coordinator Name,Backup Coordinator Email,Backup Coordinator Phone,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,City,State,Zip,Tax Exempt\n';

        angular.forEach(formData.summative.orders, function(order, key) {
        	if(order.online.total){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					fileContent += ',,,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ gradeKey + colDelim
						+ grade.online + colDelim
						+ 'Summative Test' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
						+ (cost.pricing.summative.online - order.online.totalDiscountPerStudent) + colDelim
						+ ((cost.pricing.summative.online - order.online.totalDiscountPerStudent) * grade.online) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Mathematics) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);
				});

				if(order.individualReports){
					//Score Label
					fileContent += ',,,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.online.total * order.reportsPerStudent) + colDelim
						+ 'Score Label' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
						+ (cost.pricing.summative.isr) + colDelim
						+ ((cost.pricing.summative.isr) * order.online.total * order.reportsPerStudent) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Mathematics) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);

					//Printed
					if(order.reportsPerStudent){
						fileContent += ',,,"' + today + colDelim 
							+ (index++) + colDelim
							+ formData.customer.organization + colDelim
							+ '0' + colDelim
							+ (order.online.total) + colDelim
							+ 'Printed ISR' + colDelim
							+ order.administrationWindow + colDelim
							+ order.calendarYear + colDelim
							+ 'Online' + colDelim
							+ (cost.pricing.summative.labels) + colDelim
							+ ((cost.pricing.summative.labels) * order.online.total) + colDelim
							+ yesNo(order.subjects.English) + colDelim
							+ yesNo(order.subjects.Mathematics) + colDelim
							+ yesNo(order.subjects.Reading) + colDelim
							+ yesNo(order.subjects.Science) + colDelim
							+ yesNo(order.subjects.Writing) + colDelim
							+ writeCommonData(formData);
					}
					order.scoreLabels
				}
			}
		});

		angular.forEach(formData.summative.orders, function(order, key) {
			if(order.paper.total){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					fileContent += ',,,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ gradeKey + colDelim
						+ grade.paper + colDelim
						+ 'Summative Test' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
						+ (cost.pricing.summative.paper - order.paper.totalDiscountPerStudent) + colDelim
						+ ((cost.pricing.summative.paper - order.paper.totalDiscountPerStudent) * grade.paper) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Mathematics) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);
				});

				if(order.individualReports){
					//Score Label
					fileContent += ',,,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ '0' + colDelim
						+ (order.paper.total * order.reportsPerStudent) + colDelim
						+ 'Score Label' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'Paper' + colDelim
						+ (cost.pricing.summative.isr) + colDelim
						+ ((cost.pricing.summative.isr) * order.paper.total * order.reportsPerStudent) + colDelim
						+ yesNo(order.subjects.English) + colDelim
						+ yesNo(order.subjects.Mathematics) + colDelim
						+ yesNo(order.subjects.Reading) + colDelim
						+ yesNo(order.subjects.Science) + colDelim
						+ yesNo(order.subjects.Writing) + colDelim
						+ writeCommonData(formData);

					//Printed
					if(order.reportsPerStudent){
						fileContent += ',,,"' + today + colDelim 
							+ (index++) + colDelim
							+ formData.customer.organization + colDelim
							+ '0' + colDelim
							+ (order.paper.total) + colDelim
							+ 'Printed ISR' + colDelim
							+ order.administrationWindow + colDelim
							+ order.calendarYear + colDelim
							+ 'Paper' + colDelim
							+ (cost.pricing.summative.labels) + colDelim
							+ ((cost.pricing.summative.labels) * order.paper.total) + colDelim
							+ yesNo(order.subjects.English) + colDelim
							+ yesNo(order.subjects.Mathematics) + colDelim
							+ yesNo(order.subjects.Reading) + colDelim
							+ yesNo(order.subjects.Science) + colDelim
							+ yesNo(order.subjects.Writing) + colDelim
							+ writeCommonData(formData);
					}
					order.scoreLabels
				}
			}
		});

		angular.forEach(formData.periodic.orders, function(order, key) {
			if(order.onlineTotal){
	        	var index = 0;
				angular.forEach(order.grade, function(grade, gradeKey) {
					fileContent += ',,,"' + today + colDelim 
						+ (index++) + colDelim
						+ formData.customer.organization + colDelim
						+ gradeKey + colDelim
						+ grade.online + colDelim
						+ 'Periodic' + colDelim
						+ 'School Year' + colDelim
						+ order.calendarYear + colDelim
						+ 'Online' + colDelim
						+ (cost.pricing.periodic - order.totalDiscountPerStudent) + colDelim
						+ ((cost.pricing.periodic - order.totalDiscountPerStudent) * grade.online) + colDelim
						+ yesNo(true) + colDelim
						+ yesNo(true) + colDelim
						+ yesNo(true) + colDelim
						+ yesNo(true) + colDelim
						+ yesNo(true) + colDelim
						+ writeCommonData(formData);
				});
			}
		});

		return fileContent;
		
	};

	var url = '../../wp-json/wp/v2/sendEmail/';

	var postConfirmationEmail = function(postData){
		$http.post(url, postData, {}).then(
			function(){
				alert('success');
			}, 
			function(){
				alert('failure');
			}
		);
	}
	var sendConfirmationEmail = function(formData, cost){
		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = 'l.scott.bock@gmail.com';
		postData.message = buildEmail(formData);
		postData.csv = buildCsvFile(formData, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date() + '.csv';

		if(formData.summary.discount.special && formData.summary.discount.special.code && !formData.summary.discount.special.error){
			$http.get('json/couponUses.json', { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
	    		var couponUses = response.data;
	    		if(!couponUses[formData.summary.discount.special.code]){
					couponUses[formData.summary.discount.special.code] = new Array();
	    		}
				couponUses[formData.summary.discount.special.code].push(formData.customer.firstName + ' ' + formData.customer.lastName + ', ' + formData.customer.jobTitle + ', ' + formData.customer.organization);

				postData.couponUses = angular.toJson(couponUses, true);
				postConfirmationEmail(postData);
			});
		}
		else{
			postConfirmationEmail(postData);
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


