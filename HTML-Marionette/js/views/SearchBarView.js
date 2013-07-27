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
    "marionette"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.SearchBarView = Backbone.Marionette.ItemView.extend({

            template: "#search_bar_view_template",

            className: "search_bar"

        });
});