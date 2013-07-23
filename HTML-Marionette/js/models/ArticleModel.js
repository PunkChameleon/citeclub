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
            defaults : {
                "articleTitle" : "Richard Stallman",
                "articleLink" : "#",
                "articleContent" : '"One of his criteria for giving an interview to a journalist is that the journalist agree to use his terminology throughout the article.[65] <span>Sometimes he has even required journalists to read parts of the GNU philosophy before an interview, for efficiencys sake.<sup>[citation needed]</sup></span>He has been known to turn down speaking requests over some terminology issues.[66]"'
            }
        });

});