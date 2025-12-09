import { useState, useEffect } from 'react';
import { Plus, Trash2, Droplets, Wrench, Waves, AlertTriangle, TrendingUp, DollarSign, Save, RotateCcw } from 'lucide-react';

interface Expense {
  id: number;
  name: string;
  amount: number;
  isPatched: boolean;
}

const App = () => {
  // State dasar dengan Lazy Initialization dari LocalStorage
  // Biar pas load gak berat dan datanya nyangkut
  const [income, setIncome] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tangki_gaji_income');
      return saved ? parseFloat(saved) : 5000000;
    }
    return 5000000;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tangki_gaji_expenses');
      return saved ? (JSON.parse(saved) as Expense[]) : [
        { id: 1, name: 'Cicilan Motor', amount: 800000, isPatched: false },
        { id: 2, name: 'Kopi Kekinian', amount: 400000, isPatched: false },
        { id: 3, name: 'Netflix & Chill', amount: 180000, isPatched: true },
      ];
    }
    return [];
  });
  
  const [newExpenseName, setNewExpenseName] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // Efek samping: Setiap kali income atau expenses berubah, simpen ke LocalStorage
  useEffect(() => {
    localStorage.setItem('tangki_gaji_income', income.toString());
    localStorage.setItem('tangki_gaji_expenses', JSON.stringify(expenses));
  }, [income, expenses]);

  // Reset Data Total (Buat tobat massal)
  const handleReset = () => {
    if (confirm("Yakin mau hapus semua data? Gaji lo bakal balik ke settingan pabrik.")) {
      setIncome(5000000);
      setExpenses([]);
      localStorage.removeItem('tangki_gaji_income');
      localStorage.removeItem('tangki_gaji_expenses');
    }
  };

  // Perhitungan Matematika Kehidupan
  const totalLeaks = expenses
    .filter((e: Expense) => !e.isPatched)
