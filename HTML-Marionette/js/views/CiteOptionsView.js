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
    "marionette",
    "views/WebFormView",
    "views/NewsFormView",
    "views/BookFormView",
    "views/JournalFormView"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.CiteOptionsView = Backbone.Marionette.ItemView.extend({

            template: "#cite_options_view_template",

            className: "cite_options span10 offset1 text-center",

            events: {
                "click #web" : "webCite",
                "click #news" : "newsCite",
                "click #book" : "bookCite",
                "click #journal" : "journalCite"
            },

            webCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.WebFormView({
                    articleModel : this.options.articleModel
                }));
            },

            newsCite :function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.NewsFormView({
                    articleModel : this.options.articleModel
                }));
            },

            bookCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.BookFormView({
                    articleModel : this.options.articleModel
                }));
            },

            journalCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.JournalFormView({
                    articleModel : this.options.articleModel
                }));
            }

        });
});