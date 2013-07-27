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
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Models.LoginModel = Backbone.Model.extend({

            login : function(username, password, sucessCallback, failureCallback) {
                $.ajax({
                    type: "POST",
                    url : "/action/login.php",
                    data : {
                        username : username,
                        password : password
                    },
                    success: function(data) {
                        console.log(data);
                        alert('success!')
                    },
                    failure: function(xhr, status, error) {
                        alert('failure!')
                    }
                })
            }

        });

});