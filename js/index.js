"use strict"

//Графики на главной странице
var ReqCurValue = new XMLHttpRequest();
ReqCurValue.responseType = "arraybuffer";
ReqCurValue.timeout = 5000;
let reglog = new XMLHttpRequest();
reglog.timeout = 5000;
var req1 = new XMLHttpRequest();
req1.responseType = "arraybuffer";

var GrafkFirstTimeLoaded = false;
var LastToRead = -1;
var LastLoadedRec = -1
var MaxRecCount = 32738;
var GeneralReaded = 0;
var buf = [];
var StartRec = 0;


function ParseLog(StrLog){
	let CurValue = "";
	let LastRecA = "";
	let as;
	let Strs = String(StrLog).split("&")
	if(Strs.length>0){
		console.log(Strs[0]);
	}
	if(Strs.length>1){
		as =Strs[1].split("=")
		if(as[0].trim() == "$CurValue"){
			CurValue = as[1].split(",");
		}
		else if(as[0].trim() == "$LastRecA"){
			LastRecA = as[1].split(",");
		}
	}
	if(Strs.length>2){
		as =Strs[2].split("=");
		if(as[0].trim() == "$CurValue"){
			CurValue = as[1].split(",");
		}
		else if(as[0].trim() == "$LastRecA"){
			LastRecA = as[1].split(",");
		}
	}
	if(CurValue.length>4){
		as = CurValue;
		let CurU16 = new Uint16Array(as.length);
		for(let i=0; i<as.length; i++)CurU16[i] = parseInt(as[i],16)
		FillCurState(CurU16.buffer);
	}
	if(LastRecA.length>4){
		as = LastRecA;
		let RecU16 = new Uint16Array(as.length);
		for(let i=0; i<as.length; i++)RecU16[i] = parseInt(as[i],16)

		let element = document.getElementsByClassName("statusData__curents");
		if((element != null) && (element.length>0)){
			if(GrafkFirstTimeLoaded == true){
				let Temp = new DataView(RecU16.buffer);
				let RecInBuf = Temp.getUint32(0,true);
				console.log("LastLoaded rec = "+ LastLoadedRec+
						"   LastToRead №"+LastToRead+" Rec in buf №"+RecInBuf)
				if((RecInBuf - LastLoadedRec)==1){
					console.log("View rec in buf №"+RecInBuf); 
					FillCurGraf(RecU16.buffer,true);
					LastToRead = RecInBuf + 1;
					if(LastToRead>MaxRecCount) LastToRead = 0;
				}
				if((RecInBuf - LastLoadedRec)>1){
					LoadCurGraf(true,5);
				}
					
			}	
		}
	}
}

function GetLog(){
	reglog.open("GET", "/GetLog/"+LastLoadedRec, true);
		reglog.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if(this.responseText.length>0){
				ParseLog(this.responseText);
			}

		}
	};
	reglog.send();
}

