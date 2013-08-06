/*
 *
 * Author : streetlight
 * Date: May 21, 2013
 * Description: Sets up require configuration for application.
 *
 */

define([
        "jquery",
        "backbone",
        "marionette"
    ],
    function ($, Backbone, Marionette) {

        'use strict';

        var CC = {
            App: {},
            Routers: {},
            Controllers: {},
            Layouts: {},
            Views: {},
            Models: {},
            Collections: {}
        };

        return {
            CC: CC,
            apiRoot: "http://en.wikipedia.org/w/"
        };
    });