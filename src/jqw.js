// jQueryValidations Library 
// Alias Name : jqw
// Design Pattern : Revealing Module Pattern

(function(window) {
    // We can enable the strict mode commenting the following line  
    // 'use strict';


    // This function will contain all our code
    function jqw() {

        // This variable will be inaccessible to the end user, this can be used in the scope of library.
        var defaults = {
            dataType: {
                number: 'number',
                date: 'date',
                email: 'email'
            },
        };
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

        //Private function to get caption of the field
        let _isEmail = function(element) {
            let label = $("label[for='" + $(element).attr('id') + "']");
            if (label.length == 1) return label.text().trim().replace(':', '');
            return $(element).attr('id');
        }

        //Private function to show message or error
        let _showMessage = function(message) {
            alert(message);
        }

        let _hasNumber = function(myString) {
            return /\d/.test(myString);
        }

        // function to validate complete form
        let _validate = function(formName) {
            $("#" + formName + " *").filter(':input').not("input[type=hidden]").each(function() {
                debugger;
                let element = this;
                let elementId = $(element).attr('id');
                let elementVal = $(element).val().trim();
                let elementCaption = _getCaption(element);
                let elementIsRequired = _isRequired(element);

                if ((elementIsRequired) && (elementVal == '')) {
                    _showMessage(elementCaption + " Is Required");
                    return false;
                }


                let typeVal = $(element).data('jqv-type');
                if (typeof typeVal !== typeof undefined && typeVal !== false) {
                    switch (typeVal) {
                        case "email":
                            if (elementVal != "") {
                                if (!_isEmail(email)) {
                                    _showMessage("Envalid " + elementCaption);
                                }
                            }
                            break;
                        case "number":
                            break;
                        case "decimal":
                            if ($.isNumeric($(element).val().trim()) === false) {
                                _showMessage("Only number allowed in " + elementCaption);
                                return false;
                            }
                            break;
                        case "decimalonly":
                            if ($.isNumeric($(element).val().trim()) == false) {
                                _showMessage("Only decimal number allowed in " + elementCaption);
                                return false;
                            } else {
                                let regex = /./igm,
                                    count = $(element).val().trim().match(regex),
                                    count = (count) ? count.length : 0;
                                if (count != 1) {
                                    _showMessage("Only decimal number allowed in " + elementCaption);
                                    return false;
                                }

                            }
                            break;
                        case "stringonly":
                            if (!_hasNumber($(element).val().trim())) {
                                _showMessage("Numbers not allowed " + elementCaption);
                            }
                    }
                }

            });
            //logic to validate form
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