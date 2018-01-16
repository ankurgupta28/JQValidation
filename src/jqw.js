// jQueryValidations Library 
// Alias Name : jqw
// Design Pattern : Revealing Module Pattern

(function(window) {
    // We can enable the strict mode commenting the following line  
    // 'use strict';


    // This function will contain all our code
    function jqw() {
        // This variable will be accessible to the end user.
        var _jqwObject = {
            validate: _validate,
            version: '1.0',
        };

        // This variable will be inaccessible to the end user, this can be used in the scope of library.
        var defaults = {
            dataType: {
                number: 'number',
                date: 'date',
                email: 'email'
            },
        };

        // function to validate complete form
        function _validate(formName) {
            //logic to validate form
            return true;
        };

        return _jqwObject;
    }

    // We need that our library is globally accesible, so we save in the window with name 'jqw'
    if (typeof(window.jqw) === 'undefined') {
        window.jqw = jqw();
    }
})(window); // We send the window variable withing our function