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
    "    <h2>ACT Aspire Order Form</h2>\n" +
    "    <div class=\"col-sm-12\">\n" +
    "        <p>\n" +
    "            Thank you for your decision to order ACT Aspire! To help ensure your order is accurate please fill in all\n" +
    "            applicable boxes.\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            If you have any questions on the order form below, please contact <a href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a>\n" +
    "            or 1-855-730-0400\n" +
    "        </p>\n" +
    "        <p>\n" +
    "            Pricing valid through {{cost.pricing.validThrough}}\n" +
    "        </p>\n" +
    "    </div>\n" +
    "    <!-- use ng-submit to catch the form submission and use our Angular function -->\n" +
    "    <form id=\"customerForm\" name=\"customerForm\" ng-submit=\"processForm()\">\n" +
    "\n" +
    "        <h3>1. Contact Information</h3>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"firstName\" class=\"control-label\">First Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.firstName\"\n" +
    "                       required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"lastName\" class=\"control-label\">Last Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"lastName\" ng-model=\"formData.customer.lastName\"\n" +
    "                       required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"organization\" class=\"control-label\">School / District / Organization</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"organization\" ng-model=\"formData.customer.organization\"\n" +
    "                       required=\"required\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"jobTitle\" class=\"control-label\">Job Title</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"jobTitle\" ng-model=\"formData.customer.jobTitle\"\n" +
    "                       required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4 required\">\n" +
    "                <label for=\"email\" class=\"control-label\">Email</label>\n" +
    "                <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"formData.customer.email\"\n" +
    "                       required=\"required\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-4\">\n" +
    "                <label for=\"howHeard\" class=\"control-label\">Tell Us How You Heard About Us</label>\n" +
    "                <select class=\"form-control\" name=\"howHeard\" ng-model=\"formData.customer.howHeard\"\n" +
    "                        ng-options=\"option for option in cost.howHeardOptions\" />\n" +
    "            </div>\n" +
    "\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-6 form-group\">\n" +
    "                <label class=\"checkbox-inline\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"formData.customer.groupOrder\">\n" +
    "                    Are you part of a group order?\n" +
    "                </label>\n" +
    "                <p><a href=\"http://www.discoveractaspire.org/order/\" target=\"_blank\">Not sure? Find more information\n" +
    "                    about Group Orders</a></p>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group col-sm-6 required\" ng-show=\"formData.customer.groupOrder\">\n" +
    "                <label for=\"groupContact\" class=\"control-label\">Group Owner Name</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"groupContact\" ng-model=\"formData.customer.groupContact\"\n" +
    "                       ng-required=\"formData.customer.groupOrder\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Contact Information</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"implementationName\" class=\"control-label\">Test Coordinator Contact Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"implementationName\"\n" +
    "                               ng-model=\"formData.implementationContact.name\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"implementationEmail\" class=\"control-label\">Test Coordinator Contact Email</label>\n" +
    "                        <input type=\"email\" class=\"form-control\" name=\"implementationEmail\"\n" +
    "                               ng-model=\"formData.implementationContact.email\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"implementationPhone\" class=\"control-label\">Test Coordinator Contact Phone</label>\n" +
    "                        <input type=\"tel\" class=\"form-control\" name=\"implementationPhone\"\n" +
    "                               ng-model=\"formData.implementationContact.phone\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"backupName\" class=\"control-label\">Backup Contact Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"backupName\" ng-model=\"formData.backupContact.name\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"backupEmail\" class=\"control-label\">Backup Contact Email</label>\n" +
    "                        <input type=\"email\" class=\"form-control\" name=\"backupEmail\"\n" +
    "                               ng-model=\"formData.backupContact.email\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"backupPhone\" class=\"control-label\">Backup Contact Phone</label>\n" +
    "                        <input type=\"tel\" class=\"form-control\" name=\"backupPhone\"\n" +
    "                               ng-model=\"formData.backupContact.phone\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Billing Information</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <p>If you are tax exempt, please email a copy of your exemption certificate to <a\n" +
    "                                href=\"mailto:Orders@ActAspire.org\">Orders@ActAspire.org</a></p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingName\" class=\"control-label\">Billing Contact Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingName\"\n" +
    "                               ng-model=\"formData.billingContact.name\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingEmail\" class=\"control-label\">Billing Contact Email</label>\n" +
    "                        <input type=\"email\" class=\"form-control\" name=\"billingEmail\"\n" +
    "                               ng-model=\"formData.billingContact.email\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingPhone\" class=\"control-label\">Billing Contact Phone</label>\n" +
    "                        <input type=\"tel\" class=\"form-control\" name=\"billingPhone\"\n" +
    "                               ng-model=\"formData.billingContact.phone\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-12 required\">\n" +
    "                        <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 1</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingAddress\"\n" +
    "                               ng-model=\"formData.billing.address.line1\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-12\">\n" +
    "                        <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 2</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingAddress\"\n" +
    "                               ng-model=\"formData.billing.address.line2\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"city\" class=\"control-label\">City</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"city\" ng-model=\"formData.billing.address.city\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"state\" class=\"control-label\">State</label>\n" +
    "                        <select class=\"form-control\" name=\"state\" ng-model=\"formData.billing.address.state\"\n" +
    "                                ng-options=\"key as value for (key , value) in states\" required=\"required\"></select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"zip\" class=\"control-label\">Zip</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"zip\" ng-model=\"formData.billing.address.zip\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4\">\n" +
    "                        <label for=\"purchaseOrderNumber\" class=\"control-label\">Purchase Order #</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"city\"\n" +
    "                               ng-model=\"formData.billing.purchaseOrderNumber\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-12\">\n" +
    "                        <p>* Providing contact information subscribes users to ACT Aspire communications.</p>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <h3>2. Summative Order Data</h3>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <h5>ACT Aspire Summative Test</h5>\n" +
    "                <ul>\n" +
    "                    <li>Is a vertically scaled, standards-based battery of achievement test that are linked to the\n" +
    "                        College and Career Readiness Standard in the subject areas of: English, mathematics, reading,\n" +
    "                        science and writing.\n" +
    "                    </li>\n" +
    "                    <li>Designed for Grades 3 - 10 and can be taken Online or in Paper form (paper administration\n" +
    "                        requires an additional fee).\n" +
    "                    </li>\n" +
    "                    <li>Can be administered in a Spring test administration window or a Fall test administration\n" +
    "                        window.\n" +
    "                    </li>\n" +
    "                    <li>When ordering Summative assessments, the following discounts are available*:\n" +
    "                        <ul>\n" +
    "                            <li>Test four or more grades of students: $1.00 off</li>\n" +
    "                            <li>Test 400 to 1,000 students: $1.00 off</li>\n" +
    "                            <li>Test over 1,000 students: $2.00 off</li>\n" +
    "                            <li>Bundle Periodic to Summative order: $4.00 off (applied to Summative)</li>\n" +
    "                        </ul>\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\" ng-repeat=\"order in orders.summative.orders\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                {{order.administrationWindow}} {{order.calendarYear}} Summative Order\n" +
    "                <button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\"\n" +
    "                        ng-click=\"removeOrder(orders.summative.orders, order)\">\n" +
    "                    <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div ng-show=\"order.cost.lateFee\" class=\"alert alert-danger\">\n" +
    "                    A late fee of {{order.cost.lateFee | currency}} will be applied to this order.\n" +
    "                </div>\n" +
    "                <div ng-show=\"order.cost.dates\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"form-group col-sm-4\">\n" +
    "                            <label for=\"preferredDate\" class=\"control-label\">What is your preferred start date to\n" +
    "                                administer the assessments?</label>\n" +
    "                            <select class=\"form-control\" name=\"preferredDate\" ng-model=\"order.preferredDate\"\n" +
    "                                    ng-options=\"option for option in order.cost.dates\" />\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <h5>Subjects</h5>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-2 form-group\" ng-repeat=\"(subject,enabled) in order.subjects\">\n" +
    "                        <label class=\"checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"order.subjects[subject]\">\n" +
    "                            {{subject}}\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <h5>Printed Student Reports</h5>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-6 form-group\">\n" +
    "                        <label class=\"checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"order.individualReports\">\n" +
    "                            Add Printed Individual Student Reports\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-6 form-group\">\n" +
    "                        <label class=\"checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"order.scoreLabels\">\n" +
    "                            Add Printed Score Labels\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-6 form-group\">&nbsp;\n" +
    "                        <div ng-show=\"order.individualReports\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"1\">\n" +
    "                                Individual Score Reports (x1 per student) - {{order.cost.isr | currency}}\n" +
    "                            </label>\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"order.reportsPerStudent\" value=\"2\">\n" +
    "                                Individual Score Reports (x2 per student) - {{order.cost.isr * 2 | currency}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-6 form-group\">&nbsp;\n" +
    "                        <div ng-show=\"order.scoreLabels\">\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"order.scoreLabelsPerStudent\" value=\"1\">\n" +
    "                                Printed Score Labels (x1 per student) - {{order.cost.labels | currency}}\n" +
    "                            </label>\n" +
    "                            <label>\n" +
    "                                <input type=\"radio\" ng-model=\"order.scoreLabelsPerStudent\" value=\"2\">\n" +
    "                                Printed Score Labels (x2 per student) - {{order.cost.labels * 2 | currency}}\n" +
    "                            </label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <table class=\"table table-striped\">\n" +
    "                    <thead>\n" +
    "                    <th></th>\n" +
    "                    <th>Online Test</th>\n" +
    "                    <th>Paper Test</th>\n" +
    "                    <th>Total Student Estimate</th>\n" +
    "                    </thead>\n" +
    "                    <tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "                        <td>Grade {{grade}}</td>\n" +
    "                        <td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\" min=\"0\"></td>\n" +
    "                        <td><input type=\"number\" ng-model=\"order.grade[grade].paper\" name=\"\" min=\"0\"></td>\n" +
    "                        <td>{{order.grade[grade].online + order.grade[grade].paper}}</td>\n" +
    "                    </tr>\n" +
    "                    <tr>\n" +
    "                        <td>Total</td>\n" +
    "                        <td>{{order.online.total}}</td>\n" +
    "                        <td>{{order.paper.total}}</td>\n" +
    "                        <td>{{order.paper.total + order.online.total}}</td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-7\">\n" +
    "                <label for=\"calendarYear\" class=\"control-label\">What administrative window and year would you like to\n" +
    "                    order?</label>\n" +
    "                <select class=\"form-control\" name=\"calendarYear\" ng-model=\"summative.calendarYear\">\n" +
    "                    <option value=\"\">---Please select---</option>\n" +
    "                    <option ng-repeat=\"item in cost.pricing.summative\" value=\"{{item.semester}} {{item.year}}\">\n" +
    "                        {{item.semester}} {{item.year}}\n" +
    "                    </option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-2\">\n" +
    "                <label class=\"control-label\">&nbsp;</label>\n" +
    "                <div>\n" +
    "                    <button type=\"button\" ng-model=\"addSummativeOrderButton\"\n" +
    "                            ng-click=\"addOrder(orders.summative.orders, summative.calendarYear, summative.error)\"\n" +
    "                            class=\"btn btn-primary\" ng-disabled=\"!summative.calendarYear\">Order Assessments\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"alert alert-danger\" role=\"alert\" ng-show=\"summative.error\">\n" +
    "                <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "                <span class=\"sr-only\">Error:</span>\n" +
    "                {{summative.error}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <h3>3. Periodic Order Data</h3>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12\">\n" +
    "                <h5>ACT Aspire Periodic</h5>\n" +
    "                <ul>\n" +
    "                    <li>Is a complement to the ACT Aspire Summative test, offered via ACT Aspire’s Online platform.</li>\n" +
    "                    <li>Includes access to Classroom quizzes (designed for grades 3 – 8) as well as Interim Assessments\n" +
    "                        (designed for grades 3 – 10)\n" +
    "                    </li>\n" +
    "                    <li>Is a subscription to access a series of interim tests and classroom quizzes in the subject areas\n" +
    "                        of: English, mathematics, reading, and science. The subscription is effective from September\n" +
    "                        through June of each school year.\n" +
    "                    </li>\n" +
    "                    <li>Can be administered to students throughout the year and provides immediate performance analysis\n" +
    "                        and score reporting.\n" +
    "                    </li>\n" +
    "                    <li>Can be bundled with ACT Aspire Summative test at a per-student discount off of the Summative\n" +
    "                        test (discount will be automatically applied. Refer to Order Summary below).\n" +
    "                    </li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\" ng-repeat=\"order in orders.periodic.orders\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                {{order.calendarYear | schoolYear}} Periodic Order\n" +
    "                <button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\"\n" +
    "                        ng-click=\"removeOrder(orders.periodic.orders, order)\">\n" +
    "                    <span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <table class=\"table table-striped\">\n" +
    "                <thead>\n" +
    "                <th></th>\n" +
    "                <th>Online Test</th>\n" +
    "                </thead>\n" +
    "                <tr ng-repeat=\"grade in [3,4,5,6,7,8,9,10]\">\n" +
    "                    <td>Grade {{grade}}</td>\n" +
    "                    <td><input type=\"number\" ng-model=\"order.grade[grade].online\" name=\"\" min=\"0\"></td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td>Total</td>\n" +
    "                    <td>{{order.onlineTotal}}</td>\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"form-group col-sm-7\">\n" +
    "                <label for=\"schoolYear\" class=\"control-label\">What school year would you like to order?</label>\n" +
    "                <select class=\"form-control\" name=\"schoolYear\" ng-model=\"periodic.schoolYear\">\n" +
    "                    <option value=\"\">---Please select---</option>\n" +
    "                    <option ng-repeat=\"item in cost.periodicCalendarYears\" value=\"{{item}}\">{{item | schoolYear}}\n" +
    "                    </option>\n" +
    "                </select>\n" +
    "            </div>\n" +
    "            <div class=\"form-group col-sm-2\">\n" +
    "                <label class=\"control-label\">&nbsp;</label>\n" +
    "                <div>\n" +
    "                    <button type=\"button\" ng-model=\"addPeriodicOrderButton\"\n" +
    "                            ng-click=\"addOrder(orders.periodic.orders, periodic.schoolYear)\" class=\"btn btn-primary\"\n" +
    "                            ng-disabled=\"!periodic.schoolYear\">Order Assessments\n" +
    "                    </button>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"alert alert-danger\" role=\"alert\" ng-show=\"periodic.error\">\n" +
    "                <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "                <span class=\"sr-only\">Error:</span>\n" +
    "                {{periodic.error}}\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <h3>4. Order Summary</h3>\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                Order Summary\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"col-sm-6 form-group\">\n" +
    "                        <label class=\"checkbox-inline\">\n" +
    "                            <input type=\"checkbox\" ng-model=\"formData.hasDiscountCode\">\n" +
    "                            Do you have a discount coupon code?\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                    <div class=\"form-group col-sm-4\" ng-show=\"formData.hasDiscountCode\">\n" +
    "                        <label for=\"discountCode\" class=\"control-label\">Discount Code</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"discountCode\" ng-model=\"discountCode\">\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-2\" ng-show=\"formData.hasDiscountCode\">\n" +
    "                        <label class=\"control-label\">&nbsp;</label>\n" +
    "                        <div>\n" +
    "                            <button type=\"button\" ng-click=\"addDiscountCode(discountCode); discountCode = '';\"\n" +
    "                                    class=\"btn btn-default\">Add\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\" ng-show=\"formData.hasDiscountCode\">\n" +
    "                    <div class=\"col-sm-offset-6 col-sm-6\" ng-show=\"!formData.summary.discount.special.error\">\n" +
    "                        <p class=\"coupon-code\">{{formData.summary.discount.special.code}}</p>\n" +
    "                    </div>\n" +
    "                    <div class=\"col-sm-offset-6 col-sm-6 alert alert-danger\" role=\"alert\"\n" +
    "                         ng-show=\"formData.summary.discount.special.error\">\n" +
    "                        <span class=\"glyphicon glyphicon-exclamation-sign\" aria-hidden=\"true\"></span>\n" +
    "                        <span class=\"sr-only\">Error:</span>\n" +
    "                        {{formData.summary.discount.special.error}}\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <table class=\"table table-striped table-condensed\">\n" +
    "                <thead>\n" +
    "                <th>Product Ordered</th>\n" +
    "                <th>Total Student</th>\n" +
    "                <th>Price</th>\n" +
    "                <th>Extended Price</th>\n" +
    "                <th>Discounts</th>\n" +
    "                <th>Total Discount</th>\n" +
    "                <th>Order Balance</th>\n" +
    "                </thead>\n" +
    "                <tbody>\n" +
    "                <tr ng-repeat=\"order in orders.summative.orders | filter:notZero('online')\">\n" +
    "                    <td>{{order.administrationWindow}} {{order.calendarYear}} Summative Order Online</td>\n" +
    "                    <td>{{order.online.total}}</td>\n" +
    "                    <td>\n" +
    "                        <div ng-show=\"order.individualReports || order.scoreLabels\">\n" +
    "                            <div>{{order.cost.online | currency}}</div>\n" +
    "                            <div ng-show=\"order.individualReports\">{{order.reportsPerStudent * order.cost.isr |\n" +
    "                                currency}} (ISR)\n" +
    "                            </div>\n" +
    "                            <div ng-show=\"order.scoreLabels\">{{order.scoreLabelsPerStudent * order.cost.labels | currency}} (Labels)</div>\n" +
    "                            <hr />\n" +
    "                        </div>\n" +
    "                        <div>{{order.online.price | currency}}</div>\n" +
    "                    </td>\n" +
    "                    <td>{{order.online.extendedPrice | currency}}</td>\n" +
    "                    <td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.online.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.volume\">{{order.online.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.multiGrade\">{{order.online.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.periodic\">{{order.online.discounts.periodic | currency}} ({{order.online.periodicNumberApplied | number : 1 }} Periodic @ {{cost.discounts.periodic.discountPer | currency}})</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.state\">{{order.online.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.online.discounts.special\">{{order.online.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "                        <div>{{order.online.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "                    </td>\n" +
    "                    <td>{{order.online.totalDiscount | currency}}</td>\n" +
    "                    <td>{{order.online.balance | currency}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"order in orders.summative.orders | filter:notZero('paper')\">\n" +
    "                    <td>{{order.administrationWindow}} {{order.calendarYear}} Summative Order Paper</td>\n" +
    "                    <td>{{order.paper.total}}</td>\n" +
    "                    <td>\n" +
    "                        <div ng-show=\"order.individualReports || order.scoreLabels\">\n" +
    "                            <div>{{order.cost.paper | currency}}</div>\n" +
    "                            <div ng-show=\"order.individualReports\">{{order.reportsPerStudent * order.cost.isr |\n" +
    "                                currency}} (ISR)\n" +
    "                            </div>\n" +
    "                            <div ng-show=\"order.scoreLabels\">{{order.scoreLabelsPerStudent * order.cost.labels | currency}} (Labels)</div>\n" +
    "                            <hr />\n" +
    "                        </div>\n" +
    "                        <div>{{order.paper.price | currency}}</div>\n" +
    "                    </td>\n" +
    "                    <td>{{order.paper.extendedPrice | currency}}</td>\n" +
    "                    <td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.paper.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.volume\">{{order.paper.discounts.volume | currency}} (Volume)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.multiGrade\">{{order.paper.discounts.multiGrade | currency}} (Multi-Grade)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.periodic\">{{order.paper.discounts.periodic | currency}} ({{order.paper.periodicNumberApplied | number : 1 }} Periodic @ {{cost.discounts.periodic.discountPer | currency}})</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.state\">{{order.paper.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.paper.discounts.special\">{{order.paper.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "                        <div>{{order.paper.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "                    </td>\n" +
    "                    <td>{{order.paper.totalDiscount | currency}}</td>\n" +
    "                    <td>{{order.paper.balance | currency}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"order in orders.periodic.orders\">\n" +
    "                    <td>{{order.administrationWindow}} {{order.calendarYear | schoolYear}} Periodic Order Online</td>\n" +
    "                    <td>{{order.onlineTotal}}</td>\n" +
    "                    <td>{{order.price | currency}}</td>\n" +
    "                    <td>{{order.extendedPrice | currency}}</td>\n" +
    "                    <td>\n" +
    "\t\t\t\t\t\t<span ng-show=\"order.totalDiscountPerStudent\">\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.discounts.state\">{{order.discounts.state | currency}} (State)</div>\n" +
    "\t\t\t\t\t\t\t<div ng-show=\"order.discounts.special\">{{order.discounts.special | currency}} (Special)</div>\n" +
    "\t\t\t\t\t\t\t<hr />\n" +
    "\t\t\t\t\t\t</span>\n" +
    "                        <div>{{order.totalDiscountPerStudent | currency}} (Total Discount)</div>\n" +
    "                    </td>\n" +
    "                    <td>{{order.totalDiscount | currency}}</td>\n" +
    "                    <td>{{order.balance | currency}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-repeat=\"order in orders.summative.orders\" ng-if=\"order.cost.lateFee\">\n" +
    "                    <td>Late Fee</td>\n" +
    "                    <td>--</td>\n" +
    "                    <td>{{order.cost.lateFee | currency}}</td>\n" +
    "                    <td>--</td>\n" +
    "                    <td>--</td>\n" +
    "                    <td>--</td>\n" +
    "                    <td>{{order.cost.lateFee | currency}}</td>\n" +
    "                </tr>\n" +
    "                <tr>\n" +
    "                    <td colspan=\"7\">\n" +
    "                        <h4>Total: {{formData.summary.total | currency}} <span ng-show=\"formData.summary.tax\"> + {{formData.summary.tax | currency}} ({{formData.summary.taxRate}} Sales Tax) = {{formData.summary.totalWithTax | currency}}</span>\n" +
    "                        </h4>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Additional Comments</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <textarea class=\"form-control\" rows=\"3\" ng-model=\"formData.comments\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12 form-group\">\n" +
    "                <label class=\"checkbox-inline\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"formData.acceptTerms\">\n" +
    "                    I agree to ACT Aspire's <a href=\"./json/ActAspireTermsAndConditions.pdf\" target=\"_blank\">Terms and\n" +
    "                    Conditions</a> as updated as of August 8th, 2016.\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\" ng-show=\"formData.acceptTerms\">\n" +
    "            <div class=\"form-group col-sm-12 required\">\n" +
    "                <label for=\"signature\" class=\"control-label\">Signature:</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"signature\" ng-model=\"formData.customer.signature\"\n" +
    "                       required=\"required\" placeholder=\"Enter your name as a signature\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <p>* Please note - all orders shall be subject to a cancellation fee.</p>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\"\n" +
    "                        ng-disabled=\"customerForm.$invalid || customerForm.$pending || !formData.acceptTerms || !formData.summary.total\">\n" +
    "                    Submit Order\n" +
    "                </button>\n" +
    "            </div>\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <button type=\"button\" class=\"btn btn-default\" ng-click=\"printPage()\">Print Page</button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div ui-view></div>\n"
  );


  $templateCache.put('app/form-isr.html',
    "<div ng-show=\"$state.is('form.isr')\">\n" +
    "    <p>This form should be filled out by organizations wishing to purchase printed score reports and labels for the\n" +
    "        <strong>{{cost.currentSemester}} {{cost.currentYear}}</strong> test administration of ACT Aspire. The deadline\n" +
    "        for ordering <strong>{{cost.currentSemester}} {{cost.currentYear}}</strong> reports is {{cost.deadline}}</p>\n" +
    "\n" +
    "    <form id=\"trainingForm\" name=\"trainingForm\" ng-submit=\"processForm()\">\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Contact Information</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-3 required\">\n" +
    "                        <label for=\"firstName\" class=\"control-label\">First Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.firstName\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-3 required\">\n" +
    "                        <label for=\"lastName\" class=\"control-label\">Last Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"lastName\" ng-model=\"formData.customer.lastName\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-6 required\">\n" +
    "                        <label for=\"organization\" class=\"control-label\">School / District / Organization</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"organization\"\n" +
    "                               ng-model=\"formData.customer.organization\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-6 required\">\n" +
    "                        <label for=\"jobTitle\" class=\"control-label\">Job Title</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"jobTitle\" ng-model=\"formData.customer.jobTitle\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"email\" class=\"control-label\">Email</label>\n" +
    "                        <input type=\"email\" class=\"form-control\" name=\"email\" ng-model=\"formData.customer.email\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Billing Information</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingName\" class=\"control-label\">Billing Contact Name</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingName\"\n" +
    "                               ng-model=\"formData.billingContact.name\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingEmail\" class=\"control-label\">Billing Contact Email</label>\n" +
    "                        <input type=\"email\" class=\"form-control\" name=\"billingEmail\"\n" +
    "                               ng-model=\"formData.billingContact.email\" required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"billingPhone\" class=\"control-label\">Billing Contact Phone</label>\n" +
    "                        <input type=\"tel\" class=\"form-control\" name=\"billingPhone\"\n" +
    "                               ng-model=\"formData.billingContact.phone\" required=\"required\"\n" +
    "                               ng-pattern=\"/^[(]{0,1}[0-9]{3}[)\\.\\- ]{0,1}[0-9]{3}[\\.\\- ]{0,1}[0-9]{4}$/\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-12 required\">\n" +
    "                        <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 1</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingAddress\"\n" +
    "                               ng-model=\"formData.billing.address.line1\" required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-12\">\n" +
    "                        <label for=\"billingAddress\" class=\"control-label\">Billing Address Line 2</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"billingAddress\"\n" +
    "                               ng-model=\"formData.billing.address.line2\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"city\" class=\"control-label\">City</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"city\" ng-model=\"formData.billing.address.city\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"state\" class=\"control-label\">State</label>\n" +
    "                        <select class=\"form-control\" name=\"state\" ng-model=\"formData.billing.address.state\"\n" +
    "                                ng-options=\"key as value for (key , value) in states\" required=\"required\"></select>\n" +
    "                    </div>\n" +
    "\n" +
    "                    <div class=\"form-group col-sm-4 required\">\n" +
    "                        <label for=\"zip\" class=\"control-label\">Zip</label>\n" +
    "                        <input type=\"text\" class=\"form-control\" name=\"zip\" ng-model=\"formData.billing.address.zip\"\n" +
    "                               required=\"required\">\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                Available Reports\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"form-group col-sm-12 required\">\n" +
    "                        <label for=\"administrativeWindow\" class=\"control-label\">What administrative window and year would you like to order reports for?</label>\n" +
    "                        <select class=\"form-control\" name=\"administrativeWindow\" ng-model=\"formData.administrativeWindow\"\n" +
    "                                ng-options=\"option for option in cost.administrativeWindows\" required=\"required\"></select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <table class=\"table table-striped\">\n" +
    "                <thead>\n" +
    "                <th>Printed Reports</th>\n" +
    "                <th>Amount</th>\n" +
    "                <th>Estimated Student Count</th>\n" +
    "                <th>Estimated Total</th>\n" +
    "                </thead>\n" +
    "                <tbody ng-repeat=\"reportGroup in cost.reportGroups\">\n" +
    "                <tr ng-repeat=\"report in reportGroup.reports\">\n" +
    "                    <td><label><input type=\"radio\" name=\"{{reportGroup.name}}\" value=\"{{report.number}}\"\n" +
    "                                      ng-model=\"reportGroup.selectedReport\"\n" +
    "                                      ng-change=\"selectReport(report, reportGroup)\" /> {{reportGroup.name}}\n" +
    "                        (x{{report.number}} per student)</label></td>\n" +
    "                    <td>{{report.cost | currency:\"\"}}</td>\n" +
    "                    <td><input type=\"number\" ng-model=\"report.amount\" min=\"0\"\n" +
    "                               ng-disabled=\"reportGroup.selectedReport != report.number\" /></td>\n" +
    "                    <td>{{report.cost * report.amount | currency:\"\"}}</td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "                <tfoot>\n" +
    "                <tr>\n" +
    "                    <td colspan=\"6\">\n" +
    "                        <div class=\"pull-right\"><h4>Total: {{getTotal() | currency:\"\"}}</h4></div>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "                </tfoot>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">Additional Comments</div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <textarea class=\"form-control\" rows=\"3\" ng-model=\"formData.comments\"></textarea>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row gutter\">\n" +
    "            <h4>Important Next Steps:</h4>\n" +
    "            <ul>\n" +
    "                <li>You will be invoiced upon receipt of your order</li>\n" +
    "                <li>If you would like to purchase printed reports and/or score labels for future testing adminstrations\n" +
    "                    please call 1-855-730-0400 .\n" +
    "                </li>\n" +
    "            </ul>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-12 form-group\">\n" +
    "                <label class=\"checkbox-inline\">\n" +
    "                    <input type=\"checkbox\" ng-model=\"formData.acceptTerms\">\n" +
    "                    I agree to ACT Aspire's <a href=\"./json/ActAspireTermsAndConditions.pdf\" target=\"_blank\">Terms and\n" +
    "                    Conditions</a>\n" +
    "                </label>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\" ng-show=\"formData.acceptTerms\">\n" +
    "            <div class=\"form-group col-sm-12 required\">\n" +
    "                <label for=\"firstName\" class=\"control-label\">Signature:</label>\n" +
    "                <input type=\"text\" class=\"form-control\" name=\"firstName\" ng-model=\"formData.customer.signature\"\n" +
    "                       required=\"required\" placeholder=\"Enter your name as a signature\">\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-sm-4\">\n" +
    "                <button type=\"submit\" class=\"btn btn-primary\"\n" +
    "                        ng-disabled=\"trainingForm.$invalid || trainingForm.$pending || !formData.acceptTerms \">Submit\n" +
    "                    Order\n" +
    "                </button>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </form>\n" +
    "</div>\n" +
    "<div ui-view></div>"
  );


  $templateCache.put('app/form-training.html',
    "<div ng-show=\"$state.is('form.training')\">\n" +
    "\t<h2>ACT Aspire Training Order Form</h2>\t\n" +
    "\n" +
    "\t<form id=\"trainingForm\" name=\"trainingForm\" ng-submit=\"processForm()\"> \n" +
    "\n" +
    "\t\t<div class=\"row\"><div class=\"col-sm-12\"><h4>Date: {{date | date:'yyyy-MM-dd'}}</h4></div></div>\n" +
    "\n" +
    "\t\t<div class=\"col-sm-12\">\n" +
    "\t\t\t<p>\n" +
    "\t\t\t\tThank you for your decision to order training for your ACT Aspire assessment. To help ensure your order is accurate, please fill in all applicable fields.\n" +
    "\t\t\t</p>\n" +
    "\t\t\t<p>\n" +
    "\t\t\t\tUpon completion and submission of this order form, an ACT Aspire representative will contact you regarding preferred training date, availability and scheduling. \n" +
    "\t\t\t</p>\n" +
    "\t\t\t<p>\n" +
    "\t\t\t\tIf you have questions regarding the order form below, please contact Orders@ActAspire.org or 1-855-730-0400. \n" +
    "\t\t\t</p>\n" +
    "\t\t</div>\n" +
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
    "\t\t<div class=\"panel panel-default\" ng-repeat=\"(trainingType, trainings) in cost.training\">\n" +
    "\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\t{{trainingType}}\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<table class=\"table table-striped\">\n" +
    "\t\t\t\t<thead>\n" +
    "\t\t\t\t\t<th>Training</th>\n" +
    "\t\t\t\t\t<th>Cost</th>\n" +
    "\t\t\t\t\t<th>Duration</th>\n" +
    "\t\t\t\t\t<th>Maximum Participants</th>\n" +
    "\t\t\t\t\t<th></th>\n" +
    "\t\t\t\t</thead>\n" +
    "\t\t\t\t<tr ng-repeat=\"training in trainings\">\n" +
    "\t\t\t\t\t<td><a href=\"{{training.url}}\" target=\"_blank\">{{training.mode}}: {{training.title}}</a></td>\n" +
    "\t\t\t\t\t<td><span class=\"pull-right\">{{training.cost | currency:undefined:0}}</span></td>\n" +
    "\t\t\t\t\t<td>{{training.duration}} hr</td>\n" +
    "\t\t\t\t\t<td>{{training.maxParticipants}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<button type=\"button\" ng-model=\"addTrainingButton\" ng-click=\"addTraining(training)\"  class=\"btn btn-primary\">Add</button>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t</table>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"panel panel-default\">\n" +
    "\t\t\t<div class=\"panel-heading\">\n" +
    "\t\t\tOrder Summary\n" +
    "\t\t\t</div>\n" +
    "\n" +
    "\t\t\t<table class=\"table table-striped\">\n" +
    "\t\t\t\t<thead>\n" +
    "\t\t\t\t\t<th>Description</th>\n" +
    "\t\t\t\t\t<th>Duration</th>\n" +
    "\t\t\t\t\t<th>Mode</th>\n" +
    "\t\t\t\t\t<th>Maximum Participants</th>\n" +
    "\t\t\t\t\t<th>*Preferred Date</th>\n" +
    "\t\t\t\t\t<th>*Preferred Time</th>\n" +
    "\t\t\t\t\t<th>Price</th>\n" +
    "\t\t\t\t\t<th>Quantity</th>\n" +
    "\t\t\t\t\t<th>Total</th>\n" +
    "\t\t\t\t\t<th></th>\n" +
    "\t\t\t\t</thead>\n" +
    "\t\t\t\t<tr ng-repeat=\"training in trainingOrders track by training.title\">\n" +
    "\t\t\t\t\t<td><a href=\"{{training.url}}\" target=\"_blank\">{{training.title}}</a></td>\n" +
    "\t\t\t\t\t<td>{{training.duration}} hr</td>\n" +
    "\t\t\t\t\t<td>{{training.mode}}</td>\n" +
    "\t\t\t\t\t<td>{{training.maxParticipants * training.quantity}}</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t        <p class=\"input-group training-order-calendar\">\t\n" +
    "\t\t\t\t          <input type=\"text\" class=\"form-control\" uib-datepicker-popup ng-model=\"training.preferredDate\" is-open=\"training.opened\" datepicker-options=\"dateOptions\" ng-required=\"true\" close-text=\"Close\" />\n" +
    "\t\t\t\t          <span class=\"input-group-btn\">\n" +
    "\t\t\t\t            <button type=\"button\" class=\"btn btn-default\" ng-click=\"openCalendar(training)\"><i class=\"glyphicon glyphicon-calendar\"></i></button>\n" +
    "\t\t\t\t          </span>\n" +
    "\t\t\t\t        </p>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<select class=\"form-control\" name=\"\" ng-model=\"training.preferredTime\">\n" +
    "\t\t\t\t\t\t\t<option value=\"AM\">AM</option>\n" +
    "\t\t\t\t\t\t\t<option value=\"PM\">PM</option>\n" +
    "\t\t\t\t\t\t</select>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td><span class=\"pull-right\">{{training.cost | currency:undefined:0}}</span></td>\n" +
    "\t\t\t\t\t<td>\n" +
    "\t\t\t\t\t\t<div class=\"training-order-quantity form-group\">\n" +
    "\t\t\t\t\t\t\t<input class=\"form-control\" type=\"number\" ng-model=\"training.quantity\" name=\"\" min=\"1\">\n" +
    "\t\t\t\t\t\t</div>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t<td><span class=\"pull-right\">{{training.quantity * training.cost | currency:undefined:0}}</span></td>\n" +
    "\t\t\t\t\t<td>\t\t\t\n" +
    "\t\t\t\t\t\t<button type=\"button\" class=\"pull-right btn btn-default btn-xs\" aria-label=\"Remove\" ng-click=\"removeTraining(training)\">\n" +
    "\t\t\t\t\t\t\t<span class=\"glyphicon glyphicon-remove\" aria-hidden=\"true\"></span>\n" +
    "\t\t\t\t\t\t</button>\n" +
    "\t\t\t\t\t</td>\n" +
    "\t\t\t\t</tr>\n" +
    "\t\t\t\t<tfoot>\n" +
    "\t\t\t\t\t<tr>\n" +
    "\t\t\t\t\t\t<td colspan=\"10\">\n" +
    "\t\t\t\t\t\t\t<div class=\"pull-right\"><h4>Total: {{getTotal() | currency:undefined:0}}</h4></div>\n" +
    "\t\t\t\t\t\t</td>\n" +
    "\t\t\t\t\t</tr>\n" +
    "\t\t\t\t</tfoot>\n" +
    "\t\t\t</table>\n" +
    "\t\t</div>\n" +
    "\n" +
    "\t\t<div class=\"row gutter\">\n" +
    "\t\t\t<div class=\"col-sm-12\"><h5>*Preferred date and times are to be confirmed.</h5></div>\n" +
    "\t\t\t<div class=\"col-sm-12\"><h4>Important Next Steps:</h4></div>\n" +
    "\t\t\t<div class=\"col-sm-12\">\n" +
    "\t\t\t\t<ul>\n" +
    "\t\t\t\t\t<li>Upon completion of the order an invoice for the total due will be sent to the contact above and you will be contacted regarding your preferred Training date and trainer availability.</li>\n" +
    "\t\t\t\t\t<li>Training Service representiative will reach out to you to go through the training options, modules, and scheduling. </li>\n" +
    "\t\t\t\t\t<li>Payment must be rendered before training is delivered. </li>\n" +
    "\t\t\t\t\t<li>Typical turnaround time from order to delivery, depending on your preferred training date, is two weeks.</li>\n" +
    "\t\t\t\t</ul>\n" +
    "\t\t\t</div>\n" +
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
    "  <img src=\"images/ACT_Aspire_color.jpg\" alt=\"\" width=\"233\">\n" +
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
