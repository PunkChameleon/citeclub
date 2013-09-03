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

            login: function (username, password, successCallback, failureCallback) {

                /*
                * Log user in to MediaWiki
                */

                $.ajax({
                    type: "POST",
                    url: CC.config.PATH_TO_ACTION + "login.php",
                    data: { 
                        username: username, 
                        password: password
                    },
                    success: successCallback,
                    error: failureCallback
                });
            }

        });

    });