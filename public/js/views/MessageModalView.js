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

    CC.Views.MessageModalView = Backbone.Marionette.ItemView.extend({

        className: "message_modal modal hide fade",

        getTemplate: function() {

            var type = this.model.get("type");

            if (type === CC.config.messageTypes.EDIT) {
                return "#edit_message_modal_view_template";
            } else {
                return "#message_modal_view_template";
            }
        }

    });
});