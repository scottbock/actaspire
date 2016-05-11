angular.module('myApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/confirmation.html',
    " <div id=\"form-container\">\n" +
    "    <h2>ACT Aspire Order Confirmation</h2>\n" +
    "    <p ng-hide=\"formData.submitComplete\">Submitting your order now please wait while we finish.<img src=\"images/ring.gif\" /></p>\n" +
    "    <p ng-show=\"formData.submitComplete && formData.submitSuccess\">Success!  A confirmation email has been sent to {{formData.customer.email}}</p>\n" +
    "    <p ng-show=\"formData.submitComplete && !formData.submitSuccess\">I'm sorry.  Something with your order submission has failed.  Please go <a href=\"#\" onclick=\"history.go(-1)\">back</a> and try again.  If you continue to have problems please contact us at <a href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a> or 1-855-730-0400</p>\n" +
    "</div>"
  );


  $templateCache.put('app/form-customer.html',
    "<div ng-show=\"$state.is('form.customer')\">\n" +
    "\t<h2>ACT Aspire Order Form</h2>\t\n" +
    "<div class=\"col-sm-12\">\n" +
    "  <p>\n" +
    "    Thank you for your decision to order ACT Aspire! To help ensure your order is accurate please fill in all applicable boxes.\n" +
    "  </p>\n" +
    "  <p>\n" +
    "    If you have any questions on the order form below, please contact <a href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a> or 1-855-730-0400\n" +
    "  </p>\n" +
    "  <p>\n" +
    "    Pricing valid through {{cost.pricing.validThrough}}\n" +
    "  </p>\n" +
    "</div>\n" +
    "<!-- use ng-submit to catch the form submission and use our Angular function -->\n" +
    "<form id=\"customerForm\" name=\"customerForm\" ng-submit=\"processForm()\"> \n" +
    "\n" +
    "\t<h3>1. Contact Information</h3>\n" +
    "\n" +
    "\t<div class=\"row\"><div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div></div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t    <div class=\"form-group col-sm-3 required\">\n" +
    "\t        <label for=\"firstName\" class=\"control-label\">First Name</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.firstName\" required=\"required\">\n" +
    "\t    </div>\n" +
    "\n" +
    "\t    <div class=\"form-group col-sm-3 required\">\n" +
    "\t        <label for=\"lastName\" class=\"control-label\">Last Name</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"lastName\" ng-model=\"formData.customer.lastName\" required=\"required\">\n" +
    "\t    </div>\n" +
    "\n" +
    "\t    <div class=\"form-group col-sm-6 required\">\n" +
    "\t        <label for=\"organization\" class=\"control-label\">School / District / Organization</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"organization\" ng-model=\"formData.customer.organization\" required=\"required\">\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t    <div class=\"form-group col-sm-6 required\">\n" +
    "\t        <label for=\"jobTitle\" class=\"control-label\">Job Title</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"jobTitle\" ng-model=\"formData.customer.jobTitle\" required=\"required\">\n" +
    "\t    </div>\n" +
    "\n" +
    "\t    <div class=\"form-group col-sm-4 required\">\n" +
    "\t        <label for=\"email\" class=\"control-label\">Email</label>\n" +
    "\t        <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"formData.customer.email\" required=\"required\">\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t    \t<input type=\"checkbox\" ng-model=\"formData.customer.groupOrder\">\n" +
    "\t\t    \tAre you part of a group order?\n" +
    "\t\t    </label>\n" +
    "\t\t    <p><a href=\"http://www.discoveractaspire.org/order/\" target=\"_blank\">Not sure? Find more information about Group Orders</a></p>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t    <div class=\"form-group col-sm-6 required\" ng-show=\"formData.customer.groupOrder\">\n" +
    "\t        <label for=\"groupContact\" class=\"control-label\">Group Owner Name</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"groupContact\" ng-model=\"formData.customer.groupContact\" ng-required=\"formData.customer.groupOrder\">\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"panel panel-default\">\n" +
    "\t    <div class=\"panel-heading\">Contact Information</div>\n" +
    "\t    <div class=\"panel-body\">\n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"implementationName\" class=\"control-label\">Test Coordinator Contact Name</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"implementationName\" ng-model=\"formData.implementationContact.name\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"implementationEmail\" class=\"control-label\">Test Coordinator Contact Email</label>\n" +
    "\t                <input type=\"email\" class=\"form-control\" name=\"implementationEmail\" ng-model=\"formData.implementationContact.email\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"implementationPhone\" class=\"control-label\">Test Coordinator Contact Phone</label>\n" +
    "\t                <input type=\"tel\" class=\"form-control\" name=\"implementationPhone\" ng-model=\"formData.implementationContact.phone\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\t        </div>\n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"backupName\" class=\"control-label\">Backup Contact Name</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"backupName\" ng-model=\"formData.backupContact.name\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"backupEmail\" class=\"control-label\">Backup Contact Email</label>\n" +
    "\t                <input type=\"email\" class=\"form-control\" name=\"backupEmail\" ng-model=\"formData.backupContact.email\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"backupPhone\" class=\"control-label\">Backup Contact Phone</label>\n" +
    "\t                <input type=\"tel\" class=\"form-control\" name=\"backupPhone\" ng-model=\"formData.backupContact.phone\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\t        </div>        \n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"panel panel-default\">\n" +
    "\t    <div class=\"panel-heading\">Billing Information</div>\n" +
    "\t    <div class=\"panel-body\">\n" +
    "\t    \t<div class=\"row\">\n" +
    "\t\t\t    <div class=\"col-sm-12\">\n" +
    "\t\t\t\t    <p>If you are tax exempt, please email a copy of your exemption certificate to <a href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a></p>\n" +
    "\t\t\t    </div>\n" +
    "\t\t\t</div>\n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"billingName\" class=\"control-label\">Billing Contact Name</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"billingName\" ng-model=\"formData.billingContact.name\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"billingEmail\" class=\"control-label\">Billing Contact Email</label>\n" +
    "\t                <input type=\"email\" class=\"form-control\" name=\"billingEmail\" ng-model=\"formData.billingContact.email\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"billingPhone\" class=\"control-label\">Billing Contact Phone</label>\n" +
    "\t                <input type=\"tel\" class=\"form-control\" name=\"billingPhone\" ng-model=\"formData.billingContact.phone\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\t        </div>    \n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-12 required\">\n" +
    "\t                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 1</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line1\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\t        </div>\n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-12\">\n" +
    "\t                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 2</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line2\">\n" +
    "\t            </div>\n" +
    "\t        </div>        \n" +
    "\t        <div class=\"row\">\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"city\" class=\"control-label\">City</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"city\" ng-model=\"formData.billing.address.city\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"state\" class=\"control-label\">State</label>\n" +
    "\t        \t\t<select class=\"form-control\" name=\"state\" ng-model=\"formData.billing.address.state\" ng-options=\"key as value for (key , value) in states\" required=\"required\"></select>\n" +
    "\t            </div>\n" +
    "\n" +
    "\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t                <label for=\"zip\" class=\"control-label\">Zip</label>\n" +
    "\t                <input type=\"text\" class=\"form-control\" name=\"zip\" ng-model=\"formData.billing.address.zip\" required=\"required\">\n" +
    "\t            </div>\n" +
    "\t        </div>    \n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<h3>2. Summative Order Data</h3>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-sm-12\">\n" +
    "\t  \t\t<h5>ACT Aspire Summative Test</h5>\n" +
    "\t  \t\t<ul>\n" +
    "\t\t\t    <li>Is a vertically scaled, standards-based battery of achievement test that are linked to the College and Career Readiness Standard in the subject areas of: English, mathematics, reading, science and writing.</li>\t\t\t\t\n" +
    "\t\t\t    <li>Designed for Grades 3 - 10 and can be taken Online or in Paper form (paper administration requires an additional fee).</li>\n" +
    "\t\t\t    <li>Can be administered in a Spring test administration window or a Fall test administration window.</li>\n" +
    "\t\t\t    <li>When ordering Summative assessments, the following discounts are available*:\n" +
    "\t\t\t    \t<ul>\n" +
    "\t\t\t    \t\t<li>Test four or more grades of students: $1.00 off</li>\n" +
    "\t\t\t\t\t\t<li>Test 400 to 1,000 students: $1.00 off</li>\n" +
    "\t\t\t\t\t\t<li>Test over 1,000 students: $2.00 off</li>\n" +
    "\t\t\t\t\t\t<li>Bundle Periodic to Summative order: $4.00 off (applied to Summative)</li>\n" +
    "\t\t\t    \t</ul>\n" +
    "\t\t\t    </li>\n" +
    "\t\t\t</ul>\t\t\t\n" +
    "\t\t</div>\t\t\n" +
    "\t</div>\n" +
    "\t\t\n" +
    "\t<div class=\"panel panel-default\" ng-repeat=\"order in orders.summative.orders\">\n" +
    "\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t{{order.administrationWindow}} {{order.calendarYear}} Summative Order\n" +
    "\t\t\t<button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\" ng-click=\"removeOrder(orders.summative.orders, order)\">\n" +
    "\t\t\t\t<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t</button>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"panel-body\">\n" +
    "\t\t<h5>Subjects</h5>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t    \t<div class=\"col-sm-2 form-group\" ng-repeat=\"(subject,enabled) in order.subjects\">\n" +
    "\t            <label class=\"checkbox-inline\">\n" +
    "\t            \t<input type=\"checkbox\" ng-model=\"order.subjects[subject]\">\n" +
    "\t            \t{{subject}}\n" +
    "\t            </label>\n" +
    "\t        </div>\n" +
    "\t    </div>\n" +
    "\t    <h5>Printed Student Reports</h5>\n" +
    "\t    <div class=\"row\">\n" +
    "\t    \t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t\t    \t<input type=\"checkbox\" ng-model=\"order.individualReports\">\n" +
    "\t\t\t    \tAdd Printed Individual Student Reports\n" +
    "\t\t\t    </label>\n" +
    "\t\t    </div>\n" +
    "\t     \t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t\t    \t<input type=\"checkbox\" ng-model=\"order.scoreLabels\">\n" +
    "\t\t\t    \tAdd Printed Score Labels ({{order.cost.labels | currency}})\n" +
    "\t\t\t    </label>\n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\" ng-show=\"order.individualReports\">\n" +
    "\t    \t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t<label>\n" +
    "\t\t\t\t\t<input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"1\">\n" +
    "\t\t\t\t\t1 Report Per Student ({{order.cost.isr | currency}})\n" +
    "\t\t\t\t</label>\n" +
    "\t\t\t\t<label>\n" +
    "\t\t\t\t\t<input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"2\">\n" +
    "\t\t\t\t\t2 Reports Per Student ({{order.cost.isr * 2 | currency}})\n" +
    "\t\t\t\t</label>\t\t\t\n" +
    "\t\t    </div>\n" +
    "\t    </div>\n" +
    "\n" +
    "\t\t<table class=\"table table-striped\">\n" +
    "\t\t\t<thead>\n" +
    "\t\t\t\t<th></th>\n" +
    "\t\t\t\t<th>Online Test</th>\n" +
    "\t\t\t\t<th>Paper Test</th>\n" +
    "\t\t\t\t<th>Total Student Estimate</th>\n" +
    "\t\t\t</thead>\n" +
    "\t\t\t<tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "\t\t\t\t<td>Grade {{grade}}</td>\n" +
    "\t\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\" min=\"0\"></td>\n" +
    "\t\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].paper\" name=\"\" min=\"0\"></td>\n" +
    "\t\t\t\t<td>{{order.grade[grade].online + order.grade[grade].paper}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<td>Total</td>\n" +
    "\t\t\t\t<td>{{order.online.total}}</td>\n" +
    "\t\t\t\t<td>{{order.paper.total}}</td>\n" +
    "\t\t\t\t<td>{{order.paper.total + order.online.total}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"form-group col-sm-7\">\n" +
    "\t\t\t<label for=\"calendarYear\" class=\"control-label\">What administrative window and year would you like to order?</label>\n" +
    "\t\t\t<select class=\"form-control\" name=\"calendarYear\" ng-model=\"summative.calendarYear\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t      \t\t<option ng-repeat=\"item in cost.pricing.summative\" value=\"{{item.semester}} {{item.year}}\">{{item.semester}} {{item.year}}</option>\n" +
    "\t\t\t </select>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group col-sm-2\">\n" +
    "\t\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<button type=\"button\" ng-model=\"addSummativeOrderButton\" ng-click=\"addOrder(orders.summative.orders, summative.calendarYear, summative.error)\" class=\"btn btn-primary\" ng-disabled=\"!summative.calendarYear\">Order Assessments</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"summative.error\">\n" +
    "\t\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t\t{{summative.error}}\n" +
    "\t\t</div>\n" +
    "\t</div> \t\n" +
    "\n" +
    "\t<h3>3. Periodic Order Data</h3>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-sm-12\">\n" +
    "\t  \t\t<h5>ACT Aspire Periodic</h5>\n" +
    "\t  \t\t<ul>\n" +
    "\t\t\t    <li>Is a complement to the ACT Aspire Summative test, offered via ACT Aspire’s Online platform.</li>\n" +
    "\t\t\t    <li>Includes access to Classroom quizzes (designed for grades 3 – 8) as well as Interim Assessments (designed for grades 3 – 10)</li>\n" +
    "\t\t\t    <li>Is a subscription to access a series of interim tests and classroom quizzes in the subject areas of: English, mathematics, reading, science and writing. The subscription is effective from September through June of each school year.</li>\n" +
    "\t\t\t    <li>Can be administered to students throughout the year and provides immediate performance analysis and score reporting.</li>\n" +
    "\t\t\t\t<li>Can be bundled with ACT Aspire Summative test at a per-student discount off of the Summative test (discount will be automatically applied. Refer to Order Summary below).</li>\t\t\t\t\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\t\t\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"panel panel-default\" ng-repeat=\"order in orders.periodic.orders\">\n" +
    "\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t{{order.calendarYear | schoolYear}} Periodic Order\n" +
    "\t\t\t<button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\" ng-click=\"removeOrder(orders.periodic.orders, order)\">\n" +
    "\t\t\t\t<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t</button>\n" +
    "\t\t</div>\n" +
    "\t\t<table class=\"table table-striped\">\n" +
    "\t\t\t<thead>\n" +
    "\t\t\t\t<th></th>\n" +
    "\t\t\t\t<th>Online Test</th>\n" +
    "\t\t\t</thead>\n" +
    "\t\t\t<tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "\t\t\t\t<td>Grade {{grade}}</td>\n" +
    "\t\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\" min=\"0\"></td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr>\n" +
    "\t\t\t\t<td>Total</td>\n" +
    "\t\t\t\t<td>{{order.onlineTotal}}</td>\n" +
    "\t\t\t</tr>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"form-group col-sm-7\">\n" +
    "\t\t\t<label for=\"schoolYear\" class=\"control-label\">What school year would you like to order?</label>\n" +
    "\t\t\t<select class=\"form-control\" name=\"schoolYear\" ng-model=\"periodic.schoolYear\">\n" +
    "\t\t\t\t<option value=\"\">---Please select---</option>\n" +
    "\t      \t\t<option ng-repeat=\"item in cost.periodicCalendarYears\" value=\"{{item}}\">{{item | schoolYear}}</option>\n" +
    "\t\t\t </select>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"form-group col-sm-2\">\n" +
    "\t\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t\t<div>\n" +
    "\t\t\t\t<button type=\"button\" ng-model=\"addPeriodicOrderButton\" ng-click=\"addOrder(orders.periodic.orders, periodic.schoolYear)\"  class=\"btn btn-primary\" ng-disabled=\"!periodic.schoolYear\">Order Assessments</button>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"periodic.error\">\n" +
    "\t\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t\t{{periodic.error}}\n" +
    "\t\t</div>\n" +
    "\t</div> \t\n" +
    "\n" +
    "\t<h3>4. Order Summary</h3>\n" +
    "\t<div class=\"panel panel-default\">\n" +
    "\t\t<div class=\"panel-heading\">\n" +
    "\t\t\tOrder Summary\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"panel-body\">\n" +
    "\t\t\t<div class=\"row\">\n" +
    "\t\t\t\t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t\t\t    \t<input type=\"checkbox\" ng-model=\"formData.hasDiscountCode\">\n" +
    "\t\t\t\t    \tDo you have a discount coupon code?\n" +
    "\t\t\t\t    </label>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"form-group col-sm-4\" ng-show=\"formData.hasDiscountCode\">\n" +
    "\t\t\t\t\t<label for=\"discountCode\" class=\"control-label\">Discount Code</label>\n" +
    "\t\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"discountCode\" ng-model=\"discountCode\">\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"col-sm-2\" ng-show=\"formData.hasDiscountCode\">\n" +
    "\t\t\t\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t\t\t\t<div>\n" +
    "\t\t\t\t\t\t<button type=\"button\" ng-click=\"addDiscountCode(discountCode); discountCode = '';\" class=\"btn btn-default\">Add</button>\n" +
    "\t\t\t\t\t</div>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"row\" ng-show=\"formData.hasDiscountCode\">\t\n" +
    "\t\t\t\t<div class=\"col-sm-offset-6 col-sm-6\" ng-show=\"!formData.summary.discount.special.error\">\n" +
    "\t\t\t\t\t<p class=\"coupon-code\">{{formData.summary.discount.special.code}}</p>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t\t<div class=\"col-sm-offset-6 col-sm-6 alert alert-danger\" role=\"alert\" ng-show=\"formData.summary.discount.special.error\">\n" +
    "\t\t\t\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t\t\t\t{{formData.summary.discount.special.error}}\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div> \t\n" +
    "\t\t</div>\n" +
    "\t\t<table class=\"table table-striped table-condensed\">\n" +
    "\t\t\t<thead>\n" +
    "\t\t\t\t<th>Product Ordered</th>\n" +
    "\t\t\t\t<th>Total Student</th>\n" +
    "\t\t\t\t<th>Price</th>\n" +
    "\t\t\t\t<th>Extended Price</th>\n" +
    "\t\t\t\t<th>Discounts</th>\n" +
    "\t\t\t\t<th>Total Discount</th>\n" +
    "\t\t\t\t<th>Order Balance</th>\n" +
    "\t\t\t</thead>\n" +
    "\t\t\t<tbody>\n" +
    "\t\t\t\t<tr ng-repeat=\"order in orders.summative.orders | filter:notZero('online')\">\n" +
    "\t\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear}} Summative Order Online</td>\n" +
    "\t\t\t\t\t<td>{{order.online.total}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<div ng-show=\"order.individualReports || order.scoreLabels\">\n" +
    "\t\t\t\t\t\t\t<div>{{order.cost.online | currency}}</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.individualReports\">{{order.reportsPerStudent * order.cost.isr | currency}} (ISR)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.scoreLabels\">{{order.cost.labels | currency}} (Labels)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div>{{order.online.price  | currency}}</div>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td>{{order.online.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.online.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.volume\">{{order.online.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.multiGrade\">{{order.online.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.periodic\">{{order.online.discounts.periodic | currency}} ({{order.online.periodicNumberApplied }} Periodic @ {{cost.discounts.periodic.discountPer | currency}})</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.state\">{{order.online.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.special\">{{order.online.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t<div>{{order.online.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "\t\t\t\t\t</td>\t\n" +
    "\t\t\t\t\t<td>{{order.online.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t\t<td>{{order.online.balance | currency}}</td>\t\t\t\t\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"order in orders.summative.orders | filter:notZero('paper')\">\n" +
    "\t\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear}} Summative Order Paper</td>\n" +
    "\t\t\t\t\t<td>{{order.paper.total}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<div ng-show=\"order.individualReports || order.scoreLabels\">\n" +
    "\t\t\t\t\t\t\t<div>{{order.cost.paper | currency}}</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.individualReports\">{{order.reportsPerStudent * order.cost.isr | currency}} (ISR)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.scoreLabels\">{{order.cost.labels | currency}} (Labels)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t\t<div>{{order.paper.price  | currency}}</div>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td>{{order.paper.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.paper.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.volume\">{{order.paper.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.multiGrade\">{{order.paper.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.periodic\">{{order.paper.discounts.periodic | currency}} ({{order.paper.periodicNumberApplied }} Periodic @ {{cost.discounts.periodic.discountPer | currency}})</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.state\">{{order.paper.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.special\">{{order.paper.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t<div>{{order.paper.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "\t\t\t\t\t</td>\t\n" +
    "\t\t\t\t\t<td>{{order.paper.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t\t<td>{{order.paper.balance | currency}}</td>\t\t\t\t\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr ng-repeat=\"order in orders.periodic.orders\">\n" +
    "\t\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear | schoolYear}} Periodic Order Online</td>\n" +
    "\t\t\t\t\t<td>{{order.onlineTotal}}</td>\n" +
    "\t\t\t\t\t<td>{{order.price  | currency}}</td>\n" +
    "\t\t\t\t\t<td>{{order.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.discounts.state\">{{order.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.discounts.special\">{{order.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "\t\t\t\t\t\t<div>{{order.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "\t\t\t\t\t</td>\t\n" +
    "\t\t\t\t\t<td>{{order.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t\t<td>{{order.balance | currency}}</td>\t\t\t\t\t\t\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tr>\n" +
    "\t\t\t\t\t<td colspan=\"7\">\n" +
    "\t\t\t\t\t\t<h4>Total: {{formData.summary.total | currency}} <span ng-show=\"formData.summary.tax\"> + {{formData.summary.tax | currency}} ({{formData.summary.taxRate}} Sales Tax) = {{formData.summary.totalWithTax | currency}}</span></h4>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</tbody>\n" +
    "\t\t</table>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"panel panel-default\">\n" +
    "\t\t<div class=\"panel-heading\">Additional Comments</div>\n" +
    "\t\t<div class=\"panel-body\">\n" +
    "\t\t\t<textarea class=\"form-control\" rows=\"3\" ng-model=\"formData.comments\"></textarea>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\n" +
    "\t<div class=\"row\">\n" +
    "\t\t<div class=\"col-sm-12 form-group\">\n" +
    "\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t    \t<input type=\"checkbox\" ng-model=\"formData.acceptTerms\">\n" +
    "\t\t    \tI agree to ACT Aspire's <a href=\"./json/ActAspireTermsAndConditions.pdf\" target=\"_blank\">Terms and Conditions</a>\n" +
    "\t\t    </label>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\" ng-show=\"formData.acceptTerms\">\n" +
    "\t    <div class=\"form-group col-sm-12 required\">\n" +
    "\t        <label for=\"firstName\" class=\"control-label\">Signature:</label>\n" +
    "\t        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.signature\" required=\"required\" placeholder=\"Enter your name as a signature\">\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t    <div class=\"col-sm-4\">\n" +
    "\t  \t\t<button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"customerForm.$invalid || customerForm.$pending || !formData.acceptTerms || !formData.summary.total\">Submit Order</button>\n" +
    "\t    </div>\n" +
    "\t\t<div class=\"col-sm-4\">\n" +
    "\t  \t\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"saveDraft()\">Save Draft</button>\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\">\n" +
    "\t<p>*ACT Aspire reserves the right to disallow a discount at any time if it is determined the orderor did not earn the discount based on actual volume of tested students. </p>\n" +
    "\t</div>\n" +
    "</form>\n" +
    "</div>\n" +
    "<div ui-view></div>\n"
  );


  $templateCache.put('app/form-isr.html',
    "<div ng-show=\"$state.is('form.isr')\">\n" +
    "\t<h2>For {{cost.currentSemester}} {{cost.currentYear}} Testing.</h2>\t\n" +
    "\n" +
    "\t<form id=\"trainingForm\" name=\"trainingForm\" ng-submit=\"processForm()\"> \n" +
    "\n" +
    "\t\t<div class=\"row\"><div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div></div>\n" +
    "\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t    <div class=\"form-group col-sm-3 required\">\n" +
    "\t\t        <label for=\"firstName\" class=\"control-label\">First Name</label>\n" +
    "\t\t        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.firstName\" required=\"required\">\n" +
    "\t\t    </div>\n" +
    "\n" +
    "\t\t    <div class=\"form-group col-sm-3 required\">\n" +
    "\t\t        <label for=\"lastName\" class=\"control-label\">Last Name</label>\n" +
    "\t\t        <input type=\"text\" class=\"form-control\" name=\"lastName\" ng-model=\"formData.customer.lastName\" required=\"required\">\n" +
    "\t\t    </div>\n" +
    "\n" +
    "\t\t    <div class=\"form-group col-sm-6 required\">\n" +
    "\t\t        <label for=\"organization\" class=\"control-label\">School / District / Organization</label>\n" +
    "\t\t        <input type=\"text\" class=\"form-control\" name=\"organization\" ng-model=\"formData.customer.organization\" required=\"required\">\n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t    <div class=\"form-group col-sm-6 required\">\n" +
    "\t\t        <label for=\"jobTitle\" class=\"control-label\">Job Title</label>\n" +
    "\t\t        <input type=\"text\" class=\"form-control\" name=\"jobTitle\" ng-model=\"formData.customer.jobTitle\" required=\"required\">\n" +
    "\t\t    </div>\n" +
    "\n" +
    "\t\t    <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t        <label for=\"email\" class=\"control-label\">Email</label>\n" +
    "\t\t        <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"formData.customer.email\" required=\"required\">\n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"panel panel-default\">\n" +
    "\t\t    <div class=\"panel-heading\">Billing Information</div>\n" +
    "\t\t    <div class=\"panel-body\">\n" +
    "\t\t        <div class=\"row\">\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"billingName\" class=\"control-label\">Billing Contact Name</label>\n" +
    "\t\t                <input type=\"text\" class=\"form-control\" name=\"billingName\" ng-model=\"formData.billingContact.name\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"billingEmail\" class=\"control-label\">Billing Contact Email</label>\n" +
    "\t\t                <input type=\"email\" class=\"form-control\" name=\"billingEmail\" ng-model=\"formData.billingContact.email\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"billingPhone\" class=\"control-label\">Billing Contact Phone</label>\n" +
    "\t\t                <input type=\"tel\" class=\"form-control\" name=\"billingPhone\" ng-model=\"formData.billingContact.phone\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\t\t        </div>    \n" +
    "\t\t        <div class=\"row\">\n" +
    "\t\t            <div class=\"form-group col-sm-12 required\">\n" +
    "\t\t                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 1</label>\n" +
    "\t\t                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line1\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\t\t        </div>\n" +
    "\t\t        <div class=\"row\">\n" +
    "\t\t            <div class=\"form-group col-sm-12\">\n" +
    "\t\t                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 2</label>\n" +
    "\t\t                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line2\">\n" +
    "\t\t            </div>\n" +
    "\t\t        </div>        \n" +
    "\t\t        <div class=\"row\">\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"city\" class=\"control-label\">City</label>\n" +
    "\t\t                <input type=\"text\" class=\"form-control\" name=\"city\" ng-model=\"formData.billing.address.city\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"state\" class=\"control-label\">State</label>\n" +
    "\t\t        \t\t<select class=\"form-control\" name=\"state\" ng-model=\"formData.billing.address.state\" ng-options=\"key as value for (key , value) in states\" required=\"required\"></select>\n" +
    "\t\t            </div>\n" +
    "\n" +
    "\t\t            <div class=\"form-group col-sm-4 required\">\n" +
    "\t\t                <label for=\"zip\" class=\"control-label\">Zip</label>\n" +
    "\t\t                <input type=\"text\" class=\"form-control\" name=\"zip\" ng-model=\"formData.billing.address.zip\" required=\"required\">\n" +
    "\t\t            </div>\n" +
    "\t\t        </div>    \n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\n" +
    "\n" +
    "\t\t<div class=\"panel panel-default\">\n" +
    "\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\tAvailable Reports\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<table class=\"table table-striped\">\n" +
    "\t\t\t\t<thead>\n" +
    "\t\t\t\t\t<th>Printed Reports</th>\n" +
    "\t\t\t\t\t<th># of Reports</th>\n" +
    "\t\t\t\t\t<th></th>\n" +
    "\t\t\t\t\t<th>Amount</th>\n" +
    "\t\t\t\t\t<th>Estimated Student Count</th>\n" +
    "\t\t\t\t\t<th>Estimated Total</th>\n" +
    "\t\t\t\t\t<th>Special Notes</th>\n" +
    "\t\t\t\t</thead>\n" +
    "\t\t\t\t<tbody ng-repeat=\"reportGroup in cost.reportGroups\">\n" +
    "\t\t\t\t<tr ng-repeat=\"report in reportGroup.reports\">\n" +
    "\t\t\t\t\t<td>{{report.name}}</td>\n" +
    "\t\t\t\t\t<td>{{report.number}}</td>\n" +
    "\t\t\t\t\t<td><input type=\"radio\" name=\"{{reportGroup.name}}\" value=\"{{report.name}}\" ng-model=\"reportGroup.selectedReport\"/></td>\n" +
    "\t\t\t\t\t<td>{{report.cost | currency}}</td>\n" +
    "\t\t\t\t\t<td><input type=\"number\" ng-model=\"report.amount\" min=\"0\" ng-disabled=\"reportGroup.selectedReport != report.name\"/></td>\n" +
    "\t\t\t\t\t<td>{{report.cost * report.amount | currency}}</td>\n" +
    "\t\t\t\t\t<td><input type=\"text\" ng-model=\"report.notes\" ng-disabled=\"reportGroup.selectedReport != report.name\"/></td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t</tbody>\n" +
    "\t\t\t</table>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"row gutter\">\n" +
    "\t\t\t<h4>Important Next Steps:</h4>\n" +
    "\t\t\t<ul>\n" +
    "\t\t\t\t<li>Upon completion of the order an invoice for the total due will be sent to the contact above and you will be contacted regarding your preferred Training date and trainer availability.</li>\n" +
    "\t\t\t\t<li>You will be invoiced upon receipt of your order</li>\n" +
    "\t\t\t\t<li>If you would like to purchase printed reports for future testing adminstrations please call 1-855-733-0400 .</li>\n" +
    "\t\t\t</ul>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-sm-12 form-group\">\n" +
    "\t\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t\t    \t<input type=\"checkbox\" ng-model=\"formData.acceptTerms\">\n" +
    "\t\t\t    \tI agree to ACT Aspire's <a href=\"./json/ActAspireTermsAndConditions.pdf\" target=\"_blank\">Terms and Conditions</a>\n" +
    "\t\t\t    </label>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\" ng-show=\"formData.acceptTerms\">\n" +
    "\t\t    <div class=\"form-group col-sm-12 required\">\n" +
    "\t\t        <label for=\"firstName\" class=\"control-label\">Signature:</label>\n" +
    "\t\t        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.signature\" required=\"required\" placeholder=\"Enter your name as a signature\">\n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t    <div class=\"col-sm-4\">\n" +
    "\t\t  \t\t<button type=\"submit\" class=\"btn btn-primary\" ng-disabled=\"trainingForm.$invalid || trainingForm.$pending || !formData.acceptTerms \">Submit Order</button>\n" +
    "\t\t    </div>\n" +
    "\t\t</div>\n" +
    "\t</form>\n" +
    "</div>\n" +
    "<div ui-view></div>"
  );


  $templateCache.put('app/form.html',
    "<div id=\"form-container\">\n" +
    "  <img src=\"http://www.discoveractaspire.org/wp-content/uploads/2014/07/ACTAspire_WebsiteLogo.png\" alt=\"\" width=\"233\">\n" +
    "  <div ui-view></div>\n" +
    "</div>\n" +
    "<div id=\"footer\">\n" +
    "</div>"
  );


  $templateCache.put('app/index-async.html',
    "<!doctype html>\n" +
    "<html lang=\"en\">\n" +
    "<head>\n" +
    "  <meta charset=\"utf-8\">\n" +
    "  <link rel=\"stylesheet\" href=\"bower_components/html5-boilerplate/css/normalize.css\">\n" +
    "  <link rel=\"stylesheet\" href=\"bower_components/html5-boilerplate/css/main.css\">\n" +
    "  <style>\n" +
    "    [ng-cloak] {\n" +
    "      display: none;\n" +
    "    }\n" +
    "  </style>\n" +
    "  <script src=\"bower_components/html5-boilerplate/js/vendor/modernizr-2.6.2.min.js\"></script>\n" +
    "  <script>\n" +
    "    // include angular loader, which allows the files to load in any order\n" +
    "    //@@NG_LOADER_START@@\n" +
    "    // You need to run `npm run update-index-async` to inject the angular async code here\n" +
    "    //@@NG_LOADER_END@@\n" +
    "\n" +
    "    // include a third-party async loader library\n" +
    "    /*!\n" +
    "     * $script.js v1.3\n" +
    "     * https://github.com/ded/script.js\n" +
    "     * Copyright: @ded & @fat - Dustin Diaz, Jacob Thornton 2011\n" +
    "     * Follow our software http://twitter.com/dedfat\n" +
    "     * License: MIT\n" +
    "     */\n" +
    "    !function(a,b,c){function t(a,c){var e=b.createElement(\"script\"),f=j;e.onload=e.onerror=e[o]=function(){e[m]&&!/^c|loade/.test(e[m])||f||(e.onload=e[o]=null,f=1,c())},e.async=1,e.src=a,d.insertBefore(e,d.firstChild)}function q(a,b){p(a,function(a){return!b(a)})}var d=b.getElementsByTagName(\"head\")[0],e={},f={},g={},h={},i=\"string\",j=!1,k=\"push\",l=\"DOMContentLoaded\",m=\"readyState\",n=\"addEventListener\",o=\"onreadystatechange\",p=function(a,b){for(var c=0,d=a.length;c<d;++c)if(!b(a[c]))return j;return 1};!b[m]&&b[n]&&(b[n](l,function r(){b.removeEventListener(l,r,j),b[m]=\"complete\"},j),b[m]=\"loading\");var s=function(a,b,d){function o(){if(!--m){e[l]=1,j&&j();for(var a in g)p(a.split(\"|\"),n)&&!q(g[a],n)&&(g[a]=[])}}function n(a){return a.call?a():e[a]}a=a[k]?a:[a];var i=b&&b.call,j=i?b:d,l=i?a.join(\"\"):b,m=a.length;c(function(){q(a,function(a){h[a]?(l&&(f[l]=1),o()):(h[a]=1,l&&(f[l]=1),t(s.path?s.path+a+\".js\":a,o))})},0);return s};s.get=t,s.ready=function(a,b,c){a=a[k]?a:[a];var d=[];!q(a,function(a){e[a]||d[k](a)})&&p(a,function(a){return e[a]})?b():!function(a){g[a]=g[a]||[],g[a][k](b),c&&c(d)}(a.join(\"|\"));return s};var u=a.$script;s.noConflict=function(){a.$script=u;return this},typeof module!=\"undefined\"&&module.exports?module.exports=s:a.$script=s}(this,document,setTimeout)\n" +
    "\n" +
    "    // load all of the dependencies asynchronously.\n" +
    "    $script([\n" +
    "      'bower_components/angular/angular.js',\n" +
    "      'bower_components/angular-route/angular-route.js',\n" +
    "      'app.js',\n" +
    "      'view1/view1.js',\n" +
    "      'view2/view2.js',\n" +
    "      'components/version/version.js',\n" +
    "      'components/version/version-directive.js',\n" +
    "      'components/version/interpolate-filter.js'\n" +
    "    ], function() {\n" +
    "      // when all is done, execute bootstrap angular application\n" +
    "      angular.bootstrap(document, ['myApp']);\n" +
    "    });\n" +
    "  </script>\n" +
    "  <title>My AngularJS App</title>\n" +
    "  <link rel=\"stylesheet\" href=\"app.css\">\n" +
    "</head>\n" +
    "<body ng-cloak>\n" +
    "  <ul class=\"menu\">\n" +
    "    <li><a href=\"#/view1\">view1</a></li>\n" +
    "    <li><a href=\"#/view2\">view2</a></li>\n" +
    "  </ul>\n" +
    "\n" +
    "  <div ng-view></div>\n" +
    "\n" +
    "  <div>Angular seed app: v<span app-version></span></div>\n" +
    "\n" +
    "</body>\n" +
    "</html>\n"
  );


  $templateCache.put('app/index.html',
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "\t<link rel=\"shortcut icon\" href=\"http://www.discoveractaspire.org/wp-content/uploads/2014/09/favicon.ico\" type=\"image/x-icon\">\n" +
    "\t<title>ACT Aspire Order Form</title>\n" +
    "    <!-- CSS -->\n" +
    "    <link rel=\"stylesheet\" href=\"css/bootstrap.min.css\">\n" +
    "    <link rel=\"stylesheet\" href=\"app.css\"> \n" +
    "    <link rel=\"stylesheet\" id=\"Telex-google-font-css\" href=\"http://fonts.googleapis.com/css?family=Telex%3Aregular&amp;subset=latin&amp;ver=4.2.5\" type=\"text/css\" media=\"all\"> \n" +
    "    \n" +
    "    <!-- JS -->\n" +
    "    <!-- load angular, nganimate, and ui-router -->\n" +
    "\n" +
    "    <script src=\"actaspire.js\"></script>\n" +
    "    \n" +
    "</head>\n" +
    "<body id=\"body\" ng-app=\"myApp\">\n" +
    "\n" +
    "<!-- views will be injected here -->\n" +
    "<div class=\"container-fluid fill\">\n" +
    "    <div ui-view></div>\n" +
    "</div>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );

}]);
