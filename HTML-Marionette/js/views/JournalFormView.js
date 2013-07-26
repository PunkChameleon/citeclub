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

        CC.Views.JournalFormView = Backbone.Marionette.ItemView.extend({

            template: "#journal_form_view_template",

            className: "journal_form span10 offset1 row-fluid"

        });
});