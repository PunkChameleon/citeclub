/*
 *
 * Author : streetlight
 * Date: May 21, 2013
 * Description: Sets up require configuration for application.
 *
 */

requirejs.config({

    baseUrl: 'js',

    paths: {
        jquery     : 'http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min',
        underscore : 'vendor/underscore.min',
        backbone   : 'vendor/backbone.min',
        marionette : 'vendor/backbone.marionette.min',
        mustache   : 'vendor/mustache.min'
    },

    shim: {

        "backbone": {
            deps    : ["underscore", "jquery"],
            exports : "Backbone"
        },

        "marionette" : {
            deps    : ["underscore", "jquery", "backbone"],
            exports : "Marionette"
        },

        "underscore" : {
            exports : "_"
        }

    }

});

define(["common", "jquery", "backbone", "marionette", "mustache", "routers/GlobalRouter"], function (Common, $, Backbone, Marionette, Mustache) {

    'use strict';

    var CC = Common.CC || {};

    CC.App = new Backbone.Marionette.Application();

    var mainRouter = new CC.Routers.GlobalRouter();

    CC.App.addRegions({
        "applicationWrapper" : "#wrapper"
    });
 
    // Configure custom template loading, compiling and rendering
    CC.App.addInitializer(function(options) {

        Backbone.Marionette.TemplateCache.prototype.compileTemplate = function (rawTemplate) {
            return Mustache.compile(rawTemplate);
        };

        Backbone.history.start();
        
    });
     
    // Start the app
    $(document).ready(function () {
      CC.App.start();
    });

});
