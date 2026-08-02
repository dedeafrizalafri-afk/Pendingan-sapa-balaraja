// =====================================
// REFUND DASHBOARD SAPA BALARAJA
// =====================================

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";

let allData = [];
let chart = null;

// =====================================
// LOAD DATA
// =====================================

async function loadData() {

try {

const response = await fetch(SHEET_URL + "&t=" + Date.now());

const text = await response.text();

const rows = text.trim().split(/\r?\n/);

const header =
rows[0]
.replace(/\t/g,",")
.split(",");

const idxTanggal = header.indexOf("TGL ORDER");
const idxKode = header.indexOf("KODE TOKO");
const idxNama = header.indexOf("NAMA TOKO");
const idxOrder = header.indexOf("NO ORDER");
const idxQty = header.indexOf("QTY");
const idxCustomer = header.indexOf("NAMA CUSTOMER");
const idxStatus = header.indexOf("PENANGANAN");

allData = [];

for(let i=1;i<rows.length;i++){

const col =
rows[i]
.replace(/\t/g,",")
.split(",");

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

console.log(allData);

isiFilterToko();

filterData();

}
catch(err){

console.log(err);

alert("Gagal membaca Google Sheet");

}

}
