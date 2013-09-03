/*
 *
 * Author     : streetlight
 * Date       : 7/20/2013
 * Description: Cite it or Skip It View
 *
 */


define([
        "common",
        "backbone",
        "marionette",
        "views/CiteOptionsView"
    ],
    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.CiteItSkipItView = Backbone.Marionette.ItemView.extend({

            template: "#cite_it_skip_it_view_template",

            className: "cite_or_skip span10 offset1 text-center",

            events: {
                "click #citeIt": "citeIt",
                "click #skipIt": "skipIt"
            },

            initialize: function() {
                this.listenTo(this.model, 'change', this.render);
            },

            onBeforeRender: function() {
                if (!this.model.get("allDataRetrieved")) {
                    this.$el.hide();
                } else {
                    this.$el.show();
                }
            },

            citeIt: function () {
                var contentLayout = this.options.contentLayout;
                if (contentLayout && contentLayout.buttonsForms) {
                    contentLayout.buttonsForms.show(new CC.Views.CiteOptionsView({
                        model: this.model,
                        contentLayout: this.options.contentLayout
                    }));
                }
            },

            skipIt: function () {
                var contentLayout = this.options.contentLayout;
                if (contentLayout) {
                    contentLayout.render();
                }
            }

        });
    });