import { useState, useEffect } from 'react';
import { Icon } from '../components/Icons';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
  const variants = {
    primary: "bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white shadow-lg",
    secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-900 text-slate-900 dark:text-white",
    danger: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-red-100 dark:hover:border-red-900 hover:text-red-600 dark:hover:text-red-400 text-slate-900 dark:text-white",
    pulse: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 animate-pulse"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
    </button>
  );
};

const FirstMate = () => {
  const [modalOpen, setModalOpen] = useState(false);
  
  const [config, setConfig] = useState({ mate: "0x8a...42", days: 365, active: true });
  const [tempConfig, setTempConfig] = useState({ ...config });
  const [isSaving, setIsSaving] = useState(false);

  const [lastPing, setLastPing] = useState(() => {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('lore_last_ping') : null;
    return saved ? new Date(saved) : new Date(Date.now() - (1000 * 60 * 60 * 24 * 30));
  });
  const [now, setNow] = useState(new Date());
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const expiryDate = new Date(lastPing.getTime() + (config.days * 24 * 60 * 60 * 1000));
  const totalDuration = config.days * 24 * 60 * 60 * 1000;
  const timeRemaining = Math.max(0, expiryDate - now);
  
  const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  const progress = Math.min(100, Math.max(0, (timeRemaining / totalDuration) * 100));

  let progressColor = "from-emerald-500 to-emerald-400";
  if (daysLeft < 30) progressColor = "from-amber-500 to-amber-400";
  if (daysLeft < 7) progressColor = "from-red-600 to-red-500";

  const handlePing = () => {
    setIsPinging(true); 
    setTimeout(() => {
      const newPing = new Date();
      setLastPing(newPing);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('lore_last_ping', newPing.toISOString());
      }
      setTimeout(() => setIsPinging(false), 600); 
    }, 100);
  };

  const openSettings = () => {
    setTempConfig({ ...config });
    setModalOpen(true);
  };

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      setConfig(tempConfig);
      setIsSaving(false);
      setModalOpen(false);
    }, 2000);
  };

  return (
    <div className="animate-slide-up">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-emerald-100 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> System Active
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white mb-2">First Mate Protocol</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
            A decentralized dead man's switch. If you go inactive, your treasury automatically transfers to your beneficiary.
          </p>
        </div>
        
        <Button 
          onClick={handlePing} 
          variant="pulse" 
          className={`md:w-auto px-8 transition-transform duration-200 ${isPinging ? 'scale-110 shadow-2xl ring-4 ring-emerald-500/30' : ''}`}
        >
          <Icon.Activity className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`}/> 
          {isPinging ? 'PINGING...' : 'PING HEARTBEAT'}
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className={`lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden transition-all duration-500 ${isPinging ? 'border-emerald-500 dark:border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]' : ''}`}>
          
          <div className={`absolute inset-0 bg-emerald-500/10 pointer-events-none transition-opacity duration-500 ${isPinging ? 'opacity-100' : 'opacity-0'}`}></div>

          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Legacy Timer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Time until automated transfer</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-black text-slate-900 dark:text-white transition-all">{daysLeft} Days</div>
              <div className="text-[10px] font-mono font-medium text-slate-400 mt-1">{hoursLeft}h {minutesLeft}m</div>
            </div>
          </div>
          
          <div className="relative h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4 z-10">
            <div 
              className={`absolute top-0 left-0 h-full bg-gradient-to-r ${progressColor} transition-all duration-1000`} 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs font-mono text-slate-400 z-10 relative">
            <span className="flex items-center gap-2">
              Last Ping: {lastPing.toLocaleDateString()}
              {isPinging && <span className="text-emerald-500 font-bold"> UPDATED</span>}
            </span>
            <span>Trigger: {config.days} Days</span>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4">
              <Icon.Users className="w-6 h-6"/>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Designated Mate</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">The wallet authorized to claim your assets.</p>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 truncate">{config.mate}</div>
            </div>
          </div>
          <button onClick={openSettings} className="mt-6 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 uppercase tracking-wider flex items-center gap-2 transition-colors">
            Configure Settings <Icon.ChevronLeft className="w-3 h-3 rotate-180"/>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white">Protected Assets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
              <tr>
                <th className="px-8 py-4">Asset</th>
                <th className="px-8 py-4">Class</th>
                <th className="px-8 py-4">Value</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-8 py-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600"></div>
                  Pirate #808
                </td>
                <td className="px-8 py-5 text-slate-600 dark:text-slate-400">Dreadnought</td>
                <td className="px-8 py-5 font-mono text-slate-900 dark:text-white font-bold">$52,400</td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    <Icon.Shield className="w-3 h-3"/> SECURED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <td className="px-8 py-5 font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-500 to-orange-600"></div>
                  Pirate #204
                </td>
                <td className="px-8 py-5 text-slate-600 dark:text-slate-400">Galleon</td>
                <td className="px-8 py-5 font-mono text-slate-900 dark:text-white font-bold">$10,100</td>
                <td className="px-8 py-5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                    <Icon.Shield className="w-3 h-3"/> SECURED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white">Protocol Settings</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">First Mate Address</label>
                <input 
                  type="text" 
                  value={tempConfig.mate}
                  onChange={(e) => setTempConfig({...tempConfig, mate: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Inactivity Timer (Days)</label>
                <input 
                  type="number" 
                  value={tempConfig.days}
                  onChange={(e) => setTempConfig({...tempConfig, days: Number(e.target.value)})}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-mono text-sm text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors"
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  If you do not interact with the protocol for this many days, the asset transfer will initiate.
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex gap-3">
                <Icon.AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0"/>
                <div className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <span className="font-bold">Warning:</span> Ensure your beneficiary has access to their wallet. This action cannot be reversed once the timer expires.
                </div>
              </div>
              <Button onClick={handleSaveConfig} loading={isSaving} disabled={isSaving}>SAVE & SIGN</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstMate;