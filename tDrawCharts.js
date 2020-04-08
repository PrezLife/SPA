function trendHistogramChart(eleId) {
	//Calculate the average consumption
	var energyAve = 0;
	for (var i = 0; i < trendParamsObj.dateArr.length-1; i++) {
		energyAve += trendParamsObj.energyConsumptionArr[i];
	};
	energyAve = energyAve / (trendParamsObj.dateArr.length-1);

	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Consumption",
		//"Production",
	];
	for (var i = 0; i < trendParamsObj.dateArr.length-1; i++) {
		//Build the chart array
		chartArray[i+1] = [
			trendParamsObj.energyConsumptionArr[i],
			//trendParamsObj.energyProductionArr[i],
		];
	};
	
	var chartOptions = {
		height: 300,
		//width: 600,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		title : "Average = " + energyAve.toFixed(1) + " kWh",
		legend: {
			position: 'none',
		},
		vAxis: {
			title: 'Number of Days',
		},
		hAxis : {
			title: 'Energy Consumption (kWh)',
			viewWindow: {
			},
		},
		histogram: {
			bucketSize: 3,
			//maxNumBuckets: 20,
			minValue: 0,
		},
		series: {
			0: {color: "red"},
			1: {color: "green"},
		},
	};
	//Create the chart
	var chartType = "histogram";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEnergyChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time", 
		"Consumption",
		"Monthly Avg",  
		"Solar Production",
		"Monthly Avg",
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		//Build the chart array
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.energyConsumptionArr[i],
			trendParamsExtObj.energyConsumpAveArr[i],
			//trendParamsObj.energyProductionArr[i],
			//trendParamsExtObj.energyProductionAveArr[i],
			trendParamsObj.energySolarProdArr[i],
			trendParamsExtObj.energySolarProdAveArr[i],
		];
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		seriesType: "steppedArea",
		connectSteps: false,
		series: {
			0: {color: "red", areaOpacity: .5},
			1: {type: "line", color:"red", lineWidth:3},
			2: {color: "Green", areaOpacity: .5},
			3: {type: "line", color:"green", lineWidth:3},
		},
	};
	//Create the chart
	var chartType = "combo";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEnergySumChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Consumption", {role:"annotation"},
		"Solar Production", {role:"annotation"},
		"System Production", {role:"annotation"},
		//"Import", {role:"annotation"},
		//"Export", {role:"annotation"}, 
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var prodAnnote = null;
		var solarProdAnnote = null;
		var consumpAnnote = null;
		var feedInAnnote = null;
		var purchasedAnnote = null;
		if (i == trendParamsObj.dateArr.length-1) {
			var prodConsumpPct = 100* trendParamsObj.energyProductionSumArr[i] / trendParamsObj.energyConsumptionSumArr[i];
			prodAnnote = "System Production = " +  trendParamsObj.energyProductionSumArr[i].toFixed(0) + " kWh";
			solarProdAnnote = "Solar Production = " +  trendParamsObj.energySolarProdSumArr[i].toFixed(0) + " kWh";
			consumpAnnote = "Consumption = " + trendParamsObj.energyConsumptionSumArr[i].toFixed(0) + " kWh";
			feedInAnnote = trendParamsObj.energyFeedInSumArr[i].toFixed(0) + " kWh - Export";
			purchasedAnnote =   trendParamsObj.energyPurchasedSumArr[i].toFixed(0) + " kWh - Import";
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.energyConsumptionSumArr[i], consumpAnnote,
			trendParamsObj.energySolarProdSumArr[i], solarProdAnnote,
			trendParamsObj.energyProductionSumArr[i], prodAnnote,
			//trendParamsObj.energyPurchasedSumArr[i], purchasedAnnote,
			//trendParamsObj.energyFeedInSumArr[i], feedInAnnote,
		];
	};

	var chartOptions = {
		height: 400,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 4,
		series : {
			0 : {color:"Red"},
			1 : {color:"Green"},
			2 : {color:"LimeGreen"},
			3 : {color:"Olive"},
			4 : {color:"Orange"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEnergySumChart2(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Consumption", {role:"annotation"},
		"System Production", {role:"annotation"},
		"Import", {role:"annotation"},
		"Export", {role:"annotation"}, 
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var prodAnnote = null;
		var consumpAnnote = null;
		var feedInAnnote = null;
		var purchasedAnnote = null;
		if (i == trendParamsObj.dateArr.length-1) {
			var prodConsumpPct = 100* trendParamsObj.energyProductionSumArr[i] / trendParamsObj.energyConsumptionSumArr[i];
			prodAnnote = "Production = " +  trendParamsObj.energyProductionSumArr[i].toFixed(0) + " kWh";
			consumpAnnote = "Consumption = " + trendParamsObj.energyConsumptionSumArr[i].toFixed(0) + " kWh";
			feedInAnnote = "Export = " +  trendParamsObj.energyFeedInSumArr[i].toFixed(0) + " kWh";
			purchasedAnnote = "Import = " +  trendParamsObj.energyPurchasedSumArr[i].toFixed(0) + " kWh";
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.energyConsumptionSumArr[i], consumpAnnote,
			trendParamsObj.energyProductionSumArr[i], prodAnnote,
			trendParamsObj.energyPurchasedSumArr[i], purchasedAnnote,
			trendParamsObj.energyFeedInSumArr[i], feedInAnnote,
		];
	};

	var chartOptions = {
		height: 400,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 4,
		series : {
			0 : {color:"Red"},
			1 : {color:"LimeGreen"},
			2 : {color:"Olive"},
			3 : {color:"Orange"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendBCEnergySumChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Consumption", {role:"annotation"},
		"System Production", {role:"annotation"},
		"Import", {role:"annotation"},
		"Export", {role:"annotation"}, 
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var prodAnnote = null;
		var consumpAnnote = null;
		var feedInAnnote = null;
		var purchasedAnnote = null;
		if ((i == trendParamsObj.dateArr.length-1) || (trendParamsObj.dateArr[i].getDate() == bcStartDate-1)) {
			prodAnnote = trendParamsObj.energyProductionBCArr[i].toFixed(0) + " kWh";
			consumpAnnote = trendParamsObj.energyConsumptionBCArr[i].toFixed(0) + " kWh";
			feedInAnnote = trendParamsObj.energyFeedInBCArr[i].toFixed(0) + " kWh";
			purchasedAnnote = trendParamsObj.energyPurchasedBCArr[i].toFixed(0) + " kWh";
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.energyConsumptionBCArr[i], consumpAnnote,
			trendParamsObj.energyProductionBCArr[i], prodAnnote,
			trendParamsObj.energyPurchasedBCArr[i], purchasedAnnote,
			trendParamsObj.energyFeedInBCArr[i], feedInAnnote,
		];
	};
	var chartOptions = {
		height: 400,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 4,
		series : {
			0 : {color:"Red"},
			1 : {color:"LimeGreen"},
			2 : {color:"Olive"},
			3 : {color:"Orange"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEstProdChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Bid Estimate",
		//"Post-Install Estimate",
		"Actual",
		"Actual Monthly Avg", {role: "annotation"},
	];
	var firstAnnote = true;	//Append additional text to first annotation
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		//Calculate annotation value
		var actPctAnnote = null;
		if (trendParamsObj.dateArr[i].getDate() == 15) {
			actPctAnnote = (100 * trendParamsExtObj.energySolarProdAveArr[i] / trendParamsExtObj.bidProdArr[i]).toFixed(0) + "%";
			if (firstAnnote) { //Append additional text
				actPctAnnote += " of Bid";
				firstAnnote = false;
			};
		};
		//Build the chart array
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsExtObj.bidProdArr[i],
			//trendParamsExtObj.estProdArr[i],
			trendParamsObj.energySolarProdArr[i],
			trendParamsExtObj.energySolarProdAveArr[i],
			actPctAnnote,
		];
	};
	
	//Set the custom end date for this plot
	//var thisPlotEnd = new Date(trendPlotStart.getTime());
	//thisPlotEnd.setDate(thisPlotEnd.getDate()+62);
	var chartOptions = {
		//title: 'Energy Trend',
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		seriesType: "steppedArea",
		connectSteps: false,
		annotations: {
			textStyle: {
				bold: true,
				color: "black",
			},
		},
		series : {
			0: {targetAxisIndex: 0, type:"line", color: "black", lineWidth: 4},
			//1: {targetAxisIndex: 0, type:"line", color: "black", lineWidth: 4},
			1: {targetAxisIndex: 0, color: "green", areaOpacity: .5},
			2: {targetAxisIndex: 0, type:"line", color: "green", lineWidth: 4},
		},
	};
	//Create the chart
	var chartType = "combo";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEstProdSumChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time", 
		"Bid Estimate", {role:'annotation'},  
		"Post-Install Estimate", {role: 'annotation'}, 
		"Actual ", {role: 'annotation'}, 
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		//Define the annotations
		var bidAnnote = null;
		var estAnnote = null;
		var actualAnnote = null;
		if (i == trendParamsObj.dateArr.length-1) {
			var actPct = trendMetricsObj.solarProdSumActPct;
			var estPct = 100 * trendParamsExtObj.estProdSumArr[i] / trendParamsExtObj.bidProdSumArr[i]; 
			bidAnnote = trendParamsExtObj.bidProdSumArr[i].toFixed(0) + " kWh";
			estAnnote = trendParamsExtObj.estProdSumArr[i].toFixed(0) + " kWh = " + estPct.toFixed(0) + "% of Bid";
			actualAnnote = trendParamsObj.energySolarProdSumArr[i].toFixed(0) + " kWh = " + actPct.toFixed(0) + "% of Bid";
		};
		//Append values to the chart array
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsExtObj.bidProdSumArr[i], bidAnnote,
			trendParamsExtObj.estProdSumArr[i], estAnnote,
			trendParamsObj.energySolarProdSumArr[i], actualAnnote,
		];
	};
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Production (kWh)',
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		annotations: {
			stem: {length: 0},
		},
		pointsVisible: false,
		lineWidth: 4,
		series : {
			0 : {color:"Black"},
			1 : {color:"Brown"},
			2 : {color:"Green"},
		},
	};
	//Create the chart
	var chartType = "scatter";	
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEstSavingsSumChart(eleId) {	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",  
		"Post-Install Estimate", {role: 'annotation'}, 
		"Actual ", {role: 'annotation'}, 
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		//Calculate the actual savings
		var actSavings = trendParamsObj.utilCostNoSolarSumArr[i] - trendParamsObj.utilCostNetBillBattSumArr[i];
		//Define the annotations
		var actSavingsAnnote = null;
		var estSavingsAnnote = null;
		if (i == trendParamsObj.dateArr.length-1) {
			var actSavingsPct = 100 * actSavings / trendParamsExtObj.estSavingsSumArr[i];
			estSavingsAnnote = "$" + trendParamsExtObj.estSavingsSumArr[i].toFixed(0);
			actSavingsAnnote = "$" + actSavings.toFixed(0) + " = " + actSavingsPct.toFixed(0) + "% of Estimate";
		};
		//Append values to the chart array
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsExtObj.estSavingsSumArr[i], estSavingsAnnote,
			actSavings, actSavingsAnnote,
		];
	};
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Savings',
			format: "$#",
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 4,
		series : {
			0 : {color:"Brown"},
			1 : {color:"Green"},
		},
	};
	//Create the chart
	var chartType = "scatter";	
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendUtilChargeSumChart(eleId) {
	//Calculate the utility usage charges for the installer's estimate
	var utilCostEstimate = []
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		utilCostEstimate[i] = trendParamsObj.utilCostNoSolarSumArr[i] - trendParamsExtObj.estSavingsSumArr[i];
	}
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time",
		"No Solar", {role:'annotation'}, 
		//"No Solar, TOU", {role:'annotation'},
		"Solar", {role:'annotation'}, 
		//"Solar, TOU", {role:'annotation'}, 
		"Solar+Battery", {role:'annotation'}, 
		//"Solar+Batt, TOU", {role:'annotation'}, 
		"Solar with Net Metering", {role:'annotation'}, 
		"Installer Estimate", {role:'annotation'},
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var noSolarAnnot = null;
		var noSolarTOUAnnot = null;
		var netBillNoBattAnnot = null;
		var netBillNoBattTOUAnnot = null;
		var netBillBattAnnot = null;
		var netBillBattTOUAnnot =  null;
		var netMeterAnnot = null;
		var estAnnot = null;
		if (i == trendParamsObj.dateArr.length-1) {
			noSolarAnnot = "$"+trendParamsObj.utilCostNoSolarSumArr[i].toFixed(0);
			noSolarTOUAnnot = "$" + trendParamsObj.utilCostTOUNoSolarSumArr[i].toFixed(0);
			netBillNoBattAnnot = "$" + trendParamsObj.utilCostNetBillNoBattSumArr[i].toFixed(0);
			netBillNoBattTOUAnnot = "$" + trendParamsObj.utilCostTOUNoBattSumArr[i].toFixed(0);
			netBillBattAnnot = "$" + trendParamsObj.utilCostNetBillBattSumArr[i].toFixed(0);
			netBillBattTOUAnnot = "$" + trendParamsObj.utilCostTOUBattSumArr[i].toFixed(0);
			netMeterAnnot = "$"+trendParamsObj.utilCostNetMeterSumArr[i].toFixed(0);
			estAnnot = "$" + utilCostEstimate[i].toFixed(0);
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.utilCostNoSolarSumArr[i], noSolarAnnot,
			//trendParamsObj.utilCostTOUNoSolarSumArr[i], noSolarTOUAnnot,
			trendParamsObj.utilCostNetBillNoBattSumArr[i], netBillNoBattAnnot,
			//trendParamsObj.utilCostTOUNoBattSumArr[i], netBillNoBattTOUAnnot,
			trendParamsObj.utilCostNetBillBattSumArr[i], netBillBattAnnot,
			//trendParamsObj.utilCostTOUBattSumArr[i], netBillBattTOUAnnot,
			trendParamsObj.utilCostNetMeterSumArr[i], netMeterAnnot,
			utilCostEstimate[i], estAnnot,
		];
	};
	var chartOptions = {
		height: 600,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Utility Usage Charge',
			format: "$#",
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 4,
		series: {
			0 : {color: "Red"},
			//1 : {color: "Orange"},
			1 : {color: "Gray"},
			//3 : {color: "RoyalBlue"},
			2 : {color: "Green", lineWidth: 6},
			//5 : {color: "Olive"},
			3 : {color: "Blue"},
			4 : {color: "Brown"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};
function trendUtilChargeSumChart2(eleId) {
	//Calculate the utility usage charges for the installer's estimate
	var utilCostEstimate = []
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		utilCostEstimate[i] = trendParamsObj.utilCostNoSolarSumArr[i] - trendParamsExtObj.estSavingsSumArr[i];
	}
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time",
		"No Solar", {role:'annotation'}, 
		"No Solar, TOU", {role:'annotation'},
		//"Solar", {role:'annotation'}, 
		//"Solar, TOU", {role:'annotation'}, 
		"Solar+Battery", {role:'annotation'}, 
		"Solar+Battery, TOU", {role:'annotation'}, 
		//"Solar with Net Metering", {role:'annotation'}, 
		//"Installer Estimate", {role:'annotation'},
	];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var noSolarAnnot = null;
		var noSolarTOUAnnot = null;
		var netBillNoBattAnnot = null;
		var netBillNoBattTOUAnnot = null;
		var netBillBattAnnot = null;
		var netBillBattTOUAnnot =  null;
		var netMeterAnnot = null;
		var estAnnot = null;
		if (i == trendParamsObj.dateArr.length-1) {
			noSolarAnnot = "$"+trendParamsObj.utilCostNoSolarSumArr[i].toFixed(0);
			noSolarTOUAnnot = "$" + trendParamsObj.utilCostTOUNoSolarSumArr[i].toFixed(0);
			netBillNoBattAnnot = "$" + trendParamsObj.utilCostNetBillNoBattSumArr[i].toFixed(0);
			netBillNoBattTOUAnnot = "$" + trendParamsObj.utilCostTOUNoBattSumArr[i].toFixed(0);
			netBillBattAnnot = "$" + trendParamsObj.utilCostNetBillBattSumArr[i].toFixed(0);
			netBillBattTOUAnnot = "$" + trendParamsObj.utilCostTOUBattSumArr[i].toFixed(0);
			netMeterAnnot = "$"+trendParamsObj.utilCostNetMeterSumArr[i].toFixed(0);
			estAnnot = "$" + utilCostEstimate[i].toFixed(0);
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.utilCostNoSolarSumArr[i], noSolarAnnot,
			trendParamsObj.utilCostTOUNoSolarSumArr[i], noSolarTOUAnnot,
			//trendParamsObj.utilCostNetBillNoBattSumArr[i], netBillNoBattAnnot,
			//trendParamsObj.utilCostTOUNoBattSumArr[i], netBillNoBattTOUAnnot,
			trendParamsObj.utilCostNetBillBattSumArr[i], netBillBattAnnot,
			trendParamsObj.utilCostTOUBattSumArr[i], netBillBattTOUAnnot,
			//trendParamsObj.utilCostNetMeterSumArr[i], netMeterAnnot,
			//utilCostEstimate[i], estAnnot,
		];
	};
	var chartOptions = {
		height: 600,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Utility Usage Charge',
			format: "$#",
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		annotations: {
			stem: {length: 0},
		},
		pointsVisible: false,
		lineWidth: 4,
		series: {
			0 : {color: "Red"},
			1 : {color: "Orange"},
			//2 : {color: "Gray"},
			//3 : {color: "RoyalBlue"},
			2 : {color: "Green", lineWidth: 6},
			3 : {color: "Olive"},
			4 : {color: "Blue"},
			//4 : {color: "Brown"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendBattHistChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time","<20%", "20-40%", "40-60%", "60-80%", ">80%"];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.batteryPctHistArr[i][0]*100,
			trendParamsObj.batteryPctHistArr[i][1]*100,
			trendParamsObj.batteryPctHistArr[i][2]*100,
			trendParamsObj.batteryPctHistArr[i][3]*100,
			trendParamsObj.batteryPctHistArr[i][4]*100];
	};
	var chartOptions = {
		//title: 'Battery Pct Histogram',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Percent Time',
			viewWindow: {
				//min: -250,
			},
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		series : {
			0: {color: "red"},
			1: {color: "orange"},
			2: {color: "gray"},
			3: {color: "blue"},
			4: {color: "green"},
		},
		isStacked: true,
		bar : {groupWidth: "100%"},
	};
	//Create the chart
	var chartType = "column";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendBattEnergyChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time", "SOH %", {role: 'annotation'}, "Loss %", {role: 'annotation'}, "Loss kWh", {role: 'annotation'}];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var energyLossChargePct = ((trendParamsObj.batteryChargedArr[i] - trendParamsObj.batteryDischargedArr[i]) / trendParamsObj.batteryChargedArr[i]) * 100;
		var battSOHPct = (trendParamsObj.batteryCapacityArr[i] / batteryCapacityNew) * 100;
		var energyLossKWH = trendParamsObj.batteryChargedArr[i] - trendParamsObj.batteryDischargedArr[i];
		var lossChargePctAnnote = null;
		var battSOHAnnote = null
		var energyLossKWHAnnote = null
		if (i == trendParamsObj.dateArr.length-1) {
			lossChargePctAnnote = energyLossChargePct.toFixed(1) + "%";
			battSOHAnnote = battSOHPct.toFixed(0) + "%";
			energyLossKWHAnnote = energyLossKWH.toFixed(0) + " kWh";
			//console.log(trendParamsObj.batteryDischargedArr[i] / trendParamsObj.batteryChargedArr[i])
		};
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			battSOHPct,
			battSOHAnnote,
			energyLossChargePct,
			lossChargePctAnnote,
			energyLossKWH,
			energyLossKWHAnnote];
	};
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxes: {
			0: {
				title: 'Percent',
				viewWindow: {
					min: 0,
					max: 100,
				},
			},
			1: {
				title: 'kWh',
				textStyle: {color: "red"},
				titleTextStyle: {color: "red"},
				viewWindow: {
					min: 0,
					//max: 80,
				},
			},
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		annotations: {
			stem: {length: 0},
		},
		pointsVisible: false,
		lineWidth: 3,
		series : {
			0 : {targetAxisIndex: 0, color:"Black"},
			1 : {targetAxisIndex: 0, color:"Purple"},
			2 : {targetAxisIndex: 1, color:"Red"},
		},
	};
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayPowerChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time",
		"Battery",
		"Sol Production", 
		"Consumption",
		//"Self-Consump",
		//"AE Filt",
		//"AP",
		//"AE",
		//"", {role: 'annotation'},
		//"", {role: 'annotation'},
	];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		var annotePP = null; //Peak Power annotation
		var annoteAP = null; //Average Power annotation
		var avePower = null;	//Average Power mark
		var annoteAE = null;	//Average Energy annotation
		var aveEnergy = null;	//Ave Energy mark
		var aveEnergyFilt = null;	//Ave Energy line filtered
		var span = 8;
		if ((i+1) >= span) {
			aveEnergyFilt = 0;
			for (var j = 0; j < span; j++) {
				aveEnergyFilt += dayParamsObj.energyConsumptionArr[i-j];
			};
			aveEnergyFilt = aveEnergyFilt * 5 / 1000 / span;
			if ((i+1) % span == 0) {
				annotePP = Math.max(...dayParamsObj.powerConsumptionArr.slice(i-span, i))/1000;
				annotePP = annotePP.toFixed(1);
				annoteAP = 0;
				annoteAE = 0;
				for (var j = 0; j < span; j++) {
					annoteAP += dayParamsObj.powerConsumptionArr[i-j];
					annoteAE += dayParamsObj.energyConsumptionArr[i-j];
				};
				annoteAP = annoteAP / span / 1000;
				avePower = annoteAP * 4; 
				annoteAP = annoteAP.toFixed(1);
				annoteAE = annoteAE / span / 1000;
				aveEnergy = annoteAE * 16; 
				annoteAE = annoteAE.toFixed(1);
			};
		};
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.batteryPowerArr[i]/1000, 
			dayParamsObj.powerSolarProdArr[i]/1000,
			dayParamsObj.powerConsumptionArr[i]/1000,
			//dayParamsObj.powerSelfConsumptionArr[i]/1000,
			//aveEnergyFilt,
			//avePower,
			//aveEnergy,
			//7, annotePP,
			//6, annoteAP,
		];
	};
	//console.log(chartArray);
	
	var chartOptions = {
		//title: 'Power Details',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
			viewWindow: {
				min: -1,
				max: 8,
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		annotations: {
			stem: {length: 0},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"LightGray"},
			1 : {color:"Green"},
			2 : {color:"Red"},
			3 : {color:"CornflowerBlue"},
			4 : {color:"Red", lineWidth: 4, areaOpacity: 0},
			5 : {color:"Black", lineWidth: 4, areaOpacity: 0},
			6 : {color:"Red", lineWidth: 4, areaOpacity: 0},
			7 : {color:"Black", lineWidth: 0, areaOpacity: 0},
			8 : {color:"Black", lineWidth: 0, areaOpacity: 0},
		},
	};
	
	//Create the chart
	var chartType = "area";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayEnergyChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Battery",
		"Sol Prod", 
		"Consump",
		"Self-Consump",
	];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.batteryEnergyDeltaArr[i]*4/1000,
			dayParamsObj.energySolarProdArr[i]*4/1000,
			(dayParamsObj.energyProductionArr[i] - dayParamsObj.energyFeedInArr[i] + dayParamsObj.energyPurchasedArr[i])*4/1000,
			(dayParamsObj.energyProductionArr[i] - dayParamsObj.energyFeedInArr[i])*4/1000,
		];
	};
	
	var chartOptions = {
		//title: 'Power Calculated from Energy Parameters',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
			viewWindow: {
				min: -1,
				max: 8,
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"LightGray"},
			1 : {color:"Green"},
			2 : {color:"Red"},
			3 : {color:"CornflowerBlue"},
			4 : {color:"black"},
		},
	};
	
	//Create the chart
	var chartType = "area";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayEnergySumChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Batt",
		"Sys Prod", {role:'annotation'},
		"Sol Prod", {role:'annotation'},
		"Consump", {role:'annotation'},
		"Export", {role:'annotation'}, 
		"Import", {role:'annotation'},
		//"Power Consump", {role:'annotation'}, //Based on power signal
	];
	var energyPowerConsump = 0; //Energy consumption based power signal
	
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		energyPowerConsump += .25 * dayParamsObj.powerConsumptionArr[i] / 1000;
		var prodAnnote = null;
		var solarProdAnnote = null;
		var consumpAnnote = null;
		var feedInAnnote = null;
		var purchasedAnnote = null;
		var powerConsumpAnnote = null;
		if (i == dayParamsObj.stdTimeArr.length-1) {
			prodAnnote = (dayParamsObj.energyProductionArrSum[i]/1000).toFixed(1) + " kWh";
			solarProdAnnote = (dayParamsObj.energySolarProdArrSum[i]/1000).toFixed(1) + " kWh";
			consumpAnnote = (dayParamsObj.energyConsumptionArrSum[i]/1000).toFixed(1) + "kWh";
			feedInAnnote = (dayParamsObj.energyFeedInArrSum[i]/1000).toFixed(1) + " kWh";
			purchasedAnnote = (dayParamsObj.energyPurchasedArrSum[i]/1000).toFixed(1) + " kWh";
			powerConsumpAnnote = (energyPowerConsump).toFixed(1) + " kWh";
		};
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.batteryEnergyDeltaArrSum[i]/1000,
			dayParamsObj.energyProductionArrSum[i]/1000, prodAnnote,
			dayParamsObj.energySolarProdArrSum[i]/1000, solarProdAnnote,
			dayParamsObj.energyConsumptionArrSum[i]/1000, consumpAnnote, 
			dayParamsObj.energyFeedInArrSum[i]/1000, feedInAnnote,
			dayParamsObj.energyPurchasedArrSum[i]/1000, purchasedAnnote,
			//energyPowerConsump, powerConsumpAnnote,
		];
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: { 
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				min: -5,
				max: 50,
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"LightGray"},
			1 : {color:"LimeGreen"},
			2 : {color:"Green"},
			3 : {color:"Red"},
			4 : {color:"Olive"},
			5 : {color:"Orange"},
			6 : {color:"Black"},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayBattChargeChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time", "Batt %", "Batt kWh"];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.batteryPctArr[i],
			dayParamsObj.batteryEnergyDelta2Arr[i]/1000];
	};
	var chartOptions = {
		//title: 'Storage',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		vAxes: {
			0: {
				title: 'Percent',
				viewWindow: {
					min: 0,
					max: 100,
				},
			},
			1: {
				title: "kWh",
				viewWindow: {
					min: 0,
					max: 12,
				},
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series: {
			0: {targetAxisIndex: 0, color:"blue"},
			1: {targetAxisIndex: 1, color:"black"},
		},
	};
	
	//Create the chart
	var chartType = "area";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayBattTFChart(eleId) {
	//Split the percent charge vector into two, one rising the other falling
	var batPctRising = [dayParamsObj.batteryPctArr[0]];
	var batPctFalling = [dayParamsObj.batteryPctArr[0]];
	for (var i = 1; i < dayParamsObj.stdTimeArr.length; i++) {
		batPctRising[i] = null;
		batPctFalling[i] = null;
		if (dayParamsObj.batteryPctArr[i] >= dayParamsObj.batteryPctArr[i-1]) {
			batPctRising[i] = dayParamsObj.batteryPctArr[i];
		} else {
			batPctFalling[i] = dayParamsObj.batteryPctArr[i];
		};
	};
	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Energy Delta","Charging","Discharging"];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			dayParamsObj.batteryEnergyDelta2Arr[i]/1000,
			batPctRising[i],
			batPctFalling[i]];
	};
	
	var chartOptions = {
		//title: 'Battery Transfer Function',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend : {position: "top"},
		vAxis: {
			title: 'Charge %',
			viewWindow: {
				min: 0,
				max: 100,
			},
		},
		hAxis : {
			title: 'kWh',
			viewWindow: {
				min: 0,
				max: 12,
			},
		},
		pointsVisible: true,
		lineWidth: 2,
		series : {
			0 : {color:"Red"},
			1 : {color:"Blue"},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayConsumpChart(eleId) {
	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Total",
		"Basic",
		"Dishwasher",
		"Background",
		"", {role : 'annotation'}, //Spike annotation
		//"Remainder",
	];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		var spikeY = null;
		var spikeAnnote = null;
		if (i==4) {
			spikeY = 4;
			spikeAnnote = "kWh:";
		}
		if (dayParamsObj.spikeObj.indexStart.indexOf(i) != -1) {
			spikeY = 4;
			var spikeObjIndex = dayParamsObj.spikeObj.indexStart.indexOf(i);
			var energy = (dayParamsObj.spikeObj.energy[spikeObjIndex] / 1000).toFixed(1)
			if (!isNaN(energy)) {
				spikeAnnote = energy;
			};
		};
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.energyConsumptionArr[i] *4/1000,
			(dayParamsObj.energyConsumpBGArr[i] +
			dayParamsObj.energyConsumpDishArr[i] + dayParamsObj.energyConsumpBasicArr[i]) * 4/1000,
			(dayParamsObj.energyConsumpBGArr[i] +  dayParamsObj.energyConsumpDishArr[i]) * 4/1000,
			dayParamsObj.energyConsumpBGArr[i] *4/1000,
			spikeY, spikeAnnote,
			//dayParamsObj.remainder[i] * 4/1000,
		];
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
			viewWindow: {
				min: -1,
				max: 5,
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"Red", areaOpacity:.2},
			1 : {color:"Blue", areaOpacity:.2},
			2 : {color:"Lime", areaOpacity:.2},
			3 : {color:"Black", areaOpacity:.5},
			4 : {color:"Black", areaOpacity:0, visibleInLegend: false},
		},
	};
	
	//Create the chart
	var chartType = "area";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayConsumpSumChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Background", {role:'annotation'},
		"+Dishwasher", {role:'annotation'},
		"+Basic", {role:'annotation'},
		"Total", {role:'annotation'},
	];
	
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		var backgroundAnnote = null;
		var dishAnnote = null;
		var basicAnnote = null;
		var totalAnnote = null;
		if (i == dayParamsObj.stdTimeArr.length-1) {
			totalAnnote = (dayParamsObj.energyConsumptionArrSum[i]/1000).toFixed(1) + "kWh";
			basicAnnote = ((dayParamsObj.energyConsumpBasicArrSum[i] + dayParamsObj.energyConsumpDishArrSum[i] + dayParamsObj.energyConsumpBGArrSum[i])/1000).toFixed(1) + " kWh";
			dishAnnote = ((dayParamsObj.energyConsumpDishArrSum[i] + dayParamsObj.energyConsumpBGArrSum[i])/1000).toFixed(1) + " kWh";
			backgroundAnnote = (dayParamsObj.energyConsumpBGArrSum[i]/1000).toFixed(1) + " kWh";
		};
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i], 
			dayParamsObj.energyConsumpBGArrSum[i]/1000, backgroundAnnote,
			(dayParamsObj.energyConsumpDishArrSum[i] + dayParamsObj.energyConsumpBGArrSum[i])/1000, dishAnnote,
			(dayParamsObj.energyConsumpBasicArrSum[i] + dayParamsObj.energyConsumpDishArrSum[i] + dayParamsObj.energyConsumpBGArrSum[i])/1000, basicAnnote,
			dayParamsObj.energyConsumptionArrSum[i]/1000, totalAnnote, 
		];
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: { 
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				min: 0,
				max: 50,
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		annotations: {
			stem: {length: 0},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"Black"},
			1 : {color:"Green"},
			2 : {color:"Blue"},
			3 : {color:"Red"},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};


function overlayChartProd(eleId) {
	//Define the parameters to include in the chart
	paramList = {
		"Solar Prod" : "powerSolarProdArrAve",
	};
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]/1000);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
			viewWindow: {
				min: 0,
				//max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};

	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartConsump(eleId) {
	//Define the parameters to include
	paramList = {
		"Consumption" : "powerConsumptionArrAve",
	};
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]/1000);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
			viewWindow: {
				min: 0,
				//max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartConsumpSum(eleId) {
	//Define the parameters to include
	paramList = {
		"Consumption" : "energyConsumptionArrSumAve",
	};
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]/1000);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				min: 0,
				//max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartCust(eleId) {
	//Determine the overlay month to include in the chart
	var month = '1';
	
	//Determine the day to include in the chart
	var dayList = [new Date(2020,1,6), new Date(2020,1,7), new Date(2020,1,10), new Date(2020,1,11)];
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		monthNameObj[month] + " Ave",
	];
	for (var i = 0; i < dayList.length; i++) {
		chartArray[0].push(monthNameObj[dayList[i].getMonth()] + " " + dayList[i].getDate());
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			overlayParamsObj.stdTimeArr[i],
			overlayParamsObj.energyConsumptionArrSumAve[month][i]/1000,
			//overlayParamsObj.powerConsumptionArrAve[month][i]/1000,
		];
		for (var j = 0; j < dayList.length; j++) {
			var dayStartTemp = dayList[j];
			var dayParamsObjTemp = loadDayParams(dayStartTemp);
			chartArray[i+1].push(dayParamsObjTemp. energyConsumptionArrSum[i] / 1000);
			//chartArray[i+1].push(dayParamsObjTemp. powerConsumptionArr[i] / 1000);
		};
	};
	
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"Black", lineWidth: 4},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartBatt(eleId) {
	//Define the parameters to include
	paramList = {
		"Battery Charge" : "batteryPctArrAve",
	};
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'Battery Charge %',
			viewWindow: {
				min: 0,
				max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartExport(eleId) {
	//Define the parameters to include
	paramList = {
		"Solar Prod" : "energyFeedInArrSumAve",
	};
	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]/1000);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				min: 0,
				//max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartImport(eleId) {
	//Define the parameters to include
	paramList = {
		"Solar Prod" : "energyPurchasedArrSumAve",
	};
	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time"];
	for (var i = 0; i < monthArr.length; i++) {
		var paramName = Object.keys(paramList)[0];
		if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[i])) {
			chartArray[0].push(monthObj[monthArr[i]].name);
		};
	};
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [overlayParamsObj.stdTimeArr[i]];
		for (var j = 0; j < monthArr.length; j++) {
			for (paramName in paramList) {
				if (overlayParamsObj [paramList[paramName]].hasOwnProperty(monthArr[j])) {
					chartArray[i+1].push(overlayParamsObj [paramList[paramName]][monthArr[j]][i]/1000);
				};
			};
		};
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				min: 0,
				//max: 100,
			},
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
	};
	//Set the series colors from the definitions in monthObj
	chartOptions.series = {};
	for (var i = 0; i < monthArr.length; i++) {
		chartOptions.series[i] = {color: monthObj[monthArr[i]].color};
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function overlayChartDuck(eleId) {
	//Determine the overlay month to include in the chart
	var month = '8';
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"Production",
		"Consumption",
		"Grid Draw w/o Batt",
		"w/Batt",
	];
	for (var i = 0; i < overlayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			overlayParamsObj.stdTimeArr[i],
			overlayParamsObj.powerSolarProdArrAve[month][i]/1000,
			overlayParamsObj.powerConsumptionArrAve[month][i]/1000,
			(overlayParamsObj.powerConsumptionArrAve[month][i] - overlayParamsObj.powerSolarProdArrAve[month][i])/1000,
			(overlayParamsObj.powerPurchasedArrAve[month][i]-overlayParamsObj.powerFeedInArrAve[month][i])/1000
		];
	};
	
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
		},
		hAxis : {
			viewWindow: {
				min: overlayParamsObj.dayStart,
				max: overlayParamsObj.dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"Lime"},
			1 : {color:"Red"},
			2 : {color:"Blue"},
			3 : {color:"Black"},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function panelsSumChart(eleId) {	
	//Determine the overlay month to include in the chart
	var month = '8';
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"East",
		"West",
		"South",
		"All",
	];
	for (var i = 0; i < panelsParamsObj.dateTimeArr.length; i++) {
		chartArray[i+1] = [
			panelsParamsObj.dateTimeArr[i],
			panelsParamsObj.panelsEastSumArr[i]/1000,
			panelsParamsObj.panelsWestSumArr[i]/1000,
			panelsParamsObj.panelsSouthSumArr[i]/1000,
			panelsParamsObj.panelsAllSumArr[i]/1000,
		];
	};
	
	var SOD = new Date(panelsParamsObj.dateTimeArr[0]);
	var EOD = new Date(SOD);
	SOD.setHours(0);
	EOD.setHours(24);
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
		},
		hAxis : {
			viewWindow: {
				min: SOD,
				max: EOD,
			},
		},
		//curveType: 'function',
		pointsVisible: false,
		lineWidth: 3,
		series : {
			0 : {color:"Red"},
			1 : {color:"Green"},
			2 : {color:"Blue"},
			3 : {color:"Black", lineWidth: 5,},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function panelsAveChart(eleId) {
	//Determine the overlay month to include in the chart
	var month = '8';
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
		"East",
		"West",
		"South",
		//"All",
	];
	for (var i = 0; i < panelsParamsObj.dateTimeArr.length; i++) {
		chartArray[i+1] = [
			panelsParamsObj.dateTimeArr[i],
			panelsParamsObj.panelsEastAveArr[i]/1000,
			panelsParamsObj.panelsWestAveArr[i]/1000,
			panelsParamsObj.panelsSouthAveArr[i]/1000,
			//panelsParamsObj.panelsAllAveArr[i]/1000,
		];
	};
	
	var SOD = new Date(panelsParamsObj.dateTimeArr[0]);
	var EOD = new Date(SOD);
	SOD.setHours(0);
	EOD.setHours(24);
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'top',
		},
		vAxis: {
			title: 'kW',
		},
		hAxis : {
			viewWindow: {
				min: SOD,
				max: EOD,
			},
		},
		//curveType: 'function',
		pointsVisible: false,
		lineWidth: 3,
		series : {
			0 : {color:"Red"},
			1 : {color:"Green"},
			2 : {color:"Blue"},
			3 : {color:"Black", lineWidth: 5,},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function panelsChart(eleId) {
	//Determine the overlay month to include in the chart
	var month = '8';
		
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Time",
	];
	for (panel in panelsParamsObj.panelsEastObj) {
		chartArray[0].push(panel, {role:'style'});
	};
	for (panel in panelsParamsObj.panelsWestObj) {
		chartArray[0].push(panel, {role:'style'});
	};
	for (panel in panelsParamsObj.panelsSouthObj) {
		chartArray[0].push(panel, {role:'style'});
	};
	for (var i = 0; i < panelsParamsObj.dateTimeArr.length; i++) {
		chartArray[i+1] = [panelsParamsObj.dateTimeArr[i]];
		for (panel in panelsParamsObj.panelsEastObj) {
			chartArray[i+1].push(panelsParamsObj. panelsEastObj[panel][i]/1000, "color:red");
		};
		for (panel in panelsParamsObj.panelsWestObj) {
			chartArray[i+1].push(panelsParamsObj. panelsWestObj[panel][i]/1000, "color:green");
		};
		for (panel in panelsParamsObj.panelsSouthObj) {
			chartArray[i+1].push(panelsParamsObj. panelsSouthObj[panel][i]/1000, "color:blue");
		};
	};
	
	var SOD = new Date(panelsParamsObj.dateTimeArr[0]);
	var EOD = new Date(SOD);
	SOD.setHours(0);
	EOD.setHours(24);
	var chartOptions = {
		height: 500,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'none',
		},
		vAxis: {
			title: 'kW',
		},
		hAxis : {
			viewWindow: {
				min: SOD,
				max: EOD,
			},
		},
		//curveType: 'function',
		pointsVisible: false,
		lineWidth: 1,
		series : {
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function xyROIChart(eleId) {
	
	//Define the scenario object
	var scenarioObj = {
		yieldCo: {roi: .05, kwhCost: .04, name: "YieldCo's", style: "color:green"},
		greenBond: {roi: .03, kwhCost: .05, name: "Green Bonds", style: "color:green"},
		installerEst: {roi: .025, kwhCost: .16, name: "Installer Estimate", style: "color:black"},
		actual: {roi: -.034, kwhCost: .23, name: "Actual", style: "color:red"},
		netMeter: {roi: .0288, kwhCost: .13, name: "Net Metering", style: "color:black"},
		noBattery: {roi: -.004, kwhCost: .13, name: "No Battery", style: "color:black"},
	};
	
	//Calculate Pounds of CO2 Reduced per dollar invested
	for (scenario in scenarioObj) {
		scenarioObj[scenario].co2Reduction = 1 / scenarioObj[scenario].kwhCost;
	};
	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["ROI", "kWh Cost", {role: 'style'}, {type: 'string', role: 'annotation', 'p': {'html': true}}];
	for (scenario in scenarioObj) {
		chartArray.push([
		scenarioObj[scenario].roi, 
		scenarioObj[scenario].kwhCost, 
		scenarioObj[scenario].style,
		scenarioObj[scenario].name,
		]);
	};
	
	var chartOptions = {
		height: 600,
		chartArea: {
			top: 20,
			height: "75%",
			width: "75%",
		},
		legend: {
			position: 'none',
		},
		vAxes: {
			0: {
				title: "Unsubsidized Cost per kWh",
				format: "$#.##",
				viewWindow: {
					min: .00,
					max: .25,
				},
			},
			//1: {title: "CO2 Reduction per Dollar Invested", direction: -1, viewWindow: { min: 4, max: 25, }, },
		},
		hAxis : {
			title: 'Average Annual Pre-Tax ROI',
			format: "#.##%",
			viewWindow: {
				min: -.05,
				max: +.05,
			},
		},
		annotations: {
			textStyle: {
				//bold:true,
			},
		},
		pointSize: 30,
		pointShape: "square",
		series: {
			0: {targetAxisIndex: 0},
		},
	};
	//Create the chart
	var chartType = "scatter";	
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};


//Utility function for drawing charts
function drawChart(table,options,type,eleId) {
	var data = new google.visualization.arrayToDataTable(table);
	switch (type) {
		case "scatter" : var chart = new google.visualization.ScatterChart(document.getElementById(eleId)); break;
		case "area" : var chart = new google.visualization.AreaChart(document.getElementById(eleId)); break;
		case "column" : var chart = new google.visualization.ColumnChart(document.getElementById(eleId)); break;
		case "combo" : var chart = new google.visualization.ComboChart(document.getElementById(eleId)); break;
		case "bar" : var chart = new google.visualization.BarChart(document.getElementById(eleId)); break;
		case "steppedArea" : var chart = new google.visualization.SteppedAreaChart(document.getElementById(eleId)); break;
		case "histogram" : var chart = new google.visualization.Histogram(document.getElementById(eleId)); break;
	};
	chart.draw(data,options)
};

//**********************************************
function OLDtrendEnergyChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time","Production", {role:'style'}, "Consumption", {role:'style'}, "", {role:'style'}, "", {role:'annotation'}];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		//Determine whether to display consumption as an incremental bar or as a dot
		var barConsumption = null;
		var dotConsumption = null;
		if (trendParamsObj.energyConsumptionArr[i] > trendParamsObj.energyProductionArr[i]) {
			barConsumption = trendParamsObj.energyConsumptionArr[i] - trendParamsObj.energyProductionArr[i];
		} else {
			dotConsumption = trendParamsObj.energyConsumptionArr[i];
		};
		//Identify where to put dayplot day marker.  
		var dayMarker = null
		var dayAnnote = null
		if (trendParamsObj.dateArr[i].getTime() == dayStart.getTime()) {
			dayMarker = 5;
			dayAnnote = null;
		}
		//Build the chart array
		chartArray[i+1] = [
			trendParamsObj.dateArr[i], 
			trendParamsObj.energyProductionArr[i], "color:green; opacity:0.5",
			barConsumption, "color:red; opacity:0.5",
			dotConsumption, "opacity:0.5",
			dayMarker,
			dayAnnote];
	};
	
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'none',
		},
		vAxis: {
			title: 'kWh',
			viewWindow: {
				//min: -250,
			},
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		seriesType: "bars",
		series : {
			0 : {color:"Green"},
			1 : {color:"Red"},
			2 : {type:"line", color:"red", lineWidth:0, pointsVisible:true, pointShape: 'square', visibleInLegend: false},
			3 : {type:"line", color:"black", lineWidth:0, pointsVisible:true, pointSize: 30, pointShape:{type:'star', sides:4}, visibleInLegend:false},
		},
		isStacked: true,
		//bar : {groupWidth: "100%"},
	};
	//Create the chart
	var chartType = "combo";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function trendEstPctChart(eleId) {	
	//Build the chart array
	var chartArray = [];
	chartArray[0] = ["Time", "Production", {role: 'annotation'}, "Savings", {role: 'annotation'}];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		// Calculate the production and savings Percent
		var productionPct = trendParamsObj.energyProductionSumArr[i] / estProdSumArr[i];
		var savingsPct = (trendParamsObj.utilCostNoSolarSumArr[i] - trendParamsObj.utilCostNetBillBattSumArr[i]) / trendParamsExtObj.estSavingsSumArr[i];
		//Define the annotations
		var prodAnnote = null;
		var savingsAnnote = null
		if (i == trendParamsObj.dateArr.length-1) {
			prodAnnote = (100*productionPct).toFixed(0) + "%";
			savingsAnnote = (100*savingsPct).toFixed(0) + "%";
		};
		//Append values to the chart array
		chartArray[i+1] = [
		trendParamsObj.dateArr[i],
		productionPct,
		prodAnnote,
		savingsPct,
		savingsAnnote
		];
	};
	var chartOptions = {
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'none',
		},
		vAxes: {
			0: {
				title: 'Production',
				format: "#%",
				textStyle: {color: "green"},
				titleTextStyle: {color: "green"},
				viewWindow: {
					min: 0,
					max: 1,
				},
			},
			1: {
				title: 'Savings',
				format: "#%",
				textStyle: {color: "red"},
				titleTextStyle: {color: "red"},
				viewWindow: {
					min: 0,
					max: 1,
				},
			},
		},
		hAxis : {
			viewWindow: {
				min: trendPlotStart,
				max: trendPlotEnd,
			},
		},
		lineWidth: 1,
		series : {
			0 : {targetAxisIndex: 0, color:"Green", pointsVisible:false, lineWidth:3},
			1 : {targetAxisIndex: 1, color:"Red", pointsVisible: false, lineWidth: 3},
		},
	};
	//Create the chart
	var chartType = "scatter";	
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};

function dayBattEnergyChart() {
	//Build the chart array
	var chartArray = [];
	var offsetStart = dayParamsObj.batteryChargedArr[0] - dayParamsObj.batteryDischargedArr[0];
	chartArray[0] = ["Time","Charged","Discharged", "Delta"];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			dayParamsObj.stdTimeArr[i],
			dayParamsObj.batteryChargedArr[i],
			dayParamsObj.batteryDischargedArr[i],
			dayParamsObj.batteryChargedArr[i] - dayParamsObj.batteryDischargedArr[i]];
	};
	
	var chartOptions = {
		title: 'Battery Parameters',
		height: 300,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		vAxis: {
			title: 'Watt-Hours',
			viewWindow: {
			},
		},
		hAxis : {
			viewWindow: {
				min: dayStart,
				max: dayEnd,
			},
		},
		pointsVisible: false,
		lineWidth: 2,
		series : {
			0 : {color:"Green"},
			1 : {color:"Black"},
		},
	};
	
	//Create the chart
	var chartType = "area";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, "divChart4")});
};

function dayConsumpTFChart(eleId) {
	//Build the chart array
	var chartArray = [];
	chartArray[0] = [
		"Power Consump",
		"Energy Consump",
	];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		chartArray[i+1] = [
			dayParamsObj.powerConsumptionArr[i]/1000,
			4*dayParamsObj.energyConsumptionArr[i]/1000,
		];
	};
	//console.log(chartArray);
	
	var chartOptions = {
		height: 400,
		chartArea: {
			top: 20,
			height: "80%",
			width: "80%",
		},
		legend: {
			position: 'none',
		},
		vAxis: {
			title: 'Power from Energy (kW)',
			viewWindow: {
				min: 0,
				max: 15,
			},
		},
		hAxis : {
			title:  'Power (kW)',
			viewWindow: {
				min: 0,
				max: 15,
			},
		},
		pointsVisible: true,
		lineWidth: 0,
		series : {
			0 : {color:"Black"},
		},
	};
	
	//Create the chart
	var chartType = "scatter";
	google.charts.setOnLoadCallback(function(){drawChart(chartArray, chartOptions, chartType, eleId)});
};
