/*
 *
 * Author     : nweingartner
 * Date       : 7/20/2013
 * Description: Content Layout
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "views/QuoteView",
    "models/ArticleModel"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Layouts.ContentLayout = Backbone.Marionette.Layout.extend({

            template: "#content_layout_template",

            regions: {
                quote: "#quoting_area",
                form : "#form_region"
            },

            onRender : function() {

                //Show Quote Region
                this.quote.show(new CC.Views.QuoteView({
                    model: new CC.Models.ArticleModel()
                }));

                //Show Form Region
                //this.form.show();
            }

        });
});