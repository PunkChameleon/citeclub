/*
 *
 * Author     : streetlight
 * Date       : 7/26/2013
 * Description: Abstract Form View
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.FormView = Backbone.Marionette.ItemView.extend({

            className: "citation_form span10 offset1 row-fluid",

            type : {
                "web" : "web",
                "news" : "news",
                "book" : "book",
                "journal" : "journal"
            },

            getTemplate: function() {

                var type = this.options.type;

                if (type === this.type.web) {
                    return "#web_form_view_template";
                } else if (type === this.type.news) {
                    return "#news_form_view_template";
                } else if (type === this.type.book) {
                    return "#book_form_view_template";
                } else if (type === this.type.journal) {
                    return "#journal_form_view_template";
                }
            },

            events: {
                "click .back" : "goBack"
            },

            goBack : function() {
                
            }

        });
});