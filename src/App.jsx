import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, TrendingUp, Bell, User, LogOut,
  ArrowUpRight, PlusCircle, PieChart as PieIcon, Lock, UserPlus, Settings, UserCheck, Users
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// ==================== [1] DATA GRAFIK KEUANGAN (PERSISTEN) ====================
const dataTren = [
  { bulan: 'Jan', Realisasi: 400 }, { bulan: 'Feb', Realisasi: 900 },
  { bulan: 'Mar', Realisasi: 2100 }, { bulan: 'Apr', Realisasi: 4300 },
  { bulan: 'Mei', Realisasi: 6800 }, { bulan: 'Jun', Realisasi: 8200 },
];
const dataBidang = [
  { name: 'Umum', Rp: 3.2 }, { name: 'PKN', Rp: 2.1 },
  { name: 'Lelang', Rp: 1.8 }, { name: 'PN', Rp: 1.5 }, { name: 'KIHI', Rp: 1.1 },
];
const dataProporsi = [
  { name: 'Ops Kantor', value: 40 }, { name: 'Perdis', value: 30 },
  { name: 'Pemeliharaan', value: 15 }, { name: 'Lainnya', value: 15 },
];
const COLORS = ['#D4AF37', '#1E3A8A', '#0F172A', '#94A3B8'];

// ==================== [2] INTEGRASI DATA UTUH REAL EXCEL KANWIL DJKN SUMUT ====================
const dataStatistikUnit = [
  { unit: 'Kakanwil', jumlah: 1 },
  { unit: 'Bagian Umum', jumlah: 10 },
  { unit: 'Bidang PKN', jumlah: 9 },
  { unit: 'Bidang PN', jumlah: 6 },
  { unit: 'Bidang Penilaian', jumlah: 5 },
  { unit: 'Bidang Lelang', jumlah: 6 },
  { unit: 'Bidang KIHI', jumlah: 8 },
  { unit: 'Jab. Fungsional', jumlah: 6 },
];

const dataStatistikGender = [
  { name: 'Laki-Laki', value: 26 },
  { name: 'Perempuan', value: 25 },
];

const dataStatistikJabatan = [
  { name: 'Eselon II', jumlah: 1 },
  { name: 'Eselon III / Setara', jumlah: 6 },
  { name: 'Eselon IV / Setara', jumlah: 18 },
  { name: 'Pelaksana / Setara', jumlah: 26 },
];

const dataStatistikPendidikan = [
  { name: 'S-2 / Magister', jumlah: 16 },
  { name: 'S-1 / DIV', jumlah: 24 },
  { name: 'Diploma III', jumlah: 9 },
  { name: 'Diploma I', jumlah: 1 },
  { name: 'SMA', jumlah: 1 },
];

const dataStatistikGenerasi = [
  { name: 'Gen X (1965-1980)', jumlah: 29 },
  { name: 'Gen Y (1981-1996)', jumlah: 19 },
  { name: 'Gen Z (1997-2012)', jumlah: 3 },
];

const dataStatistikGoldar = [
  { name: 'Golongan A', value: 16 },
  { name: 'Golongan B', value: 14 },
  { name: 'Golongan AB', value: 4 },
  { name: 'Golongan O', value: 17 },
];

const dataStatistikAgama = [
  { name: 'Islam', jumlah: 27 },
  { name: 'Kristen', jumlah: 20 },
  { name: 'Katolik', jumlah: 4 },
];

const GENDER_COLORS = ['#1E3A8A', '#D4AF37'];
const GOLDAR_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B'];
const GENERAL_COLORS = ['#D4AF37', '#1E3A8A', '#475569', '#64748b', '#94A3B8', '#cbd5e1'];

