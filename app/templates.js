angular.module('myApp').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('app/form-customer.html',
    "<h3>1. Contact Information</h3>\n" +
    "\n" +
    "<div class=\"row\"><div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div></div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"form-group col-sm-3 required\">\n" +
    "        <label for=\"firstName\" class=\"control-label\">First Name</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.firstName\" required=\"required\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group col-sm-3 required\">\n" +
    "        <label for=\"lastName\" class=\"control-label\">Last Name</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"lastName\" ng-model=\"formData.customer.lastName\" required=\"required\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group col-sm-6 required\">\n" +
    "        <label for=\"organization\" class=\"control-label\">School / District / Organization</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"organization\" ng-model=\"formData.customer.organization\" required=\"required\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"form-group col-sm-6 required\">\n" +
    "        <label for=\"jobTitle\" class=\"control-label\">Job Title</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"jobTitle\" ng-model=\"formData.customer.jobTitle\" required=\"required\">\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"form-group col-sm-4 required\">\n" +
    "        <label for=\"email\" class=\"control-label\">Email</label>\n" +
    "        <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"formData.customer.email\" required=\"required\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"col-sm-6 form-group\">\n" +
    "\t    <label class=\"checkbox-inline\">\n" +
    "\t    \t<input type=\"checkbox\" ng-model=\"formData.customer.groupOrder\">\n" +
    "\t    \tPart of a Group Order\n" +
    "\t    </label>\n" +
    "\t</div>\n" +
    "\n" +
    "    <div class=\"form-group col-sm-6 required\" ng-show=\"formData.customer.groupOrder\">\n" +
    "        <label for=\"groupContact\" class=\"control-label\">Group Contact Name</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"groupContact\" ng-model=\"formData.customer.groupContact\" ng-required=\"formData.customer.groupOrder\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">Contact Information</div>\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"implementationName\" class=\"control-label\">Test Coordinator Contact Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"implementationName\" ng-model=\"formData.implementationContact.name\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"implementationEmail\" class=\"control-label\">Test Coordinator Contact Email</label>\n" +
    "                <input type=\"email\" class=\"form-control\" name=\"implementationEmail\" ng-model=\"formData.implementationContact.email\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"implementationPhone\" class=\"control-label\">Test Coordinator Contact Phone</label>\n" +
    "                <input type=\"tel\" class=\"form-control\" name=\"implementationPhone\" ng-model=\"formData.implementationContact.phone\" required=\"required\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"backupName\" class=\"control-label\">Backup Contact Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"backupName\" ng-model=\"formData.backupContact.name\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"backupEmail\" class=\"control-label\">Backup Contact Email</label>\n" +
    "                <input type=\"email\" class=\"form-control\" name=\"backupEmail\" ng-model=\"formData.backupContact.email\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"backupPhone\" class=\"control-label\">Backup Contact Phone</label>\n" +
    "                <input type=\"tel\" class=\"form-control\" name=\"backupPhone\" ng-model=\"formData.backupContact.phone\" required=\"required\">\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\">Billing Information</div>\n" +
    "    <div class=\"panel-body\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"billingName\" class=\"control-label\">Billing Contact Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"billingName\" ng-model=\"formData.billingContact.name\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"billingEmail\" class=\"control-label\">Billing Contact Email</label>\n" +
    "                <input type=\"email\" class=\"form-control\" name=\"billingEmail\" ng-model=\"formData.billingContact.email\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"billingPhone\" class=\"control-label\">Billing Contact Phone</label>\n" +
    "                <input type=\"tel\" class=\"form-control\" name=\"billingPhone\" ng-model=\"formData.billingContact.phone\" required=\"required\">\n" +
    "            </div>\n" +
    "        </div>    \n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-12 required\">\n" +
    "                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 1</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line1\" required=\"required\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-12\">\n" +
    "                <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 2</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"billingAddress\" ng-model=\"formData.billing.address.line2\">\n" +
    "            </div>\n" +
    "        </div>        \n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"city\" class=\"control-label\">City</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"city\" ng-model=\"formData.billing.address.city\" required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"state\" class=\"control-label\">State</label>\n" +
    "        \t\t<select class=\"form-control\" name=\"state\" ng-model=\"formData.billing.address.state\" ng-options=\"key as value for (key , value) in states\" required=\"required\"></select>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"zip\" class=\"control-label\">Zip</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"zip\" ng-model=\"formData.billing.address.zip\" required=\"required\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"col-sm-3 form-group\">\n" +
    "\t\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t\t    \t<input type=\"checkbox\" ng-model=\"formData.billing.taxExempt\">\n" +
    "\t\t\t    \tTax Exempt\n" +
    "\t\t\t    </label>\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t    <div class=\"col-sm-9\" ng-show=\"formData.billing.taxExempt\">\n" +
    "\t\t    Please email a copy of your exemption certificate to <a href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a>\n" +
    "\t\t    </div>\n" +
    "\t\t</div>      \n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "<h3>2. Summative Order Data</h3>\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"col-sm-12\">\n" +
    "  \t\t<h5>ACT Aspire Summative Test</h5>\n" +
    "  \t\t<ul>\n" +
    "\t\t    <li>Is a vertically scaled, standards-based battery of achievement test that are linked to the College and Career Readiness Standard in the subject areas of: English, mathmatics, reading, science and writing.</li>\t\t\t\t\n" +
    "\t\t    <li>Designed for Grades 3 - 10 and can be taken Online or in Paper form (paper administration requires an additional fee).</li>\n" +
    "\t\t    <li>Can be administered in a Spring test administration window or a Fall test administration window.</li>\n" +
    "\t\t    <li>If you know your intended or preferred test dates, subjects to be taken and estimated student counts, please include where applicable below.</li>\n" +
    "\t\t    <li>Prices are good till XX/XX/XX. If you have any questions regarding the product or placing an order please contact order@actaspire.org or 888-XXX-XXXX</li>\n" +
    "\t\t</ul>\n" +
    "\t</div>\t\t\n" +
    "</div>\n" +
    "\t\n" +
    "<div class=\"panel panel-default\" ng-repeat=\"order in formData.summative.orders\">\n" +
    "\t<div class=\"panel-heading\">\n" +
    "\t\t{{order.administrationWindow}} {{order.calendarYear}} Summative Order\n" +
    "\t\t<button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\" ng-click=\"removeOrder(formData.summative.orders, order)\">\n" +
    "\t\t\t<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "\t\t</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"panel-body\">\n" +
    "\t<h5>Subjects</h5>\n" +
    "\t<div class=\"row\">\n" +
    "    \t<div class=\"col-sm-2 form-group\" ng-repeat=\"(subject,enabled) in order.subjects\">\n" +
    "            <label class=\"checkbox-inline\">\n" +
    "            \t<input type=\"checkbox\" ng-model=\"order.subjects[subject]\">\n" +
    "            \t{{subject}}\n" +
    "            </label>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <h5>Printed Student Reports</h5>\n" +
    "    <div class=\"row\">\n" +
    "    \t<div class=\"col-sm-12 form-group\">\n" +
    "\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t    \t<input type=\"checkbox\" ng-model=\"order.individualReports\">\n" +
    "\t\t    \tAdd Printed Individual Student Reports\n" +
    "\t\t    </label>\n" +
    "\t    </div>\n" +
    "\t</div>\n" +
    "\t<div class=\"row\" ng-show=\"order.individualReports\">\n" +
    "    \t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t\t<label>\n" +
    "\t\t\t\t<input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"1\">\n" +
    "\t\t\t\t1 Report Per Student\n" +
    "\t\t\t</label>\n" +
    "\t\t\t<label>\n" +
    "\t\t\t\t<input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"2\">\n" +
    "\t\t\t\t2 Reports Per Student\n" +
    "\t\t\t</label>\t\t\t\n" +
    "\t    </div>\n" +
    "     \t<div class=\"col-sm-6 form-group\">\n" +
    "\t\t    <label class=\"checkbox-inline\">\n" +
    "\t\t    \t<input type=\"checkbox\" ng-model=\"order.scoreLabels\">\n" +
    "\t\t    \tAdd Printed Score Labels\n" +
    "\t\t    </label>\n" +
    "\t    </div>\n" +
    "\n" +
    "    </div>\n" +
    "\n" +
    "    <h5>\n" +
    "\t\tStudent Estimate\n" +
    "\t</h5>\n" +
    "\t<table class=\"table table-striped\">\n" +
    "\t\t<thead>\n" +
    "\t\t\t<th></th>\n" +
    "\t\t\t<th>Online Test</th>\n" +
    "\t\t\t<th>Paper Test</th>\n" +
    "\t\t\t<th>Total Student Estimate</th>\n" +
    "\t\t</thead>\n" +
    "\t\t<tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "\t\t\t<td>Grade {{grade}}</td>\n" +
    "\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\"></td>\n" +
    "\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].paper\" name=\"\"></td>\n" +
    "\t\t\t<td>{{order.grade[grade].online + order.grade[grade].paper}}</td>\n" +
    "\t\t</tr>\n" +
    "\t\t<tr>\n" +
    "\t\t\t<td>Total</td>\n" +
    "\t\t\t<td>{{order.onlineTotal}}</td>\n" +
    "\t\t\t<td>{{order.paperTotal}}</td>\n" +
    "\t\t\t<td>{{order.paperTotal + order.onlineTotal}}</td>\n" +
    "\t\t</tr>\n" +
    "\t</table>\n" +
    "</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"form-group col-sm-5\">\n" +
    "\t\t<label for=\"administrationWindow\" class=\"control-label\">Test Administration Window</label>\n" +
    "\t\t<select class=\"form-control\" name=\"administrationWindow\" ng-model=\"summative.administrationWindow\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "      \t\t<option ng-repeat=\"item in administrationWindows\" value=\"{{item}}\">{{item}}</option>\n" +
    "\t\t </select>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group col-sm-5\">\n" +
    "\t\t<label for=\"calendarYear\" class=\"control-label\">Calendar Year</label>\n" +
    "\t\t<select class=\"form-control\" name=\"calendarYear\" ng-model=\"summative.calendarYear\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "      \t\t<option ng-repeat=\"item in calendarYears\" value=\"{{item}}\">{{item}}</option>\n" +
    "\t\t </select>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group col-sm-2\">\n" +
    "\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t<div>\n" +
    "\t\t\t<button type=\"button\" ng-model=\"addSummativeOrderButton\" ng-click=\"addOrder(formData.summative.orders, summative.calendarYear, summative.administrationWindow, summative.error)\" class=\"btn btn-default\" ng-disabled=\"!summative.calendarYear || !summative.administrationWindow\">Add to Order</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"summative.error\">\n" +
    "\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t{{summative.error}}\n" +
    "\t</div>\n" +
    "</div> \t\n" +
    "\n" +
    "<h3>3. Periodic Order Data</h3>\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"col-sm-12\">\n" +
    "  \t\t<h5>ACT Aspire Periodic</h5>\n" +
    "  \t\t<ul>\n" +
    "\t\t    <li>Is a complement to the ACT Aspire Summative test, this is a school year long subscription to access a series of interim tests and classroom quizzes in the subject areas of: English, mathmatics, reading, science and writing.</li>\n" +
    "\t\t    <li>Interim tests are designed for Grades 3 - 10 and can be taken Online, Classroom quizzez are designed for Grades 3-8 also only in Online.</li>\n" +
    "\t\t    <li>Can be administered throughout the year to students and provide immediate analysis and reporting.</li>\n" +
    "\t\t    <li>Bundle with ACT Aspire Summative test and receive a per student discount off of the Summative test (see discount below).</li>\n" +
    "\t\t    <li>Prices are good till XX/XX/XX. If you have any questions regarding the product or placing an order please contact order@actaspire.org or 888-XXX-XXXX</li>\n" +
    "\t\t</ul>\n" +
    "\t</div>\t\t\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"panel panel-default\" ng-repeat=\"order in formData.periodic.orders\">\n" +
    "\t<div class=\"panel-heading\">\n" +
    "\t\t{{order.calendarYear}} Periodic Order\n" +
    "\t\t<button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\" ng-click=\"removeOrder(formData.periodic.orders, order)\">\n" +
    "\t\t\t<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "\t\t</button>\n" +
    "\t</div>\n" +
    "\t<div class=\"panel-body\">\n" +
    "\t\tStudent Estimate\n" +
    "\t</div>\n" +
    "\t<table class=\"table table-striped\">\n" +
    "\t\t<thead>\n" +
    "\t\t\t<th></th>\n" +
    "\t\t\t<th>Online Test</th>\n" +
    "\t\t</thead>\n" +
    "\t\t<tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "\t\t\t<td>Grade {{grade}}</td>\n" +
    "\t\t\t<td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\"></td>\n" +
    "\t\t</tr>\n" +
    "\t\t<tr>\n" +
    "\t\t\t<td>Total</td>\n" +
    "\t\t\t<td>{{order.onlineTotal}}</td>\n" +
    "\t\t</tr>\n" +
    "\t</table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"form-group col-sm-5\">\n" +
    "\t\t<label for=\"schoolYear\" class=\"control-label\">School Year</label>\n" +
    "\t\t<select class=\"form-control\" name=\"schoolYear\" ng-model=\"periodic.schoolYear\">\n" +
    "\t\t\t<option value=\"\">---Please select---</option>\n" +
    "      \t\t<option ng-repeat=\"item in calendarYears\" value=\"{{item | schoolYear}}\">{{item | schoolYear}}</option>\n" +
    "\t\t </select>\n" +
    "\t</div>\n" +
    "\t<div class=\"form-group col-sm-2\">\n" +
    "\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t<div>\n" +
    "\t\t\t<button type=\"button\" ng-model=\"addPeriodicOrderButton\" ng-click=\"addOrder(formData.periodic.orders, periodic.schoolYear)\"  class=\"btn btn-default\" ng-disabled=\"!periodic.schoolYear\">Add to Order</button>\n" +
    "\t\t</div>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"periodic.error\">\n" +
    "\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t{{periodic.error}}\n" +
    "\t</div>\n" +
    "</div> \t\n" +
    "\n" +
    "<h3>4. Order Summary</h3>\n" +
    "<div class=\"panel panel-default\">\n" +
    "\t<div class=\"panel-heading\">\n" +
    "\t\tOrder Summary\n" +
    "\t</div>\n" +
    "\t<div class=\"panel-body\">\n" +
    "\t\t<div class=\"row\">\n" +
    "\t\t\t<div class=\"form-group col-sm-4\">\n" +
    "\t\t\t\t<label for=\"discountCode\" class=\"control-label\">Discount Code</label>\n" +
    "\t\t\t\t<input type=\"text\" class=\"form-control\" name=\"discountCode\" ng-model=\"discountCode\">\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"col-sm-2\">\n" +
    "\t\t\t\t<label class=\"control-label\">&nbsp;</label>\n" +
    "\t\t\t\t<div>\n" +
    "\t\t\t\t\t<button type=\"button\" ng-click=\"addDiscountCode(discountCode); discountCode = '';\" class=\"btn btn-default\">Add</button>\n" +
    "\t\t\t\t</div>\n" +
    "\t\t\t</div>\n" +
    "\t\t</div>\n" +
    "\t\t<div class=\"row\">\t\n" +
    "\t\t\t<div class=\"col-sm-6\" ng-show=\"!formData.summary.discount.special.error\">\n" +
    "\t\t\t\t<p class=\"coupon-code\">{{formData.summary.discount.special.code}}</p>\n" +
    "\t\t\t</div>\n" +
    "\t\t\t<div class=\"alert alert-danger\" role=\"alert\" ng-show=\"formData.summary.discount.special.error\">\n" +
    "\t\t\t\t<span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t\t<span class=\"sr-only\">Error:</span>\n" +
    "\t\t\t\t{{formData.summary.discount.special.error}}\n" +
    "\t\t\t</div>\n" +
    "\t\t</div> \t\n" +
    "\t</div>\n" +
    "\t<table class=\"table table-striped\">\n" +
    "\t\t<thead>\n" +
    "\t\t\t<th>Order</th>\n" +
    "\t\t\t<th>Total Student</th>\n" +
    "\t\t\t<th>Price</th>\n" +
    "\t\t\t<th>Extended Price</th>\n" +
    "\t\t\t<th>Discounts</th>\n" +
    "\t\t\t<th>Total Discount</th>\n" +
    "\t\t\t<th>Order Balance</th>\n" +
    "\t\t</thead>\n" +
    "\t\t<tbody>\n" +
    "\t\t\t<tr ng-repeat=\"order in formData.summative.orders\">\n" +
    "\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear}} Summative Order Online</td>\n" +
    "\t\t\t\t<td>{{order.online.total}}</td>\n" +
    "\t\t\t\t<td>{{order.online.price  | currency}}</td>\n" +
    "\t\t\t\t<td>{{order.online.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t<td>\n" +
    "\t\t\t\t\t<div ng-show=\"order.online.discounts.volume\">{{order.online.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.online.discounts.multiGrade\">{{order.online.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.online.discounts.periodic\">{{order.online.discounts.periodic | currency}} (Periodic)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.online.discounts.special\">{{order.online.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t<div>{{order.online.totalDiscountPerStudent | currency}}</div>\n" +
    "\t\t\t\t</td>\t\n" +
    "\t\t\t\t<td>{{order.online.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t</td>\n" +
    "\t\t\t\t<td>{{order.online.balance | currency}}</td>\t\t\t\t\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"order in formData.summative.orders\">\n" +
    "\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear}} Summative Paper Online</td>\n" +
    "\t\t\t\t<td>{{order.paper.total}}</td>\n" +
    "\t\t\t\t<td>{{order.paper.price  | currency}}</td>\n" +
    "\t\t\t\t<td>{{order.paper.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t<td>\n" +
    "\t\t\t\t\t<div ng-show=\"order.paper.discounts.volume\">{{order.paper.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.paper.discounts.multiGrade\">{{order.paper.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.paper.discounts.periodic\">{{order.paper.discounts.periodic | currency}} (Periodic)</div>\n" +
    "\t\t\t\t\t<div ng-show=\"order.paper.discounts.special\">{{order.paper.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t<div>{{order.paper.totalDiscountPerStudent | currency}}</div>\n" +
    "\t\t\t\t</td>\t\n" +
    "\t\t\t\t<td>{{order.paper.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t</td>\n" +
    "\t\t\t\t<td>{{order.paper.balance | currency}}</td>\t\t\t\t\n" +
    "\t\t\t</tr>\n" +
    "\t\t\t<tr ng-repeat=\"order in formData.periodic.orders\">\n" +
    "\t\t\t\t<td>{{order.administrationWindow}} {{order.calendarYear}} Periodic Order Online</td>\n" +
    "\t\t\t\t<td>{{order.onlineTotal}}</td>\n" +
    "\t\t\t\t<td>{{order.price  | currency}}</td>\n" +
    "\t\t\t\t<td>{{order.extendedPrice | currency}}</td>\n" +
    "\t\t\t\t<td>\n" +
    "\t\t\t\t\t<div ng-show=\"order.discounts.special\">{{order.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t<div>{{order.totalDiscountPerStudent | currency}}</div>\n" +
    "\t\t\t\t</td>\t\n" +
    "\t\t\t\t<td>{{order.totalDiscount | currency}}</td>\n" +
    "\t\t\t\t</td>\n" +
    "\t\t\t\t<td>{{order.balance | currency}}</td>\t\t\t\t\t\t\n" +
    "\t\t\t</tr>\n" +
    "\t\t</tbody>\n" +
    "\t</table>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"panel panel-default\">\n" +
    "\t<div class=\"panel-heading\">Additional Comments</div>\n" +
    "\t<div class=\"panel-body\">\n" +
    "\t\t<textarea class=\"form-control\" rows=\"3\" ng-model=\"formData.comments\"></textarea>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "\t<div class=\"col-sm-4 form-group\">\n" +
    "\t    <label class=\"checkbox-inline\">\n" +
    "\t    \t<input type=\"checkbox\" ng-model=\"formData.acceptTerms\">\n" +
    "\t    \tI agree to ACT Aspire's <a href=\"./json/ActAspireTermsAndConditions.pdf\" target=\"_blank\">Terms and Conditions</a>\n" +
    "\t    </label>\n" +
    "\t</div>\n" +
    "</div>\n" +
    "<div class=\"row\" ng-show=\"formData.acceptTerms\">\n" +
    "    <div class=\"form-group col-sm-12 required\">\n" +
    "        <label for=\"firstName\" class=\"control-label\">Signature:</label>\n" +
    "        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.signature\" required=\"required\" placeholder=\"Enter your name as a signature\">\n" +
    "    </div>\n" +
    "</div>\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-sm-4\">\n" +
    "  \t\t<button type=\"submit\" class=\"btn btn-default\" ng-disabled=\"customerForm.$invalid || customerForm.$pending || !formData.acceptTerms\">Submit Order</button>\n" +
    "    </div>\n" +
    "\t<div class=\"col-sm-4\">\n" +
    "  \t\t<button type=\"button\" class=\"btn btn-default\" ng-click=\"saveDraft()\">Save Draft</button>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n" +
    "\n"
  );


  $templateCache.put('app/form.html',
    "\n" +
    "  \n" +
    "  <div id=\"form-container\">\n" +
    "    <h2>ACT Aspire Order Form</h2>\n" +
    "    <div class=\"col-sm-12\">\n" +
    "      <p>\n" +
    "        Congratulations on your decision to order ACT Aspire! To help ensure your order is accurate please fill in all applicable boxes. This will ensure accurate order.\n" +
    "      </p>\n" +
    "      <p>\n" +
    "        Pricing valid through {{cost.pricing.validThrough}}\n" +
    "      </p>\n" +
    "    </div>\n" +
    "      <!-- use ng-submit to catch the form submission and use our Angular function -->\n" +
    "      <form id=\"customerForm\" name=\"customerForm\" ng-submit=\"processForm()\">        \n" +
    "        <!-- our nested state views will be injected here -->\n" +
    "        <div id=\"form-views\" ui-view></div>\n" +
    "      </form>\n" +
    "  \n" +
    "  </div>\n" +
    "\n"
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
    "\n" +
    "    <!-- CSS -->\n" +
    "    <link rel=\"stylesheet\" href=\"css/bootstrap.min.css\">\n" +
    "    <link rel=\"stylesheet\" href=\"app.css\">  \n" +
    "    \n" +
    "    <!-- JS -->\n" +
    "    <!-- load angular, nganimate, and ui-router -->\n" +
    "\n" +
    "    <script src=\"actaspire.js\"></script>\n" +
    "    \n" +
    "</head>\n" +
    "<body ng-app=\"myApp\">\n" +
    "\n" +
    "<!-- views will be injected here -->\n" +
    "<div class=\"container\">\n" +
    "    <div ui-view></div>\n" +
    "</div>\n" +
    "\n" +
    "</body>\n" +
    "</html>"
  );

}]);
