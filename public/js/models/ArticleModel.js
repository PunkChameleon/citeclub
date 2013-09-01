/*
 *
 * Author     : streetlight
 * Date       : 7/20/2013
 * Description: Article Model
 *
 */


define([
    "common",
    "backbone",
    "marionette"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Models.ArticleModel = Backbone.Model.extend({

        	submitCitation: function(newWikitext, successCallback, failureCallback) {

        		/*
                * Submit new citation for this article
                * by making edit with new section wikitext
                */

                $.ajax({
                    type: "POST",
                    url: CC.config.PATH_TO_ACTION + "edit.php",
                    data: { 
                        pageId: this.get("id"), 
                        sectionNum: this.get("sectionNum"),
                        text: newWikitext
                    },
                    success: successCallback,
                    error: failureCallback
                });
        	}

        });

});