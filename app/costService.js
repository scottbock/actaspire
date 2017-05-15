angular.module('myApp').factory('CostService', ['$http', function ($http) {
	var cost = {};
	$http.get('json/cost.json?'+ new Date().getTime(), { headers: { 'Cache-Control' : 'no-cache' } }).then(function(response) { 
    	cost.pricing = response.data.pricing;
		cost.discounts = response.data.discounts;
		cost.periodicCalendarYears = Object.keys(response.data.pricing.periodic);
		cost.ordersInbox = response.data.ordersInbox;
		cost.ordersBcc = response.data.ordersBcc;
		cost.howHeardOptions = response.data.howHeardOptions;
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

	var getPeriodicDiscount = function(summativeAmount, periodicAmount, summativeForSamePeriodicAmount){
		var discountAmount = 0;
		var totalSummativeAmount = summativeAmount + (summativeForSamePeriodicAmount ? summativeForSamePeriodicAmount : 0);
		if(cost.discounts){
			discountAmount = cost.discounts.periodic.discountPer;
		}

		if(periodicAmount < totalSummativeAmount){
			discountAmount = discountAmount * getPeriodicNumberApplied(summativeAmount, periodicAmount, summativeForSamePeriodicAmount) / summativeAmount
		}

		return discountAmount;
	};

	var getPeriodicNumberApplied = function(summativeAmount, periodicAmount, summativeForSamePeriodicAmount){
		summativeForSamePeriodicAmount = summativeForSamePeriodicAmount ? summativeForSamePeriodicAmount : 0;
		var totalSummativeAmount = summativeAmount + summativeForSamePeriodicAmount;
		if(totalSummativeAmount <= periodicAmount){
			return summativeAmount;
		}
		else{
			return periodicAmount * summativeAmount / (summativeAmount + summativeForSamePeriodicAmount);
		}
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
		'getPeriodicNumberApplied':getPeriodicNumberApplied,
		'getSpecialDiscount':getSpecialDiscount,
		'getStateDiscount': getStateDiscount
	}
}]);