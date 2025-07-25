"use strict"

$('.diagnostics-legend').click(function(event) {
	$('.diagnostics-legend-arrows').toggleClass('diagnostics-legend-arrows-up');
	$('.diagnostics-legend-arrowsDown').toggleClass('diagnostics-legend-arrowsDown-visible');
	$('.history-block').toggleClass('displaynone2');
	$('.history-filter').toggleClass('displaynone');
});

const BtPrev = document.getElementById('his-start-btn')
const BtNext = document.getElementById('his-end-btn')
const BtSubmit = document.getElementById('his-sub-btn')
const PickerDate = document.getElementById('hdstart')
const PickerTime = document.getElementById('hdend')

var chartC
var chartU

var CurrentRec= Number("0");
var LastLoadedRec= Number("0");
var LoadMode = "Last"
//Графики на главной странице
if(document.getElementById('chart-current') != null){
	chartC = new Highcharts.Chart('chart-current', {

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
	chartU = new Highcharts.Chart('chart-voltage', {
	title: { text: 'Напряжения питания / Температура' },
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

function FindRecByTime (aReqStr, cb){
	console.log("Request = "+aReqStr);
	let req1 = new XMLHttpRequest();
	req1.open('GET', aReqStr, true);
	req1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			console.log("Response = "+this.responseText);
			let strs = this.responseText.split(".")
			if(strs.length == 3){
				if(strs[0] == "FARecN" ){
					cb(strs[1],strs[2]);
				}
			}
		}
	}
	req1.send();
}

function onFindRecByTime(Nreg,Kreg){
	let RegCnt = Number(Kreg) - Number(Nreg) +1; 
	LoadMode = "Time"
	CurrentRec =Number(Nreg)
	LoadCurGraf();

	//LoadLogRecords("A",Nreg,RegCnt,onLoadLogRec)
}

function LoadRecByTime(dt){
	let ReqStr = "/FindRecords/FA."+Number(dt)/1000+"."+Number(dt+240000)/1000;
	FindRecByTime (ReqStr,  onFindRecByTime);
}

function ViewLogRecords(buf,Append ){
	let bufptA =[];
	let bufptB =[];
	let bufptC =[];
	let bufptU =[];
	let bufptT =[];
	let Tm = buf[0].tm, 
		TA = 0, 
		TB = 0, 
		TC = 0,
		Vin = 0,	
		Themper = 0;
	try{
		let dt = new Date(Tm)
		SetDateTimePickers(dt.getTime() + dt.getTimezoneOffset()*60000);
		for(let i=0; i<buf.length; i++){
			Tm = buf[i].tm; 
			TA =buf[i].TA; 
			TB=buf[i].TB; 
			TC=buf[i].TC;
			Vin =buf[i].Vin;
			if(!(typeof buf[i].Themper === "undefined")){
				Themper =buf[i].Themper
			}
				
				
			bufptA.push([Tm, TA]);
			bufptB.push([Tm, TB]);
			bufptC.push([Tm, TC]);
			bufptU.push([Tm, Vin]);
			if(!(typeof buf[i].Themper === "undefined")){
				bufptT.push([Tm, Themper])
			}
		}

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

function LoadLogRecords(Name,BegReg,RegCnt,cb)
{

	let DPU = 333
	let str = "/GetFileLog1/"+Name+"."+String(BegReg)+"."+String(RegCnt);

	let xhr = new XMLHttpRequest();
	xhr.responseType = "arraybuffer";
	xhr.open('GET', str, true);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			let Len = this.response.byteLength
			if(Len == RegCnt*132 ){
				let buf = new DataView(this.response);
				let OutBuf =[];
				for(let n=0; n<RegCnt; n++){
					LastLoadedRec = buf.getUint32(n*132,true)
					let Tm = new Date(buf.getUint32(n*132+4,true)*1000)
					let Ntm = Tm.getTime() - Tm.getTimezoneOffset()*60000;
					for(let i=0; i<8; i++){
						let rec = new Object();
						rec.tm = Ntm;
						let k = n*132+i*15
						rec.TA = Number(buf.getFloat32(k+8,true).toFixed(3));
						rec.TB = Number(buf.getFloat32(k+8+4,true).toFixed(3));
						rec.TC = Number(buf.getFloat32(k+8+8,true).toFixed(3));
						rec.Vin = Number((buf.getUint16(k+8+12,true)*DPU/4096.0).toFixed(1));
						rec.dch = buf.getUint8(k+8+14);
						OutBuf.push(rec);
						if(i === 0){
							rec.Themper = Number((buf.getInt16(n*132+8+120,true)/8.0).toFixed(1))
						}
						Ntm += 1000;
						
					}
				}
				CurrentRec = BegReg;
				cb(OutBuf);
			}
		}			
	}
	xhr.onerror =	function(){	
		console.log("LoadLogRecords() request error")
	}
	xhr.send();

}

function GetLogInfo(cb){
	let Info = {
		LastError:0,
		Name:" ",
		SizeRec:0,
		Available:0, // К-во доступных записей
		StartRec:0, // Начальная запись для чтения
		LastRec:0, // Конечая запись для чтения
		MaxRecCount:0, // Размер лога в записях
	};
	let req1 = new XMLHttpRequest();
	req1.responseType = "arraybuffer";

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
				cb(Info);
			}
		}
	}
	req1.onerror =	function(){	
		console.log("GetLogInfo request error")
	}
	req1.send();

}

