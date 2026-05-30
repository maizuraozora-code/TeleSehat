import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Stethoscope, ShieldCheck, LogOut, 
  Calendar, Clock, MessageCircle, Video, 
  Activity, Users, FileText, CheckCircle,
  Eye, EyeOff, UserPlus, Search, Plus, X, 
  FileSignature, Pill, TrendingUp, AlertCircle,
  ShoppingCart, Store, Minus, Trash2, Receipt, Package,
  CreditCard, Wallet, Banknote, Mic, MicOff, Camera, 
  VideoOff, PhoneOff, Send
} from 'lucide-react';

const INITIAL_DOCTORS = [
  { id: 'd1', username: 'dr.andi', email: 'andi@telesehat.com', password: 'password123', name: 'dr. Andi Pratama', spec: 'Dokter Umum', rating: 4.8, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi', phone: '081234567890' },
  { id: 'd2', username: 'dr.budi', email: 'budi@telesehat.com', password: 'password123', name: 'dr. Budi Santoso, Sp.A', spec: 'Spesialis Anak', rating: 4.9, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', phone: '081234567891' },
  { id: 'd3', username: 'dr.citra', email: 'citra@telesehat.com', password: 'password123', name: 'dr. Citra Lestari, Sp.OG', spec: 'Spesialis Kandungan', rating: 4.7, img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra', phone: '081234567892' },
];

const INITIAL_PATIENTS = [
  { id: 'p1', username: 'siti', email: 'siti@gmail.com', password: 'password123', name: 'Siti Aminah', dob: '1998-05-15', phone: '081299999999', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti' },
  { id: 'p2', username: 'joko', email: 'joko@gmail.com', password: 'password123', name: 'Bapak Joko', dob: '1980-10-20', phone: '081288888888', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko' },
];

const MOCK_ADMINS = [
  { id: 'a1', username: 'admin', email: 'admin@telesehat.com', password: 'admin123', name: 'Sistem Admin', img: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin' }
];

const INITIAL_APPOINTMENTS = [
  { id: 'a1', patientId: 'p1', doctorId: 'd1', date: '2026-05-31', time: '10:00', status: 'upcoming', diagnosis: '', prescription: '', complaint: 'Sering pusing dan mual saat pagi hari.' },
  { id: 'a2', patientId: 'p2', doctorId: 'd2', date: '2026-05-25', time: '14:30', status: 'completed', diagnosis: 'Flu ringan dan radang tenggorokan.', prescription: 'Paracetamol 3x1, Vitamin C 1x1', complaint: 'Demam dan batuk berdahak sudah 3 hari.' },
];

const INITIAL_MEDICINES = [
  { id: 'm1', name: 'Paracetamol 500mg', category: 'Obat Bebas', price: 15000, stock: 100, desc: 'Pereda demam dan nyeri ringan.' },
  { id: 'm2', name: 'Vitamin C 1000mg', category: 'Suplemen', price: 45000, stock: 50, desc: 'Meningkatkan daya tahan tubuh.' },
  { id: 'm3', name: 'Amoxicillin 500mg', category: 'Resep Dokter', price: 25000, stock: 30, desc: 'Antibiotik. Gunakan sesuai resep.' },
  { id: 'm4', name: 'Sirup Obat Batuk', category: 'Obat Bebas', price: 28000, stock: 60, desc: 'Meredakan batuk berdahak.' },
  { id: 'm5', name: 'Antasida Doen', category: 'Obat Bebas', price: 12000, stock: 80, desc: 'Meredakan gejala asam lambung.' },
  { id: 'm6', name: 'Minyak Kayu Putih', category: 'P3K', price: 22000, stock: 45, desc: 'Menghangatkan tubuh dan meredakan gatal.' },
];

const formatRupiah = (number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [doctors, setDoctors] = useState(INITIAL_DOCTORS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [medicines, setMedicines] = useState(INITIAL_MEDICINES);
  const [pharmacyOrders, setPharmacyOrders] = useState([]);

  const handleLogin = (role, userData) => setCurrentUser({ role, ...userData });
  
  const handleRegister = (role, newUserData) => {
    if (role === 'patient') setPatients([...patients, newUserData]);
    else if (role === 'doctor') setDoctors([...doctors, newUserData]);
    setCurrentUser({ role, ...newUserData });
  };

  const handleLogout = () => setCurrentUser(null);

  // Fungsi Transaksi Pasien
  const addAppointment = (newAppt) => {
    setAppointments([...appointments, { ...newAppt, id: `a${Date.now()}`, diagnosis: '', prescription: '' }]);
  };

  const addPharmacyOrder = (orderData) => {
    setPharmacyOrders([...pharmacyOrders, { ...orderData, id: `ord${Date.now()}` }]);
  };

  // Fungsi Persetujuan Admin
  const approveAppointment = (apptId) => {
    setAppointments(appointments.map(appt => 
      appt.id === apptId ? { ...appt, status: 'upcoming' } : appt
    ));
  };

  const approvePharmacyOrder = (orderId) => {
    setPharmacyOrders(pharmacyOrders.map(order => 
      order.id === orderId ? { ...order, status: 'Diproses' } : order
    ));
  };

  // Fungsi Transaksi Dokter
  const completeAppointment = (apptId, diagnosis, prescription) => {
    setAppointments(appointments.map(appt => 
      appt.id === apptId ? { ...appt, status: 'completed', diagnosis, prescription } : appt
    ));
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} patients={patients} doctors={doctors} admins={MOCK_ADMINS} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8">
        {currentUser.role === 'patient' && (
          <PatientDashboard 
            user={currentUser} 
            doctors={doctors} 
            appointments={appointments.filter(a => a.patientId === currentUser.id)} 
            onBook={addAppointment}
            medicines={medicines}
            pharmacyOrders={pharmacyOrders.filter(o => o.patientId === currentUser.id)}
            onCheckout={addPharmacyOrder}
          />
        )}
        {currentUser.role === 'doctor' && (
          <DoctorDashboard 
            user={currentUser} 
            appointments={appointments.filter(a => a.doctorId === currentUser.id)} 
            patients={patients} 
            onComplete={completeAppointment} 
          />
        )}
        {currentUser.role === 'admin' && (
          <AdminDashboard 
            doctors={doctors} 
            patients={patients} 
            appointments={appointments}
            pharmacyOrders={pharmacyOrders} 
            onApproveAppt={approveAppointment}
            onApproveOrder={approvePharmacyOrder}
          />
        )}
      </main>
    </div>
  );
}

function Navbar({ user, onLogout }) {
  const roleLabel = { patient: 'Pasien', doctor: 'Dokter', admin: 'Administrator' };
  return (
    <nav className="bg-blue-600 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2"><Activity className="h-6 w-6" /><span className="text-xl font-bold tracking-wide">TeleSehat</span></div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{user.name}</p>
            <p className="text-xs text-blue-200">{roleLabel[user.role]}</p>
          </div>
          <img src={user.img} alt="avatar" className="h-10 w-10 rounded-full bg-white border-2 border-blue-400 object-cover" />
          <button onClick={onLogout} className="p-2 bg-blue-700/50 hover:bg-blue-800 rounded-full transition-colors" title="Keluar"><LogOut className="h-5 w-5" /></button>
        </div>
      </div>
    </nav>
  );
}

function LoginPage({ onLogin, onRegister, patients, doctors, admins }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [resetInput, setResetInput] = useState('');

  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('');
  const [regSpec, setRegSpec] = useState('');

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const allUsers = [...patients, ...doctors, ...admins];
      const user = allUsers.find(u => u.username === resetInput || u.email === resetInput);
      if (user) setSuccess(`Password untuk ${user.username} adalah: ${user.password}`);
      else setError('Akun tidak ditemukan. Pastikan username/email benar.');
    }, 1000);
  };

  const handleRealLogin = (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      let foundUser = null;
      if (activeTab === 'patient') foundUser = patients.find(u => (u.username === loginInput || u.email === loginInput) && u.password === loginPassword);
      else if (activeTab === 'doctor') foundUser = doctors.find(u => (u.username === loginInput || u.email === loginInput) && u.password === loginPassword);
      else if (activeTab === 'admin') foundUser = admins.find(u => (u.username === loginInput || u.email === loginInput) && u.password === loginPassword);

      if (foundUser) onLogin(activeTab, foundUser);
      else setError(`Kredensial salah atau Anda tidak terdaftar sebagai ${activeTab === 'patient' ? 'Pasien' : activeTab === 'doctor' ? 'Dokter' : 'Admin'}.`);
    }, 1200);
  };

  const handleRealRegister = (e) => {
    e.preventDefault();
    setError(''); setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const allUsers = [...patients, ...doctors, ...admins];
      if (allUsers.some(u => u.username === regUsername)) return setError('Username sudah digunakan.');
      if (allUsers.some(u => u.email === regEmail)) return setError('Email sudah terdaftar.');

      const newUser = {
        id: `${activeTab[0]}${Date.now()}`,
        name: regName, username: regUsername, email: regEmail, password: regPassword, phone: regPhone,
        img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${regName.replace(/\s+/g, '')}`,
      };

      if (activeTab === 'patient') newUser.dob = regDob;
      else if (activeTab === 'doctor') { newUser.spec = regSpec || 'Dokter Umum'; newUser.rating = 5.0; }

      onRegister(activeTab, newUser);
    }, 1200);
  };

  const handleDemoFill = (demoUsername, demoPassword) => {
    setLoginInput(demoUsername);
    setLoginPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center text-white">
          <Activity className="h-12 w-12 mx-auto mb-2" />
          <h1 className="text-2xl font-bold">TeleSehat</h1>
          <p className="text-blue-100 text-sm mt-1">{showForgotPassword ? 'Reset Password' : (isLoginView ? 'Portal Masuk Sistem' : 'Pendaftaran Pengguna Baru')}</p>
        </div>
        
        <div className="p-6">
          {!showForgotPassword && (
            <div className="flex justify-center space-x-2 mb-6 bg-slate-100 p-1 rounded-lg">
              <button type="button" className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-1 ${activeTab === 'patient' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => {setActiveTab('patient'); setError('');}} disabled={isLoading}>
                <User className="w-4 h-4" /> <span>Pasien</span>
              </button>
              <button type="button" className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-1 ${activeTab === 'doctor' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => {setActiveTab('doctor'); setError('');}} disabled={isLoading}>
                <Stethoscope className="w-4 h-4" /> <span>Dokter</span>
              </button>
              {isLoginView && (
                <button type="button" className={`flex-1 py-2 text-sm font-medium rounded-md flex items-center justify-center space-x-1 ${activeTab === 'admin' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`} onClick={() => {setActiveTab('admin'); setError('');}} disabled={isLoading}>
                  <ShieldCheck className="w-4 h-4" /> <span>Admin</span>
                </button>
              )}
            </div>
          )}

          {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm rounded">{success}</div>}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-sm text-slate-600">Masukkan username atau email Anda untuk melihat password.</p>
              <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Username atau Email" value={resetInput} onChange={(e) => setResetInput(e.target.value)} required disabled={isLoading} />
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 flex justify-center items-center disabled:opacity-70">
                {isLoading ? <span className="animate-pulse">Memproses...</span> : null} Cek Password
              </button>
              <button type="button" onClick={() => {setShowForgotPassword(false); setError(''); setSuccess('');}} className="w-full text-slate-500 underline text-sm disabled:opacity-70" disabled={isLoading}>Kembali ke Login</button>
            </form>
          ) : isLoginView ? (
            <form onSubmit={handleRealLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username / Email</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="Masukkan identitas..." required disabled={isLoading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50 focus:bg-white" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required disabled={isLoading} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <button type="button" onClick={() => {setShowForgotPassword(true); setError('');}} className="text-xs text-blue-600 hover:underline" disabled={isLoading}>Lupa password?</button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center disabled:opacity-70">
                {isLoading ? <span className="animate-pulse">Loading...</span> : `Masuk sebagai ${activeTab === 'patient' ? 'Pasien' : activeTab === 'doctor' ? 'Dokter' : 'Admin'}`}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRealRegister} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nama Lengkap" required disabled={isLoading} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="username" required disabled={isLoading} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="email@domain.com" required disabled={isLoading} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon</label>
                <input type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="0812..." required disabled={isLoading} />
              </div>
              
              {activeTab === 'patient' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Lahir</label>
                  <input type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regDob} onChange={(e) => setRegDob(e.target.value)} required disabled={isLoading} />
                </div>
              )}
              {activeTab === 'doctor' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Spesialisasi</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regSpec} onChange={(e) => setRegSpec(e.target.value)} placeholder="Contoh: Dokter Umum" required disabled={isLoading} />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Buat password..." required minLength={6} disabled={isLoading} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600" onClick={() => setShowPassword(!showPassword)} disabled={isLoading}>
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition-colors mt-2 flex justify-center items-center disabled:opacity-70">
                {isLoading ? <span className="animate-pulse">Mendaftarkan...</span> : <><UserPlus className="w-5 h-5 mr-2" /> Daftar Sekarang</>}
              </button>
            </form>
          )}

          {!showForgotPassword && (
            <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-6">
              {isLoginView ? (
                <p>Belum punya akun? <button onClick={() => {setIsLoginView(false); setError(''); if(activeTab === 'admin') setActiveTab('patient');}} className="font-semibold text-blue-600 hover:underline" disabled={isLoading}>Daftar Sekarang</button></p>
              ) : (
                <p>Sudah punya akun? <button onClick={() => {setIsLoginView(true); setError('');}} className="font-semibold text-blue-600 hover:underline" disabled={isLoading}>Masuk di sini</button></p>
              )}
            </div>
          )}

          {isLoginView && !showForgotPassword && (
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-xs font-bold text-slate-500 mb-3 text-center uppercase tracking-wider">Akses Cepat Demo {activeTab === 'patient' ? 'Pasien' : activeTab === 'doctor' ? 'Dokter' : 'Admin'}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {activeTab === 'patient' && (
                  <>
                    <button type="button" onClick={() => handleDemoFill('siti', 'password123')} className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
                      <User className="w-3 h-3 mr-1.5" /> Siti Aminah
                    </button>
                    <button type="button" onClick={() => handleDemoFill('joko', 'password123')} className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
                      <User className="w-3 h-3 mr-1.5" /> Bapak Joko
                    </button>
                  </>
                )}
                {activeTab === 'doctor' && (
                  <>
                    <button type="button" onClick={() => handleDemoFill('dr.andi', 'password123')} className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
                      <Stethoscope className="w-3 h-3 mr-1.5" /> dr. Andi
                    </button>
                    <button type="button" onClick={() => handleDemoFill('dr.budi', 'password123')} className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
                      <Stethoscope className="w-3 h-3 mr-1.5" /> dr. Budi
                    </button>
                  </>
                )}
                {activeTab === 'admin' && (
                  <button type="button" onClick={() => handleDemoFill('admin', 'admin123')} className="flex items-center px-3 py-1.5 bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm">
                    <ShieldCheck className="w-3 h-3 mr-1.5" /> Admin Sistem
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PatientDashboard({ user, doctors, appointments, onBook, medicines, pharmacyOrders, onCheckout }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [activeMenu, setActiveMenu] = useState('home'); 
  const [cart, setCart] = useState([]);
  
  const [paymentData, setPaymentData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // States for Chat and Video
  const [activeChat, setActiveChat] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming' || a.status === 'pending_payment');
  const pastAppts = appointments.filter(a => a.status === 'completed');

  const addToCart = (med) => {
    const existing = cart.find(item => item.id === med.id);
    if (existing) {
      setCart(cart.map(item => item.id === med.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...med, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => setCart(cart.filter(item => item.id !== id));
  
  const updateCartQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPaymentData({
      type: 'pharmacy', amount: cartTotal,
      payload: { patientId: user.id, date: new Date().toLocaleDateString('id-ID'), items: cart, total: cartTotal, status: 'pending_payment' }
    });
  };

  return (
    <div className="space-y-6 relative">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="flex items-center space-x-4">
          <img src={user.img} alt="Patient" className="w-16 h-16 rounded-full border-4 border-blue-400/30" />
          <div>
            <h1 className="text-2xl font-bold">Halo, {user.name}</h1>
            <p className="text-blue-100 flex items-center mt-1"><Calendar className="w-4 h-4 mr-1"/> Lahir: {user.dob} | <Activity className="w-4 h-4 mx-1 ml-3"/> Sehat selalu!</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 bg-white/20 px-4 py-2 rounded-xl text-center backdrop-blur-sm">
          <p className="text-sm text-blue-100">Jadwal Mendatang</p>
          <p className="text-2xl font-bold">{upcomingAppts.length}</p>
        </div>
      </div>

      <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button onClick={() => setActiveMenu('home')} className={`py-2 px-4 font-medium whitespace-nowrap border-b-2 transition-colors ${activeMenu === 'home' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Klinik & Jadwal</button>
        <button onClick={() => setActiveMenu('history')} className={`py-2 px-4 font-medium whitespace-nowrap border-b-2 transition-colors ${activeMenu === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>Rekam Medis</button>
        <button onClick={() => setActiveMenu('pharmacy')} className={`py-2 px-4 font-medium whitespace-nowrap border-b-2 transition-colors ${activeMenu === 'pharmacy' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Store className="w-4 h-4 inline mr-1"/> Apotek</button>
      </div>

      {activeMenu === 'home' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center text-slate-800"><Stethoscope className="w-5 h-5 mr-2 text-blue-600" /> Cari Dokter Spesialis</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <div key={doc.id} className={`bg-white p-5 rounded-xl shadow-sm border transition-all ${selectedDoctor?.id === doc.id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}>
                  <div className="flex items-start space-x-4">
                    <img src={doc.img} alt={doc.name} className="w-14 h-14 rounded-full bg-slate-100" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-800 leading-tight">{doc.name}</h3>
                      <p className="text-sm text-blue-600 font-medium mb-1">{doc.spec}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded flex items-center">⭐ {doc.rating}</span>
                        <button onClick={() => setSelectedDoctor(doc)} className="text-sm bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white px-3 py-1 rounded-lg font-medium transition-colors">Pilih</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedDoctor && (
              <div className="mt-6 bg-white p-6 rounded-xl shadow-md border border-blue-100 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">Konfirmasi Jadwal: <span className="text-blue-600">{selectedDoctor.name}</span></h3>
                  <button onClick={() => setSelectedDoctor(null)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  setPaymentData({
                    type: 'consultation', amount: 150000, 
                    payload: { patientId: user.id, doctorId: selectedDoctor.id, date: e.target.date.value, time: e.target.time.value, complaint: e.target.complaint.value, status: 'pending_payment' }
                  }); 
                }} className="bg-slate-50 p-4 rounded-lg space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label><input type="date" name="date" required min={new Date().toISOString().split('T')[0]} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                    <div><label className="block text-sm font-medium text-slate-700 mb-1">Waktu</label><input type="time" name="time" required className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
                  </div>
                  <div><label className="block text-sm font-medium text-slate-700 mb-1">Keluhan / Gejala</label><textarea name="complaint" required rows="2" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Ceritakan keluhan atau gejala yang Anda rasakan secara singkat..."></textarea></div>
                  <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-semibold shadow-sm flex items-center justify-center"><CreditCard className="w-4 h-4 mr-2" /> Lanjut Pembayaran (Rp 150.000)</button>
                </form>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold flex items-center mb-4 text-slate-800"><Clock className="w-5 h-5 mr-2 text-blue-600" /> Jadwal Mendatang</h2>
            <div className="space-y-3">
              {upcomingAppts.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center border border-slate-200 border-dashed"><Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-slate-500 text-sm">Belum ada jadwal konsultasi dalam waktu dekat.</p></div>
              ) : (
                upcomingAppts.map(appt => {
                  const doc = doctors.find(d => d.id === appt.doctorId);
                  const isPending = appt.status === 'pending_payment';
                  return (
                    <div key={appt.id} className={`bg-white p-4 rounded-xl shadow-sm border border-l-4 ${isPending ? 'border-l-orange-400' : 'border-l-blue-500'} border-slate-200 relative overflow-hidden`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${isPending ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'}`}>{isPending ? 'Menunggu Admin' : 'Akan Datang'}</span>
                        <div className="flex space-x-1">
                          {!isPending && (
                            <>
                              <button onClick={() => setActiveChat({ name: doc?.name, info: doc?.spec, img: doc?.img, role: 'Dokter' })} className="p-1.5 bg-slate-50 text-slate-600 rounded hover:bg-slate-200 transition-colors" title="Kirim Pesan"><MessageCircle className="w-4 h-4" /></button>
                              <button onClick={() => setActiveVideo({ name: doc?.name, info: doc?.spec, img: doc?.img, role: 'Dokter' })} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-200 transition-colors" title="Masuk Video Call"><Video className="w-4 h-4" /></button>
                            </>
                          )}
                        </div>
                      </div>
                      <h4 className="font-bold text-slate-800">{doc?.name}</h4><p className="text-xs text-slate-500 mb-3">{doc?.spec}</p>
                      <div className="flex items-center text-sm font-medium text-slate-700 space-x-4 bg-slate-50 p-2 rounded-lg"><span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-blue-600"/> {appt.date}</span><span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-blue-600"/> {appt.time}</span></div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}

      {activeMenu === 'history' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center text-slate-800"><FileSignature className="w-5 h-5 mr-2 text-blue-600" /> Riwayat Konsultasi & Resep</h2>
          {pastAppts.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center border border-slate-200"><FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" /><p className="text-slate-500">Belum ada riwayat medis.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastAppts.map(appt => {
                const doc = doctors.find(d => d.id === appt.doctorId);
                return (
                  <div key={appt.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center text-sm text-slate-600 font-medium"><Calendar className="w-4 h-4 mr-2" /> {appt.date} ({appt.time})</div>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Selesai</span>
                    </div>
                    <div className="p-4 space-y-4">
                      <div className="flex items-center space-x-3"><img src={doc?.img} className="w-10 h-10 rounded-full bg-slate-100" alt="" /><div><p className="font-bold text-sm text-slate-800">{doc?.name}</p><p className="text-xs text-slate-500">{doc?.spec}</p></div></div>
                      <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100"><h5 className="text-xs font-bold text-blue-800 uppercase mb-1 flex items-center"><FileText className="w-3 h-3 mr-1"/> Catatan / Diagnosa</h5><p className="text-sm text-slate-700">{appt.diagnosis || 'Tidak ada catatan.'}</p></div>
                      {appt.prescription && (
                        <div className="bg-green-50/50 p-3 rounded-lg border border-green-100">
                          <h5 className="text-xs font-bold text-green-800 uppercase mb-1 flex items-center"><Pill className="w-3 h-3 mr-1"/> Resep Obat</h5>
                          <p className="text-sm text-slate-700 mb-2">{appt.prescription}</p>
                          <button onClick={() => setActiveMenu('pharmacy')} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 flex items-center"><Store className="w-3 h-3 mr-1"/> Cari di Apotek</button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeMenu === 'pharmacy' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold flex items-center text-slate-800"><Pill className="w-5 h-5 mr-2 text-blue-600" /> Katalog Obat & Vitamin</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {medicines.map(med => (
                <div key={med.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start mb-2"><h3 className="font-bold text-slate-800">{med.name}</h3><span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">{med.category}</span></div>
                    <p className="text-xs text-slate-500 mb-4 h-8">{med.desc}</p>
                    <div className="flex justify-between items-end">
                      <div><p className="text-xs text-slate-400">Harga</p><p className="font-bold text-blue-600">{formatRupiah(med.price)}</p></div>
                      <button onClick={() => addToCart(med)} className="bg-blue-50 text-blue-700 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors" title="Tambah ke keranjang"><Plus className="w-5 h-5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {pharmacyOrders.length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center"><Receipt className="w-4 h-4 mr-2" /> Riwayat Pesanan Obat Saya</h3>
                <div className="space-y-3">
                  {pharmacyOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                      <div><p className="text-xs text-slate-500 mb-1">Order: #{order.id} • {order.date}</p><p className="font-bold text-sm text-slate-800">{order.items.length} macam obat</p><p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">Metode: {order.paymentMethod || 'Transfer'}</p></div>
                      <div className="text-right"><p className="font-bold text-blue-600">{formatRupiah(order.total)}</p><span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${order.status === 'pending_payment' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status === 'pending_payment' ? 'Menunggu Admin' : order.status}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-200 flex flex-col sticky top-24 max-h-[calc(100vh-8rem)]">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center"><h2 className="font-bold text-slate-800 flex items-center"><ShoppingCart className="w-5 h-5 mr-2 text-blue-600" /> Keranjang</h2><span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-bold">{cart.length}</span></div>
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-400"><Package className="w-12 h-12 mx-auto mb-2 opacity-50" /><p className="text-sm">Keranjang Anda kosong.</p></div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0 pb-3">
                    <div className="flex-1 pr-2"><h4 className="text-sm font-bold text-slate-800 leading-tight">{item.name}</h4><p className="text-xs text-blue-600">{formatRupiah(item.price)}</p></div>
                    <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-1 border border-slate-200"><button onClick={() => updateCartQty(item.id, -1)} className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><Minus className="w-3 h-3" /></button><span className="text-xs font-bold w-4 text-center">{item.qty}</span><button onClick={() => updateCartQty(item.id, 1)} className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"><Plus className="w-3 h-3" /></button></div>
                    <button onClick={() => removeFromCart(item.id)} className="ml-3 text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl">
              <div className="flex justify-between items-center mb-4"><span className="text-sm font-medium text-slate-600">Total</span><span className="text-lg font-bold text-slate-800">{formatRupiah(cartTotal)}</span></div>
              <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">Lanjut Pembayaran</button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      {paymentData && <PaymentModal data={paymentData} onConfirm={(type, payload, method) => {
        if(type === 'consultation') onBook(payload); else { onCheckout({...payload, paymentMethod: method}); setCart([]); }
        setPaymentData(null);
      }} onCancel={() => setPaymentData(null)} />}
      
      {activeChat && <ChatModal partner={activeChat} onClose={() => setActiveChat(null)} />}
      {activeVideo && <VideoCallModal partner={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

function DoctorDashboard({ user, appointments, patients, onComplete }) {
  const [activeSession, setActiveSession] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);

  const getAge = (dob) => {
    if(!dob) return '-';
    const diff = Date.now() - new Date(dob).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  };

  const upcomingAppts = appointments.filter(a => a.status === 'upcoming').sort((a,b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  const completedAppts = appointments.filter(a => a.status === 'completed');

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center"><Stethoscope className="mr-2 text-blue-600"/> Halo, {user.name}</h1>
          <p className="text-slate-500 mt-1">Spesialisasi: {user.spec} • Rating: ⭐ {user.rating}</p>
        </div>
        <div className="flex space-x-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-center px-4 border-r border-slate-200"><p className="text-xs text-slate-500 font-medium">Antrean</p><p className="text-xl font-bold text-blue-600">{upcomingAppts.length}</p></div>
          <div className="text-center px-4"><p className="text-xs text-slate-500 font-medium">Selesai</p><p className="text-xl font-bold text-green-600">{completedAppts.length}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center text-slate-800"><Calendar className="w-5 h-5 mr-2 text-blue-600" /> Daftar Antrean Pasien</h2>
          <div className="space-y-4">
            {upcomingAppts.length === 0 ? (
              <div className="bg-white p-8 rounded-xl text-center border border-slate-200 border-dashed"><CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" /><p className="text-slate-600 font-medium">Tidak ada antrean saat ini.</p><p className="text-slate-400 text-sm">Anda bisa beristirahat.</p></div>
            ) : (
              upcomingAppts.map((appt, idx) => {
                const patient = patients.find(p => p.id === appt.patientId);
                const isFirst = idx === 0;

                return (
                  <div key={appt.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${isFirst ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'}`}>
                    {isFirst && <div className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 uppercase tracking-wide">Konsultasi Berikutnya</div>}
                    <div className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <img src={patient?.img} alt={patient?.name} className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200" />
                          <div>
                            <h4 className="font-bold text-lg text-slate-800">{patient?.name || 'Pasien Baru'}</h4>
                            <p className="text-sm text-slate-500 mb-1">Umur: {getAge(patient?.dob)} thn • No: {patient?.phone || '-'}</p>
                            <div className="flex items-center text-sm text-slate-700 bg-slate-50 inline-flex px-2 py-1 rounded"><Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600"/> {appt.date} <span className="mx-2">|</span><Clock className="w-3.5 h-3.5 mr-1.5 text-blue-600 font-bold"/> {appt.time}</div>
                          </div>
                        </div>
                        <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg"><p className="text-xs font-bold text-orange-800 mb-1 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> Keluhan Pasien:</p><p className="text-sm text-orange-900">{appt.complaint || 'Tidak ada keluhan tercatat.'}</p></div>
                      </div>
                      <div className="flex flex-col space-y-2 sm:min-w-[140px] justify-center">
                        <div className="flex space-x-2">
                           <button onClick={() => setActiveChat({ name: patient?.name, info: `${getAge(patient?.dob)} thn`, img: patient?.img, role: 'Pasien' })} className="flex-1 flex justify-center items-center px-3 py-2 text-sm bg-slate-100 text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-200 font-medium transition-colors"><MessageCircle className="w-4 h-4 mr-1.5" /> Chat</button>
                           <button onClick={() => setActiveVideo({ name: patient?.name, info: `${getAge(patient?.dob)} thn`, img: patient?.img, role: 'Pasien' })} className="flex-1 flex justify-center items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-600 hover:text-white font-medium transition-colors"><Video className="w-4 h-4 mr-1.5" /> Video</button>
                        </div>
                        <button onClick={() => setActiveSession(appt)} className="w-full flex justify-center items-center px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors shadow-sm"><FileSignature className="w-4 h-4 mr-2" /> Selesaikan Sesi</button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold flex items-center text-slate-800 mb-4"><CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Selesai Ditangani</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {completedAppts.length === 0 ? (
               <div className="p-6 text-center text-slate-500 text-sm">Belum ada pasien yang selesai ditangani.</div>
            ) : (
              completedAppts.reverse().map(appt => {
                const patient = patients.find(p => p.id === appt.patientId);
                return (
                  <div key={appt.id} className="p-4 hover:bg-slate-50"><div className="flex justify-between items-start mb-1"><p className="font-bold text-sm text-slate-800">{patient?.name}</p><span className="text-[10px] text-slate-500">{appt.date}</span></div><p className="text-xs text-slate-600 line-clamp-1"><span className="font-medium">Diag:</span> {appt.diagnosis}</p></div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {activeSession && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center"><h3 className="font-bold text-lg flex items-center"><FileSignature className="mr-2"/> Input Rekam Medis</h3><button onClick={() => setActiveSession(null)} className="hover:bg-blue-700 p-1 rounded"><X className="w-5 h-5"/></button></div>
            <form onSubmit={(e) => { e.preventDefault(); onComplete(activeSession.id, e.target.diagnosis.value, e.target.prescription.value); setActiveSession(null); }} className="p-6 space-y-4">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-sm mb-2"><span className="text-slate-500">Pasien:</span> <span className="font-bold text-slate-800">{patients.find(p => p.id === activeSession.patientId)?.name}</span></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Diagnosa / Catatan Medis <span className="text-red-500">*</span></label><textarea name="diagnosis" required rows="3" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Masukkan diagnosa atau keluhan pasien..."></textarea></div>
              <div><label className="block text-sm font-bold text-slate-700 mb-1">Resep Obat (Opsional)</label><textarea name="prescription" rows="2" className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Contoh: Paracetamol 500mg 3x1 sesudah makan."></textarea></div>
              <div className="pt-2 flex space-x-3"><button type="button" onClick={() => setActiveSession(null)} className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium">Batal</button><button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm">Simpan & Selesai</button></div>
            </form>
          </div>
        </div>
      )}

      {activeChat && <ChatModal partner={activeChat} onClose={() => setActiveChat(null)} />}
      {activeVideo && <VideoCallModal partner={activeVideo} onClose={() => setActiveVideo(null)} />}
    </div>
  );
}

function AdminDashboard({ doctors, patients, appointments, pharmacyOrders, onApproveAppt, onApproveOrder }) {
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const revenue = completedCount * 150000;
  const totalPharmacyRevenue = pharmacyOrders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    { label: 'Sesi Selesai', value: completedCount, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-100', trend: 'Klinik Online' },
    { label: 'Pendapatan Klinik', value: formatRupiah(revenue), icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: 'Est. Rp 150rb / Sesi' },
    { label: 'Order Obat', value: pharmacyOrders.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100', trend: 'Apotek Digital' },
    { label: 'Pendapatan Apotek', value: formatRupiah(totalPharmacyRevenue), icon: Store, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: 'Penjualan Obat' },
  ];

  return (
    <div className="space-y-6">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Dashboard Administrator</h1><p className="text-slate-500">Pusat pemantauan Klinik dan Apotek TeleSehat.</p></div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-10 group-hover:scale-150 transition-transform ${stat.bg}`}></div>
            <div className="flex justify-between items-start mb-4"><div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}><stat.icon className="w-6 h-6" /></div></div>
            <div><h3 className="text-lg font-bold text-slate-800 mb-1">{stat.value}</h3><p className="text-slate-500 text-sm font-medium">{stat.label}</p><p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide font-bold">{stat.trend}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50"><h2 className="font-bold text-lg text-slate-800 flex items-center"><Activity className="w-5 h-5 mr-2 text-blue-600"/> Log Konsultasi</h2></div>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0"><tr><th className="px-4 py-3 font-medium">Pasien</th><th className="px-4 py-3 font-medium">Dokter</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Aksi</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.slice().reverse().map((appt) => {
                  const p = patients.find(x => x.id === appt.patientId);
                  const d = doctors.find(x => x.id === appt.doctorId);
                  const isPending = appt.status === 'pending_payment';
                  return (
                    <tr key={appt.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-medium text-slate-800">{p?.name}</td><td className="px-4 py-3 text-slate-600">{d?.name}</td><td className="px-4 py-3"><span className={`inline-flex items-center text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${isPending ? 'bg-orange-100 text-orange-700' : appt.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{isPending ? 'Pending Verifikasi' : appt.status === 'upcoming' ? 'Menunggu Sesi' : 'Selesai'}</span></td><td className="px-4 py-3 text-right">{isPending && (<button onClick={() => onApproveAppt(appt.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs font-bold shadow-sm">Setujui</button>)}</td></tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50"><h2 className="font-bold text-lg text-slate-800 flex items-center"><Store className="w-5 h-5 mr-2 text-indigo-600"/> Pesanan Apotek Terbaru</h2></div>
          <div className="overflow-x-auto max-h-80">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 sticky top-0"><tr><th className="px-4 py-3 font-medium">ID Order</th><th className="px-4 py-3 font-medium">Pembeli</th><th className="px-4 py-3 font-medium">Total</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium text-right">Aksi</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {pharmacyOrders.length === 0 ? <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">Belum ada pesanan.</td></tr> : pharmacyOrders.slice().reverse().map((order) => {
                  const p = patients.find(x => x.id === order.patientId);
                  const isPending = order.status === 'pending_payment';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50"><td className="px-4 py-3 font-mono text-xs text-slate-400">#{order.id}</td><td className="px-4 py-3 font-medium text-slate-800">{p?.name}</td><td className="px-4 py-3 font-bold text-blue-600">{formatRupiah(order.total)}</td><td className="px-4 py-3"><span className={`inline-flex items-center text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider ${isPending ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{isPending ? 'Pending Verifikasi' : order.status}</span></td><td className="px-4 py-3 text-right">{isPending && (<button onClick={() => onApproveOrder(order.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs font-bold shadow-sm">Setujui</button>)}</td></tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ data, onConfirm, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center"><h3 className="font-bold text-lg text-slate-800 flex items-center"><CreditCard className="w-5 h-5 mr-2 text-blue-600"/> Detail Pembayaran</h3>{!isProcessing && (<button onClick={onCancel} className="text-slate-400 hover:bg-slate-200 p-1 rounded-full"><X className="w-5 h-5"/></button>)}</div>
        <div className="p-6">
          <div className="text-center mb-6 bg-blue-50/50 py-4 rounded-xl border border-blue-100"><p className="text-slate-500 text-sm font-medium">{data.type === 'consultation' ? 'Biaya Konsultasi Dokter' : 'Total Belanja Apotek'}</p><h2 className="text-3xl font-extrabold text-blue-600 mt-1">{formatRupiah(data.amount)}</h2></div>
          <div className="space-y-4 mb-8">
            <p className="text-sm font-bold text-slate-700 border-b pb-2">Metode Pembayaran</p>
            <div><p className="text-xs text-slate-500 mb-2 uppercase font-semibold">Virtual Account</p><div className="grid grid-cols-4 gap-2">{['BCA', 'Mandiri', 'BNI', 'BRI'].map(b => (<button key={b} onClick={() => setSelectedMethod(`VA ${b}`)} className={`border py-2 px-1 rounded-lg text-xs font-bold transition-all ${selectedMethod === `VA ${b}` ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}>{b}</button>))}</div></div>
            <div><p className="text-xs text-slate-500 mb-2 uppercase font-semibold">E-Wallet</p><div className="grid grid-cols-2 gap-3">{['GoPay', 'DANA'].map(ew => (<button key={ew} onClick={() => setSelectedMethod(ew)} className={`border p-2.5 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${selectedMethod === ew ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'text-slate-600 hover:bg-slate-50'}`}><Wallet className="w-4 h-4 mr-2" /> {ew}</button>))}</div></div>
            {data.type === 'pharmacy' && (<div><p className="text-xs text-slate-500 mb-2 uppercase font-semibold">Tunai</p><button onClick={() => setSelectedMethod('COD')} className={`w-full border p-3 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${selectedMethod === 'COD' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'text-slate-600 hover:bg-slate-50'}`}><Banknote className="w-5 h-5 mr-2" /> Bayar di Tempat (COD)</button></div>)}
          </div>
          <button disabled={!selectedMethod || isProcessing} onClick={() => { setIsProcessing(true); setTimeout(() => onConfirm(data.type, data.payload, selectedMethod), 1500); }} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center shadow-md">
            {isProcessing ? <span className="flex items-center"><Activity className="w-5 h-5 mr-2 animate-spin"/> Memproses...</span> : selectedMethod ? `Bayar Rp ${data.amount.toLocaleString('id-ID')}` : 'Pilih Metode Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatModal({ partner, onClose }) {
  const [msg, setMsg] = useState('');
  const [chats, setChats] = useState([
    { id: 1, text: `Halo, ruang obrolan telah dibuka. Silakan sampaikan pesan Anda kepada ${partner.name}.`, sender: 'system', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const handleSend = (e) => {
    e.preventDefault();
    if(!msg.trim()) return;
    
    const newChat = { id: Date.now(), text: msg, sender: 'me', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    setChats(prev => [...prev, newChat]);
    setMsg('');
    
    // Simulate smart auto-reply
    setTimeout(() => {
      setChats(prev => [...prev, { 
        id: Date.now()+1, 
        text: partner.role === 'Dokter' ? 'Baik, keluhan Anda saya catat. Mari kita bahas lebih mendalam pada sesi video sebentar lagi ya.' : 'Baik Dok, terima kasih atas informasinya.', 
        sender: 'partner', 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
      }]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[350px] h-[500px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8">
      {/* Header */}
      <div className="bg-blue-600 p-3 text-white flex justify-between items-center shadow-md z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
             <img src={partner.img} alt={partner.name} className="w-10 h-10 rounded-full bg-blue-100 border border-white object-cover" />
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">{partner.name}</h4>
            <p className="text-[10px] text-blue-100">{partner.info}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-blue-700 rounded-full transition-colors"><X className="w-5 h-5"/></button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-50 p-4 overflow-y-auto space-y-4">
        {chats.map(chat => (
          <div key={chat.id} className={`flex flex-col ${chat.sender === 'me' ? 'items-end' : chat.sender === 'system' ? 'items-center' : 'items-start'}`}>
            {chat.sender === 'system' ? (
              <span className="text-[10px] bg-slate-200 text-slate-500 px-3 py-1 rounded-full mb-2">{chat.text}</span>
            ) : (
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm shadow-sm ${chat.sender === 'me' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'}`}>
                <p>{chat.text}</p>
              </div>
            )}
            {chat.sender !== 'system' && <span className="text-[10px] text-slate-400 mt-1">{chat.time}</span>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleSend} className="flex space-x-2">
          <input type="text" value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2 text-sm outline-none transition-all" />
          <button type="submit" disabled={!msg.trim()} className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><Send className="w-5 h-5 ml-0.5 mt-0.5" /></button>
        </form>
      </div>
    </div>
  );
}

function VideoCallModal({ partner, onClose }) {
  const [time, setTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center z-50 animate-in zoom-in-95 duration-200">
      
      {/* Main Video Area (Partner) */}
      <div className="relative w-full h-full md:w-[80vw] md:h-[85vh] md:rounded-3xl bg-slate-800 overflow-hidden shadow-2xl border border-slate-700 flex flex-col items-center justify-center">
        
        {/* Top Info Bar */}
        <div className="absolute top-0 inset-x-0 p-6 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center z-10 text-white">
           <div>
             <h2 className="text-xl font-bold flex items-center"><ShieldCheck className="w-5 h-5 text-green-400 mr-2"/> {partner.name}</h2>
             <p className="text-sm text-slate-300">{partner.info}</p>
           </div>
           <div className="bg-black/40 px-3 py-1 rounded-full font-mono font-medium backdrop-blur-sm border border-white/10 flex items-center">
             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span> {formatTime(time)}
           </div>
        </div>

        {/* Simulated Partner Video Stream */}
        <div className="relative flex flex-col items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20 blur-xl scale-150"></div>
            <img src={partner.img} alt={partner.name} className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-slate-600 bg-slate-700 object-cover relative z-10 shadow-2xl" />
          </div>
          <p className="mt-8 text-slate-400 font-medium">Terhubung via koneksi aman...</p>
        </div>

        {/* Picture-in-Picture (Self Video) */}
        {!isCamOff && (
          <div className="absolute bottom-28 right-6 md:bottom-8 md:right-8 w-28 h-40 md:w-40 md:h-56 bg-slate-700 rounded-xl md:rounded-2xl border-2 border-slate-500 shadow-xl overflow-hidden z-20 flex items-center justify-center">
             <User className="w-12 h-12 text-slate-500" />
             <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-md">Anda</span>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 inset-x-0 p-6 md:pb-8 bg-gradient-to-t from-black/80 to-transparent flex justify-center items-center space-x-6 z-20">
           <button onClick={() => setIsMuted(!isMuted)} className={`p-4 rounded-full transition-all shadow-lg ${isMuted ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
             {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
           </button>
           <button onClick={onClose} className="p-5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg shadow-red-500/20 transform hover:scale-105" title="Akhiri Panggilan">
             <PhoneOff className="w-7 h-7" />
           </button>
           <button onClick={() => setIsCamOff(!isCamOff)} className={`p-4 rounded-full transition-all shadow-lg ${isCamOff ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}>
             {isCamOff ? <VideoOff className="w-6 h-6" /> : <Camera className="w-6 h-6" />}
           </button>
        </div>
      </div>
    </div>
  );
}