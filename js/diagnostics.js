/* 
 * (class)Progress<nowValue, minValue, maxValue>
 */


$('.diagnostics-legend').click(function(event) {
	$('.diagnostics-legend-arrows').toggleClass('diagnostics-legend-arrows-up');
	$('.diagnostics-legend-arrowsDown').toggleClass('diagnostics-legend-arrowsDown-visible');
	$('.diagnostics-block').toggleClass('displaynone2');
	$('.diagnostics-filter').toggleClass('displaynone');
});


//helper function-> return <DOMelement>
function elt(type, prop, ...childrens) {
	let elem = document.createElement(type);
	if (prop) Object.assign(elem, prop);
	for (let child of childrens) {
	  if (typeof child == "string") elem.appendChild(document.createTextNode(child));
	  else elem.appendChild(elem);
	}
	return elem;
	}
  
  //Progress class
  class Progress {
	constructor(now, min, max, options) {
	  this.dom = elt("div", {
		className: "progress-bar"
	  });
	  this.min = min;
	  this.max = max;
	  this.intervalCode = 0;
	  this.now = now;
	  this.syncState();
	  if(options.parent){
		document.querySelector(options.parent).appendChild(this.dom);
	  } 
	  else document.body.appendChild(this.dom)
	}
  
	syncState() {
	  this.dom.style.width = this.now + "%";
	}
  
	startTo(step, time) {
	  if (this.intervalCode !== 0) return;
	  this.intervalCode = setInterval(() => {
		console.log("sss")
		if (this.now + step > this.max) {
		  this.now = this.max;
		  this.syncState();
		  clearInterval(this.interval);
		  this.intervalCode = 0;
		  return;
		}
		this.now += step;
		this.syncState()
	  }, time)
	}
	end() {
	  this.now = this.max;
	  clearInterval(this.intervalCode);
	  this.intervalCode = 0;
	  this.syncState();
	}
}
  
  
  let pb = new Progress(15, 0, 100, {parent : ".progress"});
  
  //arg1 -> step length
  //arg2 -> time(ms)
  pb.startTo(5, 500);
  
  //end to progress after 5s
  setTimeout( () => {
	pb.end()
  }, 5000)

if(document.getElementById('chart-UEM') != null){
	var chartUEM = new Highcharts.Chart('chart-UEM',{
	
	title: { text: 'Напряжения электромагнита' },
	series: [
		{
			name:'Напряжение входное',
			color:'MediumPurple',
			visible:true,
			showInLegend: true,
			data: []
		},
		{
			name:'Напряжение питания ключей',
			color:'Fuchsia',
			visible:true,
			showInLegend: true,
			data: []
		},
		{
			name:'Напряжение EM1',
			color:'OrangeRed',
			visible:true,
			showInLegend: true,
			data: []
		},
		{
			name:'Напряжение EM2',
			color:'Coral',
			visible:true,
			showInLegend: true,
			data: []
		}
	],
	tooltip: {
		valueDecimals: 1
	},
	plotOptions: {
		line: { animation: false,
			dataLabels: { 
				enabled: false,
				format: '{point.y:,.1f}'						
			}
		},
		series: { color: '#059e8a' }
	},
	xAxis: { type: 'datetime',
		dateTimeLabelFormats: { second: '%H:%M:%S' }
	},
	yAxis: {
		title: { text: 'Напряжение  (В)' }
		//title: { text: 'Temperature (Fahrenheit)' }
	},
	credits: { enabled: false }
	});
}

if(document.getElementById('chart-iem') != null){
	var chartIEM = new Highcharts.Chart('chart-iem',{
	title: { text: 'Ток  электромагнита' },
	legend: {
		layout: 'horizontal',
		align: 'center',
		verticalAlign: 'bottom'
	},
	series: [
		{
			name:'Ток <br> электромагнита <br>',
			color:'blue',
			visible:true,
			showInLegend: true,
			data: []
		}
	],
	tooltip: {
		valueDecimals: 1
	},
	plotOptions: {
		line: { animation: true,
			dataLabels: { 
				enabled: false,
				format: '{point.y:,.1f}'					
			}
		},
		series: { color: '#059e8a', pointStart: 1 }
		
	},
	xAxis: { type: 'datetime',
		dateTimeLabelFormats: { second: '%H:%M:%S' }
	},
	yAxis: {
		title: { text: 'Ток (А)' }
	},
	credits: { enabled: false }
	})
}