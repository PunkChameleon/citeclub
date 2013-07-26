/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Web Form View
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.WebFormView = Backbone.Marionette.ItemView.extend({

            template: "#web_form_view_template",

            className: "web_form span10 offset1 row-fluid"

        });
});