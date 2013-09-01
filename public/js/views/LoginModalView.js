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
        "marionette",
        "views/LogoutView",
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

                var that = this,
                    username = this.$el.find("#username").val(),
                    password = this.$el.find('#password').val();

                this.model.login(username, password, function(data) {
                    // update user
                    CC.User.set("username", username);
                    // hide login modal 
                    that.$el.modal('hide');
                }, function(xhr) {
                    console.log("Error logging user in: " + xhr.responseText);
                });
            }

        });
    });