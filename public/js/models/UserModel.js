/*
 *
 * Author     : pcaisse
 * Date       : 8/31/2013
 * Description: User Model
 *
 */


define([
    "common",
    "backbone"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Models.UserModel = Backbone.Model.extend({

        	logUserOut: function(successCallback, failureCallback) {

        		/*
                * Log user out
                */

                $.ajax({
                    type: "POST",
                    url: CC.config.PATH_TO_ACTION + "logout.php",
                    success: successCallback,
                    error: failureCallback
                });
        	}

        });

});