function FillCurGraf(resp,Append){
	//console.log("FillCurGraf()");
	let buf = new DataView(resp);
	let Len = buf.byteLength;
	//console.log("Length = "+Len);
	let DPU = 333
	if(Append != true){
		try{
			chartC.series[0].setData([]);
			chartC.series[1].setData([]);
			chartC.series[2].setData([]);
			chartU.series[0].setData([]);
		}
		catch(e){
			console.log(e);
		}
	}
	let rec = {
		tm:0,
		TA:0,
		TB:0,
		TC:0,
		Vin:0,
		dch:0,
		Themper:0,
		Dp:0
	};
	let bufptA =[];
	let bufptB =[];
	let bufptC =[];
	let bufptU =[];
	let bufptT =[];
	let n = 0;
	while(n<Len){
		let i = 0;
		LastLoadedRec = buf.getUint32(n,true)
		let tm = new Date(buf.getUint32(n+4,true)*1000)
		//console.log("LastLoadedRec = "+LastLoadedRec+"  "+tm.toLocaleTimeString()+"\n");
		rec.tm = tm.getTime() - tm.getTimezoneOffset()*60000;
		
		rec.Themper = Number((buf.getInt16(n+8+120,true)/8.0).toFixed(1))
		rec.Dp = buf.getUint16(n+8+120+2,true);
		if(Append == true){
			chartU.series[1].addPoint([rec.tm, rec.Themper], true, true, true);
		}
		else{
			bufptT.push([rec.tm, rec.Themper]);
		}
		while(i<120){
			rec.TA = Number(buf.getFloat32(n+8+i,true).toFixed(3));
			rec.TB = Number(buf.getFloat32(n+8+i+4,true).toFixed(3));
			rec.TC = Number(buf.getFloat32(n+8+i+8,true).toFixed(3));
			rec.Vin = Number((buf.getUint16(n+8+i+12,true)*DPU/4096.0).toFixed(1));
			rec.dch = buf.getUint8(n+8+i+14)
			//ptSer.tm = rec.tm;
			//ptSer.val = rec.TA;
			if(Append == true){
				try{
					chartC.series[0].addPoint([rec.tm, rec.TA], true, true, true);
					chartC.series[1].addPoint([rec.tm, rec.TB], true, true, true);
					chartC.series[2].addPoint([rec.tm, rec.TC], true, true, true);
					chartU.series[0].addPoint([rec.tm, rec.Vin], true, true, true);
				}
				catch(e){
					console.log(e);
				}
			}
			else{
				bufptA.push([rec.tm, rec.TA]);
				bufptB.push([rec.tm, rec.TB]);
				bufptC.push([rec.tm, rec.TC]);
				bufptU.push([rec.tm, rec.Vin]);
			}
			//chartC.series[0].addPoint([rec.tm, rec.TA], true, false, true);
			//chartC.series[0].data.push([rec.tm,rec.TA]);
			/*
			if(chartC.series[0].data.length > 240) {
				chartC.series[0].addPoint([rec.tm, rec.TA], true, true, true);
			  } else {
				chartC.series[0].addPoint([rec.tm, rec.TA], true, false, true);
			  }
			*/
			i += 15
			rec.tm +=1000;
		}
		n += 132;
	}
	if(Append != true){
		try{
			chartC.series[0].setData(bufptA);
			chartC.series[1].setData(bufptB);
			chartC.series[2].setData(bufptC);
			chartU.series[0].setData(bufptU);
			chartU.series[1].setData(bufptT);
		}
		catch(e){
			console.log(e);
		}
	}
}

function LoadNext (Name,RegCnt,Append){
	let LPart = 6;

	if(LPart>(RegCnt - GeneralReaded))LPart =RegCnt - GeneralReaded;
	let CurrRec = StartRec+GeneralReaded
	let str = "/GetFileLog/"+Name+"."+String(CurrRec)+"."+String(LPart);
	console.log(str);
	req1.open('GET', str, true);
	req1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let Len = this.response.byteLength
			if(this.response.byteLength == LPart*132 ){
				try{
					LastToRead = CurrRec+LPart
					GeneralReaded += LPart;

					let bu8t = new Uint8Array(this.response)
					for(let i=0; i<bu8t.length; i++){
						buf.push(bu8t[i]);
						
					}
					if(GeneralReaded<RegCnt){
						LoadNext (Name,RegCnt,Append)
					}
					else{
						console.log("Buf len ="+buf.length+ "  RecCnt="+(buf.length)/132);
						bu8t = new Uint8Array(buf);
						buf =[];

						FillCurGraf(bu8t.buffer,Append)
						bu8t = [];
						GeneralReaded = 0;	
						GrafkFirstTimeLoaded = true;
					}
				}
				catch(e){
					console.log(e)
				}
			}
			else{
				console.log("Error length="+Len+"  RegCnt="+RegCnt)
			}
		}
		else{
			if (this.readyState == 4){
				console.log("LoadNext(): readyState="+this.readyState+"  status="+this.status )	
			}
		}
	
	}
	req1.onerror =	function(){	
		console.log("LoadNext() request error")
	}
	req1.send();
}

