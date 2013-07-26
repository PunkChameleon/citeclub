/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: News Form View
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.NewsFormView = Backbone.Marionette.ItemView.extend({

            template: "#news_form_view_template",

            className: "news_form span10 offset1 row-fluid"

        });
});