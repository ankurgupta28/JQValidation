// jQueryValidations Library 
// Alias Name : jqv
// Design Pattern : Revealing Module Pattern

(function(window) {
    // We can enable the strict mode commenting the following line  
    // 'use strict';
    class error {
        constructor(id, msg) {
            this.eleId = id;
            this.errMessage = msg;
        }
    }

    // This function will contain all our code
    function jqv() {

        // This variable will be inaccessible to the end user, this can be used in the scope of library.
        var defaults = {
            errorClass: 'is-invalid',
            errorMessageTemplate: '<div class="invalid-feedback">{0}</div>',
            successClass: 'is-valid',
        };
        var errorList = [];

        //Private function to check if element is required
        let _isRequired = function(element) {
            let value = $(element).data('jqv-required');
            return value && value.toString().toUpperCase() === "Y";
        }

        //Private function to get caption of the field
        let _getCaption = function(element) {
            let label = $("label[for='" + $(element).attr('id') + "']");
            if (label.length == 1) return label.text().trim().replace(':', '');
            return $(element).attr('id');
        }

        //Private function to show message or error
        let _showMessage = function(formName) {
            $("#" + formName + " *").removeClass("is-invalid").remove('.invalid-feedback');
            errorList.forEach(element => {
                $("#" + element.eleId).next().hasClass('invalid-feedback') ? $("#" + element.eleId).next().remove() : null;
                $("#" + element.eleId).removeClass(defaults.successClass).addClass(defaults.errorClass);
                $("#" + element.eleId).after(defaults.errorMessageTemplate.replace('{0}', element.errMessage));
            });
        }

        //Private function to check string has number or not.
        let _isNumber = function(myString) {
            return /\d/.test(myString);
        }

        //Private function to check email.
        let _isEmail = function(myString) {
            return /^.{1,}@.{2,}\..{2,}/.test(myString);
        }

        //Private function to check if input string as has only characters.
        let _isString = function(myString) {
            return /^[A-z]+$/.test(myString);
        }

        //Private function to check date is valid.
        var _isDate = function(date) {
            return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date))) ? true : false;
        }

        //Private function to clear complete form
        let _clearForm = function(formName) {
            errorList = [];
            $("#" + formName + " *").filter(':input').not("input[type=hidden]").each(function() {
                let element = this;
                $(element).removeClass("is-invalid");
                $(element).next().hasClass('invalid-feedback') ? $(element).next().remove() : null;
                $(element).val('');
            });

        };

        //Private function to validate URL
        let _isUrl = function(myString) {
            return /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(myString);
        }

        // function to validate complete form
        let _validateForm = function(formName) {
            errorList = [];
            $("#" + formName + " *").filter(':input').not("input[type=hidden]").each(function() {
                _validateElement(this, false);
            });
            if (errorList.length > 0) {
                _showMessage(formName);
                return false;
            } else
                return true;
        };
        let _validateElement = function(element, showError = true) {

            let elementId = $(element).attr('id');
            let elementVal = $(element).val().trim();
            let elementValLength = elementVal.length;
            let elementCaption = _getCaption(element);
            let elementIsRequired = _isRequired(element);
            let elementMinLength = $(element).data('jqv-min');
            let elementMaxLength = $(element).data('jqv-max');

            if ((elementIsRequired) && (elementVal == '')) {
                errorList.push(new error(elementId, elementCaption + " Is Required"));
            }

            let typeVal = $(element).data('jqv-type');
            if (typeof typeVal !== typeof undefined && typeVal !== false) {
                switch (typeVal) {
                    case "number":
                        //TODO : Logic for min & max Length
                        if ($.isNumeric(elementVal) === false) {
                            errorList.push(new error(elementId, "Only numbers are allowed"));
                        }
                        break;
                    case "decimal":
                        if ($.isNumeric($(element).val().trim()) === false) {
                            errorList.push(new error(elementId, "Only numbers are allowed."));
                        }
                        break;
                    case "decimalonly":
                        if ($.isNumeric($(element).val().trim()) == false) {
                            errorList.push(new error(elementId, "Only decimal number allowed in " + elementCaption));
                        } else {
                            let regex = /./igm,
                                count = $(element).val().trim().match(regex);

                            count = (count) ? count.length : 0;
                            if (count != 1) {
                                errorList.push(new error(elementId, "Only decimal number allowed in " + elementCaption));
                            }
                        }
                        break;
                    case "string":
                        if (typeof elementMinLength != "undefined") {
                            if (elementValLength < elementMinLength) {
                                errorList.push(new error(elementId, "Minimum " + elementMinLength + " characters are required."));
                            }
                        }
                        //TODO : Logic for max Length
                        if (!_isString(elementVal)) {
                            errorList.push(new error(elementId, "Only characters allowed"));
                        }

                        var elementFirstLetterCapital = $(element).data('jqv-first-letter-capital');
                        if (typeof elementFirstLetterCapital != "undefined" && elementFirstLetterCapital == 'Y') {
                            if (!(/^[A-Z]/.test(elementVal))) {
                                errorList.push(new error(elementId, "First character should be capital"));
                            }
                        }
                        break;
                    case "email":
                        if (!_isEmail(elementVal)) {
                            errorList.push(new error(elementId, "Invalid email"));
                        }
                        break;
                    case "url":
                        if (!_isUrl($(element).val().trim())) {
                            errorList.push(new error(elementId, "You have entered an invalid website address! " + elementCaption))
                        }
                        break;
                    case "dob":
                        var minDate = new Date();
                        //Reduce 100 year from min date, as person with more than 100 years of age is not allowd
                        minDate.setFullYear(minDate.getFullYear() - 100);

                        var today = new Date();
                        today.setFullYear(today.getFullYear() - 4);
                        if (_isDate(elementVal)) {
                            var DOB = Date.parse(elementVal);
                            if ((DOB > today || DOB < minDate)) {
                                errorList.push(new error(elementId, "Invalid " + elementCaption));
                            }
                        } else {
                            errorList.push(new error(elementId, "Invalid date"));
                        }
                        break;
                }
            }

            if (showError) {
                if (errorList.length > 0) {
                    _showMessage(elementId);
                    return false;
                } else
                    return true;
            }
        }


        // This variable will be accessible to the end user.
        var _jqvObject = {
            validateForm: _validateForm,
            validateElement: _validateElement,
            clean: _clearForm,
            version: '1.0',
        };
        return _jqvObject;
    }

    // We need that our library is globally accesible, so we save in the window with name 'jqv'
    if (typeof(window.jqv) === 'undefined') {
        window.jqv = jqv();
    }
})(window); // We send the window variable withing our function()