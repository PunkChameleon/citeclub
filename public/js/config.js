/*
 *
 * Author: streetlight
 * Date: May 21, 2013
 * Description: Sets up require configuration for application.
 *
 */

 // TODO:
 // Optionally add {{reflist}} to page wikitext if there is none
 // Datetimepicker for date fields
 // Validate citation input (ex. URL schemes)

requirejs.config({

    baseUrl: 'js',

    paths: {
        jquery: 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        underscore: 'vendor/underscore.min',
        backbone: 'vendor/backbone.min',
        marionette: 'vendor/backbone.marionette.min',
        mustache: 'vendor/mustache.min',
        bootstrap: 'vendor/bootstrap.min',
        mediawiki: 'classes/MediaWiki',
        wikitext: 'classes/WikitextProcessor'
    },

    shim: {

        "backbone": {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },

        "marionette": {
            deps: ["underscore", "jquery", "backbone"],
            exports: "Marionette"
        },

        "underscore": {
            exports: "_"
        },

        "bootstrap": {
            deps: ["jquery"]
        },

        "mediawiki": {
            deps: ["jquery"]
        }

    }

});

define(["common",
        "jquery",
        "backbone",
        "marionette", 
        "mustache",
        "mediawiki",
        "routers/GlobalRouter"],
    function (Common, $, Backbone, Marionette, Mustache) {

        'use strict';

        var CC = Common.CC || {};

        CC.App = new Backbone.Marionette.Application();

        var mainRouter = new CC.Routers.GlobalRouter();

        CC.App.addRegions({
            "applicationWrapper": "#wrapper"
        });

        // Configure custom template loading, compiling and rendering
        CC.App.addInitializer(function (options) {

            Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
                return Mustache.compile(rawTemplate);
            };

            Backbone.history.start();

        });

        CC.config = {
            PATH_TO_ACTION: "php/action/",
            citationTypes: {
                WEB: "web",
                NEWS: "news",
                BOOK: "book",
                JOURNAL: "journal"
            },
            messageTypes: {
                DEFAULT: 0,
                EDIT: 1
            } 
        };

        // Make AJAX call to get wikiURL before starting app
        $.ajax({
            url: CC.config.PATH_TO_ACTION + 'getWikiURL.php',
            success: function(wikiURL) {
                // Make another AJAX call to get current user
                // from session variable
                $.ajax({
                    url: CC.config.PATH_TO_ACTION + 'getUser.php',
                    success: function(username) {
                        // Set user
                        CC.User = new CC.Models.UserModel({
                            username: username
                        });
                        // Configure JS wrapper
                        CC.MediaWiki = MediaWiki(CC.config.PATH_TO_ACTION, wikiURL);
                        // Start the app
                        $(document).ready(function () {
                            CC.App.start();
                        });
                    },
                    error: function(xhr, error){
                        console.debug(xhr);
                        console.debug(error);
                    }
                });                
            },
            error: function(xhr, error){
                console.debug(xhr);
                console.debug(error);
            }
        });

    }
);