function LoadNext1 (Name,RegCnt,Append){
	let str = "/GetFileLog1/"+Name+"."+String(StartRec)+"."+String(RegCnt);
	console.log(str);
	req1.open('GET', str, true);
	req1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let Len = this.response.byteLength
			if(this.response.byteLength == RegCnt*132 ){
				try{
					LastToRead = StartRec+RegCnt
					let bu8t = new Uint8Array(this.response)
					for(let i=0; i<bu8t.length; i++){
						buf.push(bu8t[i]);
						
					}
					
					console.log("Buf len ="+buf.length+ "  RecCnt="+(buf.length)/132);
					bu8t = new Uint8Array(buf);
					buf =[];

					FillCurGraf(bu8t.buffer,Append)
					bu8t = [];
					GrafkFirstTimeLoaded = true;
					
				}
				catch(e){
					console.log(e)
				}
			}
			else{
				console.log("Error length="+Len+"  RegCnt="+RegCnt)
			}
		}
		else{
			if (this.readyState == 4){
				console.log("LoadNext(): readyState="+this.readyState+"  status="+this.status )	
			}
		}
	
	}
	req1.onerror =	function(){	
		console.log("LoadNext() request error")
	}
	req1.send();
}

function LoadCurGraf(Append,MaxLength){
	let Info = {
		LastError:0,
		Name:" ",
		SizeRec:0,
		Available:0, // К-во доступных записей
		StartRec:0, // Начальная запись для чтения
		LastRec:0, // Конечая запись для чтения
		MaxRecCount:0, // Размер лога в записях
	};  
	//console.log("LoadCurGraf()");

	req1.open('GET', '/GetFileLog/A.0012.0000', true);
	req1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let buf = new DataView(this.response);
			//console.log("Resp length ="+String(buf.byteLength));
			if(buf.byteLength == 23){
				Info.LastError = buf.getUint8(0)
				Info.Name = String.fromCharCode(buf.getUint8(1))
				Info.SizeRec = buf.getUint8(2)
				Info.Available = buf.getInt32(3,true);
				Info.StartRec = buf.getInt32(7,true);
				Info.LastRec = buf.getInt32(11,true);
				Info.MaxRecCount = buf.getInt32(15,true);
				MaxRecCount = buf.getInt32(15,true);
				
				let RegCnt = MaxLength;
				if(RegCnt>Info.Available) RegCnt = Info.Available; 
				if(Append == true){
					if((GrafkFirstTimeLoaded) && (LastToRead>=0)){
						console.log("Last rec ="+Info.LastRec);
						console.log("LastReadedRec = "+LastToRead);
						RegCnt = (Info.LastRec - LastToRead+1);
						if(RegCnt<0)RegCnt+= Info.MaxRecCount;
						console.log("RegCnt = "+RegCnt);
						if(RegCnt> MaxLength) RegCnt = MaxLength;
					}
				}
				if(RegCnt != 0){
					let NReg = Info.LastRec - RegCnt+1;
					if(NReg<0)NReg += Info.MaxRecCount;
					StartRec = NReg;
					GeneralReaded = 0;	
					LoadNext(Info.Name,RegCnt,Append);
				}
				else{

				}
			}
		}
	}
	req1.send();
}

function LoadCurGraf1(Append,MaxLength){
	let Info = {
		LastError:0,
		Name:" ",
		SizeRec:0,
		Available:0, // К-во доступных записей
		StartRec:0, // Начальная запись для чтения
		LastRec:0, // Конечая запись для чтения
		MaxRecCount:0, // Размер лога в записях
	};  
	//console.log("LoadCurGraf()");

	req1.open('GET', '/GetFileLog/A.0012.0000', true);
	req1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let buf = new DataView(this.response);
			//console.log("Resp length ="+String(buf.byteLength));
			if(buf.byteLength == 23){
				Info.LastError = buf.getUint8(0)
				Info.Name = String.fromCharCode(buf.getUint8(1))
				Info.SizeRec = buf.getUint8(2)
				Info.Available = buf.getInt32(3,true);
				Info.StartRec = buf.getInt32(7,true);
				Info.LastRec = buf.getInt32(11,true);
				Info.MaxRecCount = buf.getInt32(15,true);
				MaxRecCount = buf.getInt32(15,true);
				
				let RegCnt = MaxLength;
				if(RegCnt>Info.Available) RegCnt = Info.Available; 
				if(Append == true){
					if((GrafkFirstTimeLoaded) && (LastToRead>=0)){
						console.log("Last rec ="+Info.LastRec);
						console.log("LastReadedRec = "+LastToRead);
						RegCnt = (Info.LastRec - LastToRead+1);
						if(RegCnt<0)RegCnt+= Info.MaxRecCount;
						console.log("RegCnt = "+RegCnt);
						if(RegCnt> MaxLength) RegCnt = MaxLength;
					}
				}
				if(RegCnt != 0){
					let NReg = Info.LastRec - RegCnt+1;
					if(NReg<0)NReg += Info.MaxRecCount;
					StartRec = NReg;
					GeneralReaded = 0;	
					LoadNext1(Info.Name,RegCnt,Append);
				}
				else{

				}
			}
		}
	}
	req1.send();
}

