"use strict"
//Burger
$('.icon-menu').click(function(event) {
	$(this).toggleClass('active');
	$('.menu__body').toggleClass('active');
	$('body').toggleClass('lock');
});
//-------
//Don't move when click on link
$(function () {
	$(document).click((e) => {
	  const {target} = e;
	  if(target.nodeName === 'A' && target.getAttribute('href') === '#') {
		e.preventDefault();
	  }
	});
  });
//------------------------------

/*График токов способом 1 (как в приере библиотеки Highcharts)*/

var chartC = new Highcharts.Chart('chart-current', {

    title: {
        text: 'Токи фаз',
        align: 'center'
    },

    subtitle: {},

    yAxis: {
        title: {
            text: 'Ток  (А)'
        }
    },

    xAxis: { type: 'datetime',
	dateTimeLabelFormats: { second: '%H:%M:%S' }
	},

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: false
            },
            pointStart: 1
        }
    },

    series: [{
        name: 'Ток A',
        data: [0, 5, 3, 5]
    }, {
        name: 'Ток B',
        data: [5,7,4,8]
    }, {
        name: 'Ток C',
        data: [2,6,1,6]
    }],

    responsive: {
        rules: [{
            condition: {
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

});

/*График токов способом 2 (как в приере ЕСП)*/

			var chartU = new Highcharts.Chart({
			chart:{ renderTo : 'chart-voltage' },
			title: { text: 'Напряжения питания' },
			legend: {
				layout: 'horizontal',
				align: 'center',
				verticalAlign: 'bottom'
			},
			series: [
				{
					name:'Напряжение <br> входное <br>',
					color:'blue',
					visible:true,
					showInLegend: true,
					data: [220, 225, 218, 210]
				},
				{
					name:'Напряжение <br> ключей',
					color:'red',
					visible:true,
					showInLegend: true,
					data: [230,235,228,220]
				}
			],
			plotOptions: {
				line: { animation: true,
				dataLabels: { enabled: true }
				},
				series: { color: '#059e8a', pointStart: 1 }
				
			},
			xAxis: { type: 'datetime',
				dateTimeLabelFormats: { second: '%H:%M:%S' }
			},
			yAxis: {
				title: { text: 'Напряжение  (В)' }
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
	


  