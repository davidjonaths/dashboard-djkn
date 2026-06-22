import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, TrendingUp, Bell, User, LogOut, Home,
  ArrowUpRight, PlusCircle, PieChart as PieIcon, Lock, UserPlus, Settings, UserCheck, Users, Menu, X,
  Shield, CheckCircle, Target, Info
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

// ==================== [2] DATA UTUH REAL KANWIL SUMUT ====================
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
  const [currentView, setCurrentView] = useState('homepage'); // Set default ke halaman filosofi baru
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  const [databaseUsers, setDatabaseUsers] = useState(() => {
    const savedUsers = localStorage.getItem('djkn_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      { username: 'david', password: 'admin123', name: 'David', role: 'admin', unit: 'Bagian Umum' },
      { username: 'budi', password: 'user123', name: 'Budi', role: 'pegawai', unit: 'Seksi Lelang' }
    ];
  });

  // --- STATE JAM DIGITAL & WAKTU (WIB) ---
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeWIB = (date) => {
    return date.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }) + ' WIB';
  };

  const formatDateID = (date) => {
    return date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      setCurrentView('homepage'); // Redirect langsung ke Beranda Filosofi
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
    setIsMobileMenuOpen(false);
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

  const navigateTo = (view) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  // ==================== VIEW: AUTHENTICATION ====================
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-[#0b1724] font-sans relative overflow-hidden p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-[#051622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/logo-sipka.png" 
                alt="Logo SIPKA" 
                className="h-20 w-auto object-contain mx-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
              />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">SIPKA</h1>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mt-1">Sistem Informasi Pemantauan Kepegawaian & Keuangan Kantor Wilayah DJKN Sumut</p>
          </div>

          {authError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authError}</div>}
          {authSuccess && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authSuccess}</div>}

          {isRegisterMode ? (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div><label className="text-slate-400 block mb-1">Nama Lengkap</label><input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required /></div>
              <div><label className="text-slate-400 block mb-1">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required /></div>
              <div><label className="text-slate-400 block mb-1">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Akses</label>
                  <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 focus:outline-none"><option value="pegawai">Pegawai</option><option value="admin">Admin</option></select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Kerja</label>
                  <select value={authUnit} onChange={(e) => setAuthUnit(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-300 focus:outline-none"><option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option></select>
                </div>
              </div>
              <button type="submit" className="w-full bg-[#D4AF37] text-[#051622] font-black rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"><UserPlus size={16} /> Daftar Akun</button>
              <p className="text-center text-slate-400 mt-4">Sudah punya akun? <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[#D4AF37] font-bold underline ml-1">Login</button></p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div><label className="text-slate-400 block mb-1.5">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required /></div>
              <div><label className="text-slate-400 block mb-1.5">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required /></div>
              <button type="submit" className="w-full bg-[#D4AF37] text-[#051622] font-black rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"><Lock size={16} /> Masuk Ke Sistem</button>
              <p className="text-center text-slate-400 mt-4">Belum punya akun? <button type="button" onClick={() => setIsRegisterMode(true)} className="text-[#D4AF37] font-bold underline ml-1">Registrasi</button></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans relative">
      
      {/* 1. TOP BAR KHUSUS LAYAR SMARTPHONE */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#051622] border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img 
            src="/logo-sipka.png" 
            alt="Logo SIPKA" 
            className="h-8 w-auto object-contain shrink-0" 
          />
          <div>
            <h1 className="font-extrabold text-sm text-[#D4AF37] leading-none">SIPKA SUMUT</h1>
            <p className="text-[9px] text-slate-400 mt-0.5">Sistem Pemantauan Terpadu</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 rounded-xl border border-slate-700 transition"
        >
          {isMobileMenuOpen ? <X size={18} className="text-[#D4AF37]" /> : <Menu size={18} />}
        </button>
      </header>

      {/* OVERLAY BACKGROUND SAAT NAVIGASI MOBILE AKTIF */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* 2. SIDEBAR NAVIGATION */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#051622] text-white flex flex-col justify-between shadow-2xl border-r border-slate-800
        transform transition-transform duration-300 ease-in-out md:sticky md:h-screen md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header Sidebar Desktop */}
          <div className="p-5 border-b border-slate-800 flex items-center gap-4 bg-slate-950/30">
            <img 
              src="/logo-sipka.png" 
              alt="Logo SIPKA" 
              className="h-10 w-auto object-contain shrink-0" 
            />
            <div>
              <h1 className="font-black text-lg leading-tight text-white">SIPKA</h1>
              <p className="text-[9px] text-[#D4AF37] font-bold mt-0.5 tracking-wider">KANWIL SUMUT</p>
            </div>
          </div>

          {/* Tombol Menu Navigasi */}
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => navigateTo('homepage')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'homepage' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <Home size={18} /> Beranda & Filosofi
            </button>
            <button 
              onClick={() => navigateTo('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'dashboard' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <LayoutDashboard size={18} /> Dashboard Keuangan
            </button>
            <button 
              onClick={() => navigateTo('statistik')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'statistik' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <Users size={18} /> Statistik Pegawai
            </button>
            <button 
              onClick={() => navigateTo('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${currentView === 'profile' ? 'bg-[#D4AF37] text-[#051622]' : 'text-slate-400 hover:bg-slate-800/50'}`}
            >
              <Settings size={18} /> Pengaturan Profil
            </button>
          </nav>
        </div>

        {/* Keluar Button */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* 3. AREA KONTEN UTAMA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#0b1724]">
        
        {/* JAM DIGITAL DESKTOP & INFORMASI AKUN */}
        <div className="hidden md:flex justify-between items-center mb-6 bg-[#051622] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div>
            <h2 className="text-sm font-medium text-slate-400">Selamat Datang di SIPKA, <span className="text-[#D4AF37] font-bold">{sessionUser?.name}</span></h2>
            <p className="text-xs text-slate-500 mt-0.5">Unit Kerja: {sessionUser?.unit} ({sessionUser?.role?.toUpperCase()})</p>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono font-bold text-[#D4AF37] tracking-wider">{formatTimeWIB(currentTime)}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">{formatDateID(currentTime)}</div>
          </div>
        </div>

        {/* JAM DIGITAL MOBILE */}
        <div className="md:hidden bg-[#051622] border border-slate-800 rounded-xl p-3 mb-4 flex justify-between items-center shadow-md">
          <div className="text-xs font-semibold text-slate-300">
            {sessionUser?.name} ({sessionUser?.unit})
          </div>
          <div className="text-right font-mono text-xs font-bold text-[#D4AF37]">
            {formatTimeWIB(currentTime)}
          </div>
        </div>

        {/* ==================== VIEW: HOMEPAGE (FILOSOFI BARU) ==================== */}
        {currentView === 'homepage' && (
          <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-fadeIn">
            {/* HERO HERO COMPONENT */}
            <div className="text-center space-y-4">
              <img src="/logo-sipka.png" alt="SIPKA Logo" className="h-36 sm:h-44 w-auto mx-auto drop-shadow-[0_0_30px_rgba(212,175,55,0.25)]" />
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter">SIPKA</h1>
              <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/30 px-4 py-1.5 rounded-full">
                <p className="text-xs sm:text-sm text-[#D4AF37] font-black uppercase tracking-[0.25em]">Sistem Informasi Pemantauan Kepegawaian & Keuangan Kantor Wilayah DJKN Sumut</p>
              </div>
              <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                SIPKA dirancang sebagai platform analitik internal komprehensif guna melakukan pemantauan, pengelolaan akuntabel, serta pengendalian penuh terhadap aspek kepegawaian dan realisasi anggaran DIPA Kanwil.
              </p>
            </div>

            {/* CARD FILOSOFI UTAMA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#051622] border border-slate-800 p-8 rounded-3xl text-center space-y-3 group hover:border-[#D4AF37]/40 transition">
                <div className="w-14 h-14 bg-blue-600/15 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition"><Target size={28}/></div>
                <h3 className="font-black text-lg tracking-wide text-white">PANTAU</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Penyajian akurasi data kepegawaian dan log transaksi secara riil melalui visualisasi dasbor yang intuitif.</p>
              </div>
              <div className="bg-[#051622] border border-slate-800 p-8 rounded-3xl text-center space-y-3 group hover:border-[#D4AF37]/40 transition">
                <div className="w-14 h-14 bg-[#D4AF37]/15 text-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition"><Settings size={28}/></div>
                <h3 className="font-black text-lg tracking-wide text-white">KELOLA</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Efisiensi administrasi internal dalam pencatatan anggaran per bidang, mutasi dana, serta pemutakhiran profile.</p>
              </div>
              <div className="bg-[#051622] border border-slate-800 p-8 rounded-3xl text-center space-y-3 group hover:border-[#D4AF37]/40 transition">
                <div className="w-14 h-14 bg-emerald-600/15 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition"><Shield size={28}/></div>
                <h3 className="font-black text-lg tracking-wide text-white">KENDALIKAN</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Penguatan akuntabilitas pengawasan internal demi memitigasi risiko defisit anggaran dan overhead organisasi.</p>
              </div>
            </div>

            {/* BEDAH FILOSOFI LOGO SIPKA */}
            <div className="bg-[#051622] border border-slate-800 rounded-[2rem] p-6 sm:p-10">
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-white"><Info className="text-[#D4AF37]" size={22}/> Anatomi & Arti Logo SIPKA</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Perisai Luar (Integritas)</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Melambangkan benteng proteksi, kepatuhan internal terhadap regulasi, serta komitmen penuh dalam menjaga keamanan kerahasiaan data.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Tiga Figur Manusia Sinergis</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Merepresentasikan aset utama organisasi (SDM) yang berkolaborasi harmonis antar bidang demi kemajuan Kanwil Sumatera Utara.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Grafik Batang Integral</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Mewakili kinerja keuangan berkelanjutan, pengalokasian DIPA yang presisi, serta penyajian data statistik yang transparan.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Lensa Kaca Pembesar</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Mencerminkan ketelitian, fungsi pengawasan internal (monitoring), serta evaluasi menyeluruh tanpa ada data yang luput.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Panah Akselerasi ke Atas</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Melambangkan pertumbuhan eksponensial efisiensi kerja, peningkatan kualitas layanan publik, dan visi modern masa depan.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-[#D4AF37] font-bold text-xs uppercase tracking-wide">Palet Warna Biru & Emas</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Biru tua melambangkan profesionalisme kedinasan yang kokoh & tepercaya. Emas melambangkan standar kualitas prima dan kesuksesan.</p>
                </div>
              </div>
            </div>

            {/* VISI & MANFAAT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-5 flex flex-col justify-center">
                <h2 className="text-xl font-black text-white">Manfaat Operasional</h2>
                <ul className="space-y-3.5">
                  {[
                    "Konsolidasi data kepegawaian makro dan mikro terpusat",
                    "Pemberantasan disparitas laporan anggaran dengan pencatatan digital real-time",
                    "Kemudahan akses pemantauan grafik untuk menunjang decision making eksekutif",
                    "Sistem otentikasi aman berbasis klasifikasi hak akses Admin dan Pegawai"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                      <CheckCircle size={16} className="text-[#D4AF37] shrink-0 mt-0.5" /> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-center">
                <h3 className="font-bold text-base text-[#D4AF37] mb-2">Pernyataan Tujuan</h3>
                <p className="text-xs leading-relaxed text-slate-300 italic">
                  \"Menjadikan SIPKA sebagai roda penggerak digitalisasi internal Kanwil Sumut yang andal, akurat, dan adaptif guna mempermudah pengawasan aset berharga aparatur sipil negara sekaligus pendayagunaan anggaran secara optimal.\""
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD KEUANGAN */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <div className="text-slate-400 text-xs font-medium">Total Realisasi</div>
                <div className="text-xl font-bold text-white mt-1">Rp 8,2 Miliar</div>
                <div className="text-[10px] text-green-400 mt-1 flex items-center gap-1"><TrendingUp size={12}/> Target Selesai Juni</div>
              </div>
              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <div className="text-slate-400 text-xs font-medium">Jumlah Transaksi</div>
                <div className="text-xl font-bold text-white mt-1">{transaksi.length} Berkas</div>
                <div className="text-[10px] text-slate-400 mt-1">Tercatat di sistem lokal</div>
              </div>
              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <div className="text-slate-400 text-xs font-medium">Status Anggaran</div>
                <div className="text-xl font-bold text-[#D4AF37] mt-1">Optimal</div>
                <div className="text-[10px] text-slate-400 mt-1">Sesuai dengan pagu DIPA</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 tracking-wider uppercase">Tren Realisasi Anggaran (Jutaan Rp)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dataTren}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Area type="monotone" dataKey="Realisasi" stroke="#D4AF37" fillOpacity={0.1} fill="#D4AF37" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 tracking-wider uppercase">Alokasi Per Bidang (Miliar Rp)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataBidang}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                      <Bar dataKey="Rp" fill="#1E3A8A">
                        {dataBidang.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#1E3A8A'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {sessionUser?.role === 'admin' && (
                <div className="bg-[#051622] border border-slate-800 p-5 rounded-2xl shadow-md h-fit">
                  <h3 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2"><PlusCircle size={16} className="text-[#D4AF37]" /> TAMBAH TRANSAKSI BARU</h3>
                  <form onSubmit={handleTambahTransaksi} className="space-y-4 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Uraian Transaksi</label>
                      <input type="text" value={uraianInput} onChange={(e) => setUraianInput(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Contoh: Pembelian ATK Kantor" required />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Nominal Anggaran (Rp)</label>
                      <input type="number" value={nominalInput} onChange={(e) => setNominalInput(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-[#D4AF37]" placeholder="Contoh: 5000000" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-slate-400 block mb-1">Bidang / Unit</label>
                        <select value={bidangInput} onChange={(e) => setBidangInput(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300">
                          <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Jenis Arus</label>
                        <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-slate-300">
                          <option value="keluar">Pengeluaran</option><option value="masuk">Pemasukan</option>
                        </select>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#bda032] text-[#051622] font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                      <PlusCircle size={14}/> Simpan Anggaran
                    </button>
                  </form>
                </div>
              )}

              <div className={`bg-[#051622] border border-slate-800 p-5 rounded-2xl shadow-md ${sessionUser?.role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
                <h3 className="text-xs font-bold text-slate-300 mb-4 tracking-wider uppercase">Log Mutasi Anggaran Terkini</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2.5 font-semibold">Tanggal</th>
                        <th className="py-2.5 font-semibold">Uraian</th>
                        <th className="py-2.5 font-semibold">Bidang</th>
                        <th className="py-2.5 font-semibold text-right">Jumlah (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {transaksi.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-800/20 text-slate-300">
                          <td className="py-3 whitespace-nowrap">{t.date}</td>
                          <td className="py-3 max-w-xs truncate">{t.uraian}</td>
                          <td className="py-3"><span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] border border-slate-700 font-medium">{t.bidang}</span></td>
                          <td className={`py-3 text-right font-semibold ${t.tipe === 'masuk' ? 'text-green-400' : 'text-red-400'}`}>
                            {t.tipe === 'masuk' ? '+' : '-'} {t.jumlah.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: STATISTIK PEGAWAI */}
        {currentView === 'statistik' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Sebaran Pegawai per Unit Kerja</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataStatistikUnit} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                      <YAxis dataKey="unit" type="category" stroke="#94a3b8" fontSize={11} width={100} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Bar dataKey="jumlah" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Profil Berdasarkan Generasi</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dataStatistikGenerasi}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                      <YAxis stroke="#94a3b8" fontSize={11} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                      <Bar dataKey="jumlah" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Proporsi Gender Pegawai</h3>
                <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="w-full h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGender} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                          {dataStatistikGender.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} iconSize={10} style={{ fontSize: '11px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-4 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Sebaran Golongan Darah</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dataStatistikGoldar} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                        {dataStatistikGoldar.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={GOLDAR_COLORS[index % GOLDAR_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconSize={10} style={{ fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#051622] border border-slate-800 p-5 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Tingkat Pendidikan Terakhir</h3>
                <div className="space-y-3 text-xs">
                  {dataStatistikPendidikan.map((p, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-2.5 border border-slate-800/60 rounded-xl">
                      <span className="text-slate-300 font-medium">{p.name}</span>
                      <span className="font-bold text-[#D4AF37]">{p.jumlah} Pegawai</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#051622] border border-slate-800 p-5 rounded-2xl shadow-md">
                <h3 className="text-xs font-bold text-slate-300 mb-4 uppercase tracking-wider">Struktur Eselonering / Jabatan</h3>
                <div className="space-y-3 text-xs">
                  {dataStatistikJabatan.map((j, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-900/50 p-2.5 border border-slate-800/60 rounded-xl">
                      <span className="text-slate-300 font-medium">{j.name}</span>
                      <span className="font-bold text-blue-400">{j.jumlah} Orang</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PENGATURAN PROFIL */}
        {currentView === 'profile' && (
          <div className="p-4 max-w-2xl mx-auto w-full">
            <div className="bg-[#051622] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <Settings className="text-[#D4AF37]" size={24} />
                <h3 className="text-base sm:text-lg font-bold text-white">Manajemen Profil Kredensial</h3>
              </div>
              {profileSuccess && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs text-center font-medium mb-4">
                  {profileSuccess}
                </div>
              )}
              
              <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Nama Lengkap</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Ubah Password</label>
                  <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37]" required />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-2">Asal Bagian / Unit Kerja</label>
                  <select 
                    value={editUnit} 
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-[#D4AF37] text-sm"
                  >
                    <option>Bagian Umum</option>
                    <option>PKN</option>
                    <option>Lelang</option>
                    <option>KIHI</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setCurrentView('dashboard')}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-5 py-3 rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="bg-[#D4AF37] hover:bg-[#AA8811] text-[#051622] font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition shadow-lg shadow-[#D4AF37]/5 text-xs"
                  >
                    <UserCheck size={16} /> Simpan Perubahan Profil
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}