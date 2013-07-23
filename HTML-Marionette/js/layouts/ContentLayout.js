/*
 *
 * Author     : streetlight
 * Date       : 7/20/2013
 * Description: Content Layout
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "views/QuoteView",
    "views/CiteItSkipItView",
    "models/ArticleModel"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Layouts.ContentLayout = Backbone.Marionette.Layout.extend({

            template: "#content_layout_template",

            regions: {
                quote: "#quoting_area",
                buttonsForms : "#buttons_forms_region"
            },

            onRender : function() {

                var articleModel = new CC.Models.ArticleModel();

                //Show Quote Region
                this.quote.show(new CC.Views.QuoteView({
                    model: articleModel
                }));

                //Show Form Region
                this.buttonsForms.show(new CC.Views.CiteItSkipItView({
                    model: articleModel,
                    contentLayout : this
                }));
            }

        });
});