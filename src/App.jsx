import * as XLSX from 'xlsx';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, TrendingUp, Bell, User, LogOut, Home,
  ArrowUpRight, PlusCircle, PieChart as PieIcon, Lock, UserPlus, Settings, UserCheck, Users, Menu, X,
  Shield, CheckCircle, Target, Info, MapPin, Mail, Eye, EyeOff, ArrowLeft, Sun, Moon, Trash2, AlertCircle, Check, ShieldCheck,
  LayoutGrid, Search
} from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// ==================== [1] DATA GRAFIK KEUANGAN (PERSISTEN) ====================
const dataProporsi = [
  { name: 'Ops Kantor', value: 40 }, { name: 'Perdis', value: 30 },
  { name: 'Pemeliharaan', value: 15 }, { name: 'Lainnya', value: 15 },
];
const COLORS = ['#D4AF37', '#1E3A8A', '#0F172A', '#94A3B8'];
const PIE_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];

// ==================== [2] GENERATOR DATA DEFAULT (SEBELUM IMPORT) ====================
const generatePegawaiData = () => {
  const pends = ['S-1 / DIV', 'S-1 / DIV', 'S-1 / DIV', 'S-2 / Magister', 'Diploma III'];
  const gens = ['Gen X (1965-1980)', 'Gen Y (1981-1996)', 'Gen Y (1981-1996)', 'Gen Z (1997-2012)'];
  const golds = ['O', 'A', 'B', 'AB'];
  const agams = ['Islam', 'Islam', 'Islam', 'Kristen', 'Katolik'];
  const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const blueprint = [
    { unit: 'Kakanwil', list: [{j: 'Eselon II', jk: 'Laki-Laki', count: 1}] },
    { unit: 'Bagian Umum', list: [{j: 'Eselon III / Setara', jk: 'Perempuan', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 2}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 3}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 3}] },
    { unit: 'Bidang PKN', list: [{j: 'Eselon III / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 2}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 1}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 3}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 2}] },
    { unit: 'Bidang PN', list: [{j: 'Eselon III / Setara', jk: 'Perempuan', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 1}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 2}] },
    { unit: 'Bidang Penilaian', list: [{j: 'Eselon III / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 1}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 2}] },
    { unit: 'Bidang Lelang', list: [{j: 'Eselon III / Setara', jk: 'Perempuan', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 1}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 2}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 1}] },
    { unit: 'Bidang KIHI', list: [{j: 'Eselon III / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 2}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 2}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 2}] },
    { unit: 'Jab. Fungsional', list: [{j: 'Eselon IV / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Eselon IV / Setara', jk: 'Perempuan', count: 2}, {j: 'Pelaksana / Setara', jk: 'Laki-Laki', count: 1}, {j: 'Pelaksana / Setara', jk: 'Perempuan', count: 2}] }
  ];

  let result = [];
  let idCounter = 1;
  const namesL = ["Andi Pratama", "Budi Santoso", "Reza Rahadian", "Deni Setiawan", "Eko Prasetyo", "Fajar Nugraha", "Gilang Ramadhan", "Hadi Kusuma", "Iwan Fals", "Joko Widodo", "Kevin Sanjaya", "Lukman Hakim", "Rizky Febian", "Rahmat Hidayat", "Surya Saputra", "Tegar Septian", "Wahyu Hidayat", "Yoga Pratama", "Zainal Abidin", "Arief Rachman", "Bayu Skak", "Candra Wijaya", "Dika Angkasaputra", "Hendra Setiawan", "Bagas Maulana", "Dimas Ekky"];
  const namesP = ["Siti Nurhaliza", "Rina Nose", "Ani Yudhoyono", "Bunga Citra", "Citra Kirana", "Dian Sastro", "Eka Kurnia", "Fitri Tropica", "Gita Gutawa", "Hana Saraswati", "Indah Permatasari", "Ayu Tingting", "Lestari Andayani", "Maya Septha", "Nita Thalia", "Putri Marino", "Ratna Galih", "Sari Nila", "Tia Ivanka", "Wulan Guritno", "Yuni Shara", "Zahra Nur", "Nurul Arifin", "Desi Ratnasari", "Mega Iskanti"];

  let indexL = 0; let indexP = 0;
  blueprint.forEach(b => {
    b.list.forEach(item => {
      for (let i = 0; i < item.count; i++) {
         let name = item.jk === 'Laki-Laki' ? namesL[indexL++] : namesP[indexP++];
         let nip = "19" + (75 + Math.floor(Math.random()*20)) + "0" + (1+Math.floor(Math.random()*9)) + "1220" + (10+Math.floor(Math.random()*12)) + "01100" + (idCounter % 10);
         result.push({
           id: idCounter++, nip: nip, nama: name, 
           jabatan: item.j.includes('Eselon') ? 'Kepala ' + b.unit : 'Pelaksana ' + b.unit, 
           eselon: item.j, unit: b.unit, jk: item.jk,
           pendidikan: getRand(pends), generasi: getRand(gens), goldar: getRand(golds), agama: getRand(agams)
         });
      }
    });
  });
  return result;
}

const mockRealisasiUnitBulanan = [
  { bulan: 'Jan', Realisasi: 2 }, { bulan: 'Feb', Realisasi: 3.5 }, { bulan: 'Mar', Realisasi: 5 },
  { bulan: 'Apr', Realisasi: 4 }, { bulan: 'Mei', Realisasi: 6 }, { bulan: 'Jun', Realisasi: 8.5 },
  { bulan: 'Jul', Realisasi: 7 }, { bulan: 'Ags', Realisasi: 9 }, { bulan: 'Sep', Realisasi: 11 },
];

const THEME_STYLE = `
.theme-light { color: #0f172a; background: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important; }
.theme-light .theme-text-primary, .theme-light .text-white, .theme-light .text-slate-900, .theme-light .text-slate-800 { color: #0f172a !important; }
.theme-light .theme-text-secondary, .theme-light .text-slate-100, .theme-light .text-slate-200, .theme-light .text-slate-300, .theme-light .text-slate-400, .theme-light .text-slate-500, .theme-light .text-slate-600, .theme-light .text-slate-700 { color: #475569 !important; }
.theme-light .theme-text-muted { color: #64748b !important; }
.theme-light .theme-border, .theme-light .border-slate-200, .theme-light .border-slate-600, .theme-light .border-slate-700, .theme-light .border-slate-800, .theme-light .border-slate-900 { border-color: #dbe3f0 !important; }
.theme-light .theme-root { background: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important; }
.theme-light .theme-landing-nav, .theme-light .theme-dashboard-top, .theme-light .theme-surface, .theme-light .theme-sidebar, .theme-light .theme-sidebar-header, .theme-light .theme-footer, .theme-light .theme-card-light, .theme-light .theme-panel-light { background-color: rgba(255, 255, 255, 0.96) !important; border-color: #dbe3f0 !important; }
.theme-light .theme-landing-menu { background-color: rgba(255, 255, 255, 0.98) !important; border-color: #dbe3f0 !important; }
.theme-light .theme-hero-glow { background: radial-gradient(circle, rgba(212,175,55,0.16), rgba(212,175,55,0.05) 48%, transparent 72%) !important; }
.theme-light [class*="bg-slate-900/30"], .theme-light [class*="bg-slate-900/40"], .theme-light [class*="bg-slate-900/50"], .theme-light [class*="bg-slate-900/95"], .theme-light [class*="bg-slate-800"], .theme-light [class*="bg-slate-700"], .theme-light [class*="bg-slate-600"] { background-color: rgba(255, 255, 255, 0.96) !important; border-color: #dbe3f0 !important; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08) !important; }
.theme-light [class*="from-[#17375f] via-[#1d4f86] to-[#132f55]"] { background-image: linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef4ff 100%) !important; border-color: #dbe3f0 !important; box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08) !important; }
.theme-light [class*="bg-[#0f172a]/90"], .theme-light [class*="bg-[#0f172a]/95"], .theme-light [class*="bg-[#0b1724]"], .theme-light [class*="bg-[#020617]"] { background-color: rgba(255, 255, 255, 0.98) !important; border-color: #dbe3f0 !important; }
.theme-light [class*="bg-gradient-to-br from-[#0f172a] via-[#0b1724] to-[#020617]"] { background-image: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important; }
.theme-light [class*="bg-white"] { background-color: rgba(255, 255, 255, 0.98) !important; }
.theme-light [class*="text-[#D4AF37]"] { color: #b8860b !important; }

/* Custom Scrollbar & Animations */
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.1); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.5); border-radius: 8px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.8); }

@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.toast-animate { animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fadeIn { animation: fadeIn 0.3s ease-in-out; }
@keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-popIn { animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* ===== Peningkatan Interaktif & Aksesibilitas (tambahan, tidak mengubah class lama) ===== */

/* Transisi halus saat ganti tema gelap/terang */
.theme-root, .theme-root * { transition: background-color 0.35s ease, border-color 0.35s ease, color 0.35s ease, box-shadow 0.35s ease; }

/* Ring fokus yang jelas untuk navigasi keyboard (aksesibilitas) */
.theme-root button:focus-visible,
.theme-root a:focus-visible,
.theme-root input:focus-visible,
.theme-root select:focus-visible,
.theme-root label:focus-within {
  outline: 2px solid #D4AF37;
  outline-offset: 2px;
  border-radius: 6px;
}

/* Micro-interaction tombol: sedikit mengecil saat ditekan, terasa lebih responsif */
.btn-press { transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.15s ease, filter 0.15s ease; }
.btn-press:active:not(:disabled) { transform: scale(0.97); }
.btn-press:hover:not(:disabled) { filter: brightness(1.04); }

/* Kartu naik halus saat hover + bayangan emas lembut */
.card-hover { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease; }
.card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 45px -12px rgba(212, 175, 55, 0.25); }

/* Skeleton shimmer loader, untuk state loading data/import */
@keyframes shimmer { 0% { background-position: -400px 0; } 100% { background-position: 400px 0; } }
.skeleton-shimmer {
  background: linear-gradient(90deg, rgba(148,163,184,0.15) 25%, rgba(212,175,55,0.25) 37%, rgba(148,163,184,0.15) 63%);
  background-size: 800px 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}

/* Spinner kecil untuk tombol/aksi async */
@keyframes spin-smooth { to { transform: rotate(360deg); } }
.spinner-icon { animation: spin-smooth 0.8s linear infinite; }

/* Animasi masuk bertahap untuk daftar/grid (stagger) */
@keyframes riseIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-riseIn { animation: riseIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Highlight baris tabel saat baru ditambahkan */
@keyframes highlightRow { 0% { background-color: rgba(212, 175, 55, 0.35); } 100% { background-color: transparent; } }
.row-highlight-new { animation: highlightRow 1.8s ease-out; }

/* Garis progres tipis di kartu statistik */
@keyframes growWidth { from { width: 0%; } }
.progress-grow { animation: growWidth 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

/* Efek pulse halus untuk indikator status/live */
@keyframes softPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.pulse-dot { animation: softPulse 2s ease-in-out infinite; }

/* Hormati preferensi pengguna yang sensitif terhadap gerakan */
@media (prefers-reduced-motion: reduce) {
  .theme-root, .theme-root * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
}
`;

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthForm, setShowAuthForm] = useState(false); 
  const [isLandingMobileMenuOpen, setIsLandingMobileMenuOpen] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  // ---- STATE & HANDLER: FITUR LUPA PASSWORD (STEPPER MODAL) ----
  const [showForgotModal, setShowForgotModal]             = useState(false);
  const [forgotStep, setForgotStep]                       = useState('cariAkun'); // 'cariAkun' | 'verifikasiEmail' | 'resetPassword' | 'selesai'
  const [forgotUsernameInput, setForgotUsernameInput]     = useState('');
  const [forgotEmailInput, setForgotEmailInput]           = useState('');
  const [forgotNewPassword, setForgotNewPassword]         = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotShowNewPass, setForgotShowNewPass]         = useState(false);
  const [forgotShowConfPass, setForgotShowConfPass]       = useState(false);
  const [forgotFoundUser, setForgotFoundUser]             = useState(null);

  const fpPassLen      = forgotNewPassword.length >= 8;
  const fpPassUL       = /[A-Z]/.test(forgotNewPassword) && /[a-z]/.test(forgotNewPassword);
  const fpPassNum      = /\d/.test(forgotNewPassword);
  const fpPassSym      = /[^A-Za-z0-9]/.test(forgotNewPassword);
  const fpPassValid    = fpPassLen && fpPassUL && fpPassNum && fpPassSym;
  const fpPassStrength = [fpPassLen, fpPassUL, fpPassNum, fpPassSym].filter(Boolean).length;
  const fpPassMatch    = forgotConfirmPassword.length > 0 && forgotConfirmPassword === forgotNewPassword;

  const resetForgotModal = () => {
    setForgotStep('cariAkun');
    setForgotUsernameInput(''); setForgotEmailInput('');
    setForgotNewPassword(''); setForgotConfirmPassword('');
    setForgotFoundUser(null);
    setForgotShowNewPass(false); setForgotShowConfPass(false);
  };
  const closeForgotModal = () => { setShowForgotModal(false); resetForgotModal(); };

  const handleForgotStep1 = (e) => {
    e.preventDefault();
    const q = forgotUsernameInput.trim().toLowerCase();
    const found = databaseUsers.find(u => u.username.toLowerCase() === q || u.email?.toLowerCase() === q);
    if (!found) { showToast('Akun tidak ditemukan. Periksa kembali Username atau Email Anda.', 'error'); return; }
    setForgotFoundUser(found);
    setForgotStep('verifikasiEmail');
  };

  const handleForgotStep2 = (e) => {
    e.preventDefault();
    if (forgotEmailInput.trim().toLowerCase() !== forgotFoundUser?.email?.toLowerCase()) {
      showToast('Email tidak cocok dengan akun yang terdaftar.', 'error'); return;
    }
    setForgotStep('resetPassword');
  };

  const handleForgotStep3 = (e) => {
    e.preventDefault();
    if (!fpPassValid) { showToast('Password baru tidak memenuhi kriteria keamanan.', 'error'); return; }
    if (!fpPassMatch) { showToast('Konfirmasi password tidak cocok.', 'error'); return; }
    setDatabaseUsers(prev => prev.map(u =>
      u.username === forgotFoundUser.username ? { ...u, password: forgotNewPassword } : u
    ));
    if (sessionUser?.username === forgotFoundUser.username) {
      const updated = { ...sessionUser, password: forgotNewPassword };
      setSessionUser(updated);
      localStorage.setItem('djkn_session', JSON.stringify(updated));
    }
    setForgotStep('selesai');
  };

  useEffect(() => {
    if (!showForgotModal) return;
    const onKey = (e) => { if (e.key === 'Escape') closeForgotModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showForgotModal]);

  // State untuk Drill-Down Modals
  const [showPegawaiModal, setShowPegawaiModal] = useState(false);
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [searchPegawai, setSearchPegawai] = useState('');
  const [searchTransaksi, setSearchTransaksi] = useState('');

  // Menutup modal drill-down dengan tombol Escape (kenyamanan & aksesibilitas keyboard)
  useEffect(() => {
    if (!showPegawaiModal && !showUnitModal) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') { setShowPegawaiModal(false); setShowUnitModal(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showPegawaiModal, showUnitModal]);

  // DATA MASTER PEGAWAI (Dinamis dari Upload Excel)
  const [daftarPegawai, setDaftarPegawai] = useState(() => generatePegawaiData());
  const [statistikExcelFileName, setStatistikExcelFileName] = useState('');

  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('djkn_theme') : null;
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    if (typeof window !== 'undefined' && window.matchMedia) { return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
    return 'dark';
  });
  const isDarkMode = themeMode === 'dark';
  const toggleTheme = () => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  const chartTooltipStyle = isDarkMode ? { backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '8px', color: '#fff' } : { backgroundColor: '#ffffff', borderColor: '#dbe3f0', borderRadius: '8px', color: '#0f172a', boxShadow: '0 14px 28px rgba(15, 23, 42, 0.12)' };
  const chartTooltipItemStyle = { color: isDarkMode ? '#D4AF37' : '#1d4f86' };
  const chartLegendStyle = { fontSize: '11px', color: isDarkMode ? '#cbd5e1' : '#475569' };
  const chartCursorFill = isDarkMode ? 'rgba(51, 65, 85, 0.2)' : 'rgba(59, 130, 246, 0.08)';
  
  const [databaseUsers, setDatabaseUsers] = useState(() => {
    const savedUsers = localStorage.getItem('djkn_users');
    return savedUsers ? JSON.parse(savedUsers) : [ { username: 'admin_djkn', password: 'Password123!', email: 'admin@kemenkeu.go.id', name: 'Admin Pusat', role: 'admin', unit: 'Bagian Umum' } ];
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeWIB = (date) => date.toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' WIB';
  const formatDateID = (date) => date.toLocaleDateString('id-ID', { timeZone: 'Asia/Jakarta', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => { localStorage.setItem('djkn_users', JSON.stringify(databaseUsers)); }, [databaseUsers]);
  useEffect(() => { localStorage.setItem('djkn_theme', themeMode); }, [themeMode]);
  useEffect(() => {
    const savedSession = localStorage.getItem('djkn_session');
    if (savedSession) { setSessionUser(JSON.parse(savedSession)); setIsLoggedIn(true); }
  }, []);

  const [toast, setToast] = useState({ show: false, type: '', message: '' });
  const showToast = (message, type = 'error') => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 4000);
  };

  // --- STATE INPUT FORM REGISTRASI ---
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authRole, setAuthRole] = useState('pegawai');
  const [authUnit, setAuthUnit] = useState('Bagian Umum');
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const isNameValid = /^[a-zA-Z\s]{3,}$/.test(authName);
  const isUsernameFormatValid = /^[a-zA-Z0-9_]{5,20}$/.test(authUsername);
  const isUsernameUnique = authUsername.length > 0 && !databaseUsers.some(u => u.username.toLowerCase() === authUsername.toLowerCase());
  const isUsernameValid = isUsernameFormatValid && isUsernameUnique;
  const isEmailValid = authEmail.toLowerCase().endsWith('@kemenkeu.go.id'); 

  const passLength = authPassword.length >= 8;
  const passUpperLower = /[A-Z]/.test(authPassword) && /[a-z]/.test(authPassword);
  const passNumber = /\d/.test(authPassword);
  const passSymbol = /[^A-Za-z0-9]/.test(authPassword);
  const isPasswordValid = passLength && passUpperLower && passNumber && passSymbol;

  let passStrengthCount = 0;
  if (passLength) passStrengthCount++;
  if (passUpperLower) passStrengthCount++;
  if (passNumber) passStrengthCount++;
  if (passSymbol) passStrengthCount++;
  const isConfirmValid = authConfirmPassword.length > 0 && authConfirmPassword === authPassword;

  useEffect(() => {
    if (sessionUser) { setEditName(sessionUser.name); setEditPassword(sessionUser.password); setEditUnit(sessionUser.unit); }
  }, [currentView, sessionUser]);

  const [transaksi, setTransaksi] = useState(() => {
    const localData = localStorage.getItem('djkn_transaksi');
    return localData ? JSON.parse(localData) : [];
  });
  const [selectedTransaksi, setSelectedTransaksi] = useState([]);
  const selectAllTransaksiRef = useRef(null);
  const isAllTransaksiSelected = transaksi.length > 0 && selectedTransaksi.length === transaksi.length;
  const isSomeTransaksiSelected = selectedTransaksi.length > 0 && selectedTransaksi.length < transaksi.length;

  const totalRealisasi = useMemo(() => {
    const total = transaksi.reduce((sum, t) => t.tipe === 'keluar' ? sum + t.jumlah : sum, 0);
    return (total / 1000000000).toFixed(2);
  }, [transaksi]);

  const processedDataBidang = useMemo(() => {
    const totals = { 'Bagian Umum': 0, 'PKN': 0, 'Lelang': 0, 'KIHI': 0 };
    transaksi.forEach((t) => { if (t.tipe === 'keluar') { totals[t.bidang] = (totals[t.bidang] || 0) + t.jumlah; } });
    return Object.keys(totals).map(key => ({ name: key === 'Bagian Umum' ? 'Umum' : key, Rp: Number((totals[key] / 1000000000).toFixed(2)) }));
  }, [transaksi]);

  const processedDataTren = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyTotals = Array(12).fill(0);
    transaksi.forEach((t) => {
      if (t.tipe === 'keluar' && t.date) {
        const parts = t.date.split('/');
        if (parts.length >= 2) {
          const monthIndex = parseInt(parts[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex <= 11) monthlyTotals[monthIndex] += t.jumlah;
        }
      }
    });
    const currentMonth = new Date().getMonth();
    return monthNames.map((m, index) => ({ bulan: m, Realisasi: Number((monthlyTotals[index] / 1000000).toFixed(2)) })).filter((item, index) => item.Realisasi > 0 || index <= currentMonth);
  }, [transaksi]);

  useEffect(() => { localStorage.setItem('djkn_transaksi', JSON.stringify(transaksi)); }, [transaksi]);
  useEffect(() => { setSelectedTransaksi((prev) => prev.filter((id) => transaksi.some((t) => t.id === id))); }, [transaksi]);
  useEffect(() => { if (selectAllTransaksiRef.current) { selectAllTransaksiRef.current.indeterminate = isSomeTransaksiSelected; } }, [isSomeTransaksiSelected]);

  const [uraianInput, setUraianInput] = useState('');
  const [nominalInput, setNominalInput] = useState('');
  const [bidangInput, setBidangInput] = useState('Bagian Umum');
  const [tipeInput, setTipeInput] = useState('keluar');

  // --- FORM HANDLERS ---
  const handleRegister = (e) => {
    e.preventDefault();
    if (!isNameValid || !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
      showToast('Formulir pendaftaran tidak valid. Harap penuhi semua ketentuan!', 'error'); return;
    }
    const userBaru = { username: authUsername.trim(), email: authEmail.trim().toLowerCase(), password: authPassword, name: authName.trim(), role: authRole, unit: authUnit };
    setDatabaseUsers([...databaseUsers, userBaru]);
    showToast('Akun berhasil didaftarkan! Silakan masuk.', 'success');
    setAuthName(''); setAuthUsername(''); setAuthEmail(''); setAuthPassword(''); setAuthConfirmPassword('');
    setTimeout(() => setIsRegisterMode(false), 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const userDitemukan = databaseUsers.find(
      (u) => (u.username.toLowerCase() === authUsername.toLowerCase() || u.email?.toLowerCase() === authUsername.toLowerCase()) && u.password === authPassword
    );
    if (userDitemukan) {
      localStorage.setItem('djkn_session', JSON.stringify(userDitemukan));
      setSessionUser(userDitemukan); setIsLoggedIn(true); setShowAuthForm(false); setCurrentView('dashboard'); 
      setAuthUsername(''); setAuthPassword(''); showToast(`Selamat datang kembali, ${userDitemukan.name}!`, 'success');
    } else { showToast('Username, Email, atau Password salah!', 'error'); }
  };

  const handleLogout = () => { localStorage.removeItem('djkn_session'); setIsLoggedIn(false); setSessionUser(null); setIsMobileMenuOpen(false); };
  const navigateTo = (view) => { setCurrentView(view); setIsMobileMenuOpen(false); };
  const handleSaveProfile = (e) => {
    e.preventDefault(); setProfileSuccess('');
    const userDiperbarui = { ...sessionUser, name: editName.trim(), password: editPassword, unit: editUnit };
    setSessionUser(userDiperbarui); localStorage.setItem('djkn_session', JSON.stringify(userDiperbarui));
    const updatedDB = databaseUsers.map((user) => user.username.toLowerCase() === sessionUser.username.toLowerCase() ? userDiperbarui : user);
    setDatabaseUsers(updatedDB); setProfileSuccess('Profil Anda berhasil diperbarui!'); setTimeout(() => setProfileSuccess(''), 3000);
  };

const [isSavingTransaksi, setIsSavingTransaksi] = useState(false);
const [lastAddedTransaksiId, setLastAddedTransaksiId] = useState(null);
const handleTambahTransaksi = (e) => {
  e.preventDefault();

  // 1. Validasi Awal
  if (sessionUser?.role !== 'admin') return showToast('Akses ditolak! Hanya Admin yang dapat menambah data.', 'error');
  if (!uraianInput || !nominalInput) return showToast('Mohon isi Uraian dan Nominal terlebih dahulu!', 'error');
  if (parseFloat(nominalInput) <= 0) return showToast('Nominal harus lebih besar dari 0!', 'error');

  // 2. Siapkan data baru
  const dataTransaksi = {
    id: Date.now() + Math.random(),
    date: new Date().toLocaleDateString('id-ID'),
    uraian: uraianInput,
    akun: tipeInput === 'masuk' ? '425111' : '521111',
    bidang: bidangInput,
    jumlah: parseFloat(nominalInput),
    tipe: tipeInput,
  };

  // 3. Simulasikan jeda singkat agar transisi loading terlihat halus, lalu simpan ke state lokal (otomatis tersimpan ke localStorage lewat useEffect)
  setIsSavingTransaksi(true);
  setTimeout(() => {
    setTransaksi((prev) => [dataTransaksi, ...prev]);
    setUraianInput('');
    setNominalInput('');
    setIsSavingTransaksi(false);
    setLastAddedTransaksiId(dataTransaksi.id);
    setTimeout(() => setLastAddedTransaksiId(null), 2000);
    showToast('Transaksi berhasil disimpan!', 'success');
  }, 350);
};

  const handleHapusTransaksi = (id) => {
    if (typeof id === 'number') {
      if (window.confirm("Apakah kamu yakin ingin menghapus data ini?")) {
        setTransaksi((prev) => prev.filter(t => t.id !== id));
        setSelectedTransaksi((prev) => prev.filter(itemId => itemId !== id));
      }
      return;
    }
    if (selectedTransaksi.length === 0) return;
    const konfirmasi = window.confirm(`Apakah kamu yakin ingin menghapus ${selectedTransaksi.length} data terpilih?`);
    if (konfirmasi) { setTransaksi((prev) => prev.filter(t => !selectedTransaksi.includes(t.id))); setSelectedTransaksi([]); }
  };

  const handleToggleTransaksiSelect = (id) => { setSelectedTransaksi((prev) => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id] ); };
  const handleSelectAllTransaksi = () => { if (selectedTransaksi.length === transaksi.length) { setSelectedTransaksi([]); } else { setSelectedTransaksi(transaksi.map((t) => t.id)); } };

  // --- IMPORT EXCEL TRANSAKSI KEUANGAN ---
  const [isImportingTransaksi, setIsImportingTransaksi] = useState(false);
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImportingTransaksi(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result; const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0]; const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" });
        const dataBaru = rawData.map(item => {
          const normalized = {};
          Object.keys(item).forEach(key => { normalized[key.trim().toLowerCase()] = item[key]; });
          const getVal = (aliases) => { for (let key of aliases) { if (normalized[key] !== undefined && normalized[key] !== "") return normalized[key]; } return null; };
          const rawTanggal = getVal(['tanggal', 'tgl', 'date', 'waktu', 'hari']) || new Date().toLocaleDateString('id-ID');
          const rawUraian = getVal(['uraian', 'keterangan', 'deskripsi', 'nama', 'transaksi', 'rincian']) || "Data Import";
          const rawAkun = getVal(['akun', 'kode', 'rekening', 'kode_akun']) || "521111";
          const rawBidang = getVal(['bidang', 'unit', 'bagian', 'seksi']) || "Bagian Umum";
          const rawJumlah = getVal(['jumlah', 'nominal', 'total', 'harga', 'rp', 'saldo', 'nilai', 'pengeluaran', 'pemasukan']) || 0;
          const rawTipe = getVal(['tipe', 'jenis', 'status', 'arus']);
          let parsedTanggal = rawTanggal;
          if (typeof rawTanggal === 'number') { const dateObj = new Date(Math.round((rawTanggal - 25569) * 86400 * 1000)); parsedTanggal = dateObj.toLocaleDateString('id-ID'); }
          const stringJumlah = String(rawJumlah); const bersihkanAngka = stringJumlah.replace(/[^0-9]/g, ''); 
          const parsedJumlah = parseFloat(bersihkanAngka) || 0;
          let tipeTrans = "keluar"; 
          if (rawTipe) { tipeTrans = String(rawTipe).toLowerCase().includes('masuk') ? 'masuk' : 'keluar'; } else {
             if (stringJumlah.includes('+')) tipeTrans = 'masuk'; else if (stringJumlah.includes('-')) tipeTrans = 'keluar';
          }
          return { id: Date.now() + Math.random(), date: parsedTanggal, uraian: String(rawUraian), akun: String(rawAkun), bidang: String(rawBidang), jumlah: parsedJumlah, tipe: tipeTrans };
        });
        setTransaksi([...dataBaru, ...transaksi]); showToast(`Berhasil mengimpor ${dataBaru.length} data dengan sempurna!`, 'success');
      } catch (error) { showToast("Gagal membaca file. Pastikan format Excel Anda benar.", 'error'); } finally { e.target.value = ''; setIsImportingTransaksi(false); }
    };
    reader.readAsBinaryString(file);
  };

  // --- IMPORT EXCEL STATISTIK PEGAWAI (DINAMIS & ROBUST) ---
  const [isImportingStatistik, setIsImportingStatistik] = useState(false);
  const handleImportStatistikExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsImportingStatistik(true);

    const getEselonCat = (jabatan) => {
      const j = String(jabatan).toLowerCase();
      if (j.includes('kepala kantor wil')) return 'Eselon II';
      if (j.includes('kepala bagian') || j.includes('kepala bidang')) return 'Eselon III / Setara';
      if (j.includes('kepala subbagian') || j.includes('kepala seksi')) return 'Eselon IV / Setara';
      if (j.includes('pelaksana')) return 'Pelaksana / Setara';
      if (j.includes('fungsional') || j.includes('ahli') || j.includes('penilai') || j.includes('pranata')) return 'Fungsional';
      return 'Lainnya';
    };

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result; 
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0]; 
        const ws = wb.Sheets[wsname];
        
        // Membaca sbg array 2D untuk mengatasi masalah judul/header yang tidak selalu di baris ke-1
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        
        // Mencari otomatis posisi baris Header (berisi 'Nama' dan 'NIP'/'Jabatan')
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rows.length, 20); i++) {
           const rowStr = rows[i].map(c => String(c).toLowerCase()).join(' ');
           if (rowStr.includes('nama') && (rowStr.includes('nip') || rowStr.includes('jabatan'))) {
              headerRowIndex = i;
              break;
           }
        }

        if (headerRowIndex === -1) { 
           showToast('Kolom Nama/NIP tidak ditemukan. Pastikan Anda mengunggah sheet data pegawai yang valid.', 'error'); 
           return; 
        }

        const headers = rows[headerRowIndex].map(h => String(h).trim().toLowerCase());
        const parsedData = [];

        // Looping isi baris di bawah header
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
           const row = rows[i];
           if (!row || !row.some(cell => cell !== '')) continue; // Skip baris kosong

           // Helper untuk mencari nilai berdasarkan kemungkinan nama kolom (alias)
           const getVal = (aliases) => {
               for (const alias of aliases) {
                   const idx = headers.findIndex(h => h === alias || h.includes(alias));
                   if (idx !== -1 && row[idx]) return String(row[idx]).trim();
               }
               return '';
           };

           const nama = getVal(['nama']);
           if (!nama) continue; // Nama wajib ada

           let jkRaw = getVal(['jenis kelamin', 'gender', 'jk', 'kelamin']);
           let jk = 'Laki-Laki';
           if (jkRaw.toLowerCase().startsWith('p') || jkRaw.toLowerCase() === 'female') jk = 'Perempuan';

           let rawJabatan = getVal(['jabatan', 'posisi']);

           parsedData.push({
               id: Date.now() + i,
               nip: getVal(['nip']),
               nama: nama,
               jabatan: rawJabatan || 'Tidak Diketahui',
               eselon: getVal(['golongan ruang/pangkat', 'pangkat', 'golongan']) ? getEselonCat(rawJabatan) : getEselonCat(rawJabatan),
               unit: getVal(['ue3', 'unit kerja', 'unit', 'bagian', 'bidang']) || 'Tidak Diketahui',
               jk: jk,
               pendidikan: getVal(['pendidikan terakhir', 'pendidikan', 'ijazah']) || 'Tidak Diketahui',
               generasi: getVal(['generasi', 'angkatan']) || 'Tidak Diketahui',
               goldar: getVal(['golongan darah', 'goldar']) || 'Tidak Diketahui',
               agama: getVal(['agama', 'kepercayaan']) || 'Tidak Diketahui'
           });
        }

        setDaftarPegawai(parsedData); 
        setStatistikExcelFileName(file.name); 
        showToast(`Berhasil mengimpor ${parsedData.length} data pegawai! Statistik & Daftar Pegawai telah diupdate otomatis.`, 'success');
      } catch (error) { 
        showToast('Gagal membaca file statistik. Pastikan file Excel valid dan tidak rusak.', 'error'); 
      } finally { 
        e.target.value = ''; 
        setIsImportingStatistik(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleResetStatistikImport = () => { 
    setDaftarPegawai(generatePegawaiData()); 
    setStatistikExcelFileName('');
    showToast('Data pegawai dikembalikan ke data contoh.', 'success');
  };
  
  const scrollToSection = (id) => { setIsLandingMobileMenuOpen(false); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); };

  // --- ENGINE AGREGASI DINAMIS UNTUK GRAFIK ---
  const aggregateData = (data, key, valueKey = 'value', nameKey = 'name') => {
    const counts = {};
    data.forEach(item => {
      let val = item[key];
      if (!val || val === '' || val === '-') val = 'Tidak Diketahui';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.keys(counts)
      .map(k => ({ [nameKey]: k, [valueKey]: counts[k] }))
      .sort((a, b) => b[valueKey] - a[valueKey]); // Sort descending
  };

  const dataStatistikUnitTampil = aggregateData(daftarPegawai, 'unit', 'jumlah', 'unit');
  const dataStatistikGenderTampil = aggregateData(daftarPegawai, 'jk', 'value', 'name');
  const dataStatistikGenerasiTampil = aggregateData(daftarPegawai, 'generasi', 'jumlah', 'name');
  const dataStatistikPendidikanTampil = aggregateData(daftarPegawai, 'pendidikan', 'jumlah', 'name');
  const dataStatistikGoldarTampil = aggregateData(daftarPegawai, 'goldar', 'value', 'name');
  const dataStatistikAgamaTampil = aggregateData(daftarPegawai, 'agama', 'jumlah', 'name');
  // Ambil Eselon dan batasi jika telalu banyak
  const dataStatistikJabatanTampil = aggregateData(daftarPegawai, 'eselon', 'jumlah', 'name').slice(0, 8);

  const filteredPegawai = daftarPegawai.filter(p => 
    p.nama.toLowerCase().includes(searchPegawai.toLowerCase()) || 
    p.nip.includes(searchPegawai) || 
    p.jabatan.toLowerCase().includes(searchPegawai.toLowerCase()) || 
    p.unit.toLowerCase().includes(searchPegawai.toLowerCase())
  );

  const filteredTransaksi = useMemo(() => {
    if (!searchTransaksi.trim()) return transaksi;
    const q = searchTransaksi.toLowerCase();
    return transaksi.filter(t => t.uraian.toLowerCase().includes(q) || t.bidang.toLowerCase().includes(q));
  }, [transaksi, searchTransaksi]);

  // ==================== VIEW: KOMPONEN TOAST ====================
  const ToastNotification = () => {
    if (!toast.show) return null;
    const isSuccess = toast.type === 'success';
    return (
      <div className="fixed top-6 right-6 z-[100] toast-animate max-w-[calc(100vw-3rem)]">
        <div className={`relative overflow-hidden flex items-center gap-3 pl-4 pr-3 py-4 rounded-2xl shadow-2xl border ${isSuccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {isSuccess ? <CheckCircle size={20} className="text-emerald-500 shrink-0" /> : <AlertCircle size={20} className="text-red-500 shrink-0" />}
          <p className="text-sm font-bold tracking-wide leading-snug">{toast.message}</p>
          <button onClick={() => setToast({ show: false })} className="ml-2 p-1 rounded-full hover:bg-black/5 hover:opacity-70 transition-colors shrink-0"><X size={16}/></button>
        </div>
      </div>
    );
  };

  // ==================== VIEW: LANDING PAGE & AUTHENTICATION ====================
  if (!isLoggedIn) {
    if (showAuthForm) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-100 font-sans relative overflow-hidden p-4">
          <ToastNotification />

        {/* ===== MODAL: LUPA PASSWORD (STEPPER 3 LANGKAH) ===== */}
        {showForgotModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={closeForgotModal}>
            <div onClick={e => e.stopPropagation()} className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-popIn">

              {/* ── HEADER ── */}
              <div className="bg-gradient-to-r from-[#051622] to-[#0f2744] px-6 pt-6 pb-5">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#D4AF37]/20 rounded-xl shrink-0">
                      <Lock size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-base leading-tight">Pemulihan Akun</h3>
                      <p className="text-slate-400 text-[10px] mt-0.5 tracking-wide">
                        {forgotStep === 'cariAkun'        && 'Identifikasi akun yang akan dipulihkan'}
                        {forgotStep === 'verifikasiEmail' && 'Konfirmasi kepemilikan akun via email'}
                        {forgotStep === 'resetPassword'   && 'Buat password baru yang aman'}
                        {forgotStep === 'selesai'         && 'Akun berhasil dipulihkan'}
                      </p>
                    </div>
                  </div>
                  <button onClick={closeForgotModal} aria-label="Tutup" className="btn-press text-slate-500 hover:text-white hover:rotate-90 p-1.5 rounded-full hover:bg-white/10 shrink-0 mt-0.5 transition-all duration-300">
                    <X size={17} />
                  </button>
                </div>

                {/* Step indicator visual — 3 lingkaran bernomor + garis */}
                {forgotStep !== 'selesai' && (
                  <div className="flex items-center gap-0">
                    {[
                      { n: 1, label: 'Identifikasi', key: 'cariAkun' },
                      { n: 2, label: 'Verifikasi',   key: 'verifikasiEmail' },
                      { n: 3, label: 'Reset',        key: 'resetPassword' },
                    ].map((s, i) => {
                      const isActive = forgotStep === s.key;
                      const isDone   = (forgotStep === 'verifikasiEmail' && s.n === 1) ||
                                       (forgotStep === 'resetPassword'   && s.n <= 2);
                      return (
                        <React.Fragment key={s.key}>
                          <div className="flex flex-col items-center gap-1.5 flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all duration-300 ${isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'bg-[#D4AF37] border-[#D4AF37] text-[#051622]' : 'bg-transparent border-slate-600 text-slate-500'}`}>
                              {isDone ? <CheckCircle size={14} /> : s.n}
                            </div>
                            <span className={`text-[9px] font-bold tracking-wider ${isActive ? 'text-[#D4AF37]' : isDone ? 'text-emerald-400' : 'text-slate-600'}`}>{s.label}</span>
                          </div>
                          {i < 2 && (
                            <div className={`flex-1 h-0.5 mb-5 transition-all duration-500 ${isDone ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── BODY ── */}
              <div className="p-6">

                {/* STEP 1 — IDENTIFIKASI AKUN */}
                {forgotStep === 'cariAkun' && (
                  <form onSubmit={handleForgotStep1} className="space-y-5 animate-fadeIn">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 flex gap-3 items-start">
                      <AlertCircle size={15} className="text-blue-500 mt-0.5 shrink-0" />
                      <p className="text-blue-700 text-xs leading-relaxed">Masukkan <strong>Username</strong> atau <strong>Email institusi</strong> yang terdaftar. Sistem akan memverifikasi kepemilikan akun Anda.</p>
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-sm">Username atau Email Terdaftar</label>
                      <input
                        type="text"
                        autoFocus
                        value={forgotUsernameInput}
                        onChange={e => setForgotUsernameInput(e.target.value)}
                        placeholder="Cth: david_djkn atau david@kemenkeu.go.id"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400"
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={closeForgotModal} className="btn-press flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm">Batal</button>
                      <button type="submit" className="btn-press flex-1 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 rounded-xl text-sm shadow-md flex items-center justify-center gap-2">
                        Temukan Akun <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 2 — VERIFIKASI EMAIL */}
                {forgotStep === 'verifikasiEmail' && (
                  <form onSubmit={handleForgotStep2} className="space-y-5 animate-fadeIn">
                    {/* Kartu info akun yang ditemukan */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#17375f] to-[#1d4f86] flex items-center justify-center text-[#D4AF37] font-black text-base shrink-0">
                        {forgotFoundUser?.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-800 font-bold text-sm truncate">{forgotFoundUser?.name}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">@{forgotFoundUser?.username} · {forgotFoundUser?.unit}</p>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full shrink-0">Ditemukan</span>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 flex gap-3 items-start">
                      <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                      <p className="text-amber-700 text-xs leading-relaxed">Untuk membuktikan kepemilikan, masukkan <strong>email institusi</strong> yang terdaftar pada akun ini. Email bersifat rahasia — hanya pemilik yang mengetahuinya.</p>
                    </div>

                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-sm">Email Institusi Terdaftar</label>
                      <input
                        type="email"
                        autoFocus
                        value={forgotEmailInput}
                        onChange={e => setForgotEmailInput(e.target.value)}
                        placeholder="Cth: nama@kemenkeu.go.id"
                        className={`w-full bg-slate-50 border rounded-xl p-3.5 text-slate-900 text-sm focus:outline-none transition-all ${forgotEmailInput.length > 0 ? (forgotEmailInput.toLowerCase().endsWith('@kemenkeu.go.id') ? 'border-emerald-400 ring-1 ring-emerald-300' : 'border-slate-300') : 'border-slate-300 hover:border-slate-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30'}`}
                        required
                      />
                      {forgotEmailInput.length > 0 && forgotEmailInput.toLowerCase().endsWith('@kemenkeu.go.id') && (
                        <p className="text-[10px] mt-1.5 text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle size={10} /> Format email valid</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={() => { setForgotStep('cariAkun'); setForgotEmailInput(''); }} className="btn-press flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm">← Kembali</button>
                      <button type="submit" className="btn-press flex-1 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 rounded-xl text-sm shadow-md flex items-center justify-center gap-2">
                        Verifikasi <ArrowUpRight size={14} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3 — RESET PASSWORD */}
                {forgotStep === 'resetPassword' && (
                  <form onSubmit={handleForgotStep3} className="space-y-4 animate-fadeIn">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5">
                      <CheckCircle size={16} className="text-emerald-600 shrink-0" />
                      <p className="text-emerald-700 text-xs font-semibold leading-snug">Identitas terverifikasi. Sekarang buat password baru yang kuat untuk akun <strong>@{forgotFoundUser?.username}</strong>.</p>
                    </div>

                    {/* Password baru */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-sm">Password Baru</label>
                      <div className="relative">
                        <input
                          type={forgotShowNewPass ? 'text' : 'password'}
                          autoFocus
                          value={forgotNewPassword}
                          onChange={e => setForgotNewPassword(e.target.value)}
                          placeholder="Min. 8 karakter"
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 text-sm focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400"
                          required
                        />
                        <button type="button" onClick={() => setForgotShowNewPass(p => !p)} className="btn-press absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37]">
                          {forgotShowNewPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {/* Strength bar + checklist */}
                      {forgotNewPassword.length > 0 && (
                        <div className="mt-2.5 space-y-2">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(n => (
                              <div key={n} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${fpPassStrength >= n ? (fpPassStrength <= 1 ? 'bg-red-400' : fpPassStrength === 2 ? 'bg-orange-400' : fpPassStrength === 3 ? 'bg-yellow-400' : 'bg-emerald-500') : 'bg-slate-200'}`} />
                            ))}
                          </div>
                          <p className={`text-[10px] font-bold ${fpPassStrength <= 1 ? 'text-red-500' : fpPassStrength === 2 ? 'text-orange-500' : fpPassStrength === 3 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                            {fpPassStrength <= 1 ? 'Lemah' : fpPassStrength === 2 ? 'Cukup' : fpPassStrength === 3 ? 'Baik' : '✓ Kuat — Siap digunakan'}
                          </p>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            {[['≥ 8 karakter', fpPassLen], ['Huruf besar & kecil', fpPassUL], ['Mengandung angka', fpPassNum], ['Karakter khusus (!@#)', fpPassSym]].map(([label, ok]) => (
                              <p key={label} className={`text-[10px] flex items-center gap-1 transition-colors ${ok ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                                {ok ? <CheckCircle size={10} className="shrink-0" /> : <AlertCircle size={10} className="shrink-0" />} {label}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Konfirmasi password */}
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5 text-sm">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <input
                          type={forgotShowConfPass ? 'text' : 'password'}
                          value={forgotConfirmPassword}
                          onChange={e => setForgotConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru"
                          className={`w-full bg-slate-50 border rounded-xl p-3.5 pr-12 text-slate-900 text-sm focus:outline-none transition-all ${forgotConfirmPassword.length > 0 ? (fpPassMatch ? 'border-emerald-500 ring-2 ring-emerald-300/60' : 'border-red-400 ring-2 ring-red-300/60') : 'border-slate-300 hover:border-slate-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30'}`}
                          required
                        />
                        <button type="button" onClick={() => setForgotShowConfPass(p => !p)} className="btn-press absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37]">
                          {forgotShowConfPass ? <EyeOff size={17} /> : <Eye size={17} />}
                        </button>
                      </div>
                      {forgotConfirmPassword.length > 0 && (
                        <p className={`text-[10px] mt-1.5 flex items-center gap-1 font-semibold ${fpPassMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                          {fpPassMatch ? <><CheckCircle size={10} /> Password cocok dan siap disimpan</> : <><AlertCircle size={10} /> Password tidak cocok</>}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={() => { setForgotStep('verifikasiEmail'); setForgotNewPassword(''); setForgotConfirmPassword(''); }} className="btn-press flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl text-sm">← Kembali</button>
                      <button type="submit" disabled={!fpPassValid || !fpPassMatch} className="btn-press flex-1 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] disabled:from-slate-200 disabled:to-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-[#051622] font-black py-3 rounded-xl text-sm shadow-md flex items-center justify-center gap-2">
                        <CheckCircle size={14} /> Simpan Password
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP SELESAI */}
                {forgotStep === 'selesai' && (
                  <div className="text-center space-y-5 py-3 animate-popIn">
                    {/* Animasi lingkaran centang */}
                    <div className="relative mx-auto w-20 h-20">
                      <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
                      <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <CheckCircle size={38} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-black text-lg">Password Berhasil Diperbarui!</h4>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">Password akun <strong className="text-slate-700">@{forgotFoundUser?.username}</strong> telah berhasil diganti. Gunakan password baru Anda untuk masuk.</p>
                    </div>
                    {/* Info keamanan */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left flex gap-3 items-start">
                      <Shield size={14} className="text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-slate-500 text-[11px] leading-relaxed">Demi keamanan, jangan bagikan password kepada siapapun termasuk petugas IT. Gunakan password berbeda untuk setiap akun.</p>
                    </div>
                    <button onClick={closeForgotModal} className="btn-press w-full bg-gradient-to-r from-[#051622] to-[#0f2744] hover:from-[#0f2744] hover:to-[#1d4f86] text-white font-black py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all">
                      <Lock size={15} /> Masuk dengan Password Baru
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

          <div className={`w-full bg-white border border-slate-200 p-8 shadow-2xl rounded-3xl z-10 transition-all duration-500 ${isRegisterMode ? 'max-w-4xl' : 'max-w-md'}`}>
            <button onClick={() => setShowAuthForm(false)} className="text-slate-400 hover:text-slate-700 flex items-center gap-2 mb-8 transition-colors text-sm font-semibold">
              <ArrowLeft size={16} /> Kembali ke Beranda
            </button>

            <div className={`text-center ${isRegisterMode ? 'mb-10' : 'mb-8'}`}>
              <h2 className="text-2xl font-black text-slate-800">{isRegisterMode ? 'Registrasi Akun Baru' : 'Selamat Datang!'}</h2>
              <p className="text-sm text-slate-500 mt-1">{isRegisterMode ? 'Silakan lengkapi formulir pendaftaran dengan data valid' : 'Silakan masuk ke sistem SIPKA'}</p>
            </div>

            {isRegisterMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                <form onSubmit={handleRegister} className="space-y-5 text-sm animate-fadeIn">
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">Nama Lengkap</label>
                    <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className={`w-full bg-slate-50 border rounded-xl p-3.5 text-slate-900 focus:outline-none transition ${authName.length > 0 ? (isNameValid ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-red-400') : 'border-slate-300 focus:border-[#D4AF37]'}`} required placeholder="Cth: David Jonathan" />
                    {authName.length > 0 && !isNameValid && <p className="text-[10px] text-red-500 mt-1 font-semibold flex items-center gap-1"><X size={12}/> Minimal 3 karakter & tanpa angka/simbol</p>}
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">Username</label>
                    <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value.replace(/\s/g, ''))} className={`w-full bg-slate-50 border rounded-xl p-3.5 text-slate-900 focus:outline-none transition ${authUsername.length > 0 ? (isUsernameValid ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-red-400') : 'border-slate-300 focus:border-[#D4AF37]'}`} required placeholder="Cth: david_jonathan" />
                    {authUsername.length > 0 && (
                      <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${isUsernameValid ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isUsernameValid ? <><Check size={12}/> Username tersedia</> : <><X size={12}/> 5-20 Karakter, huruf/angka/underscore, dan Unik</>}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">Email Akses</label>
                    <input type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} className={`w-full bg-slate-50 border rounded-xl p-3.5 text-slate-900 focus:outline-none transition ${authEmail.length > 0 ? (isEmailValid ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-red-400') : 'border-slate-300 focus:border-[#D4AF37]'}`} required placeholder="Cth: david@kemenkeu.go.id" />
                    {authEmail.length > 0 && (
                      <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${isEmailValid ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isEmailValid ? <><Check size={12}/> Email valid</> : <><AlertCircle size={12}/> Email tidak sah (harus @kemenkeu.go.id)</>}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className={`w-full bg-slate-50 border rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none transition ${authPassword.length > 0 ? (isPasswordValid ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-amber-400') : 'border-slate-300 focus:border-[#D4AF37]'}`} required placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {authPassword.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        <div className="flex gap-1 h-1.5 w-full">
                          <div className={`h-full flex-1 rounded-full ${passStrengthCount >= 1 ? 'bg-red-500' : 'bg-slate-200'}`}></div>
                          <div className={`h-full flex-1 rounded-full ${passStrengthCount >= 2 ? 'bg-amber-500' : 'bg-slate-200'}`}></div>
                          <div className={`h-full flex-1 rounded-full ${passStrengthCount >= 3 ? 'bg-lime-500' : 'bg-slate-200'}`}></div>
                          <div className={`h-full flex-1 rounded-full ${passStrengthCount >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                          <span className={`text-[10px] flex items-center gap-0.5 ${passLength ? 'text-emerald-500' : 'text-slate-400'}`}>{passLength ? <Check size={10}/> : <div className="w-1 h-1 bg-slate-400 rounded-full mx-1"></div>} Min 8 Karakter</span>
                          <span className={`text-[10px] flex items-center gap-0.5 ${passUpperLower ? 'text-emerald-500' : 'text-slate-400'}`}>{passUpperLower ? <Check size={10}/> : <div className="w-1 h-1 bg-slate-400 rounded-full mx-1"></div>} Huruf Besar & Kecil</span>
                          <span className={`text-[10px] flex items-center gap-0.5 ${passNumber ? 'text-emerald-500' : 'text-slate-400'}`}>{passNumber ? <Check size={10}/> : <div className="w-1 h-1 bg-slate-400 rounded-full mx-1"></div>} Angka</span>
                          <span className={`text-[10px] flex items-center gap-0.5 ${passSymbol ? 'text-emerald-500' : 'text-slate-400'}`}>{passSymbol ? <Check size={10}/> : <div className="w-1 h-1 bg-slate-400 rounded-full mx-1"></div>} Simbol (!@#$)</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-slate-700 font-bold block mb-1.5">Konfirmasi Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={authConfirmPassword} onChange={(e) => setAuthConfirmPassword(e.target.value)} className={`w-full bg-slate-50 border rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none transition ${authConfirmPassword.length > 0 ? (isConfirmValid ? 'border-emerald-500 ring-1 ring-emerald-500' : 'border-red-400') : 'border-slate-300 focus:border-[#D4AF37]'}`} required placeholder="••••••••" />
                      {authConfirmPassword.length > 0 && (
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                           {isConfirmValid ? <CheckCircle size={18} className="text-emerald-500"/> : <X size={18} className="text-red-400"/>}
                         </div>
                      )}
                    </div>
                    {authConfirmPassword.length > 0 && (
                      <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${isConfirmValid ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isConfirmValid ? "Password cocok" : "Password tidak cocok"}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">Akses</label>
                      <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] transition cursor-pointer">
                        <option value="pegawai">Pegawai</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-700 font-bold block mb-1.5">Unit Kerja</label>
                      <select value={authUnit} onChange={(e) => setAuthUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] transition cursor-pointer">
                        <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={!isNameValid || !isUsernameValid || !isEmailValid || !isPasswordValid || !isConfirmValid} className="w-full bg-[#f3d05e] hover:bg-[#eebb4d] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-[#051622] font-black rounded-xl py-3.5 mt-4 flex items-center justify-center gap-2 uppercase tracking-wider transition-all shadow-md">
                    <ShieldCheck size={18} /> Daftar Akun Aman
                  </button>
                  <p className="text-center text-slate-500 mt-4 text-xs">Sudah punya akun? <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[#dca437] font-bold underline ml-1 hover:text-[#bda032]">Login</button></p>
                </form>

                <div className="bg-slate-50/50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="font-black text-slate-800 mb-6 text-base border-b border-slate-200 pb-3 flex items-center gap-2">
                    <Shield size={18} className="text-[#D4AF37]"/> Ketentuan Registrasi
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm mb-2"><User size={16} className="text-slate-500"/> Username</div>
                      <ul className="text-[11px] text-slate-500 space-y-1.5 pl-6 list-disc list-outside">
                        <li>Memiliki 5 - 20 karakter</li>
                        <li>Tanpa spasi & simbol khusus (kecuali underscore)</li>
                        <li>Harus unik (belum digunakan pengguna lain)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm mb-2"><Lock size={16} className="text-slate-500"/> Password</div>
                      <ul className="text-[11px] text-slate-500 space-y-1.5 pl-6 list-disc list-outside">
                        <li>Minimal 8 karakter untuk keamanan</li>
                        <li>Kombinasi Huruf Besar (A-Z) & Kecil (a-z)</li>
                        <li>Mengandung minimal satu Angka (0-9)</li>
                        <li>Mengandung Simbol khusus (!@#$%^&*)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm mb-2"><Mail size={16} className="text-slate-500"/> Email Institusi</div>
                      <ul className="text-[11px] text-slate-500 space-y-1.5 pl-6 list-disc list-outside">
                        <li>Sistem hanya menerima pendaftaran menggunakan alamat email resmi kedinasan (<span className="font-semibold text-slate-700">@kemenkeu.go.id</span>)</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-slate-700 text-sm mb-2"><UserCheck size={16} className="text-slate-500"/> Nama Lengkap</div>
                      <ul className="text-[11px] text-slate-500 space-y-1.5 pl-6 list-disc list-outside">
                        <li>Minimal 3 karakter, menggunakan abjad murni tanpa angka atau simbol.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5 text-sm animate-fadeIn">
                <div>
                  <label className="text-slate-700 font-bold block mb-1.5">Username / Email</label>
                  <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400" required />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                     <label className="text-slate-700 font-bold block">Password</label>
                     <button type="button" onClick={() => { setShowForgotModal(true); resetForgotModal(); }} className="text-[10px] text-[#D4AF37] hover:text-[#bda032] font-bold transition-colors underline underline-offset-2">Lupa Password?</button>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-press absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="btn-press w-full bg-[#051622] hover:bg-slate-800 text-white font-black rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg hover:shadow-xl">
                  <Lock size={16} /> Login Aman
                </button>
                <p className="text-center text-slate-500 mt-4 text-xs">Belum punya akun? <button type="button" onClick={() => setIsRegisterMode(true)} className="text-[#dca437] font-bold underline ml-1 hover:text-[#bda032]">Registrasi</button></p>
              </form>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`theme-root theme-landing-root bg-gradient-to-br from-[#0f172a] via-[#0b1724] to-[#020617] min-h-screen font-sans text-slate-200 overflow-x-hidden scroll-smooth ${isDarkMode ? "theme-dark" : "theme-light"}`}>
        <style>{THEME_STYLE}</style>
        
        {/* Navigasi Landing */}
        <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 transition-all theme-landing-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('beranda')}>
                <img src="/SIPKA-logo.png" alt="Logo SIPKA" className="h-10 w-auto drop-shadow-md" />
                <div><h1 className="font-black text-lg leading-none text-white tracking-wide">SIPKA</h1><p className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest mt-0.5">Kanwil Sumut</p></div>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => scrollToSection('beranda')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Beranda</button>
                <button onClick={() => scrollToSection('filosofi')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Filosofi Logo</button>
                <button onClick={() => scrollToSection('layanan')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Layanan & Kontak</button>
                <button onClick={toggleTheme} className="btn-press border border-slate-600/40 text-slate-200 hover:text-white hover:border-[#D4AF37] px-4 py-2.5 rounded-full text-sm flex items-center gap-2 bg-slate-800/40">
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button onClick={() => setShowAuthForm(true)} className="btn-press bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 hover:scale-105 shadow-lg shadow-[#D4AF37]/20">
                  <Lock size={14} /> Login Sistem
                </button>
              </div>
              <div className="md:hidden flex items-center"><button onClick={() => setIsLandingMobileMenuOpen(!isLandingMobileMenuOpen)} className="btn-press text-slate-300 p-2 focus:outline-none">{isLandingMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button></div>
            </div>
          </div>
          {isLandingMobileMenuOpen && (
            <div className="md:hidden bg-[#0f172a] border-b border-slate-800 animate-fadeIn theme-landing-menu">
              <div className="px-4 pt-2 pb-6 space-y-2">
                <button onClick={() => scrollToSection('beranda')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl transition-colors">Beranda</button>
                <button onClick={() => scrollToSection('filosofi')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl transition-colors">Filosofi Logo</button>
                <button onClick={() => scrollToSection('layanan')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl transition-colors">Layanan & Kontak</button>
                <button onClick={toggleTheme} className="btn-press w-full mt-4 border border-slate-600/40 text-slate-200 bg-slate-800/40 font-bold px-4 py-3 rounded-xl text-base flex justify-center items-center gap-2">{isDarkMode ? <Sun size={16} /> : <Moon size={16} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
                <button onClick={() => setShowAuthForm(true)} className="btn-press w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-bold px-4 py-3 rounded-xl text-base flex justify-center items-center gap-2"><Lock size={16} /> Login Sistem</button>
              </div>
            </div>
          )}
        </nav>

        {/* Landing Hero */}
        <section id="beranda" className="pt-32 pb-20 px-6 min-h-screen flex items-center relative theme-landing-hero">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] max-w-2xl h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none theme-hero-glow"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <img src="/SIPKA-logo.png" alt="SIPKA Hero" className="h-28 sm:h-40 mx-auto mb-8 drop-shadow-[0_0_25px_rgba(212,175,55,0.2)]" style={{ animation: 'softPulse 3.5s ease-in-out infinite' }} />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Sistem Informasi Pemantauan <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#f3d05e]">Kepegawaian & Keuangan</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Instrumen transformasi digital pendayagunaan aparatur sipil negara dan pengelolaan anggaran DIPA secara transparan, adaptif, dan presisi di lingkungan Kanwil DJKN Sumatera Utara.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setShowAuthForm(true)} className="btn-press w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c4a132] text-[#051622] font-black px-8 py-4 rounded-full text-sm flex justify-center items-center gap-2 hover:-translate-y-1 shadow-lg shadow-[#D4AF37]/20">Masuk ke Dashboard <ArrowUpRight size={18} /></button>
              <button onClick={() => scrollToSection('filosofi')} className="btn-press w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 font-bold px-8 py-4 rounded-full text-sm flex justify-center items-center">Pelajari Fitur & Makna</button>
            </div>
          </div>
        </section>

        {/* Filosofi Logo */}
        <section id="filosofi" className="py-20 px-6 bg-slate-900/40 border-t border-b border-slate-800/50 relative theme-landing-section">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-xs font-black text-[#D4AF37] tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2"><Info size={16}/> Makna & Identitas</h2>
              <h3 className="text-3xl font-black text-white">Bedah Anatomi Logo SIPKA</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/perisai.png" alt="Perisai" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Perisai Luar (Integritas)</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Melambangkan benteng proteksi sistem pengawasan, kepatuhan terhadap hukum, serta komitmen penuh menjaga kerahasiaan data.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/tiga-manusia.png" alt="Tiga Manusia" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Tiga Figur Manusia Sinergis</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Merepresentasikan Sumber Daya Manusia (SDM) sebagai pilar utama organisasi yang berkolaborasi harmonis antar-seksi.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/grafik.png" alt="Grafik" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Grafik Batang Akuntabel</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Mewakili visualisasi data realisasi keuangan DIPA yang akurat, transparan, serta performa kinerja berkala yang terukur.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/kaca-pembesar.png" alt="Kaca Pembesar" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Lensa Kaca Pembesar</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Mencerminkan fungsi pemantauan yang tajam, ketelitian, serta ketepatan evaluasi internal terhadap data makro organisasi.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/panah.png" alt="Panah" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Panah Akselerasi Ke Atas</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Melambangkan pertumbuhan produktivitas efisiensi kerja, akselerasi pelayanan publik, serta arah pandang ke masa depan.</p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm"><img src="/warna.png" alt="Warna Filosofi" className="h-10 w-10 object-contain" /></div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Biru & Emas Corporate</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Biru melambangkan profesionalisme kedinasan. Emas melambangkan kemewahan mutu pelayanan tinggi kepada publik.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layanan & Kontak Footer */}
        <footer id="layanan" className="bg-[#0b1724] pt-20 pb-10 px-6 mt-10 theme-footer">

          {/* ── JUDUL SECTION ── */}
          <div className="max-w-6xl mx-auto mb-12 text-center">
            <p className="text-[11px] font-bold tracking-[0.3em] text-[#D4AF37] uppercase mb-2">Pusat Layanan</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Kontak & Lokasi Kami</h2>
            <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">Kami siap membantu Anda. Kunjungi langsung kantor kami atau hubungi melalui saluran resmi di bawah ini.</p>
          </div>

          {/* ── GRID UTAMA ── */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* KOLOM KIRI: PETA + KONTROL */}
            <div className="lg:col-span-3 space-y-4">

              {/* ── STATUS BUKA/TUTUP REAL-TIME ── */}
              {(() => {
                const now    = new Date();
                const wibH   = parseInt(new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }));
                const wibMin = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getMinutes();
                const wibDay = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getDay(); // 0=Minggu,6=Sabtu
                const wibTotal = wibH * 60 + wibMin;
                const isWeekend = wibDay === 0 || wibDay === 6;
                const isFriday  = wibDay === 5;
                const closeTime = isFriday ? 17 * 60 + 30 : 17 * 60;
                const isOpen    = !isWeekend && wibTotal >= 7 * 60 + 30 && wibTotal < closeTime;
                const nextOpen  = isWeekend ? 'Senin 07.30 WIB' : wibTotal < 7 * 60 + 30 ? 'Hari ini 07.30 WIB' : 'Besok 07.30 WIB';
                return (
                  <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border ${isOpen ? 'bg-emerald-950/60 border-emerald-800/60' : 'bg-slate-800/60 border-slate-700/60'}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${isOpen ? 'bg-emerald-400 pulse-dot' : 'bg-slate-500'}`} />
                      <span className={`font-black text-sm ${isOpen ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isOpen ? 'Kantor Sedang Buka' : 'Kantor Sedang Tutup'}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold ${isOpen ? 'text-emerald-300' : 'text-slate-500'}`}>
                      {isOpen ? `Tutup pukul ${isFriday ? '17.30' : '17.00'} WIB` : `Buka ${nextOpen}`}
                    </span>
                  </div>
                );
              })()}

              {/* ── PETA GOOGLE MAPS ── */}
              <div className="rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/40 relative">
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-[#0b1724]/90 backdrop-blur-sm border border-[#D4AF37]/30 rounded-xl px-3 py-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#D4AF37] pulse-dot" />
                  <span className="text-[11px] font-bold text-[#D4AF37] tracking-wide">GKN Medan</span>
                </div>
                <iframe
                  title="Lokasi Gedung Keuangan Negara Medan"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3982.0143697937793!2d98.67131577597595!3d3.5912688963289975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313040b2b7a2eb%3A0x4498e0a55a2d8082!2sGedung%20Keuangan%20Negara%20Medan!5e0!3m2!1sid!2sid!4v1719000000000!5m2!1sid!2sid"
                  width="100%"
                  height="340"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* ── SELECTOR MODE TRANSPORTASI ── */}
              <div className={`rounded-2xl border border-slate-700/60 bg-slate-800/40 p-4 space-y-3`}>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Rute ke GKN Medan — Pilih Mode Transportasi</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { mode: 'driving',   icon: '🚗', label: 'Mobil',       est: '~10–20 menit' },
                    { mode: 'bicycling', icon: '🛵', label: 'Motor',       est: '~8–15 menit' },
                    { mode: 'walking',   icon: '🚶', label: 'Jalan Kaki',  est: '~30–45 menit' },
                  ].map(({ mode, icon, label, est }) => (
                    <a
                      key={mode}
                      href={`https://www.google.com/maps/dir/?api=1&destination=Gedung+Keuangan+Negara+Medan&travelmode=${mode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-press flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-slate-900/60 border border-slate-700 hover:border-[#D4AF37]/60 hover:bg-[#D4AF37]/10 transition-all group"
                    >
                      <span className="text-xl">{icon}</span>
                      <span className="text-white font-bold text-xs">{label}</span>
                      <span className="text-slate-500 text-[10px] group-hover:text-[#D4AF37] transition-colors">{est}</span>
                    </a>
                  ))}
                </div>
                {/* Info jarak dari pusat kota */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-700/60">
                  <MapPin size={12} className="text-slate-500 shrink-0" />
                  <p className="text-[11px] text-slate-500">Estimasi dari <span className="text-slate-400 font-semibold">Pusat Kota Medan (Lapangan Merdeka)</span> — sekitar <span className="text-white font-semibold">1.8 km</span></p>
                </div>
              </div>

              {/* ── TOMBOL AKSI UTAMA ── */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Gedung+Keuangan+Negara+Medan"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-press flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3.5 px-5 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-sm"
                >
                  <MapPin size={16} /> Buka di Google Maps
                </a>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=Gedung+Keuangan+Negara+Medan&travelmode=driving"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-press flex-1 flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-[#D4AF37]/50 font-bold py-3.5 px-5 rounded-xl text-sm"
                >
                  <ArrowUpRight size={16} /> Mulai Navigasi
                </a>
              </div>
            </div>

            {/* KOLOM KANAN: INFO KONTAK */}
            <div className="lg:col-span-2 space-y-7">

              {/* Identitas Kantor */}
              <div className="flex items-center gap-4">
                <img src="/SIPKA-logo.png" className="h-12 w-auto drop-shadow-md shrink-0" alt="SIPKA" />
                <div>
                  <h3 className="font-black text-white text-lg leading-tight">Kanwil DJKN</h3>
                  <p className="text-[#D4AF37] font-bold text-[11px] tracking-widest">SUMATERA UTARA</p>
                </div>
              </div>

              {/* Kartu-kartu Kontak */}
              <div className="space-y-3">
                {/* Alamat */}
                <a href="https://www.google.com/maps/search/?api=1&query=Gedung+Keuangan+Negara+Medan" target="_blank" rel="noreferrer"
                  className="flex items-start gap-3.5 group p-3.5 rounded-xl border border-transparent hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all">
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors shrink-0 mt-0.5"><MapPin size={16} className="text-[#D4AF37]" /></div>
                  <div>
                    <p className="text-white font-bold text-sm leading-snug">Gedung Keuangan Negara (GKN) Medan</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">Jl. Pangeran Diponegoro No.30-A<br/>Medan Baru, Kota Medan 20152</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-semibold text-[#D4AF37] group-hover:underline">Lihat di Maps <ArrowUpRight size={10} /></span>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:kanwil.sumut@kemenkeu.go.id"
                  className="flex items-center gap-3.5 group p-3.5 rounded-xl border border-transparent hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all">
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors shrink-0"><Mail size={16} className="text-[#D4AF37]" /></div>
                  <div>
                    <p className="text-white font-bold text-sm">kanwil.sumut@kemenkeu.go.id</p>
                    <p className="text-slate-400 text-xs mt-0.5">Email resmi institusi</p>
                  </div>
                </a>

                {/* Telepon */}
                <a href="tel:+62614538558"
                  className="flex items-center gap-3.5 group p-3.5 rounded-xl border border-transparent hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5 transition-all">
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12.3a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.6h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.1a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">(061) 453-8558</p>
                    <p className="text-slate-400 text-xs mt-0.5">Telepon kantor</p>
                  </div>
                </a>

                {/* Jam Operasional */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60">
                  <div className="p-2.5 bg-slate-700 rounded-xl shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm mb-1.5">Jam Operasional</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between"><span className="text-slate-400">Senin – Kamis</span><span className="text-white font-semibold">07.30 – 17.00 WIB</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Jumat</span><span className="text-white font-semibold">07.30 – 17.30 WIB</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Sabtu & Minggu</span><span className="text-slate-500 font-semibold">Libur</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Media Sosial */}
              <div>
                <p className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase mb-3">Media Sosial Resmi</p>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/djknkanwilsumut/?hl=en" target="_blank" rel="noreferrer" title="Instagram" className="btn-press p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-pink-500 hover:bg-pink-500/10 transition-all group shadow-md"><SiInstagram size={18} className="text-slate-400 group-hover:text-pink-500 transition-colors" /></a>
                  <a href="https://www.facebook.com/kanwildjknsumut/?locale=id_ID" target="_blank" rel="noreferrer" title="Facebook" className="btn-press p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/10 transition-all group shadow-md"><SiFacebook size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" /></a>
                  <a href="https://www.youtube.com/@KanwilDJKNSumut" target="_blank" rel="noreferrer" title="YouTube" className="btn-press p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-red-500 hover:bg-red-500/10 transition-all group shadow-md"><SiYoutube size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" /></a>
                </div>
              </div>
            </div>
          </div>

          {/* ── FOOTER BAWAH ── */}
          <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-500 font-medium">&copy; {new Date().getFullYear()} Kanwil DJKN Sumatera Utara. Hak Cipta Dilindungi Undang-Undang.</p>
            <p className="text-[11px] text-slate-600 font-medium">Dibangun dengan SIPKA v2.0</p>
          </div>
        </footer>
      </div>
    );
  }

  // ==================== TAMPILAN DASHBOARD SETELAH LOGIN ====================
  return (
    <div className={`theme-root theme-dashboard-root flex flex-col md:flex-row h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans relative ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      <style>{THEME_STYLE}</style>
      <ToastNotification />
      
      {/* 1. TOP BAR MOBILE */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md theme-dashboard-top">
        <div className="flex items-center gap-3">
          <img src="/SIPKA-logo.png" alt="Logo SIPKA" className="h-8 w-auto object-contain shrink-0" />
          <div><h1 className="font-extrabold text-sm text-[#D4AF37] leading-none">SIPKA SUMUT</h1><p className="text-[9px] text-slate-600 mt-0.5">Sistem Pemantauan Terpadu</p></div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Ganti tema" className="btn-press p-2 text-slate-600 hover:text-[#D4AF37] bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            <span className="inline-block transition-transform duration-500" style={{ transform: isDarkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</span>
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Buka menu" className="btn-press p-2 text-slate-600 hover:text-white bg-slate-100 rounded-xl border border-slate-200">{isMobileMenuOpen ? <X size={18} className="text-[#D4AF37]" /> : <Menu size={18} />}</button>
        </div>
      </header>

      {/* OVERLAY NAVIGATION MOBILE */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 md:hidden animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* 2. SIDEBAR NAVIGATION */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-white flex flex-col justify-between shadow-[10px_0_30px_rgba(15,23,42,0.08)] border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:sticky md:h-screen md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50 backdrop-blur-sm theme-sidebar-header">
            <div className="flex items-center gap-4">
              <img src="/SIPKA-logo.png" alt="Logo SIPKA" className="h-10 w-auto object-contain shrink-0" />
              <div><h1 className="font-black text-lg leading-tight text-slate-900">SIPKA</h1><p className="text-[9px] text-[#D4AF37] font-bold mt-0.5 tracking-wider">KANWIL SUMUT</p></div>
            </div>
            <button onClick={toggleTheme} aria-label="Ganti tema" className="btn-press p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-[#D4AF37] overflow-hidden">
              <span className="inline-block transition-transform duration-500" style={{ transform: isDarkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</span>
            </button>
          </div>
          <nav className="p-4 space-y-2">
            <button onClick={() => navigateTo('dashboard')} className={`btn-press relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${currentView === 'dashboard' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'}`}><LayoutDashboard size={18} /> Dashboard Keuangan</button>
            <button onClick={() => navigateTo('statistik')} className={`btn-press relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${currentView === 'statistik' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'}`}><Users size={18} /> Statistik Pegawai</button>
            <button onClick={() => navigateTo('profile')} className={`btn-press relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${currentView === 'profile' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5'}`}><Settings size={18} /> Pengaturan Profil</button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 bg-white theme-surface">
          <button onClick={handleLogout} className="btn-press w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest"><LogOut size={14} /> Keluar</button>
        </div>
      </aside>


      {/* 3. AREA KONTEN UTAMA DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-slate-100 theme-dashboard-main">
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          {/* HEADER INFO */}
          <div className="hidden md:flex justify-between items-center mb-6 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm theme-surface">
            <div>
              <h2 className="text-sm font-medium text-slate-600">Selamat Datang di SIPKA, <span className="text-[#D4AF37] font-bold">{sessionUser?.name}</span></h2>
              <p className="text-xs text-slate-600 mt-0.5">Unit Kerja: {sessionUser?.unit} ({sessionUser?.role?.toUpperCase()})</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold text-[#D4AF37] tracking-wider">{formatTimeWIB(currentTime)}</div>
              <div className="text-[11px] text-slate-600 font-medium mt-0.5">{formatDateID(currentTime)}</div>
            </div>
          </div>
          <div className="md:hidden bg-white border border-slate-200 rounded-xl p-3 mb-4 flex justify-between items-center shadow-sm theme-surface">
            <div className="text-xs font-semibold text-slate-700">{sessionUser?.name} ({sessionUser?.unit})</div>
            <div className="text-right font-mono text-xs font-bold text-[#D4AF37]">{formatTimeWIB(currentTime)}</div>
          </div>

          {/* VIEW: DASHBOARD KEUANGAN */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* KARTU KEUANGAN UTAMA */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card-hover relative overflow-hidden bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light animate-riseIn" style={{ animationDelay: '0ms' }}>
                  <div className="absolute -right-4 -top-4 text-[#D4AF37]/10"><TrendingUp size={90} /></div>
                  <div className={`text-xs font-medium relative z-10 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Total Pagu / Realisasi</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm relative z-10">Rp {totalRealisasi} M</div>
                  <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold relative z-10"><TrendingUp size={12}/> Berdasarkan log mutasi</div>
                </div>
                <div className="card-hover relative overflow-hidden bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light animate-riseIn" style={{ animationDelay: '80ms' }}>
                  <div className="absolute -right-4 -top-4 text-[#D4AF37]/10"><LayoutDashboard size={90} /></div>
                  <div className={`text-xs font-medium relative z-10 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Jumlah Transaksi</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm relative z-10">{transaksi.length} Berkas</div>
                  <div className={`text-[10px] mt-2 font-medium relative z-10 ${isDarkMode ? "text-white" : "text-slate-600"}`}>Tercatat di sistem lokal</div>
                </div>
                <div className="card-hover relative overflow-hidden bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light animate-riseIn" style={{ animationDelay: '160ms' }}>
                  <div className="absolute -right-4 -top-4 text-[#D4AF37]/10"><ShieldCheck size={90} /></div>
                  <div className={`text-xs font-medium relative z-10 ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>Status Anggaran</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm relative z-10 flex items-center gap-2">
                    Optimal <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                  </div>
                  <div className={`text-[10px] mt-2 font-medium relative z-10 ${isDarkMode ? "text-white" : "text-slate-600"}`}>Sesuai dengan pagu DIPA</div>
                </div>
              </div>


              {/* GRAFIK KEUANGAN */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-hover bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light animate-riseIn" style={{ animationDelay: '120ms' }}>
                  <h3 className={`text-xs font-black mb-5 tracking-widest uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>Tren Realisasi Anggaran (Jutaan Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={processedDataTren}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} itemStyle={chartTooltipItemStyle} />
                        <Area type="monotone" dataKey="Realisasi" stroke="#D4AF37" strokeWidth={3} fillOpacity={0.15} fill="#D4AF37" animationDuration={800} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="card-hover bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light animate-riseIn" style={{ animationDelay: '200ms' }}>
                  <h3 className={`text-xs font-black mb-5 tracking-widest uppercase ${isDarkMode ? "text-white" : "text-slate-900"}`}>Alokasi Per Bidang (Miliar Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={processedDataBidang}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: chartCursorFill }} />
                        <Bar dataKey="Rp" radius={[4, 4, 0, 0]} animationDuration={800}>
                          {processedDataBidang.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#D4AF37' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* FORM TRANSAKSI & LOG MUTASI */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {sessionUser?.role === 'admin' && (
                  <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl h-fit theme-panel-light">
                    <h3 className={`text-xs font-black mb-5 flex items-center gap-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                      <PlusCircle size={16} className="text-[#D4AF37]" /> TAMBAH TRANSAKSI BARU
                    </h3>
                    
                    <form onSubmit={handleTambahTransaksi} className="space-y-4 text-xs">
                      <div>
                        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Uraian Transaksi</label>
                        <input type="text" value={uraianInput} onChange={(e) => setUraianInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-300" placeholder="Contoh: Pembelian ATK Kantor" required />
                      </div>
                      <div>
                        <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Nominal Anggaran (Rp)</label>
                        <input type="number" min="0" value={nominalInput} onChange={(e) => setNominalInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-300" placeholder="Contoh: 5000000" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Bidang / Unit</label>
                          <select value={bidangInput} onChange={(e) => setBidangInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-300 cursor-pointer">
                            <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                          </select>
                        </div>
                        <div>
                          <label className={`block mb-1.5 font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}>Jenis Arus</label>
                          <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-300 cursor-pointer">
                            <option value="keluar">Pengeluaran</option><option value="masuk">Pemasukan</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button type="submit" disabled={isSavingTransaksi} className="btn-press flex-1 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 rounded-xl shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                          {isSavingTransaksi ? <Settings size={14} className="spinner-icon" /> : <PlusCircle size={14}/>}
                          {isSavingTransaksi ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <label className={`btn-press flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl border border-slate-600 flex items-center justify-center gap-2 ${isImportingTransaksi ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
                          <input type="file" accept=".xlsx, .xls" onChange={handleImportExcel} className="hidden" disabled={isImportingTransaksi} />
                          {isImportingTransaksi ? <Settings size={14} className="spinner-icon" /> : null}
                          {isImportingTransaksi ? 'Memproses...' : 'Import Excel'}
                        </label>
                      </div>
                    </form>
                  </div>
                )}

                <div className={`bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light animate-riseIn ${sessionUser?.role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}`} style={{ animationDelay: '120ms' }}>
                  <div className="flex flex-col gap-3 mb-5">
                    <h3 className="text-xs font-black text-white tracking-widest uppercase">Log Mutasi Anggaran Terkini</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-[11px] text-slate-300 leading-relaxed">Gunakan checkbox untuk memilih satu atau banyak data, lalu hapus sekaligus agar proses lebih cepat.</p>
                      {sessionUser?.role === 'admin' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[11px] font-medium px-3 py-2 rounded-xl border ${isDarkMode ? "text-slate-300 bg-slate-900/30 border-slate-700/50" : "text-slate-700 bg-white border-slate-200 shadow-sm"}`}>
                            {selectedTransaksi.length} dipilih
                          </span>
                          <button type="button" onClick={handleSelectAllTransaksi} className={`btn-press inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl border ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"}`}>
                            <input type="checkbox" ref={selectAllTransaksiRef} checked={isAllTransaksiSelected} readOnly className="h-4 w-4 accent-[#D4AF37]" /> Select All
                          </button>
                          <button type="button" onClick={() => handleHapusTransaksi()} disabled={selectedTransaksi.length === 0} className={`btn-press inline-flex items-center gap-2 text-[11px] font-bold px-4 py-2 rounded-xl border disabled:cursor-not-allowed ${isDarkMode ? "bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-400 text-white border-rose-400/40" : "bg-rose-50 hover:bg-rose-100 disabled:bg-slate-100 disabled:text-slate-400 text-rose-600 border-rose-200 shadow-sm"}`}>
                            <Trash2 size={14} /> Hapus Terpilih
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={14} className="text-slate-400" /></div>
                      <input
                        type="text"
                        placeholder="Cari uraian atau bidang transaksi..."
                        value={searchTransaksi}
                        onChange={(e) => setSearchTransaksi(e.target.value)}
                        className={`w-full sm:w-72 pl-9 pr-3 py-2.5 rounded-xl text-xs focus:outline-none transition-all border ${isDarkMode ? 'bg-slate-900/40 border-slate-700 text-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30' : 'bg-white border-slate-200 text-slate-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30'}`}
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-left text-xs border-collapse relative">
                      <thead className={`sticky top-0 backdrop-blur-sm z-10 ${isDarkMode ? "bg-[#0f172a]/95" : "bg-slate-100"}`}>
                        <tr className={`border-b ${isDarkMode ? "border-slate-700 text-slate-300" : "border-slate-200 text-slate-700"}`}>
                          {sessionUser?.role === 'admin' && <th className="py-3 px-2 font-bold text-center w-12"><span className="sr-only">Select</span></th>}
                          <th className="py-3 px-2 font-bold">Tanggal</th>
                          <th className="py-3 px-2 font-bold">Uraian</th>
                          <th className="py-3 px-2 font-bold">Bidang</th>
                          <th className="py-3 px-2 font-bold text-right">Jumlah (Rp)</th>
                          <th className="py-3 px-2 font-bold text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDarkMode ? "divide-slate-700/50" : "divide-slate-200/80"}`}>
                        {filteredTransaksi.map((t) => {
                          const isSelected = selectedTransaksi.includes(t.id);
                          const isBaruDitambah = t.id === lastAddedTransaksiId;
                          return (
                            <tr key={t.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40 text-slate-200' : 'hover:bg-slate-50 text-slate-700'} ${isSelected ? (isDarkMode ? 'bg-slate-800/60' : 'bg-blue-50') : ''} ${isBaruDitambah ? 'row-highlight-new' : ''}`}>
                              {sessionUser?.role === 'admin' && (
                                <td className="py-3.5 px-2 text-center align-middle">
                                  <input type="checkbox" checked={isSelected} onChange={() => handleToggleTransaksiSelect(t.id)} className="h-4 w-4 accent-[#D4AF37] cursor-pointer" />
                                </td>
                              )}
                              <td className="py-3.5 px-2 whitespace-nowrap">{t.date}</td>
                              <td className="py-3.5 px-2 max-w-xs truncate pr-4">{t.uraian}</td>
                              <td className="py-3.5 px-2"><span className={`px-2.5 py-1 rounded-md border text-[10px] font-semibold ${isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>{t.bidang}</span></td>
                              <td className={`py-3.5 px-2 text-right font-bold ${t.tipe === 'masuk' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.tipe === 'masuk' ? '+' : '-'} {t.jumlah.toLocaleString('id-ID')}</td>
                              <td className="py-3.5 px-2 text-center">
                                {sessionUser?.role === 'admin' && (
                                  <button onClick={() => handleHapusTransaksi(t.id)} title="Hapus Data" className="text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/50 p-1.5 rounded-md transition-all hover:scale-110 inline-flex items-center justify-center"><Trash2 size={14} /></button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {filteredTransaksi.length === 0 && transaksi.length > 0 && (
                          <tr><td colSpan={sessionUser?.role === 'admin' ? 6 : 5} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <Search size={24} className="opacity-40" />
                              <span className="font-medium text-sm">Tidak ada hasil untuk "{searchTransaksi}"</span>
                            </div>
                          </td></tr>
                        )}
                        {transaksi.length === 0 && (
                          <tr><td colSpan={sessionUser?.role === 'admin' ? 6 : 5} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <Info size={24} className="opacity-40" />
                              <span className="font-medium text-sm">Belum ada log mutasi.</span>
                              <span className="text-[11px] opacity-75">Tambahkan transaksi baru atau import data Excel untuk memulai.</span>
                            </div>
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: STATISTIK PEGAWAI */}
          {currentView === 'statistik' && (
             <div className="space-y-6 animate-fadeIn">
              
              {/* UPLOAD PANEL */}
              <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Import Data Excel Pegawai</h3>
                    <p className={`text-[11px] mt-2 leading-relaxed max-w-2xl ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                      Cukup upload <span className="text-[#D4AF37] font-semibold">Data All.csv</span> Anda. Sistem otomatis melacak dan mengonversi kolom <span className="text-white font-medium">NIP, Nama, Jabatan, Unit/Bidang, Gender, Pendidikan, Generasi, Goldar,</span> dan <span className="text-white font-medium">Agama</span> menjadi statistik secara dinamis.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className={`btn-press inline-flex items-center justify-center gap-2 text-center bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 px-5 rounded-xl shadow-lg shadow-[#D4AF37]/20 text-xs uppercase tracking-wider ${isImportingStatistik ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}>
                      <input type="file" accept=".csv, .xlsx, .xls" onChange={handleImportStatistikExcel} className="hidden" disabled={isImportingStatistik} />
                      {isImportingStatistik ? <Settings size={14} className="spinner-icon" /> : null}
                      {isImportingStatistik ? 'Memproses...' : 'Import Excel / CSV'}
                    </label>
                    {statistikExcelFileName && (
                      <button type="button" onClick={handleResetStatistikImport} className={`btn-press inline-flex items-center justify-center gap-2 text-center font-bold py-3 px-5 rounded-xl transition-colors border text-xs uppercase tracking-wider ${isDarkMode ? "bg-slate-800 hover:bg-slate-700 text-white border-slate-600" : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm"}`}>Reset Data</button>
                    )}
                  </div>
                </div>
                {statistikExcelFileName && (
                  <p className={`text-[11px] mt-4 animate-fadeIn ${isDarkMode ? "text-emerald-300" : "text-slate-600"}`}>
                    File aktif: <span className={isDarkMode ? "font-semibold text-white" : "font-semibold text-slate-900"}>{statistikExcelFileName}</span> · Visualisasi 100% menggunakan data yang diimpor.
                  </p>
                )}
              </div>

              {/* 4 KARTU RINGKASAN SDM DENGAN DRILL-DOWN MODAL (DIPINDAH KE SINI) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setShowPegawaiModal(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowPegawaiModal(true); } }}
                  role="button" tabIndex={0} aria-haspopup="dialog"
                  className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-md cursor-pointer group theme-panel-light flex items-center gap-4"
                  style={{ animationDelay: '0ms' }}
                >
                  <div className="bg-[#D4AF37]/20 p-3.5 rounded-xl text-[#D4AF37] group-hover:scale-110 transition-transform"><Users size={24} /></div>
                  <div className="flex-1">
                    <div className="text-2xl font-black text-[#D4AF37]">{daftarPegawai.length}</div>
                    <div className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Total Pegawai</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-0.5">Klik untuk detail <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></div>
                  </div>
                </div>
                <div
                  onClick={() => setShowUnitModal(true)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowUnitModal(true); } }}
                  role="button" tabIndex={0} aria-haspopup="dialog"
                  className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-md cursor-pointer group theme-panel-light flex items-center gap-4"
                  style={{ animationDelay: '80ms' }}
                >
                  <div className="bg-blue-500/20 p-3.5 rounded-xl text-blue-400 group-hover:scale-110 transition-transform"><LayoutGrid size={24} /></div>
                  <div className="flex-1">
                    <div className="text-2xl font-black text-blue-400">{dataStatistikUnitTampil.length}</div>
                    <div className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Bidang / Unit</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-0.5">Klik untuk detail <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /></div>
                  </div>
                </div>
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-md theme-panel-light flex items-center gap-4" style={{ animationDelay: '160ms' }}>
                  <div className="bg-indigo-500/20 p-3.5 rounded-xl text-indigo-400"><User size={24} /></div>
                  <div>
                    <div className="text-2xl font-black text-indigo-400">{dataStatistikGenderTampil.find(g => g.name === 'Laki-Laki')?.value || 0}</div>
                    <div className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Laki-laki</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Pegawai</div>
                  </div>
                </div>
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-md theme-panel-light flex items-center gap-4" style={{ animationDelay: '240ms' }}>
                  <div className="bg-rose-500/20 p-3.5 rounded-xl text-rose-400"><User size={24} /></div>
                  <div>
                    <div className="text-2xl font-black text-rose-400">{dataStatistikGenderTampil.find(g => g.name === 'Perempuan')?.value || 0}</div>
                    <div className={`text-[11px] font-bold ${isDarkMode ? "text-white" : "text-slate-800"}`}>Perempuan</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">Pegawai</div>
                  </div>
                </div>
              </div>

              {/* GRAFIK STATISTIK */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light" style={{ animationDelay: '0ms' }}>
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Sebaran Pegawai per Unit Kerja</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikUnitTampil} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis dataKey="unit" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: chartCursorFill }} contentStyle={chartTooltipStyle} />
                        <Bar dataKey="jumlah" fill="#D4AF37" radius={[0, 4, 4, 0]} animationDuration={800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light" style={{ animationDelay: '80ms' }}>
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Profil Berdasarkan Generasi</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikGenerasiTampil}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{ fill: chartCursorFill }} contentStyle={chartTooltipStyle} />
                        <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} animationDuration={800} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light" style={{ animationDelay: '160ms' }}>
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Proporsi Gender Pegawai</h3>
                  <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="w-full h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataStatistikGenderTampil} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none" animationDuration={800}>
                            {dataStatistikGenderTampil.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                          </Pie>
                          <Tooltip contentStyle={chartTooltipStyle} />
                          <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={chartLegendStyle} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="card-hover animate-riseIn bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light" style={{ animationDelay: '240ms' }}>
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Sebaran Golongan Darah</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGoldarTampil} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none" animationDuration={800}>
                          {dataStatistikGoldarTampil.map((entry, index) => (<Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />))}
                        </Pie>
                        <Tooltip contentStyle={chartTooltipStyle} />
                        <Legend verticalAlign="bottom" height={36} iconSize={10} wrapperStyle={chartLegendStyle} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card-hover bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Tingkat Pendidikan Terakhir</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikPendidikanTampil.map((p, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-xl transition-all hover:scale-[1.015] ${isDarkMode ? "bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60" : "bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
                        <span className={`${isDarkMode ? "text-slate-200" : "text-slate-700"} font-medium`}>{p.name}</span>
                        <span className="font-bold text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 rounded-md">{p.jumlah} Pegawai</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-hover bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Struktur Eselonering / Jabatan</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikJabatanTampil.map((j, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-xl transition-all hover:scale-[1.015] ${isDarkMode ? "bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60" : "bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
                        <span className={`${isDarkMode ? "text-slate-200" : "text-slate-700"} font-medium`}>{j.name}</span>
                        <span className="font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded-md">{j.jumlah} Orang</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-hover bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className={`text-xs font-black mb-5 uppercase tracking-widest ${isDarkMode ? "text-white" : "text-slate-900"}`}>Klasifikasi Agama</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                    {dataStatistikAgamaTampil.map((a, idx) => (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-xl transition-all hover:scale-[1.015] ${isDarkMode ? "bg-slate-900/40 border border-slate-700/50 hover:bg-slate-800/60" : "bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"}`}>
                        <span className={`${isDarkMode ? "text-slate-200" : "text-slate-700"} font-medium`}>{a.name}</span>
                        <span className="font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-md">{a.jumlah} Pegawai</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          )}

          {/* VIEW: PENGATURAN PROFIL */}
          {currentView === 'profile' && (
            <div className="p-4 max-w-2xl mx-auto w-full animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md theme-surface card-hover">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-5">
                  <div className="p-2 bg-[#D4AF37]/10 rounded-xl"><Settings className="text-[#D4AF37]" size={24} /></div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">Manajemen Profil Kredensial</h3>
                </div>
                {profileSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3.5 rounded-xl text-xs text-center font-bold mb-5 shadow-sm animate-popIn flex items-center justify-center gap-2"><CheckCircle size={14} /> {profileSuccess}</div>
                )}
                <form onSubmit={handleSaveProfile} className="space-y-5 text-sm">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Nama Lengkap</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400" required />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Ubah Password</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={editPassword} onChange={(e) => setEditPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="btn-press absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Asal Bagian / Unit Kerja</label>
                    <select value={editUnit} onChange={(e) => setEditUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30 transition-all hover:border-slate-400 cursor-pointer">
                      <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                    </select>
                  </div>
                  <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button type="button" onClick={() => setCurrentView('dashboard')} className="btn-press bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl">Batal</button>
                    <button type="submit" className="btn-press bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black px-6 py-3 rounded-xl flex items-center gap-2 shadow-md text-xs tracking-wider"><UserCheck size={16} /> Simpan Perubahan Profil</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* ==================== MODAL DRILL-DOWN ==================== */}

        {/* MODAL 1: DAFTAR PEGAWAI DINAMIS */}
        {showPegawaiModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowPegawaiModal(false)}>
            <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-popIn ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
               <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                  <h3 className={`text-lg font-black ${isDarkMode ? 'text-[#D4AF37]' : 'text-slate-800'}`}>Daftar Pegawai Terpadu ({daftarPegawai.length} Orang)</h3>
                  <button onClick={() => setShowPegawaiModal(false)} aria-label="Tutup" className="btn-press text-slate-400 hover:text-rose-500 hover:rotate-90 p-2 rounded-full hover:bg-rose-500/10"><X size={20}/></button>
               </div>
               
               <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-slate-400" /></div>
                    <input 
                      type="text" 
                      placeholder="Cari berdasarkan nama, NIP, jabatan, atau unit..." 
                      value={searchPegawai}
                      onChange={(e) => setSearchPegawai(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all border ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-200 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30'}`}
                    />
                  </div>
                  <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                    <table className="w-full text-left text-xs">
                      <thead className={`border-b ${isDarkMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                        <tr>
                          <th className="p-3 font-bold">No</th><th className="p-3 font-bold">NIP</th><th className="p-3 font-bold">Nama</th>
                          <th className="p-3 font-bold">Jabatan</th><th className="p-3 font-bold">Unit / Bidang</th><th className="p-3 font-bold">Pendidikan</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700/50 text-slate-300' : 'divide-slate-200 text-slate-600'}`}>
                        {filteredPegawai.map((p, index) => (
                          <tr key={p.id} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                            <td className="p-3">{index + 1}</td>
                            <td className="p-3 font-mono text-[11px] text-[#D4AF37]">{p.nip}</td>
                            <td className="p-3 font-semibold">{p.nama}</td>
                            <td className="p-3"><span className="px-2 py-1 bg-slate-500/10 rounded-md">{p.jabatan}</span></td>
                            <td className="p-3">{p.unit}</td>
                            <td className="p-3">{p.pendidikan}</td>
                          </tr>
                        ))}
                        {filteredPegawai.length === 0 && (
                          <tr><td colSpan="6" className="py-10 text-center">
                            <div className="flex flex-col items-center gap-2 text-slate-500">
                              <Search size={22} className="opacity-40" />
                              <span>Pencarian "{searchPegawai}" tidak ditemukan pada data ini.</span>
                            </div>
                          </td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-700/50 flex justify-end">
                  <button onClick={() => setShowPegawaiModal(false)} className="btn-press px-6 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold">Tutup Jendela</button>
               </div>
            </div>
          </div>
        )}

        {/* MODAL 2: DETAIL UNIT KERJA */}
        {showUnitModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setShowUnitModal(false)}>
            <div onClick={(e) => e.stopPropagation()} className={`w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-popIn ${isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
               <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                  <h3 className={`text-lg font-black ${isDarkMode ? 'text-[#D4AF37]' : 'text-slate-800'}`}>Detail Unit: Bidang PKN</h3>
                  <button onClick={() => setShowUnitModal(false)} aria-label="Tutup" className="btn-press text-slate-400 hover:text-rose-500 hover:rotate-90 p-2 rounded-full hover:bg-rose-500/10"><X size={20}/></button>
               </div>
               <div className="p-6 flex-1 overflow-y-auto custom-scrollbar space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-500 font-bold mb-1">Total Pegawai</span>
                        <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>9</span>
                     </div>
                     <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-500 font-bold mb-1">Realisasi</span>
                        <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Rp 18.45 Miliar</span>
                     </div>
                     <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-500 font-bold mb-1">Persentase</span>
                        <span className="text-xl font-black text-emerald-500">68,45%</span>
                     </div>
                     <div className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-transform hover:scale-105 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <span className="text-[10px] text-slate-500 font-bold mb-1">Total Transaksi</span>
                        <span className={`text-xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>24</span>
                     </div>
                  </div>
                  <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <h4 className={`text-xs font-bold mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Grafik Realisasi Unit</h4>
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockRealisasiUnitBulanan}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                          <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                          <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: chartCursorFill }} />
                          <Bar dataKey="Realisasi" fill="#10B981" radius={[2, 2, 0, 0]} barSize={20} animationDuration={800} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
               </div>
               <div className="p-4 border-t border-slate-700/50 flex justify-end">
                  <button onClick={() => setShowUnitModal(false)} className="btn-press px-6 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold">Tutup</button>
               </div>
            </div>
          </div>
        )}

        {/* Footer Khusus Dashboard Internal */}
        <footer className="bg-white border-t border-slate-200 rounded-t-[2.5rem] px-8 py-12 mt-12 shadow-[0_-10px_35px_rgba(15,23,42,0.06)] theme-footer">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/SIPKA-logo.png" className="h-10 w-auto drop-shadow-md" alt="SIPKA" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">SIPKA</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pr-4">Sistem Informasi Pemantauan Kepegawaian & Keuangan Kanwil DJKN Sumatera Utara.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 tracking-widest uppercase drop-shadow-sm">Kontak Internal</h3>
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
                <a href="https://www.instagram.com/djknkanwilsumut/?hl=en" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-pink-500 hover:scale-110 transition-all duration-300 group shadow-sm"><SiInstagram size={20} className="text-slate-500 group-hover:text-pink-500 transition-colors" /></a>
                <a href="https://www.facebook.com/kanwildjknsumut/?locale=id_ID" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-blue-500 hover:scale-110 transition-all duration-300 group shadow-sm"><SiFacebook size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" /></a>
                <a href="https://www.youtube.com/@KanwilDJKNSumut" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-red-500 hover:scale-110 transition-all duration-300 group shadow-sm"><SiYoutube size={20} className="text-slate-500 group-hover:text-red-500 transition-colors" /></a>
              </div>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">&copy; {new Date().getFullYear()} Kanwil DJKN Sumatera Utara. All rights reserved.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}