export default function App() {
  // --- STATE NAVIGATION & AUTHENTICATION ---
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  
  const [databaseUsers, setDatabaseUsers] = useState(() => {
    const savedUsers = localStorage.getItem('djkn_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { username: 'david', password: 'admin123', name: 'David', role: 'admin', unit: 'Bagian Umum' },
      { username: 'budi', password: 'user123', name: 'Budi', role: 'pegawai', unit: 'Seksi Lelang' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('djkn_users', JSON.stringify(databaseUsers));
  }, [databaseUsers]);

  useEffect(() => {
    const savedSession = localStorage.getItem('djkn_session');
    if (savedSession) {
      setSessionUser(JSON.parse(savedSession));
      setIsLoggedIn(true);
    }
  }, []);

  // --- STATE INPUT FORM ---
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authRole, setAuthRole] = useState('pegawai');
  const [authUnit, setAuthUnit] = useState('Bagian Umum');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    if (sessionUser) {
      setEditName(sessionUser.name);
      setEditPassword(sessionUser.password);
      setEditUnit(sessionUser.unit);
    }
  }, [currentView, sessionUser]);

  const [transaksi, setTransaksi] = useState(() => {
    const localData = localStorage.getItem('djkn_transaksi');
    return localData ? JSON.parse(localData) : [
      { id: 1, date: '12/06/2026', uraian: 'Perjalanan Dinas Sosialisasi Kekayaan Negara', akun: '524111', bidang: 'PKN', jumlah: 14500000, tipe: 'keluar' },
      { id: 2, date: '14/06/2026', uraian: 'Biaya Adminstrasi Lelang Pengadilan', akun: '425111', bidang: 'Lelang', jumlah: 45200000, tipe: 'masuk' },
    ];
  });

  useEffect(() => {
    localStorage.setItem('djkn_transaksi', JSON.stringify(transaksi));
  }, [transaksi]);

  const [uraianInput, setUraianInput] = useState('');
  const [nominalInput, setNominalInput] = useState('');
  const [bidangInput, setBidangInput] = useState('Bagian Umum');
  const [tipeInput, setTipeInput] = useState('keluar');

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    const isUsernameTaken = databaseUsers.some(
      (user) => user.username.toLowerCase() === authUsername.toLowerCase()
    );

    if (isUsernameTaken) {
      setAuthError('Username sudah terdaftar! Gunakan nama lain.');
      return;
    }

    const userBaru = {
      username: authUsername.trim(),
      password: authPassword,
      name: authName.trim(),
      role: authRole,
      unit: authUnit
    };

    setDatabaseUsers([...databaseUsers, userBaru]);
    setAuthSuccess('Akun berhasil dibuat! Silakan masuk.');
    setAuthName('');
    setAuthUsername('');
    setAuthPassword('');
    setTimeout(() => {
      setIsRegisterMode(false);
      setAuthSuccess('');
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const userDitemukan = databaseUsers.find(
      (u) => u.username.toLowerCase() === authUsername.toLowerCase() && u.password === authPassword
    );

    if (userDitemukan) {
      localStorage.setItem('djkn_session', JSON.stringify(userDitemukan));
      setSessionUser(userDitemukan);
      setIsLoggedIn(true);
      setCurrentView('dashboard');
      setAuthUsername('');
      setAuthPassword('');
    } else {
      setAuthError('Username atau password salah!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('djkn_session');
    setIsLoggedIn(false);
    setSessionUser(null);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccess('');

    const userDiperbarui = {
      ...sessionUser,
      name: editName.trim(),
      password: editPassword,
      unit: editUnit
    };

    setSessionUser(userDiperbarui);
    localStorage.setItem('djkn_session', JSON.stringify(userDiperbarui));

    const updatedDB = databaseUsers.map((user) => 
      user.username.toLowerCase() === sessionUser.username.toLowerCase() ? userDiperbarui : user
    );
    setDatabaseUsers(updatedDB);

    setProfileSuccess('Profil Anda berhasil diperbarui!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleTambahTransaksi = (e) => {
    e.preventDefault();
    if (sessionUser?.role !== 'admin') return alert('Akses ditolak!');
    if (!uraianInput || !nominalInput) return alert('Mohon isi semua data!');

    const tglHariIni = new Date().toLocaleDateString('id-ID');
    const transaksiBaru = {
      id: Date.now(),
      date: tglHariIni,
      uraian: uraianInput,
      akun: tipeInput === 'masuk' ? '425111' : '521111',
      bidang: bidangInput,
      jumlah: parseFloat(nominalInput),
      tipe: tipeInput
    };

    setTransaksi([transaksiBaru, ...transaksi]);
    setUraianInput('');
    setNominalInput('');
  };

  // ==================== VIEW: AUTHENTICATION ====================
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-[#0b1724] font-sans relative overflow-hidden p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[#051622] border border-slate-800 rounded-3xl p-8 shadow-2xl z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-5">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/1/10/Logo_Kementerian_Keuangan_Republik_Indonesia.png" 
                alt="Logo Kemenkeu" 
                className="w-24 h-24 object-contain" 
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide">KANWIL DJKN SUMATERA UTARA</h1>
            <p className="text-xs text-slate-400 mt-1">Sistem Pemantauan Internal Kepegawaian & Keuangan</p>
          </div>

          {authError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authError}</div>}
          {authSuccess && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authSuccess}</div>}

          {isRegisterMode ? (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div><label className="text-slate-400 block mb-1">Nama Lengkap</label><input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
              <div><label className="text-slate-400 block mb-1">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
              <div><label className="text-slate-400 block mb-1">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Akses</label>
                  <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300"><option value="pegawai">Pegawai</option><option value="admin">Admin</option></select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <select value={authUnit} onChange={(e) => setAuthUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300"><option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option></select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#D4AF37] text-[#051622] font-bold rounded-xl py-3 mt-2 flex items-center justify-center gap-2 text-sm"><UserPlus size={16} /> Daftar</button>
              <p className="text-center text-slate-400 mt-4">Sudah punya akun? <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[#D4AF37] font-bold underline ml-1">Login</button></p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 text-xs">
              <div><label className="text-slate-400 block mb-1.5">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
              <div><label className="text-slate-400 block mb-1.5">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
              <button type="submit" className="w-full bg-[#D4AF37] text-[#051622] font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm"><Lock size={16} /> Masuk</button>
              <p className="text-center text-slate-400 mt-4">Belum punya akun? <button type="button" onClick={() => setIsRegisterMode(true)} className="text-[#D4AF37] font-bold underline ml-1">Registrasi</button></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#051622] text-white flex flex-col justify-between shadow-2xl border-r border-slate-800">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-4 bg-slate-950/30">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/1/10/Logo_Kementerian_Keuangan_Republik_Indonesia.png" 
              alt="Logo Kemenkeu" 
              className="w-10 h-10 object-contain" 
              referrerPolicy="no-referrer"
            />
            <div>
              <h1 className="font-extrabold text-sm leading-tight text-[#D4AF37]">DJKN SUMUT</h1>
              <p className="text-[10px] text-slate-400 mt-0.5">Sistem Monitoring Internal</p>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            <button onClick={() => setCurrentView('dashboard')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'dashboard' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}><LayoutDashboard size={18} /> Dashboard Keuangan</button>
            <button onClick={() => setCurrentView('statistik')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'statistik' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}><Users size={18} /> Statistik Pegawai</button>
            <button onClick={() => setCurrentView('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'profile' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}><Settings size={18} /> Pengaturan Profil</button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-xs font-semibold">
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* AREA UTAMA */}
      <main className="flex-1 flex flex-col overflow-y-auto bg-[#0b1724]">
        
        {/* HEADER */}
        <header className="bg-[#051622]/80 backdrop-blur-md border-b border-slate-800 px-8 py-5 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentView === 'dashboard' && <>Dashboard <span className="text-[#D4AF37]">Kinerja Keuangan</span></>}
              {currentView === 'statistik' && <>Statistik <span className="text-[#D4AF37]">Kepegawaian Rill</span></>}
              {currentView === 'profile' && <>Pengaturan <span className="text-[#D4AF37]">Profil</span></>}
            </h2>
          </div>
          <div className="flex items-center gap-3 bg-slate-800/40 border border-slate-800 px-4 py-2 rounded-2xl text-xs">
            <div className="text-right">
              <p className="font-bold text-slate-200">{sessionUser?.name}</p>
              <p className="text-[10px] uppercase text-[#D4AF37] font-bold">{sessionUser?.role} • {sessionUser?.unit}</p>
            </div>
          </div>
        </header>

        {/* LOGIKA SUB VIEW */}
        {currentView === 'dashboard' && (
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-6 shadow-xl"><p className="text-xs font-semibold uppercase text-slate-400">Pagu DIPA 2026</p><h3 className="text-2xl font-extrabold text-white mt-1">Rp 12,8 M</h3></div>
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-6 shadow-xl"><p className="text-xs font-semibold uppercase text-slate-400">Total Realisasi</p><h3 className="text-2xl font-extrabold text-white mt-1">Rp 8,2 M</h3></div>
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-6 shadow-xl"><p className="text-xs font-semibold uppercase text-slate-400">Sisa Anggaran</p><h3 className="text-2xl font-extrabold text-red-400 mt-1">Rp 4,6 M</h3></div>
              <div className="bg-gradient-to-br from-[#051622] to-slate-800 border border-[#D4AF37]/30 rounded-2xl p-6 shadow-2xl"><p className="text-xs font-semibold uppercase text-slate-300">Capaian PNBP</p><h3 className="text-2xl font-extrabold text-[#D4AF37] mt-1">87.4%</h3></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className={`bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl ${sessionUser?.role !== 'admin' ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
                <h4 className="font-bold text-base text-white mb-4 flex items-center gap-2"><TrendingUp size={16} className="text-[#D4AF37]" /> Tren Kumulatif Penyerapan Anggaran</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataTren}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="bulan" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#051622', borderColor: '#334155', color: '#fff' }} />
                      <Area type="monotone" dataKey="Realisasi" stroke="#D4AF37" strokeWidth={3} fill="#D4AF37" fillOpacity={0.05} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {sessionUser?.role === 'admin' && (
                <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h4 className="font-bold text-base text-white mb-4">Input Keuangan Kantor</h4>
                  <form onSubmit={handleTambahTransaksi} className="space-y-4 text-xs">
                    <input type="text" value={uraianInput} onChange={(e) => setUraianInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none" placeholder="Uraian Kegiatan..." required />
                    <div className="grid grid-cols-2 gap-3">
                      <select value={bidangInput} onChange={(e) => setBidangInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300"><option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option></select>
                      <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-slate-300"><option value="keluar">Pengeluaran</option><option value="masuk">PNBP</option></select>
                    </div>
                    <input type="number" value={nominalInput} onChange={(e) => setNominalInput(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none" placeholder="Nominal (Rp)..." required />
                    <button type="submit" className="w-full bg-[#D4AF37] text-[#051622] font-bold rounded-xl py-3 flex items-center justify-center gap-2"><PlusCircle size={16} /> Simpan Data Anggaran</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'statistik' && (
          <div className="p-8 space-y-8 animate-fadeIn">
            
            {/* CARD KPI TOTAL RINGKAS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-semibold uppercase text-slate-400">Total Pegawai Aktif</p>
                <h3 className="text-3xl font-extrabold text-[#D4AF37] mt-1">51 Pegawai</h3>
              </div>
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-semibold uppercase text-slate-400">Pegawai Laki-Laki</p>
                <h3 className="text-2xl font-bold text-blue-400 mt-1">26 Orang</h3>
              </div>
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-semibold uppercase text-slate-400">Pegawai Perempuan</p>
                <h3 className="text-2xl font-bold text-amber-400 mt-1">25 Orang</h3>
              </div>
              <div className="bg-[#051622] border border-slate-800 rounded-2xl p-5 shadow-xl">
                <p className="text-xs font-semibold uppercase text-slate-400">Pendidikan S1/S2</p>
                <h3 className="text-2xl font-bold text-emerald-400 mt-1">40 Orang</h3>
              </div>
            </div>

            {/* BAR CHART SEBARAN UNIT KERJA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl lg:col-span-1">
                <h4 className="font-bold text-base text-white mb-3">Tabel Unit Kerja</h4>
                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#0b1724] text-slate-400 uppercase tracking-wider font-semibold">
                      <tr><th className="px-3 py-2">Unit Kerja</th><th className="px-3 py-2 text-right">Jumlah</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {dataStatistikUnit.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/20">
                          <td className="px-3 py-2 font-medium">{item.unit}</td>
                          <td className="px-3 py-2 text-right font-bold text-[#D4AF37]">{item.jumlah}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl lg:col-span-2">
                <h4 className="font-bold text-base text-white mb-4">Grafik Distribusi Pegawai Per Bidang/Unit</h4>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataStatistikUnit} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                      <XAxis dataKey="unit" stroke="#64748b" fontSize={10} angle={-15} textAnchor="end" height={50} />
                      <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#051622', borderColor: '#334155', color: '#fff' }} />
                      <Bar dataKey="jumlah" fill="#1E3A8A" radius={[4, 4, 0, 0]}>
                        {dataStatistikUnit.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#D4AF37' : '#1E3A8A'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* DEMOGRAFI GENDER, TINGKAT JABATAN, PENDIDIKAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Jenis Kelamin */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <h4 className="font-bold text-base text-white mb-2">Komposisi Gender</h4>
                <div className="flex flex-col items-center justify-center py-2">
                  <div className="w-32 h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGender} innerRadius={45} outerRadius={60} paddingAngle={4} dataKey="value">
                          {dataStatistikGender.map((entry, index) => <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full space-y-2 text-xs">
                    {dataStatistikGender.map((entry, index) => (
                      <div key={entry.name} className="flex items-center justify-between bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400">{entry.name}</span>
                        <span className="font-bold text-white">{entry.value} Orang ({((entry.value/51)*100).toFixed(1)}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tingkat Eselon */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Sebaran Eselon / Tingkat Jabatan</h4>
                  <p className="text-xs text-slate-400 mb-4">Struktural & Pelaksana</p>
                </div>
                <div className="space-y-3 text-xs">
                  {dataStatistikJabatan.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-300 font-medium">
                        <span>{item.name}</span>
                        <span className="font-bold text-[#D4AF37]">{item.jumlah}</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: `${(item.jumlah / 51) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Jenjang Pendidikan */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base text-white mb-1">Kualifikasi Pendidikan</h4>
                  <p className="text-xs text-slate-400 mb-2">Tingkat akademik terakhir</p>
                </div>
                <div className="w-full h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={dataStatistikPendidikan} margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                      <XAxis type="number" stroke="#64748b" fontSize={10} allowDecimals={false} />
                      <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#051622', borderColor: '#334155' }} />
                      <Bar dataKey="jumlah" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* SEKSI BARU: KARAKTERISTIK GENERASI, GOLONGAN DARAH & AGAMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Demografi Generasi */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h4 className="font-bold text-base text-white mb-3">Distribusi Generasi Umur</h4>
                <div className="space-y-3 text-xs">
                  {dataStatistikGenerasi.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>{item.name}</span>
                        <span className="font-bold text-blue-400">{item.jumlah} Pegawai</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(item.jumlah / 51) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Golongan Darah */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h4 className="font-bold text-base text-white mb-2">Sebaran Golongan Darah</h4>
                <div className="flex items-center justify-around h-36">
                  <div className="w-24 h-24">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGoldar} innerRadius={25} outerRadius={40} paddingAngle={3} dataKey="value">
                          {dataStatistikGoldar.map((entry, index) => <Cell key={`cell-${index}`} fill={GOLDAR_COLORS[index]} />)}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1 text-xs">
                    {dataStatistikGoldar.map((entry, index) => (
                      <div key={entry.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: GOLDAR_COLORS[index] }}></div>
                        <span className="text-slate-400">{entry.name}: <strong>{entry.value}</strong></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agama */}
              <div className="bg-[#051622] border border-slate-800 p-6 rounded-2xl shadow-xl">
                <h4 className="font-bold text-base text-white mb-4">Profil Keragaman Agama</h4>
                <div className="w-full h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataStatistikAgama}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#051622', borderColor: '#334155' }} />
                      <Bar dataKey="jumlah" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="p-8 max-w-2xl mx-auto w-full">
            <div className="bg-[#051622] border border-slate-800 rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <Settings className="text-[#D4AF37]" size={24} />
                <h3 className="text-lg font-bold text-white">Manajemen Profil Kredensial</h3>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                <div><label className="text-slate-400 block mb-1">Nama Lengkap</label><input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
                <div><label className="text-slate-400 block mb-1">Ubah Password</label><input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none" required /></div>
                <button type="submit" className="bg-[#D4AF37] text-[#051622] font-bold px-6 py-3 rounded-xl transition">Simpan Profil</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}