function FormattingCurrent(val,dp){
	let res
	if(dp < 10.0){
		res = (+val.toFixed(2)).toString();
		res +=" А"
	}
	else if(dp < 100.0){
		res = (+val.toFixed(1)).toString();
		res +=" А"
	}
	else if(dp < 1000.0){
		res = (+val.toFixed(0)).toString();
		res +=" А"
	}
	else if(dp < 10000.0){
		res = (+(val/1000.0).toFixed(2)).toString();
		res +=" кА"
	}
	else {
		res = (+(val/1000.0).toFixed(1)).toString();
		res +=" кА"
	}
	return res;
}

function FillCurState(buf){
	try{
		let val = new DataView(buf);
		let dp = val.getUint16(28,true);
		let element = document.getElementsByClassName("statusData__curents");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("statusData__curents-a-data statusData-numb");
			CurEl[0].innerHTML = FormattingCurrent(val.getFloat32(4,true),dp);

			CurEl = element[0].getElementsByClassName("statusData__curents-b-data statusData-numb");
			CurEl[0].innerHTML = FormattingCurrent(val.getFloat32(8,true),dp);

			CurEl = element[0].getElementsByClassName("statusData__curents-c-data statusData-numb");
			CurEl[0].innerHTML = FormattingCurrent(val.getFloat32(12,true),dp);
		}
		element = document.getElementsByClassName("statusData__inputs");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("statusData__inputs-switchON-data statusData-numb");
			CurEl[0].innerHTML = val.getUint8(31).toString();
			CurEl = element[0].getElementsByClassName("statusData__inputs-switchOFF-data statusData-numb");
			CurEl[0].innerHTML = val.getUint8(32).toString();
			CurEl = element[0].getElementsByClassName("statusData__inputs-block-data statusData-numb");
			CurEl[0].innerHTML = val.getUint8(30).toString();
		}
		element = document.getElementsByClassName("statusData__voltage");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("statusData__voltage-input-data statusData-numb");
			CurEl[0].innerHTML = (val.getFloat32(16,true)).toFixed(1).toString()+" V";
			CurEl = element[0].getElementsByClassName("statusData__voltage-kl-data statusData-numb");
			CurEl[0].innerHTML = (val.getFloat32(20,true)).toFixed(1).toString()+" V";
			CurEl = element[0].getElementsByClassName("statusData__voltage-temp-data statusData-numb");
			CurEl[0].innerHTML = (val.getInt16(24,true)/8.0).toFixed(1);
		}
		element = document.getElementsByClassName("status__column-time-row");
		if((element != null) && (element.length>0)){
			let n = val.getUint32(0,true)*1000;
			let tm = new Date(n);
			let CurEl; 
			CurEl = element[0].getElementsByClassName("status__column-time-row-DataData");
			CurEl[0].innerHTML = tm.toLocaleDateString();
			CurEl = element[0].getElementsByClassName("status__column-time-row-DataTime");
			CurEl[0].innerHTML = tm.toLocaleTimeString();
		}
		element = document.getElementsByClassName("status__row-status");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("status__row-status_sost-btn");
			let stat = val.getUint8(27)


		}
		element = document.getElementsByClassName("status__row-diag");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("status__row-diag-text-norm");
			let stat = val.getUint8(26)
			if(stat == 0)	CurEl[0].innerHTML = "НОРМА";
			else if(stat == 2)	CurEl[0].innerHTML = "КОРОТКОЕ ЗАМЫКАНИЕ";
			else if(stat == 3)  CurEl[0].innerHTML = "ОБРЫВ";
			else CurEl[0].innerHTML = "НЕИСПРАВНОСТЬ";
		}
		element = document.getElementsByClassName("status__row-status");
		if((element != null) && (element.length>0)){
			let CurEl; 
			CurEl = element[0].getElementsByClassName("status__row-status_sost-btn");
			let stat =  val.getUint8(27);
			if(stat == 0) CurEl[0].innerHTML = " - - - - - ";
			else if(stat == 1)	CurEl[0].innerHTML = "ВКЛЮЧЕН";
			else if(stat == 2)	CurEl[0].innerHTML = "ВЫКЛЮЧЕН";
			else CurEl[0].innerHTML = " -.-.-.-.- ";
		}
		val = null;
	}
	catch(e){
		console.log(e);
	}
}

