/*
 *
 * Author     : streetlight
 * Date       : 7/27/2013
 * Description: Citation Sucessful View.
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Views.CiteSuccessView = Backbone.Marionette.ItemView.extend({

            template: "#cite_success_view_template",

            className: "span10 offset1 text-center"

        });
});