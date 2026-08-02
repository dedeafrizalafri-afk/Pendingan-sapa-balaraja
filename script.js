const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vS169Srv3rdFs6JAfzotcL9qklXPh0AKi6jt-2ROYDlYSKtdDJy2KQ0znqTfHF_IVCtLJjyXXdbnLbm/pub?gid=463015523&single=true&output=csv";


async function loadData(){

try{

const response = await fetch(SHEET_URL);

const csv = await response.text();

console.log("CSV MASUK:");
console.log(csv.substring(0,500));


const rows = csv.split("\n");


console.log("JUMLAH BARIS:", rows.length);


const header = rows[0];

console.log("HEADER:", header);


alert("Google Sheet berhasil terbaca");


}

catch(error){

console.error(error);

alert("Gagal membaca Google Sheet");

}

}


loadData();
