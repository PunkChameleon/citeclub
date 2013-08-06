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
    "bootstrap",
    "views/LoginModalView",
    "models/LoginModel"
    ],

    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.LoginView = Backbone.Marionette.ItemView.extend({

            template: "#login_view_template",

            className: "login_text",

            events: {
                "click .show_login": "showLogin"
            },

            showLogin: function () {

                var loginModal = new CC.Views.LoginModalView({
                    model: new CC.Models.LoginModel()
                });

                this.options.modal.show(loginModal);

                loginModal.$el.modal();

            }

        });
});