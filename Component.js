sap.ui.define([
    "sap/ui/core/UIComponent",
    "workloadestimationmodel/model/models",
    "sap/ui/model/json/JSONModel"
], (UIComponent, models, JSONModel) => {
    "use strict";

    return UIComponent.extend("workloadestimationmodel.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // load local workload estimation data as the "data" model
            const oDataModel = new JSONModel(sap.ui.require.toUrl("workloadestimationmodel/model/data.json"));
            this.setModel(oDataModel, "data");

            // enable routing
            this.getRouter().initialize();
        }
    });
});