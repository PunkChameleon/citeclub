/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Login Modal View
 *
 */


define([
        "common",
        "backbone",
        "marionette"
    ],

    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.LoginModalView = Backbone.Marionette.ItemView.extend({

            template: "#login_modal_view_template",

            className: "login_modal modal hide fade",

            events: {
                "click .btn-login": "login"
            },

            login: function () {
                //Login into the application!
                this.model.login(this.$el.find("#username").val(), this.$el.find('#password').val());
            }

        });
    });