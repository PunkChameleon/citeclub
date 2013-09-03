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
        "views/FormView",
        "views/CiteItSkipItView"
    ],
    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.CiteOptionsView = Backbone.Marionette.ItemView.extend({

            template: "#cite_options_view_template",

            className: "cite_options span10 offset1 text-center",

            events: {
                "click #web": "webCite",
                "click #news": "newsCite",
                "click #book": "bookCite",
                "click #journal": "journalCite",
                "click .back": "goBack"
            },

            webCite: function () {
                this.showForm(CC.config.citationTypes.WEB);
            },

            newsCite: function () {
                this.showForm(CC.config.citationTypes.NEWS);
            },

            bookCite: function () {
                this.showForm(CC.config.citationTypes.BOOK);
            },

            journalCite: function () {
                this.showForm(CC.config.citationTypes.JOURNAL);
            },

            showForm: function(type) {

                var contentLayout = this.options.contentLayout;

                if (contentLayout && contentLayout.buttonsForms) {
                    contentLayout.buttonsForms.show(new CC.Views.FormView({
                        model: this.model,
                        type: type,
                        contentLayout: this.options.contentLayout,
                        citeOptions: this
                    }));
                }
            },

            goBack: function () {

                var contentLayout = this.options.contentLayout;

                contentLayout.buttonsForms.show(new CC.Views.CiteItSkipItView({
                    model: this.model,
                    contentLayout: contentLayout
                }));
            }

        });
    });