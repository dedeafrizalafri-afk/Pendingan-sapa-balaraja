const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";


let allData = [];
let chart;


// AMBIL DATA

async function loadData(){

try{

const response = await fetch(SHEET_URL,{
mode:"cors",
cache:"no-cache"
});


const csv = await response.text();


const rows = csv
.replace(/\r/g,"")
.trim()
.split("\n");



const header = rows[0]
.split(",")
.map(x=>x.replace(/"/g,"").trim().toUpperCase());



const idx = {

tanggal: header.indexOf("TGL ORDER"),
kode: header.indexOf("KODE TOKO"),
nama: header.indexOf("NAMA TOKO"),
order: header.indexOf("NO ORDER"),
qty: header.indexOf("QTY"),
customer: header.indexOf("NAMA CUSTOMER"),
status: header.indexOf("PENANGANAN")

};



allData=[];



for(let i=1;i<rows.length;i++){


let c = rows[i]
.split(",")
.map(x=>x.replace(/"/g,"").trim());


allData.push({

tanggal:c[idx.tanggal]||"",
kode:c[idx.kode]||"",
nama:c[idx.nama]||"",
order:c[idx.order]||"",
qty:Number(c[idx.qty])||0,
customer:c[idx.customer]||"",
status:c[idx.status]||""

});


}



console.log("TOTAL DATA:",allData.length);



tampilkan();


}
catch(e){

console.log(e);

alert("Gagal membaca Google Sheet");

}

}




function tampil(){


let pending =
allData.filter(x=>
x.status.toUpperCase()=="PENDING"
).length;



let refund =
allData.filter(x=>
x.status.toUpperCase()=="REFUND"
).length;



let qty =
allData.reduce((a,b)=>a+b.qty,0);



let toko =
new Set(allData.map(x=>x.kode)).size;



document.getElementById("pending").innerHTML=pending;

document.getElementById("refund").innerHTML=refund;

document.getElementById("qty").innerHTML=qty;

document.getElementById("toko").innerHTML=toko;



document.getElementById("lastUpdate").innerHTML =
"Last Update : "+
new Date().toLocaleString("id-ID");





// TABEL


let tbody =
document.querySelector("#dataTable tbody");


if(tbody){

tbody.innerHTML="";


allData.forEach(x=>{


tbody.innerHTML+=`

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





// GRAF
