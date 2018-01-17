// jQueryValidations Library 
// Alias Name : jqw
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
    function jqw() {

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
        let _showMessage = function() {
            $("input").removeClass("is-invalid")
            $(".invalid-feedback").hide();
            console.log(errorList);
            errorList.forEach(element => {
                $("#" + element.eleId).addClass(defaults.errorClass);
                $("#" + element.eleId).after(defaults.errorMessageTemplate.replace('{0}', element.errMessage));
            });
        }

        //Private function to check string has number or not.
        let _hasNumber = function(myString) {
            return /\d/.test(myString);
        }

        let _hasEmail = function(myString) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(myString);
        }

        // function to validate complete form
        let _validate = function(formName) {
            errorList = [];
            $("#" + formName + " *").filter(':input').not("input[type=hidden]").each(function() {

                let element = this;
                let elementId = $(element).attr('id');
                let elementVal = $(element).val().trim();
                let elementCaption = _getCaption(element);
                let elementIsRequired = _isRequired(element);

                if ((elementIsRequired) && (elementVal == '')) {
                    errorList.push(new error(elementId, elementCaption + " Is Required"));
                    //return false;
                }


                let typeVal = $(element).data('jqv-type');
                if (typeof typeVal !== typeof undefined && typeVal !== false) {
                    switch (typeVal) {
                        case "number":
                        case "decimal":
                            if ($.isNumeric($(element).val().trim()) === false) {
                                errorList.push(new error(elementId, "Only number allowed in " + elementCaption));
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
                        case "stringonly":
                            if (!_hasNumber($(element).val().trim())) {
                                errorList.push(new error(elementId, "Numbers not allowed " + elementCaption));
                            }
                        case "email":
                            if (!_hasEmail($(element).val().trim())) {
                                errorList.push(new error(elementId, "You have entered an invalid email address! " + elementCaption));
                            }
                    }
                }

            });
            if (errorList.length > 0) {
                _showMessage();
                return false;
            } else
                return true;
        };
        // This variable will be accessible to the end user.
        var _jqwObject = {
            validate: _validate,
            version: '1.0',
        };
        return _jqwObject;
    }

    // We need that our library is globally accesible, so we save in the window with name 'jqw'
    if (typeof(window.jqw) === 'undefined') {
        window.jqw = jqw();
    }
})(window); // We send the window variable withing our functio()