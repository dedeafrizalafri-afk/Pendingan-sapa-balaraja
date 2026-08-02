// =========================================
// REFUND DASHBOARD SAPA BALARAJA
// =========================================

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let allData = [];
let chart = null;

async function loadData(){

try{

const response = await fetch(SHEET_URL + "&t=" + Date.now());

const csv = await response.text();

const rows = csv.trim().split(/\r?\n/);

const header = rows[0].split(",");

const idxTanggal = header.indexOf("TGL ORDER");
const idxKode = header.indexOf("KODE TOKO");
const idxNama = header.indexOf("NAMA TOKO");
const idxOrder = header.indexOf("NO ORDE");
const idxQty = header.indexOf("QTY");
const idxCustomer = header.indexOf("NAMA CUSTOMER");
const idxStatus = header.indexOf("PENANGANAN");

allData = [];

for(let i=1;i<rows.length;i++){

const col = rows[i].split(",");

allData.push({

tanggal:col[idxTanggal]||"",

kode:col[idxKode]||"",

nama:col[idxNama]||"",

order:col[idxOrder]||"",

qty:Number(col[idxQty])||0,

customer:col[idxCustomer]||"",

status:col[idxStatus]||""

});

}

isiFilterToko();

filterData();

}catch(e){

console.log(e);

alert("Gagal membaca Google Sheet");

}

}

function isiFilterToko(){

const select=document.getElementById("filterToko");

select.innerHTML='<option value="">Semua</option>';

const toko=[...new Set(allData.map(x=>x.kode))].sort();

toko.forEach(k=>{

select.innerHTML+=`<option value="${k}">${k}</option>`;

});

}
// =========================================
// FILTER + DASHBOARD + TABEL
// =========================================

function filterData(){

const toko=document.getElementById("filterToko").value;
const status=document.getElementById("filterStatus").value;
const cari=document.getElementById("searchInput").value.toLowerCase();

let data=allData.filter(item=>{

if(toko!=="" && item.kode!==toko) return false;

if(status!=="" && item.status.toUpperCase()!=status) return false;

if(cari!=""){

const teks=(item.order+" "+item.customer+" "+item.nama).toLowerCase();

if(!teks.includes(cari)) return false;

}

return true;

});

// DASHBOARD

const totalPending=data.filter(x=>x.status.toUpperCase()=="PENDING").length;

const totalRefund=data.filter(x=>x.status.toUpperCase()=="REFUND").length;

const totalKirim=data.filter(x=>x.status.toUpperCase()=="KIRIM ULANG").length;

const totalQty=data.reduce((a,b)=>a+b.qty,0);

const totalToko=new Set(data.map(x=>x.kode)).size;

document.getElementById("pending").innerHTML=totalPending;

document.getElementById("refund").innerHTML=totalRefund;

document.getElementById("qty").innerHTML=totalQty;

document.getElementById("toko").innerHTML=totalToko;

document.getElementById("lastUpdate").innerHTML="Last Update : "+new Date().toLocaleString("id-ID");

// TABEL

const tbody=document.querySelector("#dataTable tbody");

tbody.innerHTML="";

data.forEach(item=>{

let badge="";

if(item.status.toUpperCase()=="REFUND"){

badge='<span class="status-refund">REFUND</span>';

}else if(item.status.toUpperCase()=="KIRIM ULANG"){

badge='<span class="status-kirim">KIRIM ULANG</span>';

}else{

badge='<span class="status-pending">PENDING</span>';

}

tbody.innerHTML+=`

<tr>

<td>${item.tanggal}</td>

<td>${item.kode}</td>

<td>${item.nama}</td>

<td>${item.order}</td>

<td>${item.customer}</td>

<td>${item.qty}</td>

<td>${badge}</td>

</tr>

`;

});

updateChart(totalPending,totalRefund,totalKirim);

}
// =========================================
// GRAFIK
// =========================================

function updateChart(pending,refund,kirim){

const ctx=document.getElementById("myChart");

if(chart){
chart.destroy();
}

chart=new Chart(ctx,{

type:"bar",

data:{

labels:["Pending","Refund","Kirim Ulang"],

datasets:[{

label:"Jumlah",

data:[pending,refund,kirim],

backgroundColor:[
"#f59e0b",
"#10b981",
"#3b82f6"
],

borderRadius:8

}]

},

options:{

responsive:true,

maintainAspectRatio:false,

plugins:{

legend:{
display:false
}

},

scales:{

y:{
beginAtZero:true
}

}

}

});

}

// =========================================
// EVENT
// =========================================

document.getElementById("btnFilter").addEventListener("click",filterData);

document.getElementById("filterToko").addEventListener("change",filterData);

document.getElementById("filterStatus").addEventListener("change",filterData);

document.getElementById("searchInput").addEventListener("keyup",filterData);

// =========================================
// MENU
// =========================================

document.getElementById("btnDashboard").onclick=function(){

document.getElementById("dashboardPage").style.display="block";

document.getElementById("dataPage").style.display="none";

this.classList.add("active");

document.getElementById("btnData").classList.remove("active");

}

document.getElementById("btnData").onclick=function(){

document.getElementById("dashboardPage").style.display="none";

document.getElementById("dataPage").style.display="block";

this.classList.add("active");

document.getElementById("btnDashboard").classList.remove("active");

}

// =========================================
// LOAD
// =========================================

loadData();
