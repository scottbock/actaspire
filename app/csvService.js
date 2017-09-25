angular.module('myApp').factory('CsvService', ['$http', 'currencyFilter', 'dateFilter', 'schoolYearFilter', '$state', '$cookies', function ($http, currencyFilter, dateFilter, schoolYearFilter, $state, $cookies) {
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
        var fileContent = 'NS Name,Internal ID,Date,line ,School / Customer,Grade,Quantity,Item,Test Administration,Test Admin Year,Test Mode,Rev Rec,Rev Rec Date,Item Rate,Amount,Preferred Test Date,English,Mathematics,Reading,Science,Writing,Group Order,Group Creator Name,Name,Job Title,Contact email,Test Coordinator Name,Test Coordinator Email,Test Coordinator Phone,Backup Coordinator Name,Backup Coordinator Email,Backup Coordinator Phone,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,Purchase Order #,City,State,Zip,Terms And Conditions,How Heard,Discount Code,Memo\n';

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
						+ colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
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
						+ colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
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
							+ 'Summative Test Rev Rec Template' + colDelim
							+ revRecDate(order.calendarYear, order.administrationWindow)+ colDelim
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
						+ colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
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
						+ colDelim
						+ 'Ancillary Rev Rec Template' + colDelim
						+ revRecDate(order.calendarYear, order.administrationWindow) + colDelim
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
							+ 'Periodic Test Rev Rec Template' + colDelim
							+ revRecDate(order.calendarYear)+ colDelim
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
					+ order.calendarYear + colDelim + colDelim + colDelim + colDelim
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
		var fileContent = 'NS Name,Internal ID,Admin,Year,Date,line,School / Customer,Training Description,Length (hours),Mode,Capacity,Preferred Date,Preferred Year,Preferred Time,Price,Quantity,Total,Rev Rec,Start Date,End Date,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,Memo 2\n';

		var index = 0;
        angular.forEach(trainingOrders, function(training, key) {

			fileContent += ',,"' 
				+ cost.currentSemester + colDelim
				+ cost.currentYear + colDelim	
				+ today + colDelim 
				+ (index++) + colDelim
				+ formData.customer.organization + colDelim
				+ training.title + colDelim
				+ training.duration + colDelim
				+ training.mode + colDelim
				+ (training.maxParticipants * training.quantity) + colDelim
				+ (training.preferredDate.getMonth() + 1) + ' - ' + training.preferredDate.getDate() + colDelim
				+ training.preferredDate.getFullYear() + colDelim
				+ training.preferredTime + colDelim
				+ training.cost + colDelim
				+ training.quantity + colDelim
				+ (training.cost * training.quantity) + colDelim
				+ 'Training Rev Rec Template' + colDelim
				+ dateFilter(training.preferredDate, 'MM/dd/yy') + colDelim
				+ dateFilter(training.preferredDate, 'MM/dd/yy') + colDelim
				+ formData.billingContact.name + colDelim
				+ formData.billingContact.email + colDelim
				+ formData.billingContact.phone + colDelim
				+ formData.billing.address.line1 + colDelim;

				if(formData.billing.address.line2){
					fileContent += formData.billing.address.line2
				}

				fileContent += colDelim + rowDelim;

		});

		return fileContent;
	}

	var buildIsrCsvFile = function(formData, cost){
		var fileContent = 'NS Name,Internal ID,Grade,Admin,Year,Date,line,School / Customer,Report Description,Price,Quantity,Total,Special Notes,Rev Rec,Rev Rec Date,Name,Job Title,Contact email,Billing Contact Name,Billing Contact Email,Billing Contact Phone,Billing Address Line 1,Billing Address Line 2,City,State,Zip,Terms And Conditions,Memo 2\n';

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
						+ report.cost + colDelim
						+ report.amount + colDelim
						+ (report.cost * report.amount) + colDelim
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