/*
 *
 * Author     : nweingartner
 * Date       : 7/20/2013
 * Description: Controller for Application
 *
 */


define([
    "common",
    "backbone",
    "marionette",
    "layouts/AppLayout",
    "layouts/HeaderLayout",
    "layouts/ContentLayout",
    "views/FooterView"
    ],
    function(Common, Backbone, Marionette) {

        var CC = Common.CC || {};

        CC.Controllers.GlobalController = Backbone.Marionette.Controller.extend({

            main : function() {
                //Start main Application.

                //Create the App Layout
                var appLayout = new CC.Layouts.AppLayout();

                //Place the main layout into the application
                CC.App.applicationWrapper.show(appLayout);

                var contentLayout = new CC.Layouts.ContentLayout();

                //Place Header Layout
                appLayout.header.show(new CC.Layouts.HeaderLayout({
                    modal: appLayout.modal,
                    contentLayout: contentLayout
                }));

                CC.App.vent.on("showMsg", function(title, text){
                    var msgModel = Backbone.Model.extend(),
                        msgModalView = new CC.Views.MessageModalView({
                            model: new msgModel({
                                title: title,
                                text: text
                            }) 
                        });

                    appLayout.modal.show(msgModalView);
                    msgModalView.$el.modal();
                });

                //Place Content Layout
                appLayout.content.show(contentLayout);

                //Place Footer View
                appLayout.footer.show(new CC.Views.FooterView());
            },

            about : function() {
                //About Page
            },

            howToCiteLikeABoss : function() {

            },

            contribute : function() {

            },

            contact : function() {
                
            }

        });
});