function onGetLogInfo(Info){
	let RecCnt = Number(30);
	if(RecCnt>Info.Available) RecCnt>Info.Available;
	let	Relative = Number(CurrentRec) - Number(Info.StartRec);
	if(Relative<0) Relative += Info.MaxRecCount;
	let BegRec = Number(0);
	if(LoadMode === "Prev"){
		if(Relative>=RecCnt){
			BegRec = (Number(CurrentRec) - RecCnt);
			if(BegRec<0)BegRec += Info.MaxRecCount;
		}
		else BegRec = Info.StartRec;
	}
	else if(LoadMode === "Next"){
		if(Relative+RecCnt+RecCnt<Info.Available){
			BegRec = (Number(CurrentRec) + RecCnt);
			if(BegRec>=Info.MaxRecCount)BegRec -= Info.MaxRecCount;
		}
		else{
			BegRec = Info.LastRec - RecCnt;
			if(BegRec<0)BegRec += Info.MaxRecCount;
		}
	}
	else if(LoadMode === "Time"){
		if(Relative+RecCnt<Info.Available){
			BegRec = Number(CurrentRec);
		}
		else{
			BegRec = Info.LastRec - RecCnt;
			if(BegRec<0)BegRec += Info.MaxRecCount;
		}
	}
	else if(LoadMode === "Last"){
		BegRec = Info.LastRec - RecCnt;
		if(BegRec<0)BegRec += Info.MaxRecCount;

	}


	LoadLogRecords(Info.Name, BegRec,RecCnt,onLoadLogRec)
	
}

function onLoadLogRec(buf){
	ViewLogRecords(buf,false)
}

function LoadCurGraf(){
	GetLogInfo(onGetLogInfo)
}

function BtPrevClick(){
	LoadMode = "Prev"
	//alert("Last rec ="+String(CurrentRec))
	LoadCurGraf();
}

function BtNextClick(){
	LoadMode = "Next"
	//alert('BtNextClick')
	LoadCurGraf();
}

function BtSubmitClick(){
    let str1 = String(PickerDate.value);
    let str2 = String(PickerTime.value);
	let dt = new Date();
	let dt1 = new Date(str1+"T"+str2+"Z");
	dt1 = dt1.getTime()+dt.getTimezoneOffset()*60000;
	let dt2 = new Date(dt1);
	//alert('BtSubmitClick\n'+str1+'\n'+str2+'\n'+dt2.toString());
	LoadRecByTime(dt1);

}

function DateToDatePicker(tm){
	let dt = new Date(tm)
    return String(dt.getFullYear()+"-"+
                (dt.getMonth()+1).toString().padStart(2, '0')+"-"+
                dt.getDate().toString().padStart(2, '0'))
}

function TimeToTimePicker(tm){
	let dt = new Date(tm)
	let s = String(dt.getHours().toString().padStart(2, '0')
				+":"+dt.getMinutes().toString().padStart(2, '0')
				+":"+dt.getSeconds().toString().padStart(2, '0')
			);
	return s;
}

function SetDefaultPicker(){
    let Tm = new Date();
	SetDateTimePickers(Tm.getTime());
}

function SetDateTimePickers(Tm){
    PickerDate.value = DateToDatePicker(Tm);
    PickerTime.value = TimeToTimePicker(Tm);
}

//LoadCurGraf1(false,30);
LoadCurGraf();

SetDefaultPicker();

BtPrev.onclick = BtPrevClick;
BtNext.onclick = BtNextClick;
BtSubmit.onclick = BtSubmitClick;


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
}
}
catch(e){
	console.log(e)
}
