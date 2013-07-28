/*
 *
 * Author     : nweingartner
 * Date       : 7/20/2013
 * Description: Main application Layout
 *
 */


define([
        "common",
        "backbone",
        "marionette"
    ],
    function (Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Layouts.AppLayout = Backbone.Marionette.Layout.extend({

            template: "#app_layout_template",

            className: "main_container",

            regions: {
                header: "#header",
                content: "#content",
                footer: "#footer",
                modal: "#modal"
            }

        });
    });