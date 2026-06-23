import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, TrendingUp, Bell, User, LogOut, Home,
  ArrowUpRight, PlusCircle, PieChart as PieIcon, Lock, UserPlus, Settings, UserCheck, Users, Menu, X,
  Shield, CheckCircle, Target, Info, MapPin, Mail
} from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';
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
  const [currentView, setCurrentView] = useState('homepage'); 
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
      setCurrentView('homepage'); 
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

  const navigateTo = (view) => {
    setCurrentView(view);
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

  // ==================== VIEW: AUTHENTICATION ====================
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#0b1724] to-[#020617] font-sans relative overflow-hidden p-4">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="w-full max-w-md bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img 
                src="/SIPKA-logo.png" 
                alt="Logo SIPKA" 
                className="h-20 w-auto object-contain mx-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.15)]" 
              />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">SIPKA</h1>
            <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-[0.2em] mt-1">Sistem Informasi Pemantauan Kepegawaian & Keuangan</p>
          </div>

          {authError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authError}</div>}
          {authSuccess && <div className="bg-green-500/10 border border-green-500/30 text-green-400 p-3 rounded-xl text-xs text-center font-medium mb-4">{authSuccess}</div>}

          {isRegisterMode ? (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div><label className="text-slate-600 block mb-1">Nama Lengkap</label><input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" required /></div>
              <div><label className="text-slate-600 block mb-1">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" required /></div>
              <div><label className="text-slate-600 block mb-1">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Akses</label>
                  <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-300 focus:outline-none transition"><option value="pegawai">Pegawai</option><option value="admin">Admin</option></select>
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Unit Kerja</label>
                  <select value={authUnit} onChange={(e) => setAuthUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-300 focus:outline-none transition"><option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option></select>
                </div>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 text-sm uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-lg shadow-[#D4AF37]/20"><UserPlus size={16} /> Daftar Akun</button>
              <p className="text-center text-slate-600 mt-4">Sudah punya akun? <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[#D4AF37] font-bold underline ml-1">Login</button></p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div><label className="text-slate-600 block mb-1.5">Username</label><input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" required /></div>
              <div><label className="text-slate-600 block mb-1.5">Password</label><input type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" required /></div>
              <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black rounded-xl py-3.5 flex items-center justify-center gap-2 text-sm uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-lg shadow-[#D4AF37]/20"><Lock size={16} /> Masuk Ke Sistem</button>
              <p className="text-center text-slate-600 mt-4">Belum punya akun? <button type="button" onClick={() => setIsRegisterMode(true)} className="text-[#D4AF37] font-bold underline ml-1">Registrasi</button></p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans relative">
      
      {/* 1. TOP BAR KHUSUS LAYAR SMARTPHONE */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src="/SIPKA-logo.png" 
            alt="Logo SIPKA" 
            className="h-8 w-auto object-contain shrink-0" 
          />
          <div>
            <h1 className="font-extrabold text-sm text-[#D4AF37] leading-none">SIPKA SUMUT</h1>
            <p className="text-[9px] text-slate-600 mt-0.5">Sistem Pemantauan Terpadu</p>
          </div>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-slate-600 hover:text-white bg-slate-100 rounded-xl border border-slate-200 transition"
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
        fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-white flex flex-col justify-between shadow-[10px_0_30px_rgba(15,23,42,0.08)] border-r border-slate-200
        transform transition-transform duration-300 ease-in-out md:sticky md:h-screen md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Header Sidebar Desktop */}
          <div className="p-5 border-b border-slate-200 flex items-center gap-4 bg-slate-50 backdrop-blur-sm">
            <img 
              src="/SIPKA-logo.png" 
              alt="Logo SIPKA" 
              className="h-10 w-auto object-contain shrink-0" 
            />
            <div>
              <h1 className="font-black text-lg leading-tight text-slate-900">SIPKA</h1>
              <p className="text-[9px] text-[#D4AF37] font-bold mt-0.5 tracking-wider">KANWIL SUMUT</p>
            </div>
          </div>

          {/* Tombol Menu Navigasi */}
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => navigateTo('homepage')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'homepage' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-white'}`}
            >
              <Home size={18} /> Beranda & Filosofi
            </button>
            <button 
              onClick={() => navigateTo('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'dashboard' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-white'}`}
            >
              <LayoutDashboard size={18} /> Dashboard Keuangan
            </button>
            <button 
              onClick={() => navigateTo('statistik')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'statistik' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-white'}`}
            >
              <Users size={18} /> Statistik Pegawai
            </button>
            <button 
              onClick={() => navigateTo('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'profile' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-white'}`}
            >
              <Settings size={18} /> Pengaturan Profil
            </button>
          </nav>
        </div>

        {/* Keluar Button */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* 3. AREA KONTEN UTAMA */}
      <main className="flex-1 overflow-y-auto bg-slate-100">
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          {/* JAM DIGITAL DESKTOP & INFORMASI AKUN */}
          <div className="hidden md:flex justify-between items-center mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div>
              <h2 className="text-sm font-medium text-slate-600">Selamat Datang di SIPKA, <span className="text-[#D4AF37] font-bold">{sessionUser?.name}</span></h2>
              <p className="text-xs text-slate-600 mt-0.5">Unit Kerja: {sessionUser?.unit} ({sessionUser?.role?.toUpperCase()})</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold text-[#D4AF37] tracking-wider">{formatTimeWIB(currentTime)}</div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">{formatDateID(currentTime)}</div>
            </div>
          </div>

          {/* JAM DIGITAL MOBILE */}
          <div className="md:hidden bg-white border border-slate-200 rounded-xl p-3 mb-4 flex justify-between items-center shadow-sm">
            <div className="text-xs font-semibold text-slate-700">
              {sessionUser?.name} ({sessionUser?.unit})
            </div>
            <div className="text-right font-mono text-xs font-bold text-[#D4AF37]">
              {formatTimeWIB(currentTime)}
            </div>
          </div>

          {/* ==================== VIEW: HOMEPAGE ==================== */}
          {currentView === 'homepage' && (
            <div className="max-w-6xl mx-auto space-y-12 pb-12 animate-fadeIn">
              <div className="text-center space-y-3">
                <div className="inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-4 py-1 rounded-full backdrop-blur-sm">
                  <span className="text-[11px] text-[#D4AF37] font-extrabold uppercase tracking-[0.3em]">Profil Aplikasi Internal</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-navy tracking-tight drop-shadow-md">BRANDING & FILOSOFI</h1>
                <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                  Instrumen transformasi digital pendayagunaan aparatur sipil negara dan pengelolaan anggaran DIPA secara transparan.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-xl border border-slate-700/40 rounded-[2rem] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-[80px] pointer-events-none"></div>
                
                <div className="lg:col-span-5 flex flex-col items-center justify-center text-center p-6 bg-white border border-slate-200 rounded-2xl sticky top-6 shadow-sm">
                  <img 
                    src="/SIPKA-logo.png" 
                    alt="SIPKA Logo" 
                    className="h-44 sm:h-56 w-auto object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.18)] animate-pulse" 
                  />
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-6">SIPKA</h2>
                  <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-3 rounded-full"></div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed px-4">
                    Sistem Informasi Pemantauan Kepegawaian & Keuangan
                  </p>
                </div>

                <div className="lg:col-span-7 space-y-4 relative z-10">
                  <h3 className="text-xs font-black text-[#D4AF37] tracking-[0.2em] uppercase mb-4 flex items-center gap-2 drop-shadow-sm">
                    <Info size={14}/> Bedah Anatomi Komponen Logo
                  </h3>
                  
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/perisai.png" alt="Perisai" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Perisai Luar (Integritas)</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Melambangkan benteng proteksi sistem pengawasan, kepatuhan terhadap hukum, serta komitmen penuh menjaga kerahasiaan data.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/tiga-manusia.png" alt="Tiga Manusia" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Tiga Figur Manusia Sinergis</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Merepresentasikan Sumber Daya Manusia (SDM) sebagai pilar utama organisasi yang berkolaborasi harmonis antar-seksi.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/grafik.png" alt="Grafik Batang" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Grafik Batang Akuntabel</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Mewakili visualisasi data realisasi keuangan DIPA yang akurat, transparan, serta performa kinerja berkala yang terukur.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/kaca-pembesar.png" alt="Kaca Pembesar" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Lensa Kaca Pembesar (Monitoring)</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Mencerminkan fungsi pemantauan yang tajam, ketelitian, serta ketepatan evaluasi internal terhadap data makro organisasi.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/panah.png" alt="Panah Ke Atas" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Panah Akselerasi Ke Atas</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Melambangkan pertumbuhan produktivitas efisiensi kerja, akselerasi pelayanan publik, serta arah pandang ke masa depan.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/50 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md">
                    <div className="bg-slate-100 border border-slate-200 p-2.5 rounded-xl shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                      <img src="/warna.png" alt="Warna Filosofi" className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors">Kombinasi Biru & Emas Corporate</h4>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">Warna Biru melambangkan profesionalisme kedinasan dan kepercayaan publik. Warna Emas melambangkan kemewahan mutu pelayanan tinggi.</p>
                    </div>
                  </div>

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl flex flex-col justify-center space-y-4 shadow-xl">
                  <h3 className="text-base font-black text-white flex items-center gap-2"><Target size={18} className="text-[#D4AF37]"/> Pernyataan Visi Sistem</h3>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "Menjadikan SIPKA sarana integrasi digital penunjang keputusan eksekutif yang adaptif dalam memonitoring kapabilitas aparatur sipil negara sekaligus optimalisasi realisasi DIPA secara presisi."
                  </p>
                </div>
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl space-y-3 shadow-xl">
                  <h3 className="text-base font-black text-white">Output Manfaat Operasional</h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#D4AF37]"/> Reduksi kesalahan kalkulasi rekap log mutasi manual</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#D4AF37]"/> Transparansi visualisasi grafik komparasi per bidang</li>
                    <li className="flex items-center gap-2"><CheckCircle size={14} className="text-[#D4AF37]"/> Fleksibilitas pemantauan jam kerja terpusat via smartphone</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DASHBOARD KEUANGAN */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
                  <div className="text-slate-300 text-xs font-medium">Total Realisasi</div>
<div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">
  Rp 8,2 Miliar
</div>
                  <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold"><TrendingUp size={12}/> Target Selesai Juni</div>
                </div>
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
                  <div className="text-slate-300 text-xs font-medium">Jumlah Transaksi</div>
<div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">
  {transaksi.length} Berkas
</div>
                  <div className="text-[10px] text-white mt-2 font-medium">Tercatat di sistem lokal</div>
                </div>
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1">
                  <div className="text-slate-300 text-xs font-medium">Status Anggaran</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">Optimal</div>
                  <div className="text-[10px] text-white mt-2 font-medium">Sesuai dengan pagu DIPA</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 tracking-widest uppercase">Tren Realisasi Anggaran (Jutaan Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataTren}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#D4AF37' }} />
                        <Area type="monotone" dataKey="Realisasi" stroke="#D4AF37" strokeWidth={3} fillOpacity={0.15} fill="#D4AF37" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 tracking-widest uppercase">Alokasi Per Bidang (Miliar Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataBidang}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} />
                        <Bar dataKey="Rp" radius={[4, 4, 0, 0]}>
                          {dataBidang.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {sessionUser?.role === 'admin' && (
                  <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl h-fit">
                    <h3 className="text-xs font-black text-white mb-5 flex items-center gap-2"><PlusCircle size={16} className="text-[#D4AF37]" /> TAMBAH TRANSAKSI BARU</h3>
                    <form onSubmit={handleTambahTransaksi} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">Uraian Transaksi</label>
                        <input type="text" value={uraianInput} onChange={(e) => setUraianInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" placeholder="Contoh: Pembelian ATK Kantor" required />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">Nominal Anggaran (Rp)</label>
                        <input type="number" value={nominalInput} onChange={(e) => setNominalInput(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-white focus:outline-none focus:border-[#D4AF37] transition" placeholder="Contoh: 5000000" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 block mb-1.5 font-medium">Bidang / Unit</label>
                          <select value={bidangInput} onChange={(e) => setBidangInput(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none transition">
                            <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-300 block mb-1.5 font-medium">Jenis Arus</label>
                          <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3 text-slate-200 focus:outline-none transition">
                            <option value="keluar">Pengeluaran</option><option value="masuk">Pemasukan</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 mt-2 rounded-xl transition-transform hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2">
                        <PlusCircle size={14}/> Simpan Anggaran
                      </button>
                    </form>
                  </div>
                )}

                <div className={`bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl ${sessionUser?.role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
                  <h3 className="text-xs font-black text-white mb-5 tracking-widest uppercase">Log Mutasi Anggaran Terkini</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-700 text-slate-300">
                          <th className="py-3 font-bold">Tanggal</th>
                          <th className="py-3 font-bold">Uraian</th>
                          <th className="py-3 font-bold">Bidang</th>
                          <th className="py-3 font-bold text-right">Jumlah (Rp)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {transaksi.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-800/40 text-slate-200 transition-colors">
                            <td className="py-3.5 whitespace-nowrap">{t.date}</td>
                            <td className="py-3.5 max-w-xs truncate pr-4">{t.uraian}</td>
                            <td className="py-3.5"><span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-600 text-[10px] font-semibold">{t.bidang}</span></td>
                            <td className={`py-3.5 text-right font-bold ${t.tipe === 'masuk' ? 'text-emerald-400' : 'text-rose-400'}`}>
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
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Sebaran Pegawai per Unit Kerja</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikUnit} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis dataKey="unit" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="jumlah" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Profil Berdasarkan Generasi</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikGenerasi}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Proporsi Gender Pegawai</h3>
                  <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="w-full h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataStatistikGender} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                            {dataStatistikGender.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}/>
                          <Legend verticalAlign="bottom" height={36} iconSize={10} style={{ fontSize: '11px', color: '#cbd5e1' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Sebaran Golongan Darah</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGoldar} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                          {dataStatistikGoldar.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={GOLDAR_COLORS[index % GOLDAR_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}/>
                        <Legend verticalAlign="bottom" height={36} iconSize={10} style={{ fontSize: '11px', color: '#cbd5e1' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-slate-200 mb-5 uppercase tracking-widest">Tingkat Pendidikan Terakhir</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikPendidikan.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                        <span className="text-slate-200 font-medium">{p.name}</span>
                        <span className="font-bold text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 rounded-md">{p.jumlah} Pegawai</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-xs font-black text-slate-200 mb-5 uppercase tracking-widest">Struktur Eselonering / Jabatan</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikJabatan.map((j, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                        <span className="text-slate-200 font-medium">{j.name}</span>
                        <span className="font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded-md">{j.jumlah} Orang</span>
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
              <div className="bg-gradient-to-br from-[#1e293b]/60 to-[#0f172a]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700/60 pb-5">
                  <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                    <Settings className="text-[#D4AF37]" size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">Manajemen Profil Kredensial</h3>
                </div>
                {profileSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-3.5 rounded-xl text-xs text-center font-bold mb-5 shadow-sm">
                    {profileSuccess}
                  </div>
                )}
                
                <form onSubmit={handleSaveProfile} className="space-y-5 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Nama Lengkap</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition" required />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Ubah Password</label>
                    <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-white focus:outline-none focus:border-[#D4AF37] transition" required />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1.5">Asal Bagian / Unit Kerja</label>
                    <select 
                      value={editUnit} 
                      onChange={(e) => setEditUnit(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-3.5 text-slate-200 focus:outline-none focus:border-[#D4AF37] transition text-sm cursor-pointer"
                    >
                      <option>Bagian Umum</option>
                      <option>PKN</option>
                      <option>Lelang</option>
                      <option>KIHI</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-slate-700/60 flex items-center justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setCurrentView('dashboard')}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20 text-xs"
                    >
                      <UserCheck size={16} /> Simpan Perubahan Profil
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 rounded-t-[2.5rem] px-8 py-12 mt-12 shadow-[0_-10px_35px_rgba(15,23,42,0.06)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/SIPKA-logo.png" className="h-10 w-auto drop-shadow-md" alt="SIPKA" />
                <h2 className="text-2xl font-black text-white tracking-tight">SIPKA</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pr-4">
                Sistem Informasi Pemantauan Kepegawaian & Keuangan Kanwil DJKN Sumatera Utara.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase drop-shadow-sm">Kontak</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#D4AF37]/20 transition-colors"><MapPin size={14} className="text-[#D4AF37]" /></div>
                  <span className="leading-relaxed">Gedung Keuangan Negara (GKN) Medan<br/>Jl. Pangeran Diponegoro No.30-A</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-[#D4AF37]/20 transition-colors"><Mail size={14} className="text-[#D4AF37]" /></div>
                  <span>kanwil.sumut@kemenkeu.go.id</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase drop-shadow-sm">Media Sosial</h3>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/djknkanwilsumut/?hl=en" target="_blank" rel="noreferrer" className="p-3 bg-slate-900 border border-slate-700 rounded-full hover:border-pink-500 hover:scale-110 transition-all duration-300 group shadow-md">
                  <SiInstagram size={20} className="text-slate-600 group-hover:text-pink-500 transition-colors" />
                </a>
                <a href="https://www.facebook.com/kanwildjknsumut/?locale=id_ID" target="_blank" rel="noreferrer" className="p-3 bg-slate-900 border border-slate-700 rounded-full hover:border-blue-500 hover:scale-110 transition-all duration-300 group shadow-md">
                  <SiFacebook size={20} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                </a>
                <a href="https://www.youtube.com/@KanwilDJKNSumut" target="_blank" rel="noreferrer" className="p-3 bg-slate-900 border border-slate-700 rounded-full hover:border-red-500 hover:scale-110 transition-all duration-300 group shadow-md">
                  <SiYoutube size={20} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-800/60 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Kanwil DJKN Sumatera Utara. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}