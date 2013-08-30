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

            template: "#quote_view_template",

            className: "span10 offset1",

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            }

        });
});