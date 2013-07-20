/*
 *
 * Author     : nweingartner
 * Date       : 7/20/2013
 * Description: Header Layout
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Layouts.HeaderLayout = Backbone.Marionette.Layout.extend({

            template: "#header_layout_template",

            className : "main_container",

            regions: {
                login: "#login",
                search: "#search"
            }

        });
});