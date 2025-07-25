const BYTES_IN_MB = 1048576
const BYTES_IN_KB = 1024

const form = document.getElementById('uploadForm')
const fileInput = document.getElementById('uploadForm_File')
const sizeText = document.getElementById('uploadForm_Size')
const statusText = document.getElementById('uploadForm_Status')
const progressBar = document.getElementById('progressBar')
const EspPathInput = document.getElementById('road')
const tablelist = document.getElementById('TableListFiles')

function ClearTable(){
    //let body = tablelist.getElementsByTagName("tbody").item(0);
    while(tablelist.rows.length>1) tablelist.deleteRow(1);
}

function AppendListTable(fname,size,Date){
    let body = tablelist.getElementsByTagName("tbody");
    let newrow =body[0].insertRow(-1);
    let cell = newrow.insertCell(0)
    cell.className ="first-column"
    cell.innerText = fname;
    cell = newrow.insertCell(1)
    cell.className ="second-column"
    cell.innerText = String(size);
    //cell = newrow.insertCell(2)
    //cell.className ="third-column"
    //cell.innerText = Date;
    
}

function SortTable(){
  const th = tablelist.querySelectorAll("th");
  let tbody = tablelist.querySelector("tbody");
  let rows = [...tbody.rows];
  th.forEach((header) => {
    header.addEventListener("click", function () {
      let columnIndex = header.cellIndex;
      let sortDirection =
        header.getAttribute("data-sort-direction") === "asc" ? "desc" : "asc";
      header.setAttribute("data-sort-direction", sortDirection);

      rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent;
        let bValue = b.cells[columnIndex].textContent;

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return bValue > aValue ? 1 : -1;
        }
      });

      tbody.remove();
      tbody = document.createElement("tbody");
      rows.forEach((row) => tbody.appendChild(row));
      tablelist.appendChild(tbody);
    });
  });
}

function sortTable(columnIndex) {
    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("TableListFiles");
    switching = true;

    while (switching) {
      switching = false;
      rows = table.rows;

      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[columnIndex];
        y = rows[i + 1].getElementsByTagName("td")[columnIndex];

        let index = x.innerText.indexOf('/')
        let countx = 0
        while(index !== -1) {
          countx++
          index = x.innerText.indexOf('/', index + 1)
        }
        index = y.innerText.indexOf('/')
        let county = 0
        while(index !== -1) {
          county++
          index = y.innerText.indexOf('/', index + 1)
        }
        if(countx<county){
            shouldSwitch = true;
            break;
        }

        else if(countx===county){

          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
          }
        }
      }

      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}

function GetESPListFiles(cb){
	let xhr = new XMLHttpRequest();
	//xhr.responseType = "arraybuffer";

	xhr.open('GET', '/GetESPListFiles', true);
	xhr.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let str = new String(this.responseText);
      //console.log("Resp length ="+String(buf.byteLength));
      cb(str);
    }
  }
	xhr.onerror =	function(){	
		console.log("GetESPListFiles request error");
	}
	xhr.send();

}


fileInput.addEventListener('change', function () {
  const file = this.files[0]
  if (file.size > 5 * BYTES_IN_MB) {
    alert('Принимается файл до 5 МБ')
    this.value = null
  }
});

form.addEventListener('submit', function (event) {
  event.preventDefault()
  const fileToUpload = fileInput.files[0]
  const formSent = new FormData()
  const xhr = new XMLHttpRequest()

  if (fileInput.files.length > 0) {
    formSent.append('uploadForm_File', fileToUpload)
    
    // собираем запрос и подписываемся на событие progress
    xhr.upload.addEventListener('progress', progressHandler, false)
    xhr.addEventListener('load', loadHandler, false)
    xhr.open('POST', '/upload'+EspPathInput.value)
    xhr.send(formSent)
  } else {
    alert('Сначала выберите файл')
  }
  return false
});

function progressHandler(event) {
  // считаем размер загруженного и процент от полного размера
  const loadedKb = (event.loaded/BYTES_IN_KB).toFixed(2)
  const totalSizeKb = (event.total/BYTES_IN_KB).toFixed(2)
  const percentLoaded = Math.round((event.loaded / event.total) * 100)

  progressBar.value = percentLoaded
  sizeText.textContent = `${loadedKb} из ${totalSizeKb} KБ`
  statusText.textContent = `Загружено ${percentLoaded}% | `
}

function loadHandler(event) {
  statusText.textContent = event.target.responseText
  progressBar.value = 0
}
function FillTableFiles(str){
  ClearTable();
  let arrStrs = String(str).split(";\r\n")
  for(let i=0; i<arrStrs.length; i++){
    if(arrStrs[i] !== ""){
      let PartsFName = arrStrs[i].split('|');
      AppendListTable(PartsFName[0],PartsFName[1],PartsFName[2]);
    }
  }
  sortTable(0);
}

GetESPListFiles(FillTableFiles);  

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
