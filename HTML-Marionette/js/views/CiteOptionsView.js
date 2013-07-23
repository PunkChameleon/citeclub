/*
 *
 * Author     : streetlight
 * Date       : 7/22/2013
 * Description: Cite it or Skip It View
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Views.CiteOptionsView = Backbone.Marionette.ItemView.extend({

            template: "#cite_options_view_template",

            className: "cite_options span10 offset1 text-center",

            events: {
                "click #web" : "webCite",
                "click #news" : "newsCite",
                "click #book" : "bookCite",
                "click #journal" : "journalCite"
            }

            webCite : function() {

            },

            newsCite :function() {

            },

            bookCite : function() {

            },

            journalCite : function() {
                
            }

        });
});