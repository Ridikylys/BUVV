"use strict"

//Графики на главной странице
document.getElementsByClassName


			var n = 5;
			var chartC = new Highcharts.Chart({
			chart:{ renderTo : 'chart-current' },
			title: { text: 'Токи фаз' },
			series: [
				{
					name:'Ток A',
					color:'red',
					visible:true,
					showInLegend: true,
					data: [0, 5, 3, 5]
				},
				{
					name:'Ток B',
					color:'yellow',
					visible:true,
					showInLegend: true,
					data: [5,7,4,8]
				},
				{
					name:'Ток C',
					color:'green',
					visible:true,
					showInLegend: true,
					data: [2,6,1,6]
				},
			],
			plotOptions: {
				line: { animation: false,
				dataLabels: { enabled: true }
				},
				series: { color: '#059e8a' }
			},
			xAxis: { type: 'datetime',
				dateTimeLabelFormats: { second: '%H:%M:%S' }
			},
			yAxis: {
				title: { text: 'Ток  (А)' }
				//title: { text: 'Temperature (Fahrenheit)' }
			},
			credits: { enabled: false }
			});
			var chartU = new Highcharts.Chart({
			chart:{ renderTo : 'chart-voltage' },
			title: { text: 'Напряжения питания' },
			series: [
				{
					name:'Напряжение входное',
					color:'blue',
					visible:true,
					showInLegend: true,
					data: [220, 225, 218, 210]
				},
				{
					name:'Напряжение ключей',
					color:'red',
					visible:true,
					showInLegend: true,
					data: [230,235,228,220]
				}
			],
			plotOptions: {
				line: { animation: false,
				dataLabels: { enabled: true }
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




			setInterval(function ( ) {
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				var x = (new Date()).getTime(),
					y = parseFloat(this.responseText);
				//console.log(this.responseText);
				if(chartT.series[0].data.length > 40) {
					chartT.series[0].addPoint([x, y], true, true, true);
				} else {
					chartT.series[0].addPoint([x, y], true, false, true);
				}
				}
			};
			xhttp.open("GET", "/temperature", true);
			xhttp.send();
			}, 5000 ) ;
	


  