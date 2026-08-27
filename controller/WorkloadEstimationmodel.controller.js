sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], (Controller, JSONModel) => {
    "use strict";

    return Controller.extend("workloadestimationmodel.controller.WorkloadEstimationmodel", {
        onInit() {
            const oRolloutModel = new JSONModel({
                Stations: [
                    { Name: "", Switches: null, Size: "", TotalDays: "", TotalHours: "", EuroPerHour: 0, EstimatedCost: 0 }
                ],
                totalHours: 0,
                totalCost: 0
            });
            this.getView().setModel(oRolloutModel, "rollout");
        },

        _classifySize(iSwitches) {
            if (iSwitches <= 4) {
                return "XS";
            } else if (iSwitches < 6) {
                return "S";
            } else if (iSwitches < 10) {
                return "M";
            } else if (iSwitches < 20) {
                return "L";
            }
            return "XL";
        },

        onSwitchesChange(oEvent) {
            const oInput = oEvent.getSource();
            const oContext = oInput.getBindingContext("rollout");
            const sPath = oContext.getPath();
            const oRolloutModel = this.getView().getModel("rollout");

            const iSwitches = parseFloat(oInput.getValue());

            if (isNaN(iSwitches) || iSwitches < 0) {
                oRolloutModel.setProperty(sPath + "/Size", "");
                oRolloutModel.setProperty(sPath + "/TotalDays", "");
                oRolloutModel.setProperty(sPath + "/TotalHours", "");
                oRolloutModel.setProperty(sPath + "/EstimatedCost", 0);
                this._updateRolloutTotals();
                return;
            }

            const sSize = this._classifySize(iSwitches);
            const aSizes = this.getView().getModel("data").getProperty("/Sizes");
            const oMatch = aSizes.find((oRow) => oRow.SizeCategory === sSize);

            oRolloutModel.setProperty(sPath + "/Size", sSize);
            oRolloutModel.setProperty(sPath + "/TotalDays", oMatch.TotalDays);
            oRolloutModel.setProperty(sPath + "/TotalHours", oMatch.TotalHours);

            const fRate = parseFloat(oRolloutModel.getProperty(sPath + "/EuroPerHour")) || 0;
            oRolloutModel.setProperty(sPath + "/EstimatedCost", oMatch.TotalHours * fRate);

            this._updateRolloutTotals();
        },

        onRateChange(oEvent) {
            const oInput = oEvent.getSource();
            const oContext = oInput.getBindingContext("rollout");
            const sPath = oContext.getPath();
            const oRolloutModel = this.getView().getModel("rollout");

            const fRate = parseFloat(oInput.getValue()) || 0;
            const fHours = parseFloat(oRolloutModel.getProperty(sPath + "/TotalHours")) || 0;

            oRolloutModel.setProperty(sPath + "/EstimatedCost", fHours * fRate);
            this._updateRolloutTotals();
        },

        onAddStation() {
            const oRolloutModel = this.getView().getModel("rollout");
            const aStations = oRolloutModel.getProperty("/Stations");
            aStations.push({ Name: "", Switches: null, Size: "", TotalDays: "", TotalHours: "", EuroPerHour: 0, EstimatedCost: 0 });
            oRolloutModel.refresh();
        },

        onRemoveStation(oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("rollout");
            const sPath = oContext.getPath();
            const iIndex = parseInt(sPath.split("/").pop(), 10);

            const oRolloutModel = this.getView().getModel("rollout");
            const aStations = oRolloutModel.getProperty("/Stations");
            aStations.splice(iIndex, 1);
            oRolloutModel.refresh();
            this._updateRolloutTotals();
        },

        _updateRolloutTotals() {
            const oRolloutModel = this.getView().getModel("rollout");
            const aStations = oRolloutModel.getProperty("/Stations");

            let fTotalHours = 0;
            let fTotalCost = 0;
            aStations.forEach((oStation) => {
                fTotalHours += parseFloat(oStation.TotalHours) || 0;
                fTotalCost += parseFloat(oStation.EstimatedCost) || 0;
            });

            oRolloutModel.setProperty("/totalHours", fTotalHours);
            oRolloutModel.setProperty("/totalCost", fTotalCost);
        }
    });
});
