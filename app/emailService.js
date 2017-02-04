angular.module('myApp').factory('EmailService', ['$http', 'currencyFilter', 'dateFilter', 'schoolYearFilter', '$state', '$cookies', 'CsvService', function ($http, currencyFilter, dateFilter, schoolYearFilter, $state, $cookies, CsvService) {

	var buildEmail = function(formData, orders){
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for ordering ACT Aspire! We are thrilled to be your partner for measuring college and career readiness. Please take a moment to review the order confirmation at the end of this email and make sure your order was captured accurately.' +
			'\n\nWhat’s Next?\nSeveral things will happen between now and test day.' +
			'\n\n1)  Summative Users: You will be receiving a welcome email after the ordering window closes, containing more detailed setup information.' +
			'\n\nPeriodic Users: If you ordered prior to 7/31, you will receive a welcome email in August. If you have ordered after 7/31 you will receive a welcome letter shortly after your order is placed.' +
			'\n\n2)  If this is your first time testing with ACT Aspire we will reach out to you prior to testing to help you create and upload your Organizational (ORG) file. This will tell us what schools to include in your online tenant (account).' +
			'\n\n3)  If Paper Testing: About 4 weeks before testing you will need to upload your students using the Student Data Upload (SDU) file and assign students to test sessions. ' +
			' Be mindful that there will be further set-up steps such as: setting up sessions and adding students to sessions to trigger the printing (complete test sessions before Monday 7:00 AM CST to meet the weekly printing deadline, sessions created after this deadline will be produced the following week.) More information will be provided as we near that date.' +
			'\n\nIf Online Testing: About 3 weeks before testing, you will need to upload your students using the Student Data Upload (SDU) file and assign students to test sessions. More information will be provided as we near that date. Proctor caching is mandatory for online testing. You will need to set up proctor caching and pre-cache content after testing sessions have been set up (approximately 3 weeks prior to testing). Information on proctor caching can be found here in the ACT Aspire Portal Guide. http://actaspire.avocet.pearson.com/actaspire/home#5661' +
			'\n\nIn the meantime, take a look at the ACT Aspire Landing Page (http://actaspire.pearson.com/allresources.html) to familiarize yourself with the testing process. If you have any questions, please call ACT Aspire at 1-855-730-0400.' +
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
		postData.csv = CsvService.buildCsvFile(formData, orders, cost);
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

	var sendTrainingConfirmationEmail = function(formData, trainingOrders, cost){
		$state.go('form.training.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildTrainingEmail(formData, trainingOrders);
		postData.csv = CsvService.buildTrainingCsvFile(formData, trainingOrders, cost);
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

	var sendIsrConfirmationEmail = function(formData, cost){
		$state.go('form.isr.confirmation');

		var postData = {};
		postData.clientEmail = formData.customer.email;
		postData.orderInbox = cost.ordersInbox;
		postData.orderBcc = cost.ordersBcc;
		postData.message = buildIsrEmail(formData, cost.reportGroups);
		postData.csv = CsvService.buildIsrCsvFile(formData, cost);
		postData.csvFileName = formData.customer.lastName + formData.customer.organization + new Date().getTime() + '.csv';
		postData.csvFileName = postData.csvFileName.replace(/[/\\\\]/g, '');;

		postConfirmationEmail(postData, formData);
	};	

	return {
		'sendConfirmationEmail':sendConfirmationEmail,
		'sendTrainingConfirmationEmail': sendTrainingConfirmationEmail,
		'sendIsrConfirmationEmail': sendIsrConfirmationEmail
	}
}]);