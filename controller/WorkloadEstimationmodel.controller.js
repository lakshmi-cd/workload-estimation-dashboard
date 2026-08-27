/*global QUnit*/

sap.ui.define([
	"workloadestimationmodel/controller/WorkloadEstimationmodel.controller"
], function (Controller) {
	"use strict";

	QUnit.module("WorkloadEstimationmodel Controller");

	QUnit.test("I should test the WorkloadEstimationmodel controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
