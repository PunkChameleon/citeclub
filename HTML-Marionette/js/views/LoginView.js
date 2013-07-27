/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Login View
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "bootstrap"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.LoginView = Backbone.Marionette.ItemView.extend({

            template: "#login_view_template",

            className: "login_text",

            events : {
                "click .show_login" : "showLogin"
            },

            showLogin : function() {
                var modal = this.options.modal;

            }

        });
});