/*
 *
 * Author     : streetlight
 * Date       : 7/20/2013
 * Description: Quote View.
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Views.QuoteView = Backbone.Marionette.ItemView.extend({

            className: "span10 offset1",

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            onBeforeRender: function() {
                if (this.model.get("isSearching")) {
                    this.template = "#quote_view_searching_template";
                } else if (this.model.has("id")) {
                    this.template = "#quote_view_template";
                } else {
                    this.template = "#quote_view_no_results_template";
                }
            }

        });
});