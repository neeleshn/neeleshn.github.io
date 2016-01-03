function LeaveFn($scope) {
    var braDept = [{ value: "BRA - Dept 1", option: "BRA - Dept 1" },
                   { value: "BRA - Dept 2", option: "BRA - Dept 2" },
                   { value: "BRA - Dept 3", option: "BRA - Dept 3"}];

    var edicDept = [{ value: "EDIC - Dept 1", option: "EDIC - Dept 1" },
                    { value: "EDIC - Dept 2", option: "EDIC - Dept 2" },
                    { value: "EDIC - Dept 3", option: "EDIC - Dept 3"}];

    var unionDept = [{ value: "UNION - Dept 1", option: "UNION - Dept 1" },
                     { value: "UNION - Dept 2", option: "UNION - Dept 2" },
                     { value: "UNION - Dept 3", option: "UNION - Dept 3"}];
    //Above variables are the departments of each Office
    $scope.dates = [];
    $scope.submitShow = false;
    $scope.dateDisabled = true;
    $scope.expError = true;
    $scope.advancePay = false;
    $scope.SubmitPay = false;

    $scope.offChange = function () { //the departments are allocated as per the office selected in the dropdown.
        if ($scope.officemodel == "")
            $scope.depts = null;
        if ($scope.officemodel == "BRA")
            $scope.depts = braDept;
        if ($scope.officemodel == "EDIC")
            $scope.depts = edicDept;
        if ($scope.officemodel == "UNION")
            $scope.depts = unionDept;
    }

    $scope.mailChange = function () { //this function validates the email address entered in the input box and checks for first.last@boston.gov or first.m.last@boston.gov format.
        var testmail1 = /^([a-zA-Z0-9])+\.([a-zA-Z0-9])+\@boston.gov$/;
        var testmail2 = /^([a-zA-Z0-9])+\.([a-zA-Z])\.([a-zA-Z0-9])+\@boston.gov$/;
        if (!((testmail2.test($scope.emailmodel)) || (testmail1.test($scope.emailmodel))))
            $scope.mailerror = "Invalid Email Address!!!";
        else $scope.mailerror = "";
    }

    $scope.teleChange = function () { // this function validates the telephone number entered in the box. It shows error whenever a character other than digits are entered.
        var testTele = /^([0-9])+$/;
        if (!(testTele.test($scope.teleModel)))
            $scope.teleError = "Enter Only Numbers!!!";
        else $scope.teleError = "";
    }

    $scope.typeChange = function () { // this function checks the leave type selected and if the leave type is "other" then it checks if the explain box is filled or not.
        if ($scope.typeModel == "other") {
            if (!$scope.expModel) {
                $scope.expError = true;
            }
            else $scope.expError = false;
        }
        else $scope.expError = false;
    }

    $scope.dateChange = function () { // this function checks if the end date entered is after the begin date or not.
        if ($scope.endModel && $scope.beginModel) {
            if ($scope.endModel < $scope.beginModel) {
                $scope.dateError = 'End Date should be after Begin Date';
                $scope.dateDisabled = true;
            }
            else {
                $scope.dateError = '';
                $scope.dateDisabled = false;
            }
        }
    }

    $scope.addClick = function () { // This function converts the datetime-local format to a readable format and adds a leave entry to an array.
        var begin = $scope.beginModel;
        var bDate = begin.getDate();
        var bMonth = begin.getMonth() + 1;
        var bYear = (begin.getYear() + 1900).toString();
        var bHours = begin.getHours();
        var bMinutes = begin.getMinutes();

        var end = $scope.endModel;
        var eDate = end.getDate();
        var eMonth = end.getMonth() + 1;
        var eYear = (end.getYear() + 1900).toString();
        var eHours = end.getHours();
        var eMinutes = end.getMinutes();

        // The below code finds out the number of days between the end date and begin date. If the end date and begin date are same, then it returns the gap in hours
        if (bDate == eDate && bMonth == eMonth && bYear == eYear) {
            var total1 = (eHours - bHours).toString() + " Hours";
        }
        else {
            var total1 = Math.round((end - begin) / (24 * 60 * 60 * 1000));
            if (total1 <= 0)
                total1 = 1;
            total1 = total1.toString() + " Days";
        }

        if (bDate < 10)
            bDate = "0" + bDate.toString();
        else bDate = bDate.toString();
        if (bMonth < 10)
            bMonth = "0" + bMonth.toString();
        else bMonth = bMonth.toString();
        if (bHours < 10)
            bHours = "0" + bHours.toString();
        else bHours = bHours.toString();
        if (bMinutes < 10)
            bMinutes = "0" + bMinutes.toString();
        else bMinutes = bMinutes.toString();
        var bDate1 = bMonth + "/" + bDate + "/" + bYear + "\t - \t" + bHours + ":" + bMinutes;

        if (eDate < 10)
            eDate = "0" + eDate.toString();
        else eDate = eDate.toString();
        if (eMonth < 10)
            eMonth = "0" + eMonth.toString();
        else eMonth = eMonth.toString();
        if (eHours < 10)
            eHours = "0" + eHours.toString();
        else eHours = eHours.toString();
        if (eMinutes < 10)
            eMinutes = "0" + eMinutes.toString();
        else eMinutes = eMinutes.toString();
        var eDate1 = eMonth + "/" + eDate + "/" + eYear + "\t - \t" + eHours + ":" + eMinutes;

        var x = { beginDate: bDate1, endDate: eDate1, total: total1, type: $scope.typeModel, exp: $scope.expModel, date1: begin, date2: end };
        $scope.dates.push(x); // Adding the data to an array
        $scope.beginModel = null;
        $scope.endModel = null;
        $scope.typeModel = null;
        $scope.expModel = null;

        var sum = 0;
        for (i = 0; i < $scope.dates.length; i++) {
            if ($scope.dates[i].type == "vacation") {
                sum = sum + ($scope.dates[i].date2 - $scope.dates[i].date1);
                console.log(sum);
            }
        }
        if (sum >= 604800000) {
            $scope.advancePay = true;
            if (!$scope.advModel) {
                console.log("no option selected");
                $scope.SubmitPay = true;
            }
            else {
                console.log("option selected");
                $scope.SubmitPay = false;
            }
        }
        else {
            $scope.advancePay = false;
            $scope.SubmitPay = true;
            $scope.advModel = null;
        }
    }

    $scope.removeClick = function (x) { // Remove data from the array upon clicking remove button
        $scope.dates.splice(x, 1);
        var sum = 0;
        for (i = 0; i < $scope.dates.length; i++) {
            if ($scope.dates[i].type == "vacation") {
                sum = sum + ($scope.dates[i].date2 - $scope.dates[i].date1);
                console.log(sum);
            }
        }
        if (sum >= 604800000) {
            $scope.advancePay = true;
            if (!$scope.advModel) {
                console.log("no option selected");
                $scope.SubmitPay = true;
            }
            else {
                console.log("option selected");
                $scope.SubmitPay = false;
            }
        }
        else {
            $scope.advancePay = false;
            $scope.SubmitPay = true;
            $scope.advModel = null;
        }
    }

    $scope.editClick = function (x) { // Make the date editable, upon clicking edit button
        $scope.beginModel = $scope.dates[x].date1;
        $scope.endModel = $scope.dates[x].date2;
        $scope.typeModel = $scope.dates[x].type;
        $scope.expModel = $scope.dates[x].exp;
        $scope.dates.splice(x, 1);
        var sum = 0;
        for (i = 0; i < $scope.dates.length; i++) { // calculates the duration of vacation leave
            if ($scope.dates[i].type == "vacation") {
                sum = sum + ($scope.dates[i].date2 - $scope.dates[i].date1);
                console.log(sum);
            }
        }
        if (sum >= 604800000) { // if duration of vacation leave is greater than 7 days, request for advanced pay pops up.
            $scope.advancePay = true;
            if (!$scope.advModel) {
                console.log("no option selected");
                $scope.SubmitPay = true;
            }
            else {
                console.log("option selected");
                $scope.SubmitPay = false;
            }
        }
        else {
            $scope.advancePay = false;
            $scope.SubmitPay = true;
            $scope.advModel = null;
        }
    }

    $scope.payChange = function () {// This function is called when request for advanced pay is answered with yes or no
        $scope.SubmitPay = false;
    }

    $scope.submitClick = function (x) {
        $scope.submitShow = true;
    }

    $scope.reset = function () { // resets the form.
        $scope.empmodel = null;
        $scope.emailmodel = null;
        $scope.mailError = "";
        $scope.typeModel = null;
        $scope.expModel = null;
        $scope.officemodel = null;
        $scope.deptmodel = null;
        $scope.locModel = null;
        $scope.teleModel = null;
        $scope.beginModel = null;
        $scope.endModel = null;
        $scope.payModel = null;
        $scope.dates = [];
        $scope.advancePay = false;
        $scope.submitShow = false;
    }

}
