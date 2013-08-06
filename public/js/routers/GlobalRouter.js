/*
 *
 * Author     : pcaisse
 * Date       : 5/21/2013
 * Description: Router for application
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "controllers/GlobalController"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Routers.GlobalRouter = Backbone.Marionette.AppRouter.extend({

            controller : new CC.Controllers.GlobalController(),

            appRoutes: {
                "": "main",
                "about" : "about"
            }

        });
});