/*
 *
 * Author     : pcaisse
 * Date       : 5/21/2013
 * Description: Router for application
 *
 */


define([
    "backbone",
    "marionette",
    "common",
    "controllers/GlobalController"
    ],
    function(Backbone, Marionette, Common) {

        var CC = Common.CC;

        CC.Routers.GlobalRouter = Backbone.Marionette.AppRouter.extend({

            controller: CC.Controllers.GlobalController,

            routes: {
                "/": "main"
            }

        });
});