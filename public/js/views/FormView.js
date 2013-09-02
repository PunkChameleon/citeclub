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
    "marionette",
    "views/CiteOptionsView",
    "wikitext"
    ],
    function(Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.FormView = Backbone.Marionette.ItemView.extend({

            className: "citation_form span10 offset1 row-fluid",

            getTemplate: function() {

                var type = this.options.type;

                if (type === CC.config.citationTypes.WEB) {
                    return "#web_form_view_template";
                } else if (type === CC.config.citationTypes.NEWS) {
                    return "#news_form_view_template";
                } else if (type === CC.config.citationTypes.BOOK) {
                    return "#book_form_view_template";
                } else if (type === CC.config.citationTypes.JOURNAL) {
                    return "#journal_form_view_template";
                }
            },

            events: {
                "click .back": "goBack",
                "click .cite_button": "submit"
            },

            goBack: function() {
                
                var contentLayout = this.options.contentLayout;

                //Go Back Functionality should go here!
                contentLayout.buttonsForms.show(new CC.Views.CiteOptionsView({
                    model: this.model,
                    contentLayout: contentLayout
                }));
            },

            submit: function() {
                
                // create hashmap used to build citation wikitext (<ref>) from form data
                var that = this,
                    citationData = {},
                    fields = {};

                citationData.type = this.options.type;

                this.$el.find('input:text').each(function() {
                    var id = $(this).attr('id'), // text input id should correspond to citation attribute name
                        value = $(this).val();
                    if (value !== "")
                        fields[id] = value;
                });

                citationData.fields = fields;
                
                // get citation wikitext
                var oldSectionText = this.model.get("sectionText"),
                    citationWikitext = WikitextProcessor.buildCitationWikitext(citationData),
                    newSectionWikitext = WikitextProcessor.citedSectionWikitext(oldSectionText, citationWikitext);
                
                if (newSectionWikitext) {
                    this.model.submitCitation(newSectionWikitext, function(data) {

                        CC.App.vent.trigger("showMsg", {
                            type: CC.config.messageTypes.EDIT,
                            url: that.model.get("url")
                        });
                        $(".new_page").click();

                    }, function(xhr) {
                        CC.App.vent.trigger("showMsg", {
                            type: CC.config.messageTypes.DEFAULT,
                            title: "Error Citing Article",
                            text: "An error occurred: " + xhr.responseText
                        });
                        console.log("Error: " + xhr.responseText);
                        console.log(xhr);
                    });
                }
            }

        });
});