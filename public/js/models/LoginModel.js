/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Login Model
 *
 */


define([
        "common",
        "backbone"
    ],
    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Models.LoginModel = Backbone.Model.extend({

            login: function (username, password, sucessCallback, failureCallback) {

                /*
                * Log user in to MediaWiki
                */

                $.ajax({
                    type: "POST",
                    url: "/citeclub/public/php/ajax/login.php",
                    data: { 
                        username: username, 
                        password: password
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    error: function (xhr) {
                        console.log("Error logging in: " + xhr.responseText);
                    }
                });
            }

        });

    });