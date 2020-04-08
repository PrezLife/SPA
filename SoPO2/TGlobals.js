
//Define the New Battery Capacity.  This could be extracted from the SolarEdge API data.
var batteryCapacityNew = 9800; //kWh

//Declare the state machine status object
var currentState = {
	trendFileLoaded: false,
	dayFileLoaded: false,
	overlayParamsBuilt: false,
	tabWindow: "",
};


//Define the month information for use in the standard day overlay charts
var monthObj = {
	'7' : {name: 'Aug', color: 'Red', 	plot: true},
	'8' : {name: 'Sep', color: 'Orange',plot: true},
	'9' : {name: 'Oct', color: 'Tan',plot: true},
	'10': {name: 'Nov', color: 'Green', plot: true},
	'11': {name: 'Dec', color: 'Blue', plot: true},
	'0':  {name: 'Jan', color: 'Black', plot: true},
	'1':  {name: 'Feb', color: 'Cyan', plot: true},
	'2':  {name: 'Mar', color: 'Navy', plot: false},
	'3':  {name: 'Apr', color: 'Lime', plot: false},
	'4':  {name: 'May', color: 'Olive', plot: false},
	'5':  {name: 'Jun', color: 'OrangeRed', plot: false},
	'6':  {name: 'Jul', color: 'DarkRed', plot: false},
};
//Define the months to plot and their sequence for the standard day overlay charts
var monthArr = ['7','8','9','10','11','0','1','2','3'];


//Define the window structure
var uiWindowObj2 = {
	header1: {title: "Solar Performance Analysis",  class: "w3-teal"},
	main1: {
		tabBar2: {
			tB201: {title: "Energy Flow", function: "selectTabBarItem(\"tB201\", \"main2\", \"dispEnergy\", \"header2Title\", \"Energy Flow\")"},
			tB202: {title: "Estimates", function: "selectTabBarItem(\"tB202\", \"main2\", \"dispEstimates\", \"header2Title\", \"Estimated and Actual Production & Savings\")"},
			tB203: {title: "Architectures", function: "selectTabBarItem(\"tB203\", \"main2\", \"dispArchAndRates\", \"header2Title\", \"Architecture & Rate Structure\")"},
			tB204: {title: "Economics", function: "selectTabBarItem(\"tB204\", \"main2\", \"dispEconomics\", \"header2Title\", \"Economics\")"},
			tB205: {title: "Battery", function: "selectTabBarItem(\"tB205\", \"main2\", \"dispBattery\", \"header2Title\", \"Battery Usage & Efficiency\")"},
			tB207: {title: "Day Plots", function: "selectTabBarItem(\"tB207\", \"main2\", \"dispDayPlots\", \"header2Title\", \"Standard Day Plots\")"},
			tB208: {title: "Day Overlays", function: "selectTabBarItem(\"tB208\", \"main2\", \"dispDayOverlays\", \"header2Title\", \"Day Overlays\")"},
			tB209: {title: "Consumption", function: "selectTabBarItem(\"tB209\", \"main2\", \"dispConsumption\", \"header2Title\", \"Consumption Analysis\")"},
			tB210: {title: "Panels", function: "selectTabBarItem(\"tB210\", \"main2\", \"dispPanels\", \"header2Title\", \"Panel Production\")"},
		},
		header2: {title:"Default Inner Header", class: ""},
		main2: {
			main3: {},
		},
	},
	footer1: {title: "This is the Footer",},
};
