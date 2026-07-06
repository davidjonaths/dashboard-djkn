require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sipka_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const sampleUnits = ['Bagian Umum','Bidang PKN','Bidang PN','Bidang Penilaian','Bidang Lelang','Bidang KIHI','Jab. Fungsional'];
const sampleEselon = ['Eselon II','Eselon III / Setara','Eselon IV / Setara','Pelaksana / Setara'];
const samplePendidikan = ['S-1 / DIV','S-2 / Magister','Diploma III','SLTA'];
const sampleGenerasi = ['Gen X (1965-1980)','Gen Y (1981-1996)','Gen Z (1997-2012)'];
const sampleGoldar = ['O','A','B','AB'];
const sampleAgama = ['Islam','Kristen','Katolik','Hindu','Buddha'];

function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function makeName(i){
  const first = ['Andi','Budi','Citra','Dewi','Eko','Fajar','Gilang','Hadi','Indra','Joko','Kevin','Lina','Maya','Nina','Oki','Putri','Rani','Sari','Teguh','Uli'];
  const last = ['Pratama','Santoso','Rahman','Setiawan','Prasetyo','Nugraha','Ramadhan','Kusuma','Suryanto','Wijaya','Hakim','Febian','Hidayat','Saputra','Septian','Hidayat'];
  return `${first[i % first.length]} ${last[(i*7) % last.length]}`;
}

function makeNip(i){
  // simple unique NIP
  const base = Date.now().toString().slice(-6);
  return `19${(100+i).toString().slice(-3)}${base}${(i%99).toString().padStart(2,'0')}`;
}

async function seed(count = 50){
  const items = [];
  for(let i=0;i<count;i++){
    items.push([
      makeNip(i),
      makeName(i),
      rand(sampleEselon),
      rand(sampleUnits),
      Math.random() > 0.5 ? 'Laki-Laki' : 'Perempuan',
      rand(samplePendidikan),
      rand(sampleGenerasi),
      rand(sampleGoldar),
      rand(sampleAgama)
    ]);
  }

  const conn = await pool.getConnection();
  try{
    await conn.beginTransaction();
    const placeholders = items.map(()=> '(?,?,?,?,?,?,?,?,?)').join(',');
    const flat = items.flat();
    const sql = `INSERT INTO pegawai (nip,nama,eselon,unit,jk,pendidikan,generasi,goldar,agama) VALUES ${placeholders}`;
    await conn.query(sql, flat);
    await conn.commit();
    console.log(`Inserted ${count} pegawai`);
  }catch(err){
    await conn.rollback();
    console.error('Seed failed:', err.message);
    throw err;
  }finally{
    conn.release();
  }
}

if (require.main === module){
  const n = Number(process.argv[2] || 50);
  seed(n).then(()=> process.exit(0)).catch(()=> process.exit(1));
}

module.exports = { seed };