.reduce((acc: number, curr: Expense) => acc + curr.amount, 0);
  
  const currentBalance = income - totalLeaks;
  // Mencegah error NaN atau Infinity kalau income 0
  const fillPercentage = income > 0 ? Math.max(0, Math.min(100, (currentBalance / income) * 100)) : 0;

  // Komentar Pedas (Sarcastic Engine)
  const getSarcasticStatus = () => {
    if (currentBalance < 0) return "TENGGELAM DALAM HUTANG. Selamat.";
    if (fillPercentage < 20) return "Kering kerontang, Bos. Puasa senin-kamis?";
    if (fillPercentage < 50) return "Bahaya. Sekali sakit, tamat riwayat.";
    if (fillPercentage < 80) return "Lumayan. Bisa napas dikit.";
    return "Sultan Mah Bebas. Air melimpah!";
  };

  const getWaterColor = () => {
    if (fillPercentage < 20) return 'from-red-600 to-red-900';
    if (fillPercentage < 50) return 'from-yellow-600 to-yellow-900';
    return 'from-cyan-500 to-blue-600';
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseName || !newExpenseAmount) return;
    const amount = parseFloat(newExpenseAmount);
    setExpenses([...expenses, { 
      id: Date.now(), 
      name: newExpenseName, 
      amount: amount, 
      isPatched: false 
    }]);
    setNewExpenseName('');
    setNewExpenseAmount('');
  };

  const togglePatch = (id: number) => {
    setExpenses(expenses.map((exp: Expense) => 
      exp.id === id ? { ...exp, isPatched: !exp.isPatched } : exp
    ));
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter((exp: Expense) => exp.id !== id));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-cyan-900 overflow-x-hidden">
      
      {/* Header Area */}
      <div className="p-6 max-w-md mx-auto relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-2">
              <Droplets className="text-cyan-400" /> TANGKI GAJI
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 flex items-center gap-1">
              <Save size={10} /> Auto-Saved
            </p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={handleReset}
                className="text-xs border border-red-900 text-red-700 px-3 py-1 rounded-full hover:bg-red-900/20 transition-colors"
                title="Reset Data"
            >
                <RotateCcw size={14} />
            </button>
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="text-xs border border-gray-800 px-3 py-1 rounded-full hover:bg-gray-900 transition-colors"
            >
                {showSettings ? 'Tutup' : 'Set Gaji'}
            </button>
          </div>
        </header>

        {/* Settings Panel (Gaji) */}
        {showSettings && (
          <div className="mb-6 bg-neutral-900/50 border border-neutral-800 p-4 rounded-xl animate-in fade-in slide-in-from-top-4">
            <label className="text-xs text-gray-400 mb-2 block">Total Kapasitas (Gaji/Income)</label>
            <input 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(parseFloat(e.target.value) || 0)}
              className="w-full bg-black border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg"
            />
          </div>
        )}

        {/* THE TANK VISUALIZATION */}
        <div className="relative h-80 w-full border-2 border-neutral-800 rounded-3xl bg-neutral-900/30 backdrop-blur-sm overflow-hidden mb-8 shadow-2xl shadow-black">
          
          {/* Glass Reflections */}
          <div className="absolute top-0 left-4 w-2 h-full bg-white/5 z-20 rounded-full blur-[1px]"></div>
          
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20 z-0"></div>

          {/* Water Level */}
          <div 
            className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-in-out bg-gradient-to-t ${getWaterColor()} z-10 flex items-start justify-center pt-4 overflow-hidden`}
            style={{ height: `${fillPercentage}%` }}
          >
            {/* Wave Animation */}
            <div className="absolute top-0 w-[200%] h-8 bg-white/10 animate-pulse rounded-[100%] blur-xl -translate-y-1/2"></div>
            
            {/* Bubbles */}
            {fillPercentage > 10 && (
              <>
                <div className="absolute bottom-10 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce duration-[3000ms]"></div>
                <div className="absolute bottom-20 left-3/4 w-3 h-3 bg-white/10 rounded-full animate-bounce duration-[5000ms]"></div>
              </>
            )}
          </div>

          {/* Status Text Overlay */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none mix-blend-difference">
            <span className="text-5xl font-black text-white tracking-tighter">
              {Math.round(fillPercentage)}%
            </span>
            <span className="text-sm font-medium text-gray-300 mt-2 uppercase tracking-widest text-center px-4">
              {formatRupiah(currentBalance)}
            </span>
          </div>

          {/* Warning Indicator if Low */}
          {fillPercentage < 20 && (
            <div className="absolute top-4 right-4 z-30 animate-pulse text-red-500">
              <AlertTriangle size={24} />
            </div>
          )}
        </div>

        {/* Sarcastic Status Bar */}
        <div className="mb-8 p-3 rounded-lg bg-neutral-900 border-l-4 border-l-cyan-500 border border-neutral-800">
          <p className="text-sm italic text-gray-400">"{getSarcasticStatus()}"</p>
        </div>

        {/* Leak List Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Waves className="text-red-500" size={18} />
              Daftar Kebocoran
            </h2>
            <span className="text-xs text-red-400">
              Total Bocor: {formatRupiah(totalLeaks)}
            </span>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Nama Kebocoran" 
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none text-white placeholder-gray-600"
            />
            <input 
              type="number" 
              placeholder="Rp" 
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              className="w-24 bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm focus:border-cyan-500 focus:outline-none text-white placeholder-gray-600"
            />
            <button 
              type="submit"
              className="bg-gray-100 hover:bg-white text-black p-3 rounded-lg transition-colors"
            >
              <Plus size={20} />
            </button>
          </form>

          {/* Expense Items */}
          <div className="space-y-3">
            {expenses.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-sm border border-dashed border-gray-800 rounded-xl">
                Belum ada kebocoran? <br/>Halah, pencitraan. Masukin sini cepet.
              </div>
            )}

            {expenses.map((expense: Expense) => (
              <div 
                key={expense.id}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  expense.isPatched 
                    ? 'bg-neutral-900/30 border-neutral-800 opacity-60' 
                    : 'bg-neutral-900 border-red-900/30 hover:border-red-500/50'
                }`}
              >
                {/* Active Leak Animation Background */}
                {!expense.isPatched && (
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-red-500/5 blur-2xl rounded-full"></div>
                )}

                <div className="p-4 flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => togglePatch(expense.id)}
                      className={`p-2 rounded-lg transition-all ${
                        expense.isPatched 
                          ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                          : 'bg-neutral-800 text-gray-400 hover:bg-cyan-500 hover:text-black'
                      }`}
                      title={expense.isPatched ? "Bocorin lagi" : "Tambal bocor ini"}
                    >
                      <Wrench size={18} className={expense.isPatched ? "" : "animate-pulse"} />
                    </button>
                    
                    <div>
                      <h3 className={`font-medium ${expense.isPatched ? 'text-gray-500 line-through' : 'text-white'}`}>
                        {expense.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatRupiah(expense.amount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`text-[10px] font-bold px-2 py-1 rounded ${
                      expense.isPatched 
                        ? 'text-green-600 bg-green-900/10' 
                        : 'text-red-500 bg-red-900/10'
                    }`}>
                      {expense.isPatched ? 'AMAN' : 'BOCOR'}
                    </div>

                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="text-gray-700 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Footer */}
          <div className="mt-12 pt-6 border-t border-neutral-800 text-center pb-8">
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-900 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1 flex justify-center items-center gap-1"><TrendingUp size={12}/> Potensi Hemat</div>
                    <div className="text-green-500 font-bold">
                        {formatRupiah(expenses
  .filter((e: Expense) => e.isPatched)
  .reduce((a: number, b: Expense) => a + b.amount, 0))}
                    </div>
                </div>
                <div className="p-4 bg-neutral-900 rounded-lg">
                    <div className="text-gray-500 text-xs mb-1 flex justify-center items-center gap-1"><DollarSign size={12}/> Sisa Nyawa</div>
                    <div className={`font-bold ${currentBalance < 0 ? 'text-red-500' : 'text-white'}`}>
                        {formatRupiah(currentBalance)}
                    </div>
                </div>
             </div>
             <p className="text-[10px] text-gray-700 mt-6">
                *Data aman tersimpan di browser lo. Jangan dipake di warnet ya.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;


