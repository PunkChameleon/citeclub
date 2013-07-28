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
                $.ajax({
                    type: "POST",
                    url: Common.apiRoot + "action/login.php",
                    data: {
                        lgname: username,
                        lgpassword: password
                    },
                    success: function (data) {
                        console.log(data);
                    },
                    failure: function (xhr, status, error) {
                        console.log(xhr);
                    }
                })
            }

        });

    });