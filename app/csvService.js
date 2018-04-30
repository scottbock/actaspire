angular.module('myApp').factory('CsvService', ['$http', 'currencyFilter', 'dateFilter', 'schoolYearFilter', '$state', '$cookies', function ($http, currencyFilter, dateFilter, schoolYearFilter, $state, $cookies) {
	var yesNo = function(bool){
		if(bool){
			return 'Yes';
		}
		return 'No';
	};

	var getEmailSuffix = function(emailAddress){
		if(emailAddress && emailAddress.indexOf('@') > -1){
			return emailAddress.split('@')[1];
		}
		return '';
	}

	var truncate = function(string, maxLength) {
		if(!string){
			return string;
		}

    return string.substring(0, Math.min(maxLength,string.length));
	}

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
			+ getEmailSuffix(formData.customer.email) + colDelim
			+ formData.implementationContact.name + colDelim
			+ formData.implementationContact.email + colDelim
      + getEmailSuffix(formData.implementationContact.email) + colDelim
			+ formData.implementationContact.phone + colDelim
			+ formData.backupContact.name + colDelim
			+ formData.backupContact.email + colDelim
      + getEmailSuffix(formData.backupContact.email) + colDelim
			+ formData.billingContact.name + colDelim
			+ formData.billingContact.email + colDelim
      + getEmailSuffix(formData.billingContact.email) + colDelim
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
			+ yesNo(formData.acceptTerms) + colDelim
			+ (formData.customer.howHeard || '') + colDelim;

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
        var fileContent = 'QB Customer,Internal ID,Transaction Date,line ,School / Customer,cfi-Grade,Quantity,Item,cfi-Test Admin,cfi-Test Admin Year,cfi-Test Mode,Price,Amount,cfc-Preferred Test Date,English,Mathematics,Reading,Science,Writing,Group Order,Group Creator Name,Name,Job Title,Contact email,Contact email Suffix,cfc-Implementation Contact Name,cfc-Implementation Contact Email,cfc-Implementation Contact Email Suffix,cfc-Implementation Contact Phone,cfc-Backup Contact Name,cfc-Backup Contact Email,cfc-Backup Contact Email Suffix,Billing Contact Name,Email,Email Suffix,Phone,Billing Address Line 1,BillTo Line2,PO Number,BillTo City,BillTo State,BillTo PostalCode,Terms And Conditions,How Heard,cfc-Discount Code,Memo\n';

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
							+ ((order.preferredDate || '')) + colDelim
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
						+ order.online.total + colDelim
						+ 'Individual Score Reports ' + order.reportsPerStudent + 'x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'n/a' + colDelim
						+ (order.cost.isr * order.reportsPerStudent) + colDelim
						+ ((order.cost.isr) * order.online.total * order.reportsPerStudent) + colDelim
            + ((order.preferredDate || '')) + colDelim
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
						+ 'n/a' + colDelim
						+ (order.cost.labels) + colDelim
						+ ((order.cost.labels) * order.online.total) + colDelim
            + ((order.preferredDate || '')) + colDelim
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
              + ((order.preferredDate || '')) + colDelim
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
						+ order.paper.total + colDelim
						+ 'Individual Score Reports ' + order.reportsPerStudent + 'x' + colDelim
						+ order.administrationWindow + colDelim
						+ order.calendarYear + colDelim
						+ 'n/a' + colDelim
						+ (order.cost.isr * order.reportsPerStudent) + colDelim
						+ ((order.cost.isr) * order.paper.total * order.reportsPerStudent) + colDelim
            + ((order.preferredDate || '')) + colDelim
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
						+ 'n/a' + colDelim
						+ (order.cost.labels) + colDelim
						+ ((order.cost.labels) * order.paper.total) + colDelim
            + ((order.preferredDate || '')) + colDelim
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
              + ((order.preferredDate || '')) + colDelim
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
					+ order.calendarYear + colDelim + colDelim
					+ order.cost.lateFee + colDelim
					+ order.cost.lateFee + colDelim
          + ((order.preferredDate || '')) + colDelim
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

	var buildTrainingCsvFile = function(formData, trainingOrders, cost){
		var fileContent = 'QB Customer,Account No,cfi-Test Mode,cfi-Test Admin,cfi-Test Admin Year,Transaction Date,School / Customer,Training Description,Length (hours),Mode,Capacity,Preferred Date,Preferred Year,Preferred Time,Price,Quantity,Total,Start Date,End Date,Contact Name,Email,Email Suffix,Phone,BillTo Line1,BillTo Line2,BillTo City,BillTo State,BillTo PostalCode,Memo 2\n';

		var index = 0;
        angular.forEach(trainingOrders, function(training, key) {

			fileContent += ',,n/a,"'
				+ cost.currentSemester + colDelim
				+ cost.currentYear + colDelim	
				+ today + colDelim
				+ formData.customer.organization + colDelim
				+ truncate(training.title, 31) + colDelim
				+ training.duration + colDelim
				+ training.mode + colDelim
				+ (training.maxParticipants * training.quantity) + colDelim
				+ (training.preferredDate.getMonth() + 1) + ' - ' + training.preferredDate.getDate() + colDelim
				+ training.preferredDate.getFullYear() + colDelim
				+ training.preferredTime + colDelim
				+ training.cost + colDelim
				+ training.quantity + colDelim
				+ (training.cost * training.quantity) + colDelim
				+ dateFilter(training.preferredDate, 'MM/dd/yy') + colDelim
				+ dateFilter(training.preferredDate, 'MM/dd/yy') + colDelim
				+ formData.billingContact.name + colDelim
				+ formData.billingContact.email + colDelim
        + getEmailSuffix(formData.billingContact.email) + colDelim
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

				fileContent += colDelim + rowDelim;

		});

		return fileContent;
	}

	var buildIsrCsvFile = function(formData, cost){
		var fileContent = 'QB Customer,Account No,cfi-Test Mode,cfi-Grade,cfi-Test Admin,cfi-Test Admin Year,Transaction Date,School / Customer,Report Description,Price,Quantity,Total,Special Notes,Name,Job Title,Contact email,Contact email Suffix,Contact Name,Email,Email Suffix,Phone,BillTo Line1,BillTo Line2,BillTo City,BillTo State,BillTo PostalCode,Terms And Conditions,Memo 2\n';

		var adminWindow = formData.administrativeWindow.split(' ');
		var semester = adminWindow[0];
		var year = adminWindow[1];

		var index = 0;
        angular.forEach(cost.reportGroups, function(reportGroup, key) {
        	angular.forEach(reportGroup.reports, function(report, key) {
        		if(report.amount){
					fileContent += ',,n/a,0,"'
						+ semester + colDelim
						+ year + colDelim
						+ today + colDelim
						+ formData.customer.organization + colDelim
						+ reportGroup.name + ' ' + report.number + 'x' + colDelim
						+ report.cost + colDelim
						+ report.amount + colDelim
						+ (report.cost * report.amount) + colDelim
						+ formData.comments + colDelim
						+ formData.customer.firstName + ' ' + formData.customer.lastName + colDelim
						+ formData.customer.jobTitle + colDelim
						+ formData.customer.email + colDelim
            + getEmailSuffix(formData.customer.email) + colDelim
						+ formData.billingContact.name + colDelim
						+ formData.billingContact.email + colDelim
            + getEmailSuffix(formData.billingContact.email) + colDelim
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
						+ yesNo(formData.acceptTerms) + colDelim + rowDelim;
				}	
			});

		});

		return fileContent;
	}	

	return {
		'buildCsvFile':buildCsvFile,
		'buildTrainingCsvFile': buildTrainingCsvFile,
		'buildIsrCsvFile': buildIsrCsvFile
	}
}]);