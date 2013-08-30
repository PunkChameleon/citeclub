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

                var articleModel = new CC.Models.ArticleModel(),
                    keywords = $('.keywords').val();

                CC.MediaWiki.citationNeededPage(keywords, function(pageData) {
                    if (pageData != null) {
                        // data found!
            
                        // get page id and title
                        var id = pageData.id;
                        var title = pageData.title;
                        
                        CC.MediaWiki.getPageContent(id, function(content) {
                            CC.MediaWiki.getPageHTML(id, function(html) {
            
                                // text for this section in Wikipedia markup language
                                var firstSection = WikitextProcessor.firstCitationNeededSectionText(content),
                                    sectionText, 
                                    sectionNum;
                                
                                if (firstSection !== null) {
                                    sectionNum = firstSection['section'];
                                    sectionText = firstSection['text'];
                                } else {
                                    sectionText = content;
                                }
                                
                                var articleURL = CC.MediaWiki.urlFromPageId(id);
                                
                                // set paragraph 
                                var paragraphHTML = function() {
                                    var citationNeededSelector = ":contains('citation needed')";
                                    var $parent = $(html).find(citationNeededSelector).parent();            
                                    if ($parent[0].nodeName == "TABLE") {
                                        // we have a table
                                        // get the HTML of the <td> instead of all the table HTML
                                        return $(html).find('td').filter(citationNeededSelector).filter(':first').html();
                                    }
                                    return $parent.html();
                                }

                                articleModel.set({
                                    id: id,
                                    title: title,
                                    url: articleURL,
                                    sectionNum: sectionNum,
                                    sectionText: sectionText,
                                    html: paragraphHTML
                                });
                                
                            });
                        });
            
                    } else {
                        // couldn't find any pages
                    }
            
                });

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