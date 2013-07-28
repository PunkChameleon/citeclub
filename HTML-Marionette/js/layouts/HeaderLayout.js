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

            onRender: function () {

                //Show Login View
                this.login.show(new CC.Views.LoginView({
                    modal: this.options.modal
                }));

                //Show Search View
                this.search.show(new CC.Views.SearchBarView());
            }

        });
    });