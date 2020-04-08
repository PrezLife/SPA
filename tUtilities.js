
function translateDate(dateString) {
	var year = dateString.substring(0, 4);
	var month = Number(dateString.substring(5, 7)) - 1;
	var day = dateString.substring(8, 10);
	var hour = 0, minute = 0, second = 0;
	if (dateString.length > 10) {
		hour = dateString.substring(11, 13);
		minute = dateString.substring(14,16);
		second = dateString.substring(17,19);
	};

	var thisDate = new Date(year, month, day, hour, minute, second);
	//console.log(thisDate);
	return thisDate;
};

function loadDayParams(dayStart) {
	var year = dayStart.getFullYear().toString();
	var month = dayStart.getMonth() + 1;
	month = month.toString();
	var date = dayStart.getDate().toString();
	if (month.length == 1) {
		month = "0" + month;
	};
	if (date.length == 1) {
		date = "0" + date;
	}
	var dateString = year + "-" + month + "-" + date;
	var dayParamsObj = dayFileObj[dateString];
	
	//Build the extended dayplot parameters and then add them to dayParamsObj
	var dayParamsExtObj = buildDayParamsExt(dayParamsObj);
	for (param in dayParamsExtObj) {
		dayParamsObj[param] = dayParamsExtObj[param];
	};

	return dayParamsObj;
};

