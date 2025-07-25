"use strict"
var ToID;
function LoadLog(BeginRecord,EndRecord){
    let Tmb = new Date();
    let Tme = new Date();
    let Info = {
		LastError:0,
		Name:" ",
		SizeRec:0,
		Available:0, // К-во доступных записей
		StartRec:0, // Начальная запись для чтения
		LastRec:0, // Конечая запись для чтения
		MaxRecCount:0, // Размер лога в записях
	};  
    function GetInfo(){
        let req1 = new XMLHttpRequest();
        req1.responseType = "arraybuffer";
	    req1.open('GET', '/GetFileLog/B.0012.0000', true);
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
                    FindRecords();
                }
            }
        }
        req1.send();
    }
    function FindRecords(){
        if((BeginRecord == undefined) || (EndRecord == undefined)){
            let aCnt = 100;
            if(aCnt>Info.Available) aCnt=Info.Available;
            let aNRec = Info.LastRec - aCnt +1;
            if(aNRec<0) aNRec += Info.MaxRecCount;
            LoadRecords(aNRec,aCnt)
        }
        else{
            let aCnt = Number(EndRecord) - Number(BeginRecord) + 1;
            let aNRec = Number(BeginRecord);
            LoadRecords(aNRec,aCnt)
        }
    }
    function LoadRecords(NRec,RecCnt){
        let req2 = new XMLHttpRequest();
        req2.responseType = "arraybuffer";
        let Name = 'B'
        let str = "/GetFileLog1/"+Name+"."+String(NRec)+"."+String(RecCnt);
        req2.open('GET', str, true);
        req2.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                FillTable(this.response);
            }
        }
        req2.send();
    }
    function FillTable(buf){
		const win1251decoder = new TextDecoder("windows-1251");
		// Преобразование ArrayBuffer в строку
        let RecCnt = buf.byteLength/(Info.SizeRec+4);
        let dvbuf = new DataView(buf);
        for(let i=0; i<RecCnt; i++){
            let RecIndex = i*(Info.SizeRec+4);
            let TmStmp = dvbuf.getUint32((RecIndex+4),true);
            let NRec = dvbuf.getInt32((RecIndex+0),true);
            let mes = new Uint8Array(buf,(RecIndex+8),60);
            let str = win1251decoder.decode(mes);
            let tm = new Date(TmStmp*1000);
            if(i == 0) Tmb = tm;
            if(i == RecCnt - 1) tm;
            AppendLogTable(tm,str);
                
        }
        clearTimeout(ToID);
        if(button.hasAttribute('disabled')){
            button.removeAttribute('disabled')
        }    
    }
    ClearTable();
    GetInfo();

}

function ClearTable(){
    let listtable = document.getElementsByClassName("eventlog-table");
    let table = listtable[0].getElementsByTagName("table").item(0);
    let body = table.getElementsByTagName("tbody").item(0);
    while(body.rows.length>1) body.deleteRow(1);
}

function AppendLogTable(dtevent,mes){
    let listtable = document.getElementsByClassName("eventlog-table");
    let table = listtable[0].getElementsByTagName("table").item(0);
    let body = table.getElementsByTagName("tbody");
    let newrow =body[0].insertRow(1);
    let dt = new Date(dtevent);
    let cell = newrow.insertCell(0)
    cell.className ="data-column"
    cell.innerText = dt.toLocaleDateString();
    cell = newrow.insertCell(1)
    cell.className ="time-column"
    cell.innerText = dt.toLocaleTimeString();
    cell = newrow.insertCell(2)
    cell.className ="event-column"
    cell.innerText = mes;
}

function GetEventsLog(){
    let str1 = document.getElementsByClassName('dstart-input').item(0).value;
    let str2 = document.getElementsByClassName('dend-input').item(0).value;
    let dt = new Date();
    let dt1;
    let dt2;
    if(str1.length>0){
        dt1 = new Date(str1+"T00:00:00Z");
        dt1 = dt1.getTime()+dt.getTimezoneOffset()*60000;
        console.log(Number(dt1));
    }
    else{
        alert("Начальная дата не установлена");
        return;
    } 
    if(str2.length>0){
        dt2 = new Date(str2+"T23:59:59Z");
        dt2 = dt2.getTime()+ dt.getTimezoneOffset()*60000;
        console.log(Number(dt2));
    }
    else{
        alert("Конечная дата не установлена");
        return;
    }
    if(dt1>dt2)dt1 = dt2;
    let ReqStr = "/FindRecords/FB."+Number(dt1)/1000+"."+Number(dt2)/1000;
    
    function GetRecByTime (aReqStr){
        console.log("Request = "+aReqStr);
        let req1 = new XMLHttpRequest();
        req1.open('GET', aReqStr, true);
        req1.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Response = "+this.responseText);
                let strs = this.responseText.split(".")
                if(strs.length == 3){
                    if(strs[0] == "FBRecN" ){
                        LoadLog(strs[1],strs[2]);
                    }
                }
            }
        }
        req1.send();
    }
    //AppendLogTable(dt1,"Проверка добавления в таблицу")
    //LoadLog();
    GetRecByTime (ReqStr)
    return false;
}

function DateToDatePicker(dt){
    return String(dt.getFullYear()+"-"+
                (dt.getMonth()+1).toString().padStart(2, '0')+"-"+
                dt.getDate().toString().padStart(2, '0'))
}

const button = document.getElementsByClassName('set-sub-btn').item(0);

button.onclick=function(){
    button.setAttribute('disabled', '');
    ToID = setTimeout(() => {
        if(button.hasAttribute('disabled')){
            button.removeAttribute('disabled')
        }
    }, 3000);    
    GetEventsLog()
    return false;
};
function SetDefaultPicker(){
    let Tm = new Date();
    document.getElementsByClassName('dstart-input').item(0).value = DateToDatePicker(Tm);
    document.getElementsByClassName('dend-input').item(0).value = DateToDatePicker(Tm);
}
SetDefaultPicker();
LoadLog(undefined,undefined);
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

$('.diagnostics-legend').click(function(event) {
	$('.diagnostics-legend-arrows').toggleClass('diagnostics-legend-arrows-up');
	$('.diagnostics-legend-arrowsDown').toggleClass('diagnostics-legend-arrowsDown-visible');
	$('.filter-block-teh').toggleClass('displaynone2');
	$('.eventlog-filter').toggleClass('displaynone');
});