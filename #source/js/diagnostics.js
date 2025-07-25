"use strict"

$('.diagnostics-legend').click(function(event) {
	$('.diagnostics-legend-arrows').toggleClass('diagnostics-legend-arrows-up');
	$('.diagnostics-legend-arrowsDown').toggleClass('diagnostics-legend-arrowsDown-visible');
	$('.diagnostics-block').toggleClass('displaynone2');
	$('.diagnostics-filter').toggleClass('displaynone4');
});
	// Dropdown Menu
/*
	var dropdown = document.querySelectorAll('.dropdown');
	var dropdownArray = Array.prototype.slice.call(dropdown,0);
	console.log("Grafiks.html загружен");
	dropdownArray.forEach(function(el){
		var button = el.querySelector('a[data-toggle="dropdown"]'),
				menu = el.querySelector('.dropdown-menu'),
				arrow = button.querySelector('i.icon-arrow');
	
		button.onclick = function(event) {
			if(!menu.hasClass('show')) {
				menu.classList.add('show');
				menu.classList.remove('hide');
				arrow.classList.add('open');
				arrow.classList.remove('close');
				event.preventDefault();
			}
			else {
				menu.classList.remove('show');
				menu.classList.add('hide');
				arrow.classList.remove('open');
				arrow.classList.add('close');
				event.preventDefault();
			}
		};
	})
	
	Element.prototype.hasClass = function(className) {
		return this.className && new RegExp("(^|\\s)" + className + "(\\s|$)").test(this.className);
	};
*/
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
  
  
var pb = new Progress(15, 0, 100, {parent : ".progress"});


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
	valueDecimals: 3
},
plotOptions: {
	line: { animation: true,
		dataLabels: { 
			enabled: false,
			format: '{point.y:,.3f}'					
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
		valueDecimals: 2
	},
	plotOptions: {
		line: { animation: false,
			dataLabels: { 
				enabled: false,
				format: '{point.y:,.2f}'						
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
	
function FillGrafikProc(buf){
	let DPI = 42.24;
	let i16all = new Int16Array(buf);
	let fl32 = new Float32Array(i16all.length/8);
	let n = 2;
	for(let i = 0; i<fl32.length; i++){
		fl32[i] = +(i16all[n]*DPI/4096.0).toFixed(3);
		n += 8;
	}
	i16all = null;
	chartIEM.series[0].setData(fl32);
	let DPU = 333.0;
	let u16all = new Uint16Array(buf);
	n = 6;
	for(let i = 0; i<fl32.length; i++){
		fl32[i] =+(u16all[n]*DPU/4096.0).toFixed(2);
		n += 8;
	}
	chartUEM.series[0].setData(fl32);
	n = 5;
	for(let i = 0; i<fl32.length; i++){
		fl32[i] =+(u16all[n]*DPU/4096.0).toFixed(2);
		n += 8;
	}
	chartUEM.series[1].setData(fl32);
	n = 4;
	for(let i = 0; i<fl32.length; i++){
		fl32[i] =+(u16all[n]*DPU/4096.0).toFixed(2);
		n += 8;
	}
	chartUEM.series[3].setData(fl32);
	n = 3;
	for(let i = 0; i<fl32.length; i++){
		fl32[i] =+(u16all[n]*DPU/4096.0).toFixed(2);
		n += 8;
	}
	chartUEM.series[2].setData(fl32);
	fl32 = null;
}

function GetStmFile(name,PostFunc){
	let reqLoad = new XMLHttpRequest();
	reqLoad.timeout = 5000;
	//let Progress = document.getElementById("progressBar");
	reqLoad.responseType = "arraybuffer";
	reqLoad.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log('принято : '+String(this.response.byteLength));
			PostFunc(this.response) ;
		}
	}
	if(pb != null){
		reqLoad.onprogress = function(event) {
			let pl = event.loaded;
			let pt = event.total;
			//console.log("загружено:"+pl+"   из:"+pt);
			pb.now =  Math.round(100 * pl/pt);
			pb.syncState(); 
			//alert( 'Получено с сервера ' + event.loaded + ' байт из ' + event.total );
		}
	}
	reqLoad.onerror =function(){

	}
	reqLoad.ontimeout = function(){

	}
	reqLoad.open("GET",name , true);
	reqLoad.send();
}

function ViewProc(){
	try{
		let Sel = document.getElementById("SelectFile");
		let Ind = Sel.selectedIndex;
		if(Sel.selectedIndex >= 0){
			let str = '/DownLoadFile/'+Sel.options[Ind].value;
			GetStmFile(str,FillGrafikProc)
		}
		else alert("Файл не выбран")
		
	}
	catch(e){
		alert(e);
	
	}
}

function DownloadProc(){
	let Sel = document.getElementById("SelectFile");
	let Progress = document.getElementById("progressBar");
	let Ind = Sel.selectedIndex;
	if(Sel.selectedIndex >= 0){
		try{
			let fileName = Sel.options[Ind].value;

			let reqLoad = new XMLHttpRequest();
			reqLoad.responseType = "arraybuffer";
			reqLoad.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
				    console.log("download byte length = "+ this.response.byteLength);
					var ablob = new Blob([this.response],{type: "image/png"});
				//Check the Browser type and download the File.
					var isIE = false || !!document.documentMode;
					if (isIE) {
						window.navigator.msSaveBlob(ablob, fileName);
					} else {
						var url = window.URL || window.webkitURL;
						var link = url.createObjectURL(ablob);
						console.log('link = '+link)
						var a = document.createElement("a");
						a.setAttribute("download", fileName);
						a.setAttribute("href", link);
						a.setAttribute("enctype","multipart/form-data");
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
					
				}
			}
			if(Progress != null){
				reqLoad.onprogress = function(event) {
					let pl = event.loaded;
					let pt = event.total;
					//console.log("загружено:"+pl+"   из:"+pt);
					Progress.value =  Math.round(100 * pl/pt); 
					//alert( 'Получено с сервера ' + event.loaded + ' байт из ' + event.total );
				}
			}
			reqLoad.open("GET", '/DownLoadFile/'+fileName, true);
			reqLoad.send();
		}
		catch(e){
			alert(e);
		
		}
	}
	else alert("Файл не выбран")

}

function GetListFiles(){
	let ArrDtChange;
	function ConvertDate(str,index){
		let dt=new Date(  Number(str.substring(6,8))+2000,	
		Number(str.substring(3,5))-1,	
		Number(str.substring(0,2)),	
		Number(str.substring(9,11)),	
		Number(str.substring(12,14)),	
		Number(str.substring(15,17)));
		let ms = dt.getTime() - dt.getTimezoneOffset()*60000;		
		ArrDtChange[index] = ms;
		let dt1  = new Date(ms);
		return dt1.toLocaleDateString()+" "+dt1.toLocaleTimeString()									  
	}
	function ConvertName(fname,index){
		let PartNames;
		let i;
		let result;
		PartNames = fname.split(',')
		let str; 
		str = PartNames[3];	
		PartNames[3] = ConvertDate(str);
		if(PartNames.length>=5){
			str = PartNames[4];	
			PartNames[4] = ConvertDate(str,index);
		}
		if(Number(PartNames[1]) == 1){
			PartNames[1] = "Включение"
		}
		else if(Number(PartNames[1]) == 2){
			PartNames[1] = "Выключение"
		}
		else if(Number(PartNames[1]) == 3){
			PartNames[1] = "Включ/Выкл"
		}
		result ="";
		for (i = 0; i<PartNames.length; i++){
			if(result.length) result+=","
			result+= PartNames[i];
		}
		return result;
	}
	function SortFNames(fnames){
		let i; let j; let len = fnames.length;
		for(i=0; i<len-1; i++){
			for(j=i+1; j<len; j++){
				if(ArrDtChange[i]<ArrDtChange[j]){
					let tempstr;
					tempstr = fnames[i];
					fnames[i] = fnames[j];
					fnames[j] = tempstr; 
					let tempdt;
					tempdt = ArrDtChange[i];
					ArrDtChange[i] = ArrDtChange[j];
					ArrDtChange[j] = tempdt;
				}
			}
		}

	}
	function GetDescribtion(str){
		let str1 = "";
		let PartNames;
		PartNames = str.split(',')
		str1 = PartNames[1] + "  "+PartNames[4] + "    "+PartNames[2]+"Byte"
		return str1
	}
	function FillTable(u8arr){
		const win1251decoder = new TextDecoder("windows-1251");
		// Преобразование ArrayBuffer в строку
		let str =  win1251decoder.decode(u8arr);
		//console.log(str);
		const fnames = str.split(';')
		ArrDtChange = new Array(fnames.length);
		for(let i=0; i<fnames.length; i++){
			fnames[i] = ConvertName(fnames[i],i);
		}	
		SortFNames(fnames);
		while(Sel.length)Sel.remove(0);
		for(let i=0; i<fnames.length; i++){
			let strsn = fnames[i].split(",");
			let opt = document.createElement('option');
			opt.text = GetDescribtion(fnames[i]);
			opt.value = strsn[0];
			Sel.appendChild(opt);
		}
		Sel.selectedIndex = 0;
		let hidden = Sel.hasAttribute("hidden");
			if (hidden) {
				Sel.removeAttribute("hidden");
			}

	}
	let Sel = document.getElementById("SelectFile");
	if(Sel != null){ 
		try{
			let req = new XMLHttpRequest();
			req.responseType = "arraybuffer";
			req.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					console.log("response byte length = "+ this.response.byteLength);
					let u8arr = new Uint8Array(this.response);
					FillTable(u8arr);
					
				}
			};
			req.open("GET", "/GetListFiles", true);
			req.send();
		}
			catch(e){
			alert(e);
		}
	}
}


