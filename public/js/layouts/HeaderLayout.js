/*
 *
 * Author     : streetlight
 * Date       : 7/20/2013
 * Description: Header Layout
 *
 */


define([
        "common",
        "backbone",
        "marionette",
        "views/LoginView",
        "views/SearchBarView"
    ],
    function (Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Layouts.HeaderLayout = Backbone.Marionette.Layout.extend({

            template: "#header_layout_template",

            className: "span10 offset1",

            regions: {
                login: "#login_area",
                search: "#search_area"
            },

            initialize: function() {
                this.listenTo(CC.User, 'change', this.render);
            },

            onRender: function () {

                var view;
                            
                if (CC.User && CC.User.get("username")) {
                    // user logged in
                    view = new CC.Views.LogoutView({
                        model: CC.User,
                        contentLayout: this.options.contentLayout
                    }); 
                } else {
                    // user not logged in
                    view = new CC.Views.LoginView({
                        modal: this.options.modal,
                        contentLayout: this.options.contentLayout
                    });
                }         
                //Show Login View
                this.login.show(view);

                //Show Search View
                this.search.show(new CC.Views.SearchBarView({
                    contentLayout: this.options.contentLayout
                }));
            }

        });
    });