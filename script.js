const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";


let allData = [];
let chart = null;


// ===============================
// AMBIL DATA GOOGLE SHEET
// ===============================

async function loadData(){

try{

const response = await fetch(SHEET_URL);

const csv = await response.text();

      console.log(csv);

const const rows = csv
.replace(/\r/g,"")
.trim()
.split("\n");


const headers = rows[0]
.split(",")
.map(x=>x.trim().replace(/"/g,"").toUpperCase());



console.log("HEADER:",headers);



const idxTanggal = headers.indexOf("TGL ORDER");
const idxKode = headers.indexOf("KODE TOKO");
const idxNama = headers.indexOf("NAMA TOKO");
const idxOrder = headers.indexOf("NO ORDER");
const idxQty = headers.indexOf("QTY");
const idxCustomer = headers.indexOf("NAMA CUSTOMER");
const idxStatus = headers.indexOf("PENANGANAN");



allData=[];



for(let i=1;i<rows.length;i++){


let col =
rows[i]
.split(",")
.map(x=>x.replace(/"/g,"").trim());



if(col.length < 5) continue;



allData.push({

tanggal: col[idxTanggal] || "",

kode: col[idxKode] || "",

nama: col[idxNama] || "",

order: col[idxOrder] || "",

qty: Number(col[idxQty]) || 0,

customer: col[idxCustomer] || "",

status: col[idxStatus] || ""


});


}



console.log("TOTAL DATA:",allData.length);



isiToko();

tampilkanData();


}

catch(error){

console.log(error);

alert("Gagal membaca Google Sheet");

}

}




// ===============================
// ISI FILTER TOKO
// ===============================

function isiToko(){


const select =
document.getElementById("filterToko");


if(!select) return;



let toko =
[...new Set(allData.map(x=>x.kode))]
.filter(x=>x);



select.innerHTML =
`<option value="">Semua Toko</option>`;


toko.forEach(t=>{


select.innerHTML +=
`
<option value="${t}">
${t}
</option>
`;


});


}





// ===============================
// TAMPIL DASHBOARD
// ===============================

function tampilkanData(){


let pending =
allData.filter(x=>

x.status
.toUpperCase()
.includes("PENDING")

).length;



let refund =
allData.filter(x=>

x.status
.toUpperCase()
.includes("REFUND")

).length;



let qty =
allData.reduce(
(a,b)=>a+b.qty,
0
);



let toko =
new Set(
allData.map(x=>x.kode)
).size;



document.getElementById("pending").innerHTML =
pending;


document.getElementById("refund").innerHTML =
refund;


document.getElementById("qty").innerHTML =
qty;


document.getElementById("toko").innerHTML =
toko;



document.getElementById("lastUpdate").innerHTML =
"Last Update : "+
new Date().toLocaleString("id-ID");




// ===============================
// TABEL
// ===============================


const tbody =
document.querySelector("#dataTable tbody");



if(tbody){


tbody.innerHTML="";


allData.forEach(item=>{


tbody.innerHTML +=
`
<tr>

<td>${item.tanggal}</td>

<td>${item.kode}</td>

<td>${item.nama}</td>

<td>${item.order}</td>

<td>${item.customer}</td>

<td>${item.qty}</td>

<td>${item.status}</td>

</tr>
`;



});


}



// ===============================
// GRAFIK
// ===============================


const ctx =
document.getElementById("myChart");



if(ctx){


if(chart){

chart.destroy();

}


chart =
new Chart(ctx,{

type:"bar",

data:{

labels:[
"Pending",
"Refund"
],

datasets:[{

label:"Jumlah",

data:[
pending,
refund
]

}]

}

});


}



}




// START

loadData();
alert("SCRIPT AKTIF");
