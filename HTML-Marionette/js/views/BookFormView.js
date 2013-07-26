/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Book Form View
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.BookFormView = Backbone.Marionette.ItemView.extend({

            template: "#book_form_view_template",

            className: "book_form span10 offset1 row-fluid"

        });
});