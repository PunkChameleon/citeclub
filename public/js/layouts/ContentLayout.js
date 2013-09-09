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
    "wikitext",
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

            onRender: function() {

                var articleModel = new CC.Models.ArticleModel({
                        isSearching: true
                    }),
                    keywords = $('.keywords').val();

                CC.MediaWiki.citationNeededPage(keywords, function(pageData) {

                    // searching is finished
                    articleModel.set("isSearching", false);
                    
                    if (pageData !== null) {
                        // data found!
            
                        // get page id and title
                        var id = pageData.id,
                            title = pageData.title,
                            articleURL = CC.MediaWiki.urlFromPageId(id);

                        articleModel.set({
                            id: id,
                            title: title,
                            url: articleURL
                        });
                        
                        CC.MediaWiki.getPageContent(id, function(content) {
                            CC.MediaWiki.getPageHTML(id, function(html) {
            
                                // text for this section in Wikipedia markup language
                                var firstSection = WikitextProcessor.firstCitationNeededSectionText(content),
                                    sectionText, 
                                    sectionNum;
                                
                                if (firstSection !== null) {
                                    sectionNum = firstSection.section;
                                    sectionText = firstSection.text;
                                } else {
                                    sectionText = content;
                                }
                                
                                // set paragraph 
                                var citationNeededElems = $(html).find(":contains('citation needed')").filter(":first"),
                                    citationNeededParagraphs = citationNeededElems[0] ? citationNeededElems.parents() : [],
                                    paragraphHTML = citationNeededParagraphs[0] ? citationNeededParagraphs[0].outerHTML : "";

                                articleModel.set({
                                    sectionNum: sectionNum,
                                    sectionText: sectionText,
                                    html: paragraphHTML,
                                    allDataRetrieved: true
                                });
                                
                            });
                        });
                    }             
                });

                //Show Quote Region
                this.quote.show(new CC.Views.QuoteView({
                    model: articleModel
                }));

                //Show Form Region
                this.buttonsForms.show(new CC.Views.CiteItSkipItView({
                    model: articleModel,
                    contentLayout: this
                }));
            }

        });
});