angular.module('myApp').factory('EmailService', ['$http', 'currencyFilter', 'dateFilter', 'schoolYearFilter', '$state', '$cookies', function ($http, currencyFilter, dateFilter, schoolYearFilter, $state, $cookies) {

	var buildEmail = function(formData, orders){
		var emailBody = 'Dear ' + formData.customer.firstName + ' ' + formData.customer.lastName + 
			',\n\nThank you for ordering ACT Aspire! We are thrilled to be your partner for measuring college and career readiness. Please take a moment to review the order confirmation at the end of this email and make sure your order was captured accurately.' +
			'\n\nWhat’s Next?\nSeveral things will happen between now and test day.' +
			'\n\n1)  Summative Users: You will be receiving a welcome email after the ordering window closes, containing more detailed setup information.' +
			'\n\nPeriodic Users: If you ordered prior to 7/31, you will receive a welcome email in August. If you have ordered after 7/31 you will receive a welcome letter shortly after your order is placed.' +
			'\n\n2)  If this is your first time testing with ACT Aspire we will reach out to you prior to testing to help you create and upload your Organizational (ORG) file. This will tell us what schools to include in your online tenant (account).' +
			'\n\n3)  If Paper Testing: About 4 weeks before testing you will need to upload your students using the Student Data Upload (SDU) file and assign students to test sessions. More information will be provided as we near that date.' +
			'\n\nIf Online Testing: About 3 weeks before testing, you will need to upload your students using the Student Data Upload (SDU) file and assign students to test sessions. More information will be provided as we near that date. Proctor caching is mandatory for online testing. You will need to set up proctor caching and pre-cache content after testing sessions have been set up (approximately 3 weeks prior to testing). Information on proctor caching can be found here in the ACT Aspire Portal Guide. http://actaspire.avocet.pearson.com/actaspire/home#5661' +
			'\n\nIn the meantime, take a look at the ACT Aspire Landing Page (http://actaspire.pearson.com/allresources.html) to familiarize yourself with the testing process. If you have any questions, please call Bri Silver at 319-248-1422.' +
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
		var fileContent = 'NS Name,Internal ID,Admin,Year,Date,line,School / Customer,Training Description,Length (hours),Mode,Capacity,Preferred Date,Preferred Year,Preferred Time,Price,Quantity,Total,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2\n';

		var index = 0;
        angular.forEach(trainingOrders, function(training, key) {

			fileContent += ',,,,"' + today + colDelim 
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
				+ currencyFilter(training.cost * training.quantity) + colDelim
				+ formData.billingContact.name + colDelim
				+ formData.billingContact.email + colDelim
				+ formData.billingContact.phone + colDelim
				+ formData.billing.address.line1 + colDelim;

				if(formData.billing.address.line2){
					fileContent += formData.billing.address.line2
				}

				fileContent += rowDelim;

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
		var fileContent = 'NS Name,Internal ID,Grade,Admin,Year,Date,line,School / Customer,Report Description,Price,Quantity,Total,Special Notes,Rev Rec,Rev Rec Date,Name,Job Title,Contact email,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,City,State,Zip,Terms And Conditions\n';

		var index = 0;
        angular.forEach(cost.reportGroups, function(reportGroup, key) {
        	angular.forEach(reportGroup.reports, function(report, key) {
        		if(report.amount){
					fileContent += ',,0,"' 
						+ cost.currentSemester + colDelim
						+ cost.currentYear + colDelim
						+ today + colDelim 
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
}]);