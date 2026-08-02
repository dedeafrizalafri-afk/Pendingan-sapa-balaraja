// ======================================
// REFUND DASHBOARD SAPA BALARAJA
// ======================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";


let allData = [];


// ======================================
// AMBIL DATA GOOGLE SHEET
// ======================================

async function loadData(){

try{


const response = await fetch(
SHEET_URL,
{
method:"GET",
mode:"cors",
cache:"no-cache"
}
);



if(!response.ok){

throw new Error(
"Status Google Sheet : " + response.status
);

}



const csv = await response.text();


console.log("CSV MASUK");
console.log(csv.substring(0,500));



const rows = csv
.replace(/\r/g,"")
.trim()
.split("\n");



const header = rows[0]
.split(",")
.map(x=>x.replace(/"/g,"").trim());



console.log("HEADER:",header);



const tanggal = header.indexOf("TGL ORDER");
const kode = header.indexOf("KODE TOKO");
const nama = header.indexOf("NAMA TOKO");
const order = header.indexOf("NO ORDER");
const qty = header.indexOf("QTY");
const customer = header.indexOf("NAMA CUSTOMER");
const status = header.indexOf("PENANGANAN");



allData=[];



for(let i=1;i<rows.length;i++){


let col = rows[i]
.split(",")
.map(x=>x.replace(/"/g,"").trim());



if(col.length<5) continue;



allData.push({

tanggal:col[tanggal] || "",

kode:col[kode] || "",

nama:col[nama] || "",

order:col[order] || "",

qty:Number(col[qty]) || 0,

customer:col[customer] || "",

status:col[status] || ""

});


}



console.log(
"TOTAL DATA:",
allData.length
);



tampilDashboard();

tampilTabel();



}

catch(error){

console.error(
"ERROR:",
error
);


alert(
"Gagal membaca Google Sheet\n\n" +
error.message
);


}

}





// ======================================
// DASHBOARD
// ======================================

function tampilDashboard(){


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



let totalQty =
allData.reduce(
(a,b)=>a+b.qty,
0
);



let totalToko =
new Set(
allData.map(x=>x.kode)
).size;



document.getElementById("pending").innerHTML =
pending;


document.getElementById("refund").innerHTML =
refund;


document.getElementById("qty").innerHTML =
totalQty;


document.getElementById("toko").innerHTML =
totalToko;


document.getElementById("lastUpdate").innerHTML =
"Last Update : "+
new Date().toLocaleString("id-ID");


}





// ======================================
// TABEL
// ======================================

function tampilTabel(){


const tbody =
document.querySelector("#dataTable tbody");


if(!tbody) return;



tbody.innerHTML="";



allData.forEach(x=>{


tbody.innerHTML +=

`
<tr>

<td>${x.tanggal}</td>

<td>${x.kode}</td>

<td>${x.nama}</td>

<td>${x.order}</td>

<td>${x.customer}</td>

<td>${x.qty}</td>

<td>${x.status}</td>

</tr>
`;



});


}




// ======================================
// SEARCH
// ======================================

let search =
document.getElementById("searchInput");


if(search){


search.addEventListener(
"keyup",
function(){


let key =
this.value.toLowerCase();



document
.querySelectorAll("#dataTable tbody tr")
.forEach(row=>{


row.style.display =

row.innerText
.toLowerCase()
.includes(key)

?
""
:
"none";


});


});

}





// ======================================
// MULAI
// ======================================

loadData();
