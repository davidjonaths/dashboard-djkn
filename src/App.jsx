import * as XLSX from 'xlsx';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, TrendingUp, Bell, User, LogOut, Home,
  ArrowUpRight, PlusCircle, PieChart as PieIcon, Lock, UserPlus, Settings, UserCheck, Users, Menu, X,
  Shield, CheckCircle, Target, Info, MapPin, Mail, Eye, EyeOff, ArrowLeft, Sun, Moon, Trash2
} from 'lucide-react';
import { SiInstagram, SiFacebook, SiYoutube } from 'react-icons/si';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

// ==================== [1] DATA GRAFIK KEUANGAN (PERSISTEN) ====================
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

const THEME_STYLE = `
.theme-light {
  color: #0f172a;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important;
}

.theme-light .theme-text-primary,
.theme-light .text-white,
.theme-light .text-slate-900,
.theme-light .text-slate-800 {
  color: #0f172a !important;
}

.theme-light .theme-text-secondary,
.theme-light .text-slate-300,
.theme-light .text-slate-400,
.theme-light .text-slate-500,
.theme-light .text-slate-600,
.theme-light .text-slate-700 {
  color: #475569 !important;
}

.theme-light .theme-text-muted {
  color: #64748b !important;
}

.theme-light .theme-border,
.theme-light .border-slate-200,
.theme-light .border-slate-700,
.theme-light .border-slate-800,
.theme-light .border-slate-900 {
  border-color: #dbe3f0 !important;
}

.theme-light .theme-root {
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important;
}

.theme-light .theme-landing-nav,
.theme-light .theme-dashboard-top,
.theme-light .theme-surface,
.theme-light .theme-sidebar,
.theme-light .theme-sidebar-header,
.theme-light .theme-footer,
.theme-light .theme-card-light,
.theme-light .theme-panel-light {
  background-color: rgba(255, 255, 255, 0.96) !important;
  border-color: #dbe3f0 !important;
}

.theme-light .theme-landing-menu {
  background-color: rgba(255, 255, 255, 0.98) !important;
  border-color: #dbe3f0 !important;
}

.theme-light .theme-hero-glow {
  background: radial-gradient(circle, rgba(212,175,55,0.16), rgba(212,175,55,0.05) 48%, transparent 72%) !important;
}

.theme-light [class*="bg-slate-900/40"],
.theme-light [class*="bg-slate-800/30"],
.theme-light [class*="bg-slate-800/40"],
.theme-light [class*="bg-slate-800/50"],
.theme-light [class*="bg-slate-800/60"],
.theme-light [class*="bg-slate-700/40"],
.theme-light [class*="bg-slate-700/50"],
.theme-light [class*="bg-slate-700/60"] {
  background-color: rgba(255, 255, 255, 0.96) !important;
  border-color: #dbe3f0 !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08) !important;
}

.theme-light [class*="from-[#17375f] via-[#1d4f86] to-[#132f55]"] {
  background-image: linear-gradient(135deg, #ffffff 0%, #f8fbff 55%, #eef4ff 100%) !important;
  border-color: #dbe3f0 !important;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08) !important;
}

.theme-light [class*="bg-[#0f172a]/90"],
.theme-light [class*="bg-[#0b1724]"],
.theme-light [class*="bg-[#020617]"] {
  background-color: rgba(255, 255, 255, 0.98) !important;
  border-color: #dbe3f0 !important;
}

.theme-light [class*="bg-gradient-to-br from-[#0f172a] via-[#0b1724] to-[#020617]"] {
  background-image: linear-gradient(135deg, #f8fafc 0%, #ffffff 54%, #eef4ff 100%) !important;
}

.theme-light [class*="bg-white"] {
  background-color: rgba(255, 255, 255, 0.98) !important;
}

.theme-light [class*="text-[#D4AF37]"] {
  color: #b8860b !important;
}

/* Custom Scrollbar untuk Tabel Log Mutasi */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.1); 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.5); 
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.8); 
}
`;

const STATISTIK_FIELD_ALIASES = {
  unit: ['unit', 'bagian', 'bidang', 'seksi', 'departemen', 'department', 'office'],
  gender: ['gender', 'jenis_kelamin', 'jk', 'sex'],
  jabatan: ['jabatan', 'posisi', 'eselon', 'grade'],
  pendidikan: ['pendidikan', 'education', 'degree'],
  generasi: ['generasi', 'kelompok_usia', 'age_group', 'angkatan'],
  goldar: ['goldar', 'golongan_darah', 'blood_type', 'golongan darah'],
  agama: ['agama', 'religion', 'kepercayaan']
};

const normalizeCell = (value) => String(value ?? '').trim();

const pickFirstValue = (row, aliases) => {
  for (const key of aliases) {
    const value = normalizeCell(row?.[key]);
    if (value) return value;
  }
  return '';
};

const buildCountData = (rows, aliases, order = [], valueKey = 'jumlah', labelKey = 'name') => {
  const counts = new Map();

  rows.forEach((row) => {
    const value = pickFirstValue(row, aliases) || 'Tidak diketahui';
    counts.set(value, (counts.get(value) || 0) + 1);
  });

  const ordered = order.map((name) => ({
    [labelKey]: name,
    [valueKey]: counts.get(name) || 0,
  }));

  const extras = [...counts.entries()]
    .filter(([name]) => !order.includes(name))
    .map(([name, count]) => ({
      [labelKey]: name,
      [valueKey]: count,
    }));

  return [...ordered, ...extras];
};

