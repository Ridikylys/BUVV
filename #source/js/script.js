"use strict"
//Burger
$('.icon-menu').click(function(event) {
	$(this).toggleClass('active');
	$('.menu__body').toggleClass('active');
	$('body').toggleClass('lock');
});
//-------

//For img
function ibg(){

	let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();
//-------

filterSelection("all")
function filterSelection(c) {
  var x, i;
  x = document.getElementsByClassName("filterDiv");
  if (c == "all") c = "";
  // Add the "show" class (display:block) to the filtered elements, and remove the "show" class from the elements that are not selected
  for (i = 0; i < x.length; i++) {
    w3RemoveClass(x[i], "show");
    if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
  }
}

// Show filtered elements
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {
      element.className += " " + arr2[i];
    }
  }
}

// Hide elements that are not selected
function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);
    }
  }
  element.className = arr1.join(" ");
}

	


	//Select in menu-news
	$('.menu-news__link').click(function(event) {
		$('.menu-news__link').removeClass('select');
		$(this).addClass('select');
	});



//Don't move when click on link
$(function () {
	$(document).click((e) => {
	  const {target} = e;
	  if(target.nodeName === 'A' && target.getAttribute('href') === '#') {
		e.preventDefault();
	  }
	});
  });

//Slider
if($('.slider__body').length>0){
	$(document).ready(function(){
		$('.slider__body').slick({
			//autoplay: false,
			//infinite: true,
			dots: true,
			adaptiveHeight: true,
			arrows: false,
			accessibility: false,
			slidesToShow: 1,
			autoplaySpeed: 3000,
			pauseOnFocus: true,
			pauseOnHover: true,
			pauseOnDotsHover: true,
			nextArrow: '<button type="button" class="slick-next"></button>',
			prevArrow: '<button type="button" class="slick-prev"></button>',
			responsive: [{
				breakpoint: 768,
				settings: {},
			}]
		});
	});
}
//---------

//Form validate
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('form');
	form.addEventListener('submit', formSend);

	async function formSend(e) {
		e.preventDefault();

		let error = formValidate(form);

		if (error === 0) {
			//Если все ОК, то ничего
			console.log('ТЕПЕРЬ ОК');
		} else {
			//Сюда дописать что делаем если не ОК
			console.log('НЕ ОК');
		}
	}

	function formValidate(form) {
		let error = 0;
		let formReq = document.querySelectorAll('._req');

		for (let index = 0; index < formReq.length; index++) {
			const input = formReq[index];
			formRemoveError(input);

			if (input.classList.contains('_email')) {
				if (emailTest(input)) {
					formAddError(input);
					error++;
				} else {
					if (input.value === '') {
						formAddError(input);
						error++;
					}		
				}
			}
		}
		return error;
	}

	function formAddError(input) {
		input.parentElement.classList.add('_error');
		input.classList.add('_error');
	}

	function formRemoveError(input) {
		input.parentElement.classList.remove('_error');
		input.classList.remove('_error');
	}

	//Функция теста email
	function emailTest(input) {
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
	}
});
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
	
//Функия графиков из примера
/*
Highcharts.chart('container', {

	title: {
	  text: 'График токов и напряжений БУВВ-1',
	  align: 'left'
	},
  
	subtitle: {
	  text: 'Попытка номер 2',
	  align: 'left'
	},
  
	yAxis: {
	  title: {
		text: 'Ток, напряжение ( % )'
	  }
	},
  
	xAxis: {
	  accessibility: {
		rangeDescription: 'Range: 2010 to 2020'
	  }
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
		pointStart: 2010
	  }
	},
  
	series: [{
	  name: 'Ток 1',
	  data: [
		43934, 48656, 65165, 81827, 112143, 142383,
		171533, 165174, 155157, 161454, 154610
	  ]
	}, {
	  name: 'Напряжение ЕМ1',
	  data: [
		24916, 37941, 29742, 29851, 32490, 30282,
		38121, 36885, 33726, 34243, 31050
	  ]
	}, {
	  name: 'Напряжение ЕМ2',
	  data: [
		11744, 30000, 16005, 19771, 20185, 24377,
		32147, 30912, 29243, 29213, 25663
	  ]
	}, {
	  name: 'Еще что нибудь',
	  data: [
		null, null, null, null, null, null, null,
		null, 11164, 11218, 10077
	  ]
	}, {
	  name: 'И что нибудь 2',
	  data: [
		21908, 5548, 8105, 11248, 8989, 11816, 18274,
		17300, 13053, 11906, 10073
	  ]
	}],
  
	responsive: {
	  rules: [{
		condition: {
		  maxWidth: 500
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
*/

  