function setcontrolletime(){
	let tm = new Date();
	let str="/SetTime/"+String(tm.getUTCFullYear())+"."+
	String(tm.getUTCMonth()+1)+"."+
	String(tm.getUTCDate())+"."+
	String(tm.getUTCHours())+"."+
	String(tm.getUTCMinutes())+"."+
	String(tm.getUTCSeconds())+"."+
	String(tm.getUTCMilliseconds());
	console.log(str);
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		}
	}
	req.open("GET",str , true);
	req.send();
}

if(document.getElementById('chart-voltage1') != null){

var chartU1 = new Highcharts.Chart('chart-voltage1',{
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
		data: []
	},
	{
		name:'Напряжение <br> ключей',
		color:'red',
		visible:true,
		showInLegend: true,
		data: []
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
}

if(document.getElementById('chart-current') != null){
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
        data: []
    }, {
        name: 'Ток B',
        data: []
    }, {
        name: 'Ток C',
        data: []
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
}

if(document.getElementById('chart-voltage') != null){
	var chartU = new Highcharts.Chart('chart-voltage', {
	title: { text: 'Напряжения питания/Температура' },
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
			data: []
		},
		{
			name:'Температура <br> блока',
			color:'red',
			visible:true,
			showInLegend: true,
			data: []
		}
	],
	plotOptions: {
		line: { 
			animation: true,
			dataLabels: { enabled: false }
		},
		series: { 
			label: {
				connectorAllowed: true
			},
			color: '#059e8a', 
			pointStart: 1 
		}
		
	},
	xAxis: { type: 'datetime',
		dateTimeLabelFormats: { second: '%H:%M:%S' }
	},
	yAxis: {
		title: { text: 'Напряжение  (В)/ Температура(°С)' }
	},
	credits: { enabled: false }
	});
}
	

let element = document.getElementsByClassName("status");
if((element != null) && (element.length>0)){
	LoadCurGraf1(false,30);
}	
element = document.getElementsByClassName("status__row-time")
console.log(element[0])
let ico = element[0].getElementsByClassName("icon").item(0);
console.log(ico)
if(ico != null){
	ico.onclick = setcontrolletime;  
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
		
		let as = String(e.data).split(",")
		let u16 = new Uint16Array(as.length);
		for(let i=0; i<as.length; i++)u16[i] = parseInt(as[i],16)
		FillCurState(u16.buffer);
	}, false);
	source.addEventListener('LastRecA', function(e) {
		let LastRecA = "";
		LastRecA = String(e.data).split(",");
		let as = LastRecA;
		let RecU16 = new Uint16Array(as.length);
		for(let i=0; i<as.length; i++)RecU16[i] = parseInt(as[i],16)
			let element = document.getElementsByClassName("statusData__curents");
		if((element != null) && (element.length>0)){
			if(GrafkFirstTimeLoaded == true){
				let Temp = new DataView(RecU16.buffer);
				let RecInBuf = Temp.getUint32(0,true);
				console.log("LastLoaded rec = "+ LastLoadedRec+
						"   LastToRead №"+LastToRead+" Rec in buf №"+RecInBuf)
				if((RecInBuf - LastLoadedRec)==1){
					console.log("View rec in buf №"+RecInBuf); 
					FillCurGraf(RecU16.buffer,true);
					LastToRead = RecInBuf + 1;
					if(LastToRead>MaxRecCount) LastToRead = 0;
				}
				if((RecInBuf - LastLoadedRec)>1){
					LoadCurGraf(true,5);
				}
					
			}	
		}
	
		//console.log("LastRecA", e.data);
	}, false);
}
}
catch(e){
	console.log(e)
}
/*
setTimeout(() => {
	setInterval( GetLog, 2000 ) ;
	
}, 3000);
*/
console.log("index.js загружен");
	


  