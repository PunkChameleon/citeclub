/*
 *
 * Author     : pcaisse
 * Date       : 8/31/2013
 * Description: Displays messages to the user with an 'OK' button similar to an alert
 *
 */


define([
        "common",
        "backbone",
        "marionette"
    ],

    function (Common, Backbone) {

        var CC = Common.CC || {};

        CC.Views.LoginModalView = Backbone.Marionette.ItemView.extend({

            template: "#message_modal_view_template",

            className: "message_modal modal hide fade"

        });
    });