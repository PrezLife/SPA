//Load google charts
google.charts.load('current', {'packages':['corechart']});

buildWindow('window', uiWindowObj2);

//Open the first menu window
document.getElementById("tB201").click();

//Build the panel vectors
buildPanelVectors();

//Load and process the trend data file
var trendParamsObj, trendParamsExtObj = {}, trendMetricsObj = {};
var trendStart = new Date(), trendEnd = new Date();
var trendPlotStart = new Date(), trendPlotEnd = new Date();
var bcStartDate;
var url2 = 'https://solarperf.s3.amazonaws.com/zTrendParamsObj.txt';
fetch(url2).then(function (response) {
	response.text().then(function(text) {
		trendParamsObj = JSON.parse(text);
		//Convert the date strings to date objects
		for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
			var stdDateObj = translateDate(trendParamsObj.dateArr[i]);
			trendParamsObj.dateArr[i] = stdDateObj;
		};
		//Extract the billing cycle start date (of the month)
		bcStartDate = trendParamsObj.bcStartDate;
		
		//Set the trend data range 
		trendStart = trendParamsObj.dateArr[0];
		trendEnd = trendParamsObj.dateArr[trendParamsObj.dateArr. length - 1];
		trendEnd.setDate(trendEnd.getDate() + 1); //One day past end
		
		//Set the trend plot date range based on the available data
		trendPlotStart.setTime(trendStart.getTime());
		trendPlotStart.setDate(1);
		trendPlotEnd.setTime(trendEnd.getTime());
		trendPlotEnd.setMonth(trendPlotEnd.getMonth() + 1);
		trendPlotEnd.setDate(1);
		//trendPlotEnd = new Date(2020, 07, 01)
		
		//Build the extended trend parameters object and the trend metrics object
		buildTrendParamsExt();
		buildTrendMetrics();
		
		currentState.trendFileLoaded = true;
	});
});

//Load and process the dayfile data file
var url3 = 'https://solarperf.s3.amazonaws.com/zDayFileObj.txt';
var dayFileObj, dayParamsObj, overlayParamsObj={};
var dayStart = new Date(), dayEnd = new Date();
fetch(url3).then(function (response) {
	response.text().then(function(text) {
		dayFileObj = JSON.parse(text);
		//Convert the timestamp text strings to objects
		for (date in dayFileObj) {
			for (var i = 0; i < dayFileObj[date].stdTimeArr.length; i++) {
				var stdTimeObj = translateDate(dayFileObj[date].stdTimeArr[i]);
				dayFileObj[date].stdTimeArr[i] = stdTimeObj;
			};
		};
		
		//Define the initial dayplot range
		var dateStrArr = Object.keys(dayFileObj);
		dayStart = translateDate(dateStrArr[dateStrArr.length-2]);
		dayEnd.setTime(dayStart.getTime());
		dayEnd.setDate(dayEnd.getDate() + 1);
		currentState.dayFileLoaded = true;
		
		//Build the overlay data vectors
		buildOverlayParams();
		currentState.overlayParamsBuilt = true;
	});
});

function updateDay(updateType) {
	if (currentState.dayFileLoaded) {
		switch (updateType) {
			case 'previous': 
				if (dayStart.getTime() > trendStart.getTime()) {
					dayStart.setDate(dayStart.getDate() - 1);
					dayEnd.setDate(dayEnd.getDate() - 1);
				};
				break;
			case 'next':
				if (dayEnd.getTime() < trendEnd.getTime()) {
					dayStart.setDate(dayStart.getDate() + 1);
					dayEnd.setDate(dayEnd.getDate() + 1);
				};
				break;
			case 'same':
				break;
			};
		var dayStartString = dayStart.getMonth()+1 + "/" + dayStart.getDate() + "/" + dayStart.getFullYear();
		document.getElementById("dayDateStart").innerHTML = dayStartString;
		dayParamsObj = loadDayParams(dayStart);
		
		//Update the day charts
		updateDayCharts();
		
		//Update Buttons
		var ele = document.getElementById('prevButton');
		if (dayStart.getTime() <= trendStart.getTime()) {
			ele.classList.add('w3-disabled');
		} else {
			ele.classList.remove('w3-disabled');
		};
		var ele = document.getElementById('nextButton');
		if (dayEnd.getTime() >= trendEnd.getTime()) {
			ele.classList.add('w3-disabled');
		} else {
			ele.classList.remove('w3-disabled');
		};
	};
};

function updateDayCharts() {
	if (currentState.tabWindow == "dayplots") {
		dayPowerChart('divChartA1');
		dayEnergyChart('divChartA2');
		dayEnergySumChart('divChartA3');
		//dayConsumpChart('divChartA4');
		//dayConsumpSumChart('divChartA5');
		dayBattChargeChart('divChartB1');
		//dayConsumpTFChart('divChartB2');
		dayBattTFChart('divChartB2');
		//dayBattEnergyChart(dayParamsObj);
	} else if (currentState.tabWindow == "consumption") {
		dayConsumpChart('divChartA4');
		dayConsumpSumChart('divChartA5');
	};
};

function dispEnergy(eleId, titleId, title) {
	var thisWindow = "energy";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";
	
	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br><p>This first chart shows the daily solar energy production and household energy consumption.  The solid lines represent the daily averages for each calendar month.</p><br>";
	txt += "</div>";
	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Daily Energy Production and Consumption");
	txt += "</div>";
	
	txt += "<div class='w3-container'>";
		txt += "<br><p>This chart is built from the same data and shows the cumulative production and consumption.  \"System production\" is also shown along with \"Solar production\".   System production is the amount of solar energy available to the house after round-trip battery charge/discharge losses are taken into account.</p><br>";
	txt += "</div>";
	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "Cumulative Energy Production and Consumption");
	txt += "</div>";
	
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt += "<p>This chart is the simlar to the previous chart, but also shows the energy imports from and exports to the grid.  System production plus imports equals consumption plus exports.</p>";
		txt += "<br>";
	txt += "</div>";
	var chartEleIdC = 'divChartC';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdC, "Cumulative Energy Flows");
	txt += "</div>";
	
	txt += "<div class='w3-container'>";
		txt += "<br><p>This chart shows the same data as the previous chart but segmented into the utility billing cycle.  It is used for validating the system monitoring results against data provided in monthly utility bills.</p><br>";
	txt += "</div>";
	var chartEleIdD = 'divChartD';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdD, "Billing Cycle Energy Flows");
	txt += "</div>";
	txt += "<div class='w3-container'>";
		txt += "<br><p>Because SCI REMC does not offer net metering, exports to the grid are priced at wholesale rates instead of retail rates.  Wholesale rates currently are 50% lower than retail rates.  So, it is important to synchronize energy consumption with solar production and battery storage as best as possible during the day.  This will help minimize the amount of energy that is first exported at wholesale rates and then later imported at the higher retail rates.</p><br>";
	txt += "</div>";

	document.getElementById(eleId).innerHTML = txt;

	//Generate the charts after the trend file is loaded
	var stateTimer = setInterval(function() {
		if (currentState.trendFileLoaded) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				trendEnergyChart(chartEleIdA);
				trendEnergySumChart(chartEleIdB);
				trendEnergySumChart2(chartEleIdC);
				trendBCEnergySumChart(chartEleIdD);
				var production = trendParamsObj.energyProductionSumArr[trendParamsObj.dateArr.length - 1];
				var consumption = trendParamsObj.energyConsumptionSumArr[trendParamsObj.dateArr.length - 1];
				var ratio = production / consumption
				var txt = "To-date, the total production is ";
			};
		};
	}, 100);
};

function dispEstimates(eleId, titleId, title) {
	var thisWindow = "estimates";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";
	
	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt+= "<p>The solar installers provided an annual energy production estimate with their project bid.  After the installation was complete, they provided an updated estimate that included a monthly breakdown as well as the expected utility bill savings.</p>"
		txt += "<p>The first chart shows the actual solar energy production in comparison to the original bid estimate.  The bid estimate has been broken down into monthly average values based on the typical seasonal variation in solar insolation for this geographic area.  The actual monthly production is consistently below the installer's bid estimate, ranging from <b><span id='pctMin'></span>%</b> to <b><span id='pctMax'></span>%</b> of the bid estimate.</p>";
		txt += "<br>";
	txt += "</div>";
	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Estimated and Actual Solar Energy Production");
	txt += "</div>";
	
	txt += "<div class='w3-container'>";
		txt += "<br><p> This chart shows the cumulative actual and estimated solar energy production to-date.  The post-installation estimate is included in addition to the bid estimate.  The actual solar production is only <b><span id='pctSum'></span>%</b> of the bid estimate</p><br>";
	txt += "</div>";
	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "Cumulative Solar Energy Production");
	txt += "</div>";
	
	txt += "<div class='w3-container'>";
		txt += "<br><p>This chart shows the actual utility bill savings in relation to the installer's post-installation estimate.  The bid estimate is not shown in this chart as the installer did not include savings estimates with the bid.</p><br>";
	txt += "</div>";
	var chartEleIdC = 'divChartC';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdC, "Cumulative Savings");
	txt += "</div>";
	
	document.getElementById(eleId).innerHTML = txt;
	
	var stateTimer = setInterval(function() {
		if (currentState.trendFileLoaded) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				trendEstProdChart(chartEleIdA);
				trendEstProdSumChart(chartEleIdB);
				trendEstSavingsSumChart(chartEleIdC);
				document.getElementById('pctMin').innerHTML = trendMetricsObj.solarProdActPctMin.toFixed(0);
				document.getElementById('pctMax').innerHTML = trendMetricsObj.solarProdActPctMax.toFixed(0);
				document.getElementById('pctSum').innerHTML = trendMetricsObj.solarProdSumActPct.toFixed(0);
			};
		};
	}, 100);
};
	
function dispArchAndRates(eleId, titleId, title) {
	var thisWindow = "architecture";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";
	
	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt += "<p>The first chart shows utility usage charges that would have been incurred to-date for a variety of different system configurations.  This just shows the usage charges and does not include the utility's fixed monthly connection fee, which is independent of the system configuration.  The following architectures are modeled:</p>";
		txt += "<ul>";
			txt += "<li><b>No Solar</b>  No PV solar system installed.</li>";
			txt += "<li><b>Solar</b>  The existing PV solar system but without a battery.</li>";
			txt += "<li><b>Solar+Battery</b>  The existing system, which consists of a 7.15 kW PV system plus a 9.8 kWh battery for storage.  The system is grid-connected to SCI REMC, who offers net billing rather than net metering.</li>";
			txt +="<li><b>Solar with Net Metering</b>  The existing PV solar system but without a battery and connected to a utility that offers net metering.</li>";
			txt += "<li><b>Installer Estimate</b>  The expected usage charges based on the installer's post-installation estimate of the energy and cost savings the system should generate.</li>";
		txt += "</ul>";
		txt += "<br>";
	txt += "</div>";
	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Cumulative Utility Usage Charges for Various System Architectures");
	txt += "</div>";
	txt += "<div class='w3-container'>";
		txt += "<br><p>In the past, SCI REMC offered Time-of-Use (TOU) Rates as an alternative to standard rates.  TOU rates vary the cost per kWh based on both time of day and time of year.  They generally result in higher charges during the summer and lower charges during the spring and fall.  Solar with storage is generally more able than other architectures to benefit from TOU rates over the course of a full year.</p><br>";
	txt += "</div>";
	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "The Impact of Time-of-Use (TOU) Rates");
	txt += "</div>";

	document.getElementById(eleId).innerHTML = txt;

	var stateTimer = setInterval(function() {
		if (currentState.trendFileLoaded) {
			clearInterval(stateTimer)
			if (currentState.tabWindow == thisWindow) {
				trendUtilChargeSumChart(chartEleIdA);
				trendUtilChargeSumChart2(chartEleIdB);
			};
		};
	}, 100);
};

function dispEconomics(eleId, titleId, title) {
	var thisWindow = "economics";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";
	
	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt += "<p>This chart illustrates the economics of various solar investment options and scenarios.  The Y-Axis represents the environmental effectiveness of the investment, the X-Axis represents the personal financial return.  The most effective investment options are in the lower righthand corner of the chart.</p>";
		txt += "<p>The following investment options are included in the analysis: </p>";
		txt += "<ul>";
			txt += "<li><b>Actual</b>  The existing PV solar system.</li>";
			txt += "<li><b>No Battery</b>  The existing PV solar system but without a battery.</li>";
			txt += "<li><b>Installer Estimate</b>  The existing PV solar system if it's actual performance matched the installer's post-installation production and savings estimates.</li>";
			txt +="<li><b>Net Metering</b>  The existing PV solar system but without a battery and connected to a utility that offers net metering.</li>";
			txt += "<li><b>Green Bonds</b>  Investment in green bonds or green bond funds.  Green bonds are used to provide debt financing to renewable energy projects.</li>";
			txt += "<li><b>YieldCo's</b>  Equity investments in companies that primarily operate renewable energy portfolios.  Examples include Brookfield Renewable Partners, Nextera, and Terraform.</li>";
		txt += "</ul>";
		//txt += "<p>Of the options listed, the existing PV solar system is the least financially effective. At $.23 per kWh, it is ~6 times more expensive than a modern utility-scale solar plant to operate from a CO2 reduction standpoint.  It also will fail to generate a positive financial return for its owners.</p>";
		txt += "<br>";
	txt += "</div>";
	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Investment Options & Scenarios");
	txt += "</div>";
	document.getElementById(eleId).innerHTML = txt;

	var stateTimer = setInterval(function() {
		if (currentState.trendFileLoaded) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				xyROIChart(chartEleIdA);
			};
		};
	}, 100);
};

function dispBattery(eleId, titleId, title) {
	var thisWindow = "battery";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = ""

	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br><p>The first chart shows a time histogram of battery level for each day.  The lower limit charge threshold was raised from 15% to ~25% in early October to provide more outage backup capacity, which is why the pattern changes there.  \"Red time\" (<20% charge) since then is associated with snow cover on the panels or power outages.</p><br>";
	txt += "</div>";
	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Battery Charge Time Histogram");
	txt += "</div>";
	txt += "<div class='w3-container'>";
		txt += "<br><p>This chart shows three pieces of information: </p>";
		txt += "<ul>";
			txt += "<li><b>SOH - State of Health</b>  This is the actual charge capacity of the battery as a percent of nameplate capacity.  It starts at ~95% and will slowly decline over time.</li>";
			txt += "<li><b>Loss - %</b>  The charge energy lost during roundtrip charge/discharge cycles.</li>";
			txt += "<li><b>Loss - kWh</b>  The total cumulative energy lost during charge/discharge cycles.</li>";
		txt += "</ul>";
	txt += "</div>";

	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "Battery Health & Energy Loss");
	txt += "</div>";

	document.getElementById(eleId).innerHTML = txt;

	var stateTimer = setInterval(function() {
		if (currentState.trendFileLoaded) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				trendBattHistChart(chartEleIdA);
				trendBattEnergyChart(chartEleIdB);
			};
		};
	}, 100);

};

function dispDayPlots(eleId, titleId, title) {
	var thisWindow = "dayplots"
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";

	//Build the Date display and increment/decrement buttons
	var txtDate = buildDateDispHTML();
	txt += txtDate;
	
	//Build text and containers for charts
	txt += "<div class='w3-row'>";
		txt += "<div class='w3-col m6'>";
			var chartEleIdA1 = 'divChartA1';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA1, 'Power Production & Consumption');
			txt += "</div>";
			var chartEleIdA2 = 'divChartA2';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA2, 'Power Calculated from Energy');
			txt += "</div>";
			var chartEleIdA3 = 'divChartA3';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA3, 'Cumulative Energy');
			txt += "</div>";
		txt += "</div>";
		txt += "<div class='w3-col m6'>";
			var chartEleIdB1 = 'divChartB1';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdB1, 'Battery Charge');
			txt += "</div>";
			var chartEleIdB2 = 'divChartB2';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdB2, 'Battery Transfer Function');
			txt += "</div>";
		txt += "</div>";
	txt += "</div>";
	
	//Create space at bottom for date display and control
	txt += "<br><br><br><br>";

	document.getElementById(eleId).innerHTML = txt;

	var stateTimer = setInterval(function() {
		if (currentState.dayFileLoaded) {
			clearInterval(stateTimer)
			if (currentState.tabWindow == thisWindow) {
				//Update the date and generate the dayplots
				updateDay("same");
			};
		};
	}, 100);
};

function dispDayOverlays(eleId, titleId, title) {
	var thisWindow = "dayoverlays"
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";
	
	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt+= "<p>These charts show how system performance varies seasonally.  The last chart is a \"duck chart\" that illustrates how the system impacts peak demand on the electric utility during a high production month, both with and without a battery.</p>"
		txt += "<br>";
	txt += "</div>";

	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Average Power Production");
	txt += "</div>";
	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "Average Power Consumption");
	txt += "</div>";
	var chartEleIdC = 'divChartC';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdC, "Average Cumulative Energy Consumption");
	txt += "</div>";
	//var chartEleIdD = 'divChartD';
	//txt += "<div class='w3-container'>";
	//	txt += buildChartDivHTML(chartEleIdD, "Overlay Cust");
	//txt += "</div>";
	var chartEleIdE = 'divChartE';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdE, "Average Battery Charge");
	txt += "</div>";
	var chartEleIdF = 'divChartF';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdF, "Average Cumulative Energy Export");
	txt += "</div>";
	var chartEleIdG = 'divChartG';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdG, "Average Cumulative Energy Import");
	txt += "</div>";
	var chartEleIdH = 'divChartH';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdH, "Duck Chart - September, 2019");
	txt += "</div>";
	
	document.getElementById(eleId).innerHTML = txt;

	var stateTimer = setInterval(function() {
		if (currentState.overlayParamsBuilt) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				overlayChartProd(chartEleIdA);
				overlayChartConsump(chartEleIdB);
				overlayChartConsumpSum(chartEleIdC);
				//overlayChartCust(chartEleIdD);
				overlayChartBatt(chartEleIdE);
				overlayChartExport(chartEleIdF);
				overlayChartImport(chartEleIdG);
				overlayChartDuck(chartEleIdH);
			};
		};
	}, 100);
};

function dispConsumption(eleId, titleId, title) {
	var thisWindow = "consumption";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";

	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt+= "<p>The top two charts show how consumption varies day-to-day and over time.  The bottom two charts are day plots focused on sources of demand and the size (in terms of both power and energy) and timing of large spikes.</p>"
		txt += "<br>";
	txt += "</div>";

	txt += "<div class='w3-row'>";
		txt += "<div class='w3-col m6'>";
			var chartEleIdA = 'divChartA';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA, "Daily Energy Consumption Histogram");
			txt += "</div>";
		txt += "</div>";
		txt += "<div class='w3-col m6'>";		
			var chartEleIdB = 'divChartB';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdB, "Daily Energy Production and Consumption");
			txt += "</div>";
		txt += "</div>";			
	txt += "</div>";
	
	//Build the Date display and increment/decrement buttons
	var txtDate = buildDateDispHTML();
	txt += txtDate;

	//Build text and containers for the dayplots
	txt += "<div class='w3-row'>";
		txt += "<div class='w3-col m2'>";
			txt += "<p></p>";
		txt += "</div>"
		txt += "<div class='w3-col m8 w3-center'>";
			var chartEleIdA4 = 'divChartA4';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA4, 'Consumption Source');
			txt += "</div>";
			var chartEleIdA5 = 'divChartA5';
			txt += "<div class='w3-container'>";
				txt += buildChartDivHTML(chartEleIdA5, 'Cumulative Consumption Source');
			txt += "</div>";
		txt += "</div>";
		txt += "<div class='w3-col m2'>";
		txt += "</div>"
	txt += "</div>";

	//Create space at bottom for date display and control
	txt += "<br><br><br><br>";

	document.getElementById(eleId).innerHTML = txt;

	//Generate the charts after the trend file is loaded
	var stateTimer = setInterval(function() {
		if (currentState.dayFileLoaded) {
			clearInterval(stateTimer);
			if (currentState.tabWindow == thisWindow) {
				trendHistogramChart(chartEleIdA);
				trendEnergyChart(chartEleIdB);
				updateDay("same");
			};
		};
	}, 100);
};

function dispPanels(eleId, titleId, title) {
	var thisWindow = "panels";
	currentState.tabWindow = thisWindow;
	document.getElementById(titleId).innerHTML = title;
	var txt = "";

	//Build text and containers for charts
	txt += "<div class='w3-container'>";
		txt += "<br>";
		txt += "<p>The charts below show the output of each of the three sections of panels in the system.  Only one day of operation is shown, as individual panel data is not available from the SolarEdge API.  This data has to be captured manually.</p>"
		txt += "<div class='w3-center'>";
			txt += "<img src='SoPO2/panel_layout.jpg' width='600px'>";
		txt += "</div>";
		txt += "<br>";
	txt += "</div>";

	var chartEleIdA = 'divChartA';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdA, "Panels - Total Power - March 7, 2020");
		txt += "</div>";
	txt += "</div>";
	var chartEleIdB = 'divChartB';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdB, "Panels - Average Power per Panel - March 7, 2020");
		txt += "</div>";
	txt += "</div>";
	var chartEleIdC = 'divChartC';
	txt += "<div class='w3-container'>";
		txt += buildChartDivHTML(chartEleIdC, "Power per Panel - March 7, 2020");
		txt += "</div>";
	txt += "</div>";
	
	document.getElementById(eleId).innerHTML = txt;

	//Generate the charts 
	panelsSumChart(chartEleIdA);
	panelsAveChart(chartEleIdB);
	panelsChart(chartEleIdC);
};

function buildChartDivHTML(eleId, title) {
	var txt = "";
	txt += "<div class='w3-container w3-card'>";
		txt += "<h4 class='w3-center'>" + title + "</h4>";
		txt += "<div id=" + eleId + "></div>"
	txt += "</div>";
	return txt;
};

function buildDateDispHTML() {
	//Build the Date display and increment/decrement buttons
	var txtDate = "";
	txtDate += "<div class='w3-container w3-card w3-bottom w3-white w3-border'>";
		txtDate += "<div class='w3-row w3-center'>";
				txtDate += "<button id='prevButton' class='w3-btn w3-small w3-round w3-blue w3-disabled' style='margin-top:7px'  onclick=\"updateDay('previous')\"> &#10094; Previous Day</button>";
				txtDate += "<button class='w3-btn'> <h4 id='dayDateStart'></h4> </button>";
				txtDate += "<button id='nextButton' class='w3-btn w3-small w3-round w3-blue w3-disabled'  style='margin-top:7px'  onclick=\"updateDay('next')\">Next Day &#10095;</button>";
			txtDate += "</div>";
		txtDate += "</div>";
	txtDate += "</div>";
	
	return txtDate;
};