export default function App() {
  // --- STATE NAVIGATION & AUTHENTICATION ---
  const [currentView, setCurrentView] = useState('dashboard'); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // State Khusus Landing Page & Login
  const [showAuthForm, setShowAuthForm] = useState(false); 
  const [isLandingMobileMenuOpen, setIsLandingMobileMenuOpen] = useState(false);

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('djkn_theme') : null;
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });
  const isDarkMode = themeMode === 'dark';
  const toggleTheme = () => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  
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
    localStorage.setItem('djkn_theme', themeMode);
  }, [themeMode]);

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
  const [selectedTransaksi, setSelectedTransaksi] = useState([]);
  const selectAllTransaksiRef = useRef(null);
  const isAllTransaksiSelected = transaksi.length > 0 && selectedTransaksi.length === transaksi.length;
  const isSomeTransaksiSelected = selectedTransaksi.length > 0 && selectedTransaksi.length < transaksi.length;

  // --- LOGIKA AUTOKALKULASI DATA EXCEL (useMemo) ---
  const totalRealisasi = useMemo(() => {
    const total = transaksi.reduce((sum, t) => t.tipe === 'keluar' ? sum + t.jumlah : sum, 0);
    return (total / 1000000000).toFixed(2);
  }, [transaksi]);

  const processedDataBidang = useMemo(() => {
    const totals = { 'Bagian Umum': 0, 'PKN': 0, 'Lelang': 0, 'KIHI': 0 };
    
    transaksi.forEach((t) => {
      if (t.tipe === 'keluar') {
        if (totals[t.bidang] !== undefined) {
          totals[t.bidang] += t.jumlah;
        } else {
          totals[t.bidang] = t.jumlah;
        }
      }
    });

    return Object.keys(totals).map(key => ({
      name: key === 'Bagian Umum' ? 'Umum' : key,
      Rp: Number((totals[key] / 1000000000).toFixed(2))
    }));
  }, [transaksi]);

  const processedDataTren = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const monthlyTotals = Array(12).fill(0);

    transaksi.forEach((t) => {
      if (t.tipe === 'keluar' && t.date) {
        const parts = t.date.split('/');
        if (parts.length >= 2) {
          const monthIndex = parseInt(parts[1], 10) - 1;
          if (monthIndex >= 0 && monthIndex <= 11) {
            monthlyTotals[monthIndex] += t.jumlah;
          }
        }
      }
    });

    const currentMonth = new Date().getMonth();
    return monthNames.map((m, index) => ({
      bulan: m,
      Realisasi: Number((monthlyTotals[index] / 1000000).toFixed(2)) 
    })).filter((item, index) => item.Realisasi > 0 || index <= currentMonth);
  }, [transaksi]);

  useEffect(() => {
    localStorage.setItem('djkn_transaksi', JSON.stringify(transaksi));
  }, [transaksi]);

  useEffect(() => {
    setSelectedTransaksi((prev) => prev.filter((id) => transaksi.some((t) => t.id === id)));
  }, [transaksi]);

  useEffect(() => {
    if (selectAllTransaksiRef.current) {
      selectAllTransaksiRef.current.indeterminate = isSomeTransaksiSelected;
    }
  }, [isSomeTransaksiSelected]);

  const [uraianInput, setUraianInput] = useState('');
  const [nominalInput, setNominalInput] = useState('');
  const [bidangInput, setBidangInput] = useState('Bagian Umum');
  const [tipeInput, setTipeInput] = useState('keluar');

  const [statistikExcelRows, setStatistikExcelRows] = useState([]);
  const [statistikExcelFileName, setStatistikExcelFileName] = useState('');

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
      setShowAuthForm(false);
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

  // --- FUNGSI TAMBAH TRANSAKSI ---
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

  // --- [BARU] FUNGSI HAPUS TRANSAKSI ---
  const handleHapusTransaksi = (id) => {
    if (typeof id === 'number') {
      if (window.confirm("Apakah kamu yakin ingin menghapus data ini?")) {
        setTransaksi((prev) => prev.filter(t => t.id !== id));
        setSelectedTransaksi((prev) => prev.filter(itemId => itemId !== id));
      }
      return;
    }

    if (selectedTransaksi.length === 0) return;

    const totalHapus = selectedTransaksi.length;
    const konfirmasi = window.confirm(
      `Apakah kamu yakin ingin menghapus ${totalHapus} data terpilih?`
    );

    if (konfirmasi) {
      setTransaksi((prev) => prev.filter(t => !selectedTransaksi.includes(t.id)));
      setSelectedTransaksi([]);
    }
  };

  const handleToggleTransaksiSelect = (id) => {
    setSelectedTransaksi((prev) => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAllTransaksi = () => {
    if (selectedTransaksi.length === transaksi.length) {
      setSelectedTransaksi([]);
    } else {
      setSelectedTransaksi(transaksi.map((t) => t.id));
    }
  };

  // --- [DIPERBARUI] FUNGSI IMPORT EXCEL SUPER ROBUST ---
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Membaca raw data
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: "" });
        
        const dataBaru = rawData.map(item => {
          // Normalisasi key agar fleksibel dibaca
          const normalized = {};
          Object.keys(item).forEach(key => {
            const cleanKey = key.trim().toLowerCase();
            normalized[cleanKey] = item[key];
          });

          // Fungsi pencari nilai berdasarkan alias
          const getVal = (aliases) => {
            for (let key of aliases) {
              if (normalized[key] !== undefined && normalized[key] !== "") {
                return normalized[key];
              }
            }
            return null;
          };

          // Ambil data mentah dari berbagai kemungkinan nama kolom
          const rawTanggal = getVal(['tanggal', 'tgl', 'date', 'waktu', 'hari']) || new Date().toLocaleDateString('id-ID');
          const rawUraian = getVal(['uraian', 'keterangan', 'deskripsi', 'nama', 'transaksi', 'rincian']) || "Data Import";
          const rawAkun = getVal(['akun', 'kode', 'rekening', 'kode_akun']) || "521111";
          const rawBidang = getVal(['bidang', 'unit', 'bagian', 'seksi']) || "Bagian Umum";
          const rawJumlah = getVal(['jumlah', 'nominal', 'total', 'harga', 'rp', 'saldo', 'nilai', 'pengeluaran', 'pemasukan']) || 0;
          const rawTipe = getVal(['tipe', 'jenis', 'status', 'arus']);

          // Olah Tanggal (Jika excel mengirim dalam format serial number)
          let parsedTanggal = rawTanggal;
          if (typeof rawTanggal === 'number') {
            const dateObj = new Date(Math.round((rawTanggal - 25569) * 86400 * 1000));
            parsedTanggal = dateObj.toLocaleDateString('id-ID');
          }

          // Olah Nominal Jumlah & Filter Tipe (Membaca Tanda Minus / Plus)
          const stringJumlah = String(rawJumlah);
          const bersihkanAngka = stringJumlah.replace(/[^0-9]/g, ''); // Hapus semua titik, spasi, koma, minus, plus
          const parsedJumlah = parseFloat(bersihkanAngka) || 0;

          let tipeTrans = "keluar"; // Default
          if (rawTipe) {
             tipeTrans = String(rawTipe).toLowerCase().includes('masuk') ? 'masuk' : 'keluar';
          } else {
             // Deteksi otomatis jika ada tanda minus (-) atau plus (+) di kolom nominal/jumlah
             if (stringJumlah.includes('+')) {
               tipeTrans = 'masuk';
             } else if (stringJumlah.includes('-')) {
               tipeTrans = 'keluar';
             }
          }

          return {
            id: Date.now() + Math.random(),
            date: parsedTanggal,
            uraian: String(rawUraian),
            akun: String(rawAkun),
            bidang: String(rawBidang),
            jumlah: parsedJumlah, // Hanya masuk angka bulat yang siap dikalkulasi grafik
            tipe: tipeTrans
          };
        });

        // Gabungkan data import baru ke data lama
        setTransaksi([...dataBaru, ...transaksi]);
        alert(`Berhasil mengimpor ${dataBaru.length} data dengan sempurna!`);
      } catch (error) {
        console.error(error);
        alert("Gagal membaca file. Pastikan format Excel Anda benar.");
      } finally {
        e.target.value = ''; // Reset uploader
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImportStatistikExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const normalizedRows = rawData.map((row) => ({
          unit: pickFirstValue(row, STATISTIK_FIELD_ALIASES.unit),
          gender: pickFirstValue(row, STATISTIK_FIELD_ALIASES.gender),
          jabatan: pickFirstValue(row, STATISTIK_FIELD_ALIASES.jabatan),
          pendidikan: pickFirstValue(row, STATISTIK_FIELD_ALIASES.pendidikan),
          generasi: pickFirstValue(row, STATISTIK_FIELD_ALIASES.generasi),
          goldar: pickFirstValue(row, STATISTIK_FIELD_ALIASES.goldar),
          agama: pickFirstValue(row, STATISTIK_FIELD_ALIASES.agama),
        }));

        if (!normalizedRows.length) {
          alert('File Excel tidak memiliki data yang bisa dibaca.');
          return;
        }

        setStatistikExcelRows(normalizedRows);
        setStatistikExcelFileName(file.name);
        alert(`Berhasil mengimpor ${normalizedRows.length} data pegawai untuk menu statistik!`);
      } catch (error) {
        alert('Gagal membaca file statistik. Pastikan file Excel valid dan memiliki kolom yang sesuai.');
      } finally {
        e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleResetStatistikImport = () => {
    setStatistikExcelRows([]);
    setStatistikExcelFileName('');
  };

  const scrollToSection = (id) => {
    setIsLandingMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const statistikSourceRows = statistikExcelRows.length > 0 ? statistikExcelRows : null;
  const dataStatistikUnitTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.unit, dataStatistikUnit.map((item) => item.unit), 'jumlah', 'unit')
    : dataStatistikUnit;
  const dataStatistikGenderTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.gender, dataStatistikGender.map((item) => item.name), 'value')
    : dataStatistikGender;
  const dataStatistikJabatanTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.jabatan, dataStatistikJabatan.map((item) => item.name), 'jumlah')
    : dataStatistikJabatan;
  const dataStatistikPendidikanTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.pendidikan, dataStatistikPendidikan.map((item) => item.name), 'jumlah')
    : dataStatistikPendidikan;
  const dataStatistikGenerasiTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.generasi, dataStatistikGenerasi.map((item) => item.name), 'jumlah')
    : dataStatistikGenerasi;
  const dataStatistikGoldarTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.goldar, dataStatistikGoldar.map((item) => item.name), 'value')
    : dataStatistikGoldar;
  const dataStatistikAgamaTampil = statistikSourceRows
    ? buildCountData(statistikSourceRows, STATISTIK_FIELD_ALIASES.agama, dataStatistikAgama.map((item) => item.name), 'jumlah')
    : dataStatistikAgama;

  // ==================== VIEW: LANDING PAGE & AUTHENTICATION ====================
  if (!isLoggedIn) {
    if (showAuthForm) {
      return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 font-sans relative overflow-hidden p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 p-8 shadow-2xl rounded-3xl z-10">
            
            <button 
              onClick={() => setShowAuthForm(false)} 
              className="text-slate-400 hover:text-slate-700 flex items-center gap-2 mb-8 transition-colors text-sm font-semibold"
            >
              <ArrowLeft size={16} /> Kembali ke Beranda
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Selamat Datang!</h2>
              <p className="text-sm text-slate-500 mt-1">Silakan masuk ke sistem SIPKA</p>
            </div>

            {authError && <div className="bg-red-100 border border-red-200 text-red-600 p-3 rounded-xl text-xs text-center font-semibold mb-4">{authError}</div>}
            {authSuccess && <div className="bg-green-100 border border-green-200 text-green-600 p-3 rounded-xl text-xs text-center font-semibold mb-4">{authSuccess}</div>}

            {isRegisterMode ? (
              <form onSubmit={handleRegister} className="space-y-4 text-sm animate-fadeIn">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1.5">Nama Lengkap</label>
                  <input type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" required />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1.5">Username</label>
                  <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" required />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1.5">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={authPassword} 
                      onChange={(e) => setAuthPassword(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Akses</label>
                    <select value={authRole} onChange={(e) => setAuthRole(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition cursor-pointer">
                      <option value="pegawai">Pegawai</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Unit Kerja</label>
                    <select value={authUnit} onChange={(e) => setAuthUnit(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition cursor-pointer">
                      <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#f3d05e] hover:bg-[#eebb4d] text-[#051622] font-black rounded-xl py-3.5 mt-4 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors shadow-md">
                  <UserPlus size={16} /> Daftar Akun
                </button>
                <p className="text-center text-slate-500 mt-4 text-xs">Sudah punya akun? <button type="button" onClick={() => setIsRegisterMode(false)} className="text-[#dca437] font-bold underline ml-1 hover:text-[#bda032]">Login</button></p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-5 text-sm animate-fadeIn">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1.5">Username</label>
                  <input type="text" value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" required />
                </div>
                <div>
                  <label className="text-slate-700 font-semibold block mb-1.5">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      value={authPassword} 
                      onChange={(e) => setAuthPassword(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#f3d05e] hover:bg-[#eebb4d] text-[#051622] font-black rounded-xl py-3.5 mt-2 flex items-center justify-center gap-2 uppercase tracking-wider transition-colors shadow-md">
                  <Lock size={16} /> Masuk Ke Sistem
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
        
        {/* Navigasi Bar */}
        <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-800 transition-all theme-landing-nav">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('beranda')}>
                <img src="/SIPKA-logo.png" alt="Logo SIPKA" className="h-10 w-auto drop-shadow-md" />
                <div>
                  <h1 className="font-black text-lg leading-none text-white tracking-wide">SIPKA</h1>
                  <p className="text-[9px] text-[#D4AF37] font-bold uppercase tracking-widest mt-0.5">Kanwil Sumut</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => scrollToSection('beranda')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Beranda</button>
                <button onClick={() => scrollToSection('filosofi')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Filosofi Logo</button>
                <button onClick={() => scrollToSection('layanan')} className="text-sm font-semibold text-slate-300 hover:text-[#D4AF37] transition-colors">Layanan & Kontak</button>
                <button 
                  onClick={toggleTheme}
                  className="border border-slate-600/40 text-slate-200 hover:text-white hover:border-[#D4AF37] px-4 py-2.5 rounded-full text-sm flex items-center gap-2 transition-all bg-slate-800/40"
                >
                  {isDarkMode ? <Sun size={14} /> : <Moon size={14} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button 
                  onClick={() => setShowAuthForm(true)} 
                  className="bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-bold px-6 py-2.5 rounded-full text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-[#D4AF37]/20"
                >
                  <Lock size={14} /> Login Sistem
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsLandingMobileMenuOpen(!isLandingMobileMenuOpen)}
                  className="text-slate-300 p-2 focus:outline-none"
                >
                  {isLandingMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {isLandingMobileMenuOpen && (
            <div className="md:hidden bg-[#0f172a] border-b border-slate-800 animate-fadeIn theme-landing-menu">
              <div className="px-4 pt-2 pb-6 space-y-2">
                <button onClick={() => scrollToSection('beranda')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl">Beranda</button>
                <button onClick={() => scrollToSection('filosofi')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl">Filosofi Logo</button>
                <button onClick={() => scrollToSection('layanan')} className="block w-full text-left px-3 py-3 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-[#D4AF37] rounded-xl">Layanan & Kontak</button>
                <button 
                  onClick={toggleTheme}
                  className="w-full mt-4 border border-slate-600/40 text-slate-200 bg-slate-800/40 font-bold px-4 py-3 rounded-xl text-base flex justify-center items-center gap-2"
                >
                  {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button 
                  onClick={() => setShowAuthForm(true)} 
                  className="w-full mt-4 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-bold px-4 py-3 rounded-xl text-base flex justify-center items-center gap-2"
                >
                  <Lock size={16} /> Login Sistem
                </button>
              </div>
            </div>
          )}
        </nav>

        <section id="beranda" className="pt-32 pb-20 px-6 min-h-screen flex items-center relative theme-landing-hero">
          <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[80%] max-w-2xl h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none theme-hero-glow"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <img src="/SIPKA-logo.png" alt="SIPKA Hero" className="h-28 sm:h-40 mx-auto mb-8 drop-shadow-[0_0_25px_rgba(212,175,55,0.2)] animate-pulse" />
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
              Sistem Informasi Pemantauan <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#f3d05e]">Kepegawaian & Keuangan</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Instrumen transformasi digital pendayagunaan aparatur sipil negara dan pengelolaan anggaran DIPA secara transparan, adaptif, dan presisi di lingkungan Kanwil DJKN Sumatera Utara.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setShowAuthForm(true)} 
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#c4a132] text-[#051622] font-black px-8 py-4 rounded-full text-sm flex justify-center items-center gap-2 transition-transform hover:-translate-y-1 shadow-lg shadow-[#D4AF37]/20"
              >
                Masuk ke Dashboard <ArrowUpRight size={18} />
              </button>
              <button 
                onClick={() => scrollToSection('filosofi')} 
                className="w-full sm:w-auto bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 font-bold px-8 py-4 rounded-full text-sm flex justify-center items-center transition-colors"
              >
                Pelajari Fitur & Makna
              </button>
            </div>
          </div>
        </section>

        <section id="filosofi" className="py-20 px-6 bg-slate-900/40 border-t border-b border-slate-800/50 relative theme-landing-section">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-xs font-black text-[#D4AF37] tracking-[0.2em] uppercase mb-3 flex items-center justify-center gap-2">
                <Info size={16}/> Makna & Identitas
              </h2>
              <h3 className="text-3xl font-black text-white">Bedah Anatomi Logo SIPKA</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/perisai.png" alt="Perisai" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Perisai Luar (Integritas)</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Melambangkan benteng proteksi sistem pengawasan, kepatuhan terhadap hukum, serta komitmen penuh menjaga kerahasiaan data.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/tiga-manusia.png" alt="Tiga Manusia" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Tiga Figur Manusia Sinergis</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Merepresentasikan Sumber Daya Manusia (SDM) sebagai pilar utama organisasi yang berkolaborasi harmonis antar-seksi.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/grafik.png" alt="Grafik" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Grafik Batang Akuntabel</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Mewakili visualisasi data realisasi keuangan DIPA yang akurat, transparan, serta performa kinerja berkala yang terukur.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/kaca-pembesar.png" alt="Kaca Pembesar" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Lensa Kaca Pembesar</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Mencerminkan fungsi pemantauan yang tajam, ketelitian, serta ketepatan evaluasi internal terhadap data makro organisasi.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/panah.png" alt="Panah" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Panah Akselerasi Ke Atas</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Melambangkan pertumbuhan produktivitas efisiensi kerja, akselerasi pelayanan publik, serta arah pandang ke masa depan.</p>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/40 hover:bg-slate-800/60 hover:border-[#D4AF37]/40 transition-all duration-300 group shadow-md theme-card-light">
                <div className="bg-slate-100 border border-slate-200 p-3 rounded-2xl w-fit group-hover:bg-[#D4AF37]/10 transition-colors shadow-sm">
                  <img src="/warna.png" alt="Warna Filosofi" className="h-10 w-10 object-contain" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-wide group-hover:text-[#D4AF37] transition-colors mb-2">Biru & Emas Corporate</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Biru melambangkan profesionalisme kedinasan. Emas melambangkan kemewahan mutu pelayanan tinggi kepada publik.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer id="layanan" className="bg-[#0b1724] pt-20 pb-10 px-6 mt-10 theme-footer">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/SIPKA-logo.png" className="h-12 w-auto drop-shadow-md" alt="SIPKA" />
                <h2 className="text-3xl font-black text-white tracking-tight">SIPKA</h2>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pr-4 mt-4">
                Sistem Informasi Pemantauan Kepegawaian & Keuangan Kanwil DJKN Sumatera Utara. Solusi cerdas untuk tata kelola pemerintahan yang transparan.
              </p>
            </div>
            
            <div className="space-y-5">
              <h3 className="text-sm font-black text-[#D4AF37] tracking-widest uppercase drop-shadow-sm">Pusat Layanan & Kontak</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3 group">
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors shrink-0"><MapPin size={16} className="text-[#D4AF37]" /></div>
                  <span className="leading-relaxed">Gedung Keuangan Negara (GKN) Medan<br/>Jl. Pangeran Diponegoro No.30-A<br/>Medan, Sumatera Utara</span>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="p-2.5 bg-slate-800 rounded-xl group-hover:bg-[#D4AF37]/20 transition-colors shrink-0"><Mail size={16} className="text-[#D4AF37]" /></div>
                  <span>kanwil.sumut@kemenkeu.go.id</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-5">
              <h3 className="text-sm font-black text-[#D4AF37] tracking-widest uppercase drop-shadow-sm">Kanal Media Sosial</h3>
              <p className="text-sm text-slate-400">Ikuti perkembangan dan informasi terbaru melalui media sosial resmi kami.</p>
              <div className="flex gap-4">
                <a href="https://www.instagram.com/djknkanwilsumut/?hl=en" target="_blank" rel="noreferrer" className="p-3.5 bg-slate-800 border border-slate-700 rounded-full hover:border-pink-500 hover:-translate-y-1 transition-all duration-300 group shadow-md">
                  <SiInstagram size={20} className="text-slate-400 group-hover:text-pink-500 transition-colors" />
                </a>
                <a href="https://www.facebook.com/kanwildjknsumut/?locale=id_ID" target="_blank" rel="noreferrer" className="p-3.5 bg-slate-800 border border-slate-700 rounded-full hover:border-blue-500 hover:-translate-y-1 transition-all duration-300 group shadow-md">
                  <SiFacebook size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </a>
                <a href="https://www.youtube.com/@KanwilDJKNSumut" target="_blank" rel="noreferrer" className="p-3.5 bg-slate-800 border border-slate-700 rounded-full hover:border-red-500 hover:-translate-y-1 transition-all duration-300 group shadow-md">
                  <SiYoutube size={20} className="text-slate-400 group-hover:text-red-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Kanwil DJKN Sumatera Utara. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // ==================== TAMPILAN DASHBOARD SETELAH LOGIN ====================
  return (
    <div className={`theme-root theme-dashboard-root flex flex-col md:flex-row h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans relative ${isDarkMode ? "theme-dark" : "theme-light"}`}>
      <style>{THEME_STYLE}</style>
      
      {/* 1. TOP BAR KHUSUS LAYAR SMARTPHONE */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md theme-dashboard-top">
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
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 text-slate-600 hover:text-[#D4AF37] bg-slate-100 rounded-xl border border-slate-200 transition"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-slate-600 hover:text-white bg-slate-100 rounded-xl border border-slate-200 transition"
          >
            {isMobileMenuOpen ? <X size={18} className="text-[#D4AF37]" /> : <Menu size={18} />}
          </button>
        </div>
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
          <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50 backdrop-blur-sm theme-sidebar-header">
            <div className="flex items-center gap-4">
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
            <button onClick={toggleTheme} className="p-2 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-[#D4AF37] transition" aria-label="Toggle theme">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Tombol Menu Navigasi */}
          <nav className="p-4 space-y-2">
            <button 
              onClick={() => navigateTo('dashboard')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'dashboard' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <LayoutDashboard size={18} /> Dashboard Keuangan
            </button>
            <button 
              onClick={() => navigateTo('statistik')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'statistik' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Users size={18} /> Statistik Pegawai
            </button>
            <button 
              onClick={() => navigateTo('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${currentView === 'profile' ? 'bg-gradient-to-r from-[#D4AF37] to-[#bda032] text-[#051622] shadow-lg shadow-[#D4AF37]/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <Settings size={18} /> Pengaturan Profil
            </button>
          </nav>
        </div>

        {/* Keluar Button */}
        <div className="p-4 border-t border-slate-200 bg-white theme-surface">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl py-2.5 text-xs font-bold uppercase tracking-widest transition-colors"
          >
            <LogOut size={14} /> Keluar
          </button>
        </div>
      </aside>

      {/* 3. AREA KONTEN UTAMA DASHBOARD */}
      <main className="flex-1 overflow-y-auto bg-slate-100 theme-dashboard-main">
        <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-80px)]">
          {/* JAM DIGITAL DESKTOP & INFORMASI AKUN */}
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

          {/* JAM DIGITAL MOBILE */}
          <div className="md:hidden bg-white border border-slate-200 rounded-xl p-3 mb-4 flex justify-between items-center shadow-sm theme-surface">
            <div className="text-xs font-semibold text-slate-700">
              {sessionUser?.name} ({sessionUser?.unit})
            </div>
            <div className="text-right font-mono text-xs font-bold text-[#D4AF37]">
              {formatTimeWIB(currentTime)}
            </div>
          </div>

          {/* VIEW: DASHBOARD KEUANGAN */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 theme-panel-light">
                  <div className="text-slate-300 text-xs font-medium">Total Realisasi</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">Rp {totalRealisasi} Miliar</div>
                  <div className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold"><TrendingUp size={12}/> Berdasarkan log mutasi</div>
                </div>
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 theme-panel-light">
                  <div className="text-slate-300 text-xs font-medium">Jumlah Transaksi</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">{transaksi.length} Berkas</div>
                  <div className="text-[10px] text-white mt-2 font-medium">Tercatat di sistem lokal</div>
                </div>
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl transition-transform hover:-translate-y-1 theme-panel-light">
                  <div className="text-slate-300 text-xs font-medium">Status Anggaran</div>
                  <div className="text-2xl font-black text-[#D4AF37] mt-1 drop-shadow-sm">Optimal</div>
                  <div className="text-[10px] text-white mt-2 font-medium">Sesuai dengan pagu DIPA</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 tracking-widest uppercase">Tren Realisasi Anggaran (Jutaan Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={processedDataTren}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="bulan" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} itemStyle={{ color: '#D4AF37' }} />
                        <Area type="monotone" dataKey="Realisasi" stroke="#D4AF37" strokeWidth={3} fillOpacity={0.15} fill="#D4AF37" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 tracking-widest uppercase">Alokasi Per Bidang (Miliar Rp)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={processedDataBidang}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} />
                        <Bar dataKey="Rp" radius={[4, 4, 0, 0]}>
                          {processedDataBidang.map((entry, index) => (
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
                  <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl h-fit theme-panel-light">
                    <h3 className="text-xs font-black text-white mb-5 flex items-center gap-2">
                      <PlusCircle size={16} className="text-[#D4AF37]" /> TAMBAH TRANSAKSI BARU
                    </h3>
                    
                    <form onSubmit={handleTambahTransaksi} className="space-y-4 text-xs">
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">Uraian Transaksi</label>
                        <input type="text" value={uraianInput} onChange={(e) => setUraianInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" placeholder="Contoh: Pembelian ATK Kantor" required />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1.5 font-medium">Nominal Anggaran (Rp)</label>
                        <input type="number" value={nominalInput} onChange={(e) => setNominalInput(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" placeholder="Contoh: 5000000" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 block mb-1.5 font-medium">Bidang / Unit</label>
                          <select value={bidangInput} onChange={(e) => setBidangInput(e.target.value)} className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition">
                            <option>Bagian Umum</option><option>PKN</option><option>Lelang</option><option>KIHI</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-300 block mb-1.5 font-medium">Jenis Arus</label>
                          <select value={tipeInput} onChange={(e) => setTipeInput(e.target.value)} className="w-full bg-white border border-slate-700 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition">
                            <option value="keluar">Pengeluaran</option><option value="masuk">Pemasukan</option>
                          </select>
                        </div>
                      </div>

                      {/* Container Tombol agar berjajar */}
                      <div className="flex gap-3 pt-2">
                        {/* Tombol Simpan */}
                        <button type="submit" className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 rounded-xl transition-transform hover:scale-[1.02] shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2">
                          <PlusCircle size={14}/> Simpan
                        </button>

                        {/* Tombol Import Excel */}
                        <label className="flex-1 text-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl cursor-pointer transition-colors border border-slate-600 flex items-center justify-center gap-2">
                          <input 
                            type="file" 
                            accept=".xlsx, .xls" 
                            onChange={handleImportExcel} 
                            className="hidden" 
                          />
                          Import Excel
                        </label>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-3 leading-relaxed">
                        Format Excel yang didukung: <span className="text-[#D4AF37] font-semibold">tanggal/tgl/date</span>, <span className="text-[#D4AF37] font-semibold">uraian/keterangan/deskripsi</span>, <span className="text-[#D4AF37] font-semibold">akun/kode/rekening</span>, <span className="text-[#D4AF37] font-semibold">bidang/unit/bagian</span>, <span className="text-[#D4AF37] font-semibold">jumlah/nominal</span>, dan <span className="text-[#D4AF37] font-semibold">tipe/jenis/status</span>.
                      </p>
                    </form>
                  </div>
                )}

                <div className={`bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light ${sessionUser?.role === 'admin' ? 'xl:col-span-2' : 'xl:col-span-3'}`}>
                  <div className="flex flex-col gap-3 mb-5">
                    <h3 className="text-xs font-black text-white tracking-widest uppercase">Log Mutasi Anggaran Terkini</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Gunakan checkbox untuk memilih satu atau banyak data, lalu hapus sekaligus agar proses lebih cepat.
                      </p>
                      {sessionUser?.role === 'admin' && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-slate-300 font-medium px-3 py-2 rounded-xl bg-slate-900/30 border border-slate-700/50">
                            {selectedTransaksi.length} dipilih
                          </span>
                          <button
                            type="button"
                            onClick={handleSelectAllTransaksi}
                            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold px-4 py-2 rounded-xl border border-slate-600 transition-colors"
                          >
                            <input
                              type="checkbox"
                              ref={selectAllTransaksiRef}
                              checked={isAllTransaksiSelected}
                              readOnly
                              className="h-4 w-4 accent-[#D4AF37]"
                            />
                            Select All
                          </button>

                          <button
                            type="button"
                            onClick={() => handleHapusTransaksi()}
                            disabled={selectedTransaksi.length === 0}
                            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[11px] font-bold px-4 py-2 rounded-xl border border-rose-400/40 transition-colors"
                          >
                            <Trash2 size={14} />
                            Hapus Terpilih
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KONTAINER SCROLL UNTUK TABEL */}
                  <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <table className="w-full text-left text-xs border-collapse relative">
                      <thead className="sticky top-0 bg-[#0f172a]/95 backdrop-blur-sm z-10">
                        <tr className="border-b border-slate-700 text-slate-300">
                          {sessionUser?.role === 'admin' && (
                            <th className="py-3 px-2 font-bold text-center w-12">
                              <span className="sr-only">Select</span>
                            </th>
                          )}
                          <th className="py-3 px-2 font-bold">Tanggal</th>
                          <th className="py-3 px-2 font-bold">Uraian</th>
                          <th className="py-3 px-2 font-bold">Bidang</th>
                          <th className="py-3 px-2 font-bold text-right">Jumlah (Rp)</th>
                          <th className="py-3 px-2 font-bold text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/50">
                        {transaksi.map((t) => {
                          const isSelected = selectedTransaksi.includes(t.id);
                          return (
                            <tr key={t.id} className={`hover:bg-slate-800/40 text-slate-200 transition-colors ${isSelected ? 'bg-slate-800/60' : ''}`}>
                              {sessionUser?.role === 'admin' && (
                                <td className="py-3.5 px-2 text-center align-middle">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleTransaksiSelect(t.id)}
                                    className="h-4 w-4 accent-[#D4AF37] cursor-pointer"
                                  />
                                </td>
                              )}
                              <td className="py-3.5 px-2 whitespace-nowrap">{t.date}</td>
                              <td className="py-3.5 px-2 max-w-xs truncate pr-4">{t.uraian}</td>
                              <td className="py-3.5 px-2">
                                <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-600 text-[10px] font-semibold">{t.bidang}</span>
                              </td>
                              <td className={`py-3.5 px-2 text-right font-bold ${t.tipe === 'masuk' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {t.tipe === 'masuk' ? '+' : '-'} {t.jumlah.toLocaleString('id-ID')}
                              </td>
                              <td className="py-3.5 px-2 text-center">
                                {sessionUser?.role === 'admin' && (
                                  <button 
                                    onClick={() => handleHapusTransaksi(t.id)}
                                    title="Hapus Data"
                                    className="text-rose-500 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/50 p-1.5 rounded-md transition-colors inline-flex items-center justify-center"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {transaksi.length === 0 && (
                          <tr>
                            <td colSpan={sessionUser?.role === 'admin' ? 6 : 5} className="py-8 text-center text-slate-500 font-medium">Belum ada log mutasi.</td>
                          </tr>
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
              <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Import Data Excel Pegawai</h3>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed max-w-2xl">
                      Upload file Excel berisi data pegawai untuk memperbarui visual statistik secara otomatis. Kolom yang didukung antara lain: <span className="text-[#D4AF37] font-semibold">unit</span>, <span className="text-[#D4AF37] font-semibold">gender</span>, <span className="text-[#D4AF37] font-semibold">jabatan</span>, <span className="text-[#D4AF37] font-semibold">pendidikan</span>, <span className="text-[#D4AF37] font-semibold">generasi</span>, <span className="text-[#D4AF37] font-semibold">goldar</span>, dan <span className="text-[#D4AF37] font-semibold">agama</span>.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="inline-flex items-center justify-center gap-2 text-center bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black py-3 px-5 rounded-xl cursor-pointer transition-transform hover:scale-[1.01] shadow-lg shadow-[#D4AF37]/20 text-xs uppercase tracking-wider">
                      <input 
                        type="file" 
                        accept=".xlsx, .xls" 
                        onChange={handleImportStatistikExcel} 
                        className="hidden" 
                      />
                      Import Excel Statistik
                    </label>
                    {statistikExcelRows.length > 0 && (
                      <button
                        type="button"
                        onClick={handleResetStatistikImport}
                        className="inline-flex items-center justify-center gap-2 text-center bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-5 rounded-xl transition-colors border border-slate-600 text-xs uppercase tracking-wider"
                      >
                        Reset Data
                      </button>
                    )}
                  </div>
                </div>
                {statistikExcelFileName && (
                  <p className="text-[11px] text-emerald-300 mt-4">
                    File aktif: <span className="font-semibold text-white">{statistikExcelFileName}</span> · data visual telah mengikuti hasil import.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Sebaran Pegawai per Unit Kerja</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikUnitTampil} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                        <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis dataKey="unit" type="category" stroke="#94a3b8" fontSize={11} width={100} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="jumlah" fill="#D4AF37" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Profil Berdasarkan Generasi</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataStatistikGenerasiTampil}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip cursor={{fill: 'rgba(51, 65, 85, 0.2)'}} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                        <Bar dataKey="jumlah" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Proporsi Gender Pegawai</h3>
                  <div className="h-64 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="w-full h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={dataStatistikGenderTampil} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                            {dataStatistikGenderTampil.map((entry, index) => (
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

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-5 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Sebaran Golongan Darah</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={dataStatistikGoldarTampil} cx="50%" cy="50%" outerRadius={80} dataKey="value" stroke="none">
                          {dataStatistikGoldarTampil.map((entry, index) => (
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
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Tingkat Pendidikan Terakhir</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikPendidikanTampil.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                        <span className="text-slate-200 font-medium">{p.name}</span>
                        <span className="font-bold text-[#D4AF37] px-2 py-1 bg-[#D4AF37]/10 rounded-md">{p.jumlah} Pegawai</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Struktur Eselonering / Jabatan</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikJabatanTampil.map((j, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                        <span className="text-slate-200 font-medium">{j.name}</span>
                        <span className="font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded-md">{j.jumlah} Orang</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Klasifikasi Agama</h3>
                  <div className="space-y-3 text-xs">
                    {dataStatistikAgamaTampil.map((a, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-3 border border-slate-700/50 rounded-xl hover:bg-slate-800/60 transition-colors">
                        <span className="text-slate-200 font-medium">{a.name}</span>
                        <span className="font-bold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded-md">{a.jumlah} Pegawai</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#17375f] via-[#1d4f86] to-[#132f55] backdrop-blur-md border border-slate-700/40 p-6 rounded-2xl shadow-xl theme-panel-light">
                  <h3 className="text-xs font-black text-white mb-5 uppercase tracking-widest">Catatan Import</h3>
                  <div className="space-y-3 text-[11px] leading-relaxed text-slate-300">
                    <p>• Jika belum ada file Excel, dashboard statistik tetap memakai data bawaan.</p>
                    <p>• Setelah import, seluruh grafik dan daftar akan mengikuti isi file yang diunggah.</p>
                    <p>• Klik <span className="text-[#D4AF37] font-semibold">Reset Data</span> untuk kembali ke data awal.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: PENGATURAN PROFIL */}
          {currentView === 'profile' && (
            <div className="p-4 max-w-2xl mx-auto w-full animate-fadeIn">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md theme-surface">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-5">
                  <div className="p-2 bg-[#D4AF37]/10 rounded-xl">
                    <Settings className="text-[#D4AF37]" size={24} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-800">Manajemen Profil Kredensial</h3>
                </div>
                {profileSuccess && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3.5 rounded-xl text-xs text-center font-bold mb-5 shadow-sm">
                    {profileSuccess}
                  </div>
                )}
                
                <form onSubmit={handleSaveProfile} className="space-y-5 text-sm">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Nama Lengkap</label>
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" required />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Ubah Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={editPassword} 
                        onChange={(e) => setEditPassword(e.target.value)} 
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 pr-12 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition" 
                        required 
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] focus:outline-none transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1.5">Asal Bagian / Unit Kerja</label>
                    <select 
                      value={editUnit} 
                      onChange={(e) => setEditUnit(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition cursor-pointer"
                    >
                      <option>Bagian Umum</option>
                      <option>PKN</option>
                      <option>Lelang</option>
                      <option>KIHI</option>
                    </select>
                  </div>

                  <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setCurrentView('dashboard')}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit" 
                      className="bg-gradient-to-r from-[#D4AF37] to-[#f3d05e] text-[#051622] font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-transform hover:scale-[1.02] shadow-md text-xs tracking-wider"
                    >
                      <UserCheck size={16} /> Simpan Perubahan Profil
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Footer Khusus Dashboard Internal */}
        <footer className="bg-white border-t border-slate-200 rounded-t-[2.5rem] px-8 py-12 mt-12 shadow-[0_-10px_35px_rgba(15,23,42,0.06)] theme-footer">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src="/SIPKA-logo.png" className="h-10 w-auto drop-shadow-md" alt="SIPKA" />
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">SIPKA</h2>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pr-4">
                Sistem Informasi Pemantauan Kepegawaian & Keuangan Kanwil DJKN Sumatera Utara.
              </p>
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
                <a href="https://www.instagram.com/djknkanwilsumut/?hl=en" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-pink-500 hover:scale-110 transition-all duration-300 group shadow-sm">
                  <SiInstagram size={20} className="text-slate-500 group-hover:text-pink-500 transition-colors" />
                </a>
                <a href="https://www.facebook.com/kanwildjknsumut/?locale=id_ID" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-blue-500 hover:scale-110 transition-all duration-300 group shadow-sm">
                  <SiFacebook size={20} className="text-slate-500 group-hover:text-blue-500 transition-colors" />
                </a>
                <a href="https://www.youtube.com/@KanwilDJKNSumut" target="_blank" rel="noreferrer" className="p-3 bg-slate-50 border border-slate-200 rounded-full hover:border-red-500 hover:scale-110 transition-all duration-300 group shadow-sm">
                  <SiYoutube size={20} className="text-slate-500 group-hover:text-red-500 transition-colors" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-slate-200 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-500 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Kanwil DJKN Sumatera Utara. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}