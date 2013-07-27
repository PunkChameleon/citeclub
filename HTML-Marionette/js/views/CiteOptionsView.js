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
    "views/FormView"
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

            type : {
                "web" : "web",
                "news" : "news",
                "book" : "book",
                "journal" : "journal"
            },

            webCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.FormView({
                    articleModel : this.options.articleModel,
                    type: this.type.web,
                    contentLayout: this.options.contentLayout,
                    citeOptions: this
                }));
            },

            newsCite :function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.FormView({
                    articleModel : this.options.articleModel,
                    type: this.type.news,
                    contentLayout: this.options.contentLayout,
                    citeOptions: this
                }));
            },

            bookCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.FormView({
                    articleModel : this.options.articleModel,
                    type: this.type.book,
                    contentLayout: this.options.contentLayout,
                    citeOptions: this
                }));
            },

            journalCite : function() {
                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.FormView({
                    articleModel : this.options.articleModel,
                    type: this.type.journal,
                    contentLayout: this.options.contentLayout,
                    citeOptions: this
                }));
            }

        });
});