//Build the extended day parameters
function buildDayParamsExt(dayParamsObj) {
	var dayParamsExtObj = {};
	
	//Build the cumulative energy parameters.  Add "Sum" to the end of the base parameter name.
	var paramList = ['energyProductionArr', 'energySolarProdArr', 'energyConsumptionArr', 'energyFeedInArr', 'energyPurchasedArr', 'batteryEnergyDeltaArr'];
	for (var i = 0; i < paramList.length; i++) {
		dayParamsExtObj[paramList[i]+"Sum"] = [];
		dayParamsExtObj[paramList[i]+"Sum"][0] = dayParamsObj[paramList[i]][0];
		for (var j = 1; j < dayParamsObj.stdTimeArr.length; j++) {
			dayParamsExtObj[paramList[i]+"Sum"][j] = dayParamsExtObj[paramList[i]+"Sum"][j-1] + dayParamsObj[paramList[i]][j];
		};
	};
	
	//============
	//Build the energy consumption source vectors
	//============
	
	//Find the the background consumption rate by averaging the lowest X consumption samples
	var consumpCloneArr = dayParamsObj.energyConsumptionArr.slice(0);
	consumpCloneArr.sort(function(a, b) {return a-b});
	var span = 16;	//Number of samples to use
	var consumpBackground = 0;
	var index = 0; var done = false; var count = 0;
	while (!done){
		if (consumpCloneArr[index] > 0) {
			consumpBackground += consumpCloneArr[index];
			count += 1;
		};
		index += 1;
		if (count >= span) {
			done = true;
		};
	};
	consumpBackground = consumpBackground / count;
	
	//Build the background consumption array.  Also build the remainder array, which equals the amount of consumption left after subtracting out the background consumption.  This array will be updated in each of the additional consumption category calculations, as well.
	var remainder = dayParamsObj.energyConsumptionArr.slice(0);
	dayParamsExtObj.energyConsumpBGArr = [];
	dayParamsExtObj.energyConsumpBGArrSum = [0];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		dayParamsExtObj.energyConsumpBGArr[i] = consumpBackground;
		if (i>0) {
			dayParamsExtObj.energyConsumpBGArrSum[i] = dayParamsExtObj.energyConsumpBGArrSum[i-1] + dayParamsExtObj.energyConsumpBGArr[i];
		};
		remainder[i] = remainder[i] - dayParamsExtObj. energyConsumpBGArr[i];
	};
	
	//Build the dishwasher consumption array
	var hoursDish = [0, 1, 22, 23];
	var IR = [];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		var thisHour = dayParamsObj.stdTimeArr[i].getHours();
		if (hoursDish.indexOf(thisHour) != -1) {
			IR.push(i);
		};
	};
	var consumpDishArr = [];
	var consumpDishArrSum = [0];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		consumpDishArr[i] = 0;
		if (IR.indexOf(i) != -1) {
			consumpDishArr[i] = remainder[i];
		};
		if (i>0) {
			consumpDishArrSum[i] = consumpDishArrSum[i-1] + consumpDishArr[i];
		};
		remainder[i] = remainder[i] - consumpDishArr[i];
	};
	dayParamsExtObj.energyConsumpDishArr = consumpDishArr;
	dayParamsExtObj.energyConsumpDishArrSum = consumpDishArrSum;
	
	//Build the basic consumption vector with spikes chopped off
	var spikeLim = 75; //Wh = W/4
	var consumpBasicArr = [];
	var consumpBasicArrSum = [0];
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		consumpBasicArr[i] = remainder[i];
		if (i>0 && (consumpBasicArr[i] > (consumpBasicArr[i-1] + spikeLim))) {
			consumpBasicArr[i] = consumpBasicArr[i-1];
		} else if (i>1 && (consumpBasicArr[i] > (consumpBasicArr[i-2] + spikeLim))) {
			consumpBasicArr[i-1] = consumpBasicArr[i-2];
			consumpBasicArr[i] = consumpBasicArr[i-1];
		};
	};
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		remainder[i] = remainder[i] - consumpBasicArr[i];
		if (i>0) { //Calculate the sum array
			consumpBasicArrSum[i] = consumpBasicArrSum[i-1] + consumpBasicArr[i];
		};
	};
	dayParamsExtObj.energyConsumpBasicArr = consumpBasicArr;
	dayParamsExtObj.energyConsumpBasicArrSum = consumpBasicArrSum;

	//Identify and capture metrics for each consumption "spike" that remains
	var spikeObj = {
		indexStart : [], 
		indexEnd : [],
		energy : [],
		powerPeak : [],
	};
	//Capture the spike starting and ending indices
	var inSpike = false;
	var spikeLim = 170;  //Watts
	for (var i = 0; i < dayParamsObj.stdTimeArr.length; i++) {
		if (!inSpike) {
			if (remainder[i] > spikeLim) {
				inSpike = true;
				spikeObj.indexStart.push(i);
				//spikeObj.timeStart.push(dayParamsObj.stdTimeArr[i])
			};
		} else {
			if (remainder[i] < 1) {
				spikeObj.indexEnd.push(i);
				inSpike = false;
			};
		};
	};
	//Calculate the energy in each spike
	for (var i = 0; i < spikeObj.indexEnd.length; i++) {
		var energy = 0;
		for (var j = spikeObj.indexStart[i]; j < spikeObj.indexEnd[i]; j++) {
			energy += remainder[j]; 
		};
		spikeObj.energy[i] = energy;
	};
	
	//if (dayParamsObj.stdTimeArr[0].getMonth()=='1' && dayParamsObj.stdTimeArr[0].getDate()=='17') {
	//	console.log(dayParamsObj.stdTimeArr[0], spikeObj);
	//};
	dayParamsExtObj.remainder = remainder;
	
	dayParamsExtObj.spikeObj = spikeObj;
	
			
	
	return dayParamsExtObj;
};


//Build the overlay vector parameters
//overlayParamsObj -> parameter name -> month -> values
//Overlay average parameter name = dayParamsObj name + "Ave"
function buildOverlayParams() {
	//Build the standard time vector and store it in the overlay parameters object along with the start and end day for charting
	overlayParamsObj.stdTimeArr = [];
	var dayParamsTempObj = loadDayParams(dayStart);
	for (var i = 0; i < dayParamsTempObj.stdTimeArr.length; i++) {
		overlayParamsObj.stdTimeArr[i] = dayParamsTempObj.stdTimeArr[i];
	};
	overlayParamsObj.dayStart = new Date();
	overlayParamsObj.dayEnd = new Date();
	overlayParamsObj.dayStart.setTime(overlayParamsObj.stdTimeArr[0]. getTime());
	overlayParamsObj.dayEnd.setTime(overlayParamsObj.dayStart. getTime());
	overlayParamsObj.dayEnd.setDate(overlayParamsObj.dayEnd. getDate() + 1);
	
	//Determine the months for which trend data (and therefore day parameter data) exists and capture the trendParamsObj index range for each month.  Key = month, value = IR vector
	var monthDaysIRObj = {};
	for (var i = 0; i < trendParamsObj.dateArr.length-1; i++) {
		var month = trendParamsObj.dateArr[i].getMonth();
		if (!monthDaysIRObj.hasOwnProperty(month)) {
			monthDaysIRObj[month] = [];
		};
		monthDaysIRObj[month].push(i);
	};
	
	//Define the day parameters for which to calculate overlay parameters
	var dayParams = ['powerProductionArr', 'powerSolarProdArr', 'batteryPowerArr', 'powerConsumptionArr', 'powerPurchasedArr', 'powerFeedInArr', 'energyProductionArrSum', 'energyConsumptionArrSum', 'energyFeedInArrSum', 'energyPurchasedArrSum', 'batteryPctArr'];

	//Build the overlay parameters
	//Parameter name -> month -> day --> 24 hour vectors
	for (var i = 0; i < dayParams.length; i++) {
		overlayParamsObj[dayParams[i]+"Ave"] = {};
		overlayParamsObj[dayParams[i]+"Max"] = {};
		for (month in monthDaysIRObj) {
			overlayParamsObj[dayParams[i]+"Ave"][month] = [];
			overlayParamsObj[dayParams[i]+"Max"][month] = [];
			for (var k = 0; k < overlayParamsObj.stdTimeArr.length; k++) {
				overlayParamsObj[dayParams[i]+"Ave"][month][k] = 0;
				overlayParamsObj[dayParams[i]+"Max"][month][k] = 0;
			};
			var numDays = monthDaysIRObj[month].length;
			for (var j = 0; j < numDays; j++) {
				var thisIndex = monthDaysIRObj[month][j];
				var thisDay = trendParamsObj.dateArr[thisIndex];
				var thisDayParamsObj = loadDayParams(thisDay);
				for (var k = 0; k < thisDayParamsObj.stdTimeArr. length; k++) {
					if (thisDayParamsObj[dayParams[i]][k] > overlayParamsObj[dayParams[i]+"Max"][month][k]) {
						overlayParamsObj[dayParams[i]+"Max"][month][k] = thisDayParamsObj[dayParams[i]][k];
					};
					overlayParamsObj[dayParams[i]+"Ave"][month][k] += thisDayParamsObj[dayParams[i]][k]/ numDays;
				};
			};
		};
	};
};

//Build the extended trend parameters object
function buildTrendParamsExt() {
	//Build the installer estimate vectors
	[estProdArr, estProdSumArr, estSavingsArr, estSavingsSumArr, bidProdArr, bidProdSumArr] = buildEstimateVectors();
	//Build the monthly average vectors
	[energyProductionAveArr, energySolarProdAveArr, energyConsumpAveArr] = buildMonthlyAveVectors();
	//Build the weather vectors
	cloudCoverArr = buildWeatherVectors();
	
	//Add these vectors to the extended trend parameter object
	trendParamsExtObj.estProdArr = estProdArr;
	trendParamsExtObj.estProdSumArr = estProdSumArr;
	trendParamsExtObj.estSavingsArr = estSavingsArr;
	trendParamsExtObj.estSavingsSumArr = estSavingsSumArr;
	trendParamsExtObj.bidProdArr = bidProdArr;
	trendParamsExtObj.bidProdSumArr = bidProdSumArr;
	trendParamsExtObj.energyProductionAveArr = energyProductionAveArr;
	trendParamsExtObj.energySolarProdAveArr = energySolarProdAveArr;
	trendParamsExtObj.energyConsumpAveArr = energyConsumpAveArr;
	trendParamsExtObj.cloudCoverArr = cloudCoverArr;
};

//Build the estimated production and savings vectors
function buildEstimateVectors() {
	//Define the estimated production object.  key = Actual Month-1.  Production = kWh.  Savings = $.
	var estProdObj = {
		7: {days: 31, estProd: 960, estSavings: 130}, //August
		8: {days: 30, estProd: 787, estSavings: 106},
		9: {days: 31, estProd: 619, estSavings: 84},
		10: {days: 30, estProd: 408, estSavings: 55},
		11: {days: 31, estProd: 346, estSavings: 46},
		0: {days: 31, estProd: 417, estSavings: 57},
		1: {days: 28, estProd: 485, estSavings: 65},
		2: {days: 31, estProd: 716, estSavings: 97},
		3: {days: 30, estProd: 819, estSavings: 110},
		4: {days: 31, estProd: 939, estSavings: 127},
		5: {days: 30, estProd: 992, estSavings: 133},
		6: {days: 31, estProd: 1031, estSavings: 139},
	};
	//Define the installer's annual production estimate from the bid
	var bidProdAnnual = 9300; 

	// Calculate the estimated production for a year
	var estProdAnnual = 0
	for (month in estProdObj) {
		estProdAnnual += estProdObj[month].estProd;
	};
	
	//Calculate the monthly bid production (bidProd) values and insert these into the estimated production object
	var bidEstRatio = bidProdAnnual / estProdAnnual;
	for (month in estProdObj) {
		var bidProdMonth = bidEstRatio * estProdObj[month].estProd;
		estProdObj[month].bidProd = bidProdMonth;
	};
	
	//Calculate the estimated daily production and savings and the bid estimated daily production and insert these values into the estimated production object
	for (month in estProdObj) {
		var estProdDaily = estProdObj[month].estProd / estProdObj[month].days;
		var bidProdDaily = estProdObj[month].bidProd / estProdObj[month].days;
		var estSavingsDaily = estProdObj[month].estSavings / estProdObj[month].days;
		estProdObj[month].estProdDaily = estProdDaily;
		estProdObj[month].bidProdDaily = bidProdDaily;
		estProdObj[month].estSavingsDaily = estSavingsDaily;
	};
	
	//Build the bid and estimated production and savings time vectors
	var estProdArr = [];
	var estProdSumArr = [];
	var estProdSum = 0; 
	var estSavingsArr = [];
	var estSavingsSumArr = [];
	var estSavingsSum = 0;
	var bidProdArr = [];
	var bidProdSumArr = [];
	var bidProdSum = 0; 
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var month = trendParamsObj.dateArr[i].getMonth();
		var estProdDaily = estProdObj[month].estProdDaily;
		estProdArr[i] = estProdDaily;
		estProdSum += estProdDaily;
		estProdSumArr[i] = estProdSum;
		var estSavingsDaily = estProdObj[month].estSavingsDaily;
		estSavingsArr[i] = estSavingsDaily;
		estSavingsSum += estSavingsDaily;
		estSavingsSumArr[i] = estSavingsSum;
		var bidProdDaily = estProdObj[month].bidProdDaily;
		bidProdArr[i] = bidProdDaily;
		bidProdSum += bidProdDaily;
		bidProdSumArr[i] = bidProdSum;

	};
	return [estProdArr, estProdSumArr, estSavingsArr, estSavingsSumArr, bidProdArr, bidProdSumArr];
};

function buildMonthlyAveVectors() {
	//Calculate the monthly average production
	//**** This needs to be fixed to support multiple years
	var monthlyCountArr = Array(12).fill(0);
	var monthlyProdSumArr = Array(12).fill(0);
	var monthlyProdAveArr = Array(12).fill(0);
	var monthlySolarProdSumArr = Array(12).fill(0);
	var monthlySolarProdAveArr = Array(12).fill(0);
	var monthlyConsumpSumArr = Array(12).fill(0);
	var monthlyConsumpAveArr = Array(12).fill(0);
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var month = trendParamsObj.dateArr[i].getMonth();
		monthlyCountArr[month] += 1;
		monthlyProdSumArr[month] += trendParamsObj.energyProductionArr[i];
		monthlySolarProdSumArr[month] += trendParamsObj.energySolarProdArr[i];
		monthlyConsumpSumArr[month] += trendParamsObj.energyConsumptionArr[i];
	};
	for (var i = 0; i < monthlyProdSumArr.length; i++) {
		if (monthlyCountArr[i] != 0) {
			monthlyProdAveArr[i] = monthlyProdSumArr[i] / monthlyCountArr[i];
			monthlySolarProdAveArr[i] = monthlySolarProdSumArr[i] / monthlyCountArr[i];
			monthlyConsumpAveArr[i] = monthlyConsumpSumArr[i] / monthlyCountArr[i];
		};
	};
	
	//Build the monthly average time vector
	var energyProductionAveArr = [];
	var energySolarProdAveArr = [];
	var energyConsumpAveArr = [];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var month = trendParamsObj.dateArr[i].getMonth();
		energyProductionAveArr[i] = monthlyProdAveArr[month];
		energySolarProdAveArr[i] = monthlySolarProdAveArr[month];
		energyConsumpAveArr[i] = monthlyConsumpAveArr[month];
	};
	
	return [energyProductionAveArr, energySolarProdAveArr, energyConsumpAveArr];
};

function buildWeatherVectors() {
	//Key = month - 1.  Indianapolis data.
	//*** Need to generalize to support multiple years
	var cloudCoverObj = {
		7: [2, 3, 4, 2, 3, 6, 3, 4, 3, 3, 6, 9, 7, 4, 5, 7, 8, 7, 4, 7, 7, 9, 6, 3, 5, 9, 7, 1, 3, 8, 9],
		8: [8, 6, 3, 3, 2, 5, 6, 8, 4, 5, 5, 2, 3, 3, null, 4, 5, 3, 3, 4, 7, 6, 5, 4, 8, 4, 4, 7, 7, 4],
		9: [2, 5, 4, 3, 4, 10, 5, 0, 2, 9, 9, 0, 1, 1, 5, 8, 3, 3, 4, 5, 7, 3, 2, 8, 10, 10, 4, 5, 10, 10, 9],
	};
	
	cloudCoverArr = [];
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var month = trendParamsObj.dateArr[i].getMonth();
		var day = trendParamsObj.dateArr[i].getDate();
		var cloudCover = null;
		if (cloudCoverObj.hasOwnProperty(month)) {
			cloudCover = cloudCoverObj[month][day - 1];
		};
		cloudCoverArr[i] = cloudCover;
	};
	return cloudCoverArr;
};

var panelsParamsObj = {};
function buildPanelVectors() {
	var thisDate = '2020-03-07';
	var timeArr = ['07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
	var dateTimeArr = [];
	for (var i = 0; i < timeArr.length; i++) {
		var thisTime = new Date(thisDate + 'T' + timeArr[i]);
		thisTime.setHours(thisTime.getHours() + 5);
		dateTimeArr[i] = thisTime;
	};
	panelsParamsObj.dateTimeArr = dateTimeArr;
	
	var panelsSouthObj = {
		'1.1.8': [0, 9.96, 21.27, 34.56, 111.3, 231.76, 256.55, 327.87, 298.93, 243.04, 13.39, 6.84, 0],
		'1.1.6': [0, 7.31, 12.93, 29.63, 100.62, 227.07, 259.64, 326.6, 296.93, 225.65, 9.17, 4.58, 0],
		'1.1.5': [0, 6.05, 11.32, 30.46, 102.73, 231.39, 237.96, 327.19, 295.6, 200.52, 9.41, 3.36, 0],
	};
	var panelsWestObj = {
		'1.1.11': [0, 10.17, 14.04, 17.13, 56.61, 121.89, 175.85, 211.11, 222.93, 196.63, 17.55, 6.33, 0],
		'1.1.7': [0, 5.87, 10.67, 15.27, 49.15, 118, 121.37, 207.28, 221.72, 121.87, 15.12, 6.35, 0],
		'1.1.10': [0, 13.12, 16.27, 17.68, 53.42, 114.47, 88.21, 201.86, 213.33, 90.86, 13.14, 6.21, 0],
		'1.1.1': [0, 7.46, 11.85, 15.19, 50.57, 113.17, 169.11, 205.91, 219.22, 211.58, 13.18, 4.98, 0],
		'1.1.2': [0, 8.46, 13.95, 16.47, 52.59, 119.01, 170.73, 210.83, 221.89, 117.87, 21.05, 7.7, 0],
		'1.1.3': [0, 6.03, 10.7, 13.76, 48.81, 114.3, 144.89, 202.85, 216.29, 144.46, 17.29, 3.93, 0],
		'1.1.9': [0, 6.92, 11.14, 14.65, 52.35, 120, 113.52, 205.63, 220.24, 137.46, 23.36, 7.87, 0],
		'1.1.4': [0, 11.94, 16.54, 18.32, 53.57, 118.01, 87.62, 203.38, 216.97, 123.71, 25.23, 8.98, 0],
	};

	var panelsEastObj = {
		'1.2.10': [0, 52.36, 242.74, 158.82, 296.62, 280.74, 245.67, 180.4, 111.1, 29.08, 13.32, 6.59, 0],
		'1.2.7': [0, 36.61, 247.46, 160.81, 292.43, 278.2, 235.63, 172.17, 107.93, 25.91, 9.93, 4.01, 0],
		'1.2.4': [0, 24.66, 241.54, 204.33, 294.43, 277.26, 210.26, 162.22, 102.36, 23.2, 9.11, 4.1, 0], 
		'1.2.1': [0, 34.82, 190.1, 215.92, 297.53, 280.71, 160.79, 129.03, 109.87, 29.67, 12.72, 6.39, 0],
		'1.2.9': [0, 41.68, 215.65, 126.61, 294.83, 278, 244.8, 152.65, 109.57, 29.29, 11.56, 4.72, 0],
		'1.2.11': [0, 39.61, 247.05, 152.46, 296.56, 281.6, 237.74, 128.14, 112.31, 29.03, 13.34, 7.12, 0],
		'1.2.8': [0, 14.56, 249.08, 154.26, 294.12, 278.46, 233.12, 92.62, 102.47, 25.71, 9.77, 4.27, 0],
		'1.2.3': [0, 34.43, 197.01, 131.56, 296.93, 281.65, 211.08, 85.88, 107.95, 23.5, 10.54, 4.76, 0],
		'1.2.6': [0, 34.55, 209.44, 89.19, 295.78, 280.16, 244.34, 116.74, 109.68, 26.87, 10.28, 4.03, 0],
		'1.2.2': [0, 19.96, 249.42, 90.3, 300, 283.62, 245.72, 104.22, 112.41, 27.35, 11.95, 5.58, 0],
		'1.2.5': [0, 28.39, 242.16, 113.25, 299, 281.96, 245.03, 105.62, 109.83, 26.17, 10.72, 4.74, 0],
	};
	
	//Calculate the panel bank averages
	var panelsSouthSumArr = Array(timeArr.length).fill(0);
	var panelsWestSumArr = Array(timeArr.length).fill(0);
	var panelsEastSumArr = Array(timeArr.length).fill(0);
	var panelsAllSumArr = [];
	var panelsSouthAveArr = [];
	var panelsWestAveArr = [];
	var panelsEastAveArr = [];
	var numPanelsSouth = Object.keys(panelsSouthObj).length;
	var numPanelsWest = Object.keys(panelsWestObj).length;
	var numPanelsEast = Object.keys(panelsEastObj).length;
	for (var i = 0; i < timeArr.length; i++) {
		for (panel in panelsSouthObj) {
			panelsSouthSumArr[i] += panelsSouthObj[panel][i];
		};
		for (panel in panelsWestObj) {
			panelsWestSumArr[i] += panelsWestObj[panel][i];
		};
		for (panel in panelsEastObj) {
			panelsEastSumArr[i] += panelsEastObj[panel][i];
		};
		panelsAllSumArr[i] = panelsSouthSumArr[i] + panelsWestSumArr[i] + panelsEastSumArr[i];
	};
	for (var i = 0; i < panelsSouthSumArr.length; i++) {
		panelsSouthAveArr[i] = panelsSouthSumArr[i] / numPanelsSouth;
	};
	for (var i = 0; i < panelsWestSumArr.length; i++) {
		panelsWestAveArr[i] = panelsWestSumArr[i] / numPanelsWest;
	};
	for (var i = 0; i < panelsEastSumArr.length; i++) {
		panelsEastAveArr[i] = panelsEastSumArr[i] / numPanelsEast;
	};
	
	panelsParamsObj.panelsSouthObj = panelsSouthObj;
	panelsParamsObj.panelsWestObj = panelsWestObj;
	panelsParamsObj.panelsEastObj = panelsEastObj;
	panelsParamsObj.panelsSouthSumArr = panelsSouthSumArr;
	panelsParamsObj.panelsWestSumArr = panelsWestSumArr;
	panelsParamsObj.panelsEastSumArr = panelsEastSumArr;
	panelsParamsObj.panelsAllSumArr = panelsAllSumArr;
	panelsParamsObj.panelsSouthAveArr = panelsSouthAveArr;
	panelsParamsObj.panelsWestAveArr = panelsWestAveArr;
	panelsParamsObj.panelsEastAveArr = panelsEastAveArr;
};

//Build the analysis metrics
function buildTrendMetrics() {
	//Calculate the min and max monthly actual production percent of the bid estimate
	var productionActPctMin = 1000;
	var productionActPctMax = 0;
	var solarProdActPctMin = 1000;
	var solarProdActPctMax = 0;
	for (var i = 0; i < trendParamsObj.dateArr.length; i++) {
		var productionActPct = 100 * trendParamsExtObj.energyProductionAveArr[i] / trendParamsExtObj.bidProdArr[i];
		productionActPctMax = Math.max(productionActPct, productionActPctMax);
		productionActPctMin = Math.min(productionActPct, productionActPctMin);
		var solarProdActPct = 100 * trendParamsExtObj.energySolarProdAveArr[i] / trendParamsExtObj.bidProdArr[i];
		solarProdActPctMax = Math.max(solarProdActPct, solarProdActPctMax);
		solarProdActPctMin = Math.min(solarProdActPct, solarProdActPctMin);
	};
	
	var indexEnd = trendParamsObj.dateArr.length-1;
	var solarProdSumActPct = 100 * trendParamsObj.energySolarProdSumArr[indexEnd] / trendParamsExtObj.bidProdSumArr[indexEnd]; 
	
	trendMetricsObj.productionActPctMin = productionActPctMin;
	trendMetricsObj.productionActPctMax = productionActPctMax;
	trendMetricsObj.solarProdActPctMin = solarProdActPctMin;
	trendMetricsObj.solarProdActPctMax = solarProdActPctMax;
	trendMetricsObj.solarProdSumActPct = solarProdSumActPct;
};