let element = document.getElementById('ViewProc');
if(element != null)element.onclick = function(){
/*
	if (){
		btn.setAttribute('disabled', true);
	  }else{
		btn.removeAttribute('disabled');
	  }
*/
	ViewProc();
} 
element = document.getElementById('DlProc');
if(element != null)element.onclick = DownloadProc;
element = document.getElementById('ViewList');
if(element != null){
	element.onclick = GetListFiles;	
//	window.onload = GetListFiles;
	GetListFiles();
}
try{
	if (!!window.EventSource) {
		var source = new EventSource('/eventsBUVV');
	  
		source.addEventListener('open', function(e) {
		  console.log("Events Connected ");
		  console.log("data = "+e.data);
		}, false);
	  
		source.addEventListener('error', function(e) {
		  if (e.target.readyState != EventSource.OPEN) {
			console.log("Events Disconnected");
		  }
		}, false);
	  
		source.addEventListener('message', function(e) {
		  console.log("message", e.data);
		}, false);
	  
		source.addEventListener('LogMessage', function(e) {
		  console.log("LogMessage", e.data);
		}, false);
		source.addEventListener('CurValue', function(e) {
			//console.log("CurValue", e.data);
		}, false);
		source.addEventListener('LastRecA', function(e) {

		}, false);
	}
}
catch(e){
	console.log(e)
}
	
	


  