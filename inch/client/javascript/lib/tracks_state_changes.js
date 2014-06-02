define([], function() {
	"use strict";

	return {
		prior_state: null,
        current_state: null,

        update_state: function(new_state) {
        	this.prior_state = this.current_state;
            this.current_state = new_state;
        },
        changed: function(f) { 
        	if (this.prior_state === null) { return true; }

        	return f(this.prior_state) !== f(this.current_state); 
        },
        changed_strict: function(f) { 
        	if (this.prior_state === null) { return false; }

        	return f(this.prior_state) !== f(this.current_state); 
      	},
        element_changed: function(f, i) { 
        	if (this.prior_state === null) { return true; }

        	return f(this.prior_state, i) !== f(this.current_state, i); 
        },
        element_changed_strict: function(f, i) { 
        	if (this.prior_state === null) { return false; }

        	return f(this.prior_state, i) !== f(this.current_state, i); 
        },

        value: function(f) {  
            if (this.current_state === null) { 
                return false; 
            }

            return f(this.current_state);  
        },
        prior_value: function(f) {  
            if (this.prior_state === null) { 
                return false; 
            }

            return f(this.prior_state);  
        },
        element_value: function(f, i) { return f(this.current_state, i); },
        prior_element_value: function(f, i) { return f(this.prior_state, i); },
        prior_element: function(f, i) { return f(this.prior_state, i); },
        
        is: function(f) { return f(this.current_state) === true; },
        element_is: function(f, i) { return f(this.current_state, i) === true;}
	};
});