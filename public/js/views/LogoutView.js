/*
 *
 * Author     : pcaisse
 * Date       : 8/31/2013
 * Description: Logout View (shows logged in user's name and allows them to log out)
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "models/UserModel"
    ],

    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.LogoutView = Backbone.Marionette.ItemView.extend({

            template: "#logout_view_template",

            events: {
                "click .logout": "logOut"
            },

            logOut: function () {

                var that = this;

                this.model.logUserOut(function(data) {
                    // clear model
                    that.model.clear();
                    // show login view
                    var contentLayout = that.options.contentLayout;
                    if (contentLayout && contentLayout.login) {
                        contentLayout.login.show(new CC.Views.LoginView({
                            model: that.model,
                            contentLayout: contentLayout
                        }));
                    }
                }, function(xhr) {
                    console.log("Error logging user out: " + xhr.responseText);
                })
            }

        });
});