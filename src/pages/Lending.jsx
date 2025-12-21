import { useState } from 'react';
import { Icon } from '../components/Icons';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg",
        secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white",
        danger: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-red-100 hover:text-red-600 dark:hover:text-red-400 text-slate-900 dark:text-white",
        emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200"
    };
    return (
        <button onClick={onClick} disabled={disabled || loading} className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
        </button>
    );
};

const Lending = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [modalStep, setModalStep] = useState(1);
    
    const [walletAssets, setWalletAssets] = useState([
        { id: 204, class: "Galleon", backing: 10100, artColor: "from-amber-700 via-slate-900 to-black" },
        { id: 112, class: "Frigate", backing: 1000, artColor: "from-blue-900 via-slate-900 to-black" }
    ]);
    const [vaultAssets, setVaultAssets] = useState([
        { id: 808, class: "Dreadnought", backing: 52400, artColor: "from-purple-900 via-slate-900 to-black" }
    ]);
    const [debt, setDebt] = useState(15000); 
    const [lorePrice] = useState(0.15); 
    const [amountInput, setAmountInput] = useState('');

    // Calculations
    const totalCollateral = vaultAssets.reduce((acc, curr) => acc + curr.backing, 0);
    const maxBorrow = totalCollateral * 0.50; 
    const availableToBorrow = Math.max(0, maxBorrow - debt);
    
    const calculateHF = (newDebt, newCollateral) => {
        if (newDebt <= 0) return 999;
        return (newCollateral * 0.85) / newDebt;
    };

    const currentHF = calculateHF(debt, totalCollateral);

    const calculateRate = (currentDebt) => {
        if (totalCollateral === 0) return 0;
        const utilization = currentDebt / maxBorrow; 
        const rate = 2.0 + (Math.min(1, utilization) * 3.0); 
        return rate.toFixed(2);
    };

    const currentRate = calculateRate(debt);
    const accruedInterest = debt > 0 ? (debt * (currentRate / 100)) : 0;
    const totalOwed = debt + accruedInterest;
    
    const openModal = (type, asset = null) => {
        setActiveModal({ type, asset });
        setModalStep(1);
        setAmountInput('');
    };

    const executeTransaction = () => {
        setModalStep(2); 
        setTimeout(() => {
            if (activeModal.type === 'deposit') {
                setVaultAssets(prev => [...prev, activeModal.asset]);
                setWalletAssets(prev => prev.filter(a => a.id !== activeModal.asset.id));
            } else if (activeModal.type === 'withdraw') {
                setVaultAssets(prev => prev.filter(a => a.id !== activeModal.asset.id));
                setWalletAssets(prev => [...prev, activeModal.asset]);
            } else if (activeModal.type === 'borrow') {
                setDebt(prev => prev + Number(amountInput));
            } else if (activeModal.type === 'repay') {
                setDebt(prev => Math.max(0, prev - Number(amountInput)));
            }
            setModalStep(3);
        }, 2000);
    };

    const getHealthColor = (hf) => {
        if (hf < 1.1) return "text-red-500 dark:text-red-400";
        if (hf < 1.5) return "text-amber-500 dark:text-amber-400";
        return "text-emerald-500 dark:text-emerald-400";
    };

    // Modal Preview State
    let previewHF = currentHF;
    let previewRate = currentRate;
    let interestDue = 0;
    let totalRepayCost = 0;
    let isOverLimit = false;

    if (activeModal?.type === 'borrow' && amountInput) {
        const val = Number(amountInput);
        if (val > availableToBorrow) isOverLimit = true;
        const projectedDebt = debt + val;
        previewHF = calculateHF(projectedDebt, totalCollateral);
        previewRate = calculateRate(projectedDebt);
    } else if (activeModal?.type === 'repay' && amountInput) {
        const val = Number(amountInput);
        if (val > totalOwed) isOverLimit = true;
        previewHF = calculateHF(debt - val, totalCollateral);
        interestDue = val * (calculateRate(debt) / 100);
        totalRepayCost = val + interestDue;
        previewRate = calculateRate(debt - val);
    } else if (activeModal?.type === 'deposit') {
        previewHF = calculateHF(debt, totalCollateral + activeModal.asset.backing);
    } else if (activeModal?.type === 'withdraw') {
        previewHF = calculateHF(debt, totalCollateral - activeModal.asset.backing);
    }

    return (
        <div className="animate-slide-up pb-12">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white mb-2">Quartermaster's Vault</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">Access the Closed-Loop Credit Facility.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Collateral</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white">${totalCollateral.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Total Debt</div>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">${debt.toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Borrow Power</div>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">${Math.max(0, availableToBorrow).toLocaleString()}</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Health Factor</div>
                    <div className={`text-xl font-black ${getHealthColor(currentHF)}`}>{currentHF >= 999 ? '∞' : currentHF.toFixed(2)}</div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left Col: Management */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Collateral Management</h3>
                            <div className="text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">50% LTV</div>
                        </div>
                        <div className="p-4 space-y-6">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Icon.Lock className="w-3 h-3"/> Locked in Lending({vaultAssets.length})</div>
                                <div className="space-y-3">
                                    {vaultAssets.map(asset => (
                                        <div key={asset.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${asset.artColor} shrink-0`}></div>
                                            <div className="flex-1"><div className="text-xs font-bold text-slate-900 dark:text-white">{asset.class} #{asset.id}</div><div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${asset.backing.toLocaleString()}</div></div>
                                            <button onClick={() => openModal('withdraw', asset)} className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 transition-colors">Unlock</button>
                                        </div>
                                    ))}
                                    {vaultAssets.length === 0 && <div className="text-center text-xs text-slate-400 py-4 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">No collateral locked.</div>}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2"><Icon.Wallet className="w-3 h-3"/> Available in Wallet ({walletAssets.length})</div>
                                <div className="space-y-3">
                                    {walletAssets.map(asset => (
                                        <div key={asset.id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors cursor-pointer group" onClick={() => openModal('deposit', asset)}>
                                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${asset.artColor} shrink-0`}></div>
                                            <div className="flex-1"><div className="text-xs font-bold text-slate-900 dark:text-white">{asset.class} #{asset.id}</div><div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">${asset.backing.toLocaleString()}</div></div>
                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Console */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-slate-900 dark:bg-indigo-950/20 rounded-3xl p-6 md:p-8 border border-slate-800 dark:border-indigo-500/20 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div><h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Icon.ShieldAlert className="w-5 h-5 text-emerald-400"/> Risk Monitor</h3><p className="text-xs text-slate-400">Real-time solvency analysis.</p></div>
                            <div className="text-right"><div className="text-2xl font-mono font-bold">{currentHF >= 999 ? '∞' : currentHF.toFixed(2)}</div><div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Health Factor</div></div>
                        </div>
                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-2 relative">
                            <div className="absolute left-[30%] top-0 h-full w-0.5 bg-red-500 z-20"></div>
                            <div className={`h-full transition-all duration-500 ${getHealthColor(currentHF).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`} style={{ width: `${Math.min(100, (currentHF / 3) * 100)}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-6"><span>1.0 (Liquidated)</span><span>3.0 (Safe)</span></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5"><div className="text-slate-400 mb-1">Interest Rate</div><div className="font-mono font-bold text-emerald-400">{currentRate}% APY</div></div>
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5"><div className="text-slate-400 mb-1">Accrued Interest</div><div className="font-mono font-bold text-white">+{accruedInterest.toFixed(2)} $LORE</div></div>
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5"><div className="text-slate-400 mb-1">Liquidation Price</div><div className="font-mono font-bold text-white">${debt > 0 ? ((totalCollateral * 0.85) / (debt/lorePrice)).toFixed(2) : '---'}</div></div>
                            <div className="bg-black/20 p-3 rounded-xl border border-white/5"><div className="text-slate-400 mb-1">Passive Deleveraging</div><div className="font-mono font-bold text-emerald-400">+${(totalCollateral * 0.054 / 365).toFixed(2)} / Day</div></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                        <div className="flex gap-4 mb-8">
                            <button onClick={() => openModal('borrow')} disabled={availableToBorrow <= 0} className="flex-1 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-200 dark:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">Borrow $LORE</button>
                            <button onClick={() => openModal('repay')} disabled={debt <= 0} className="flex-1 py-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed">Repay Debt</button>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 flex gap-3 items-start">
                            <Icon.AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5"/>
                            <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed"><span className="font-bold block mb-1">Hard Liquidation Rule</span>Due to Immutable Principal, you cannot top-up collateral to prevent liquidation. You must repay debt if HF drops below 1.1.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-slide-up flex flex-col overflow-hidden max-h-[85vh] border border-slate-200 dark:border-slate-800">
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                            <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{activeModal.type === 'deposit' ? 'Lock Collateral' : activeModal.type === 'borrow' ? 'Borrow Funds' : activeModal.type === 'repay' ? 'Repay Debt' : 'Unlock Collateral'}</h3>
                            <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                <Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {modalStep === 1 ? (
                                <div className="space-y-6">
                                    {activeModal.type === 'deposit' || activeModal.type === 'withdraw' ? (
                                        <div className="flex gap-4 items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${activeModal.asset.artColor} shrink-0`}></div>
                                            <div>
                                                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{activeModal.asset.class}</div>
                                                <div className="text-lg font-black text-slate-900 dark:text-white">#{activeModal.asset.id}</div>
                                                <div className="text-xs font-mono text-emerald-500 dark:text-emerald-400 font-bold">${activeModal.asset.backing.toLocaleString()} Value</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Amount ($LORE)</label>
                                            <div className="relative">
                                                <input type="number" value={amountInput} onChange={(e) => setAmountInput(e.target.value)} className={`w-full bg-slate-50 dark:bg-slate-800 border ${isOverLimit ? 'border-red-500 text-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white'} rounded-xl p-4 pr-16 font-mono font-bold focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 text-lg transition-colors`} placeholder="0.00" />
                                                <button onClick={() => setAmountInput(activeModal.type === 'borrow' ? availableToBorrow : totalOwed)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors">MAX</button>
                                            </div>
                                            
                                            <div className={`flex justify-between mt-2 text-xs ${isOverLimit ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                                <span>{activeModal.type === 'repay' ? 'Total Due (Inc. Interest):' : 'Available:'}</span>
                                                <span>{activeModal.type === 'borrow' ? availableToBorrow.toLocaleString() : totalOwed.toLocaleString()}</span>
                                            </div>

                                            {activeModal.type === 'repay' && amountInput > 0 && !isOverLimit && (
                                                <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs space-y-1">
                                                    <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Principal</span><span>{amountInput} $LORE</span></div>
                                                    <div className="flex justify-between text-slate-500 dark:text-slate-400"><span>Accrued Interest ({calculateRate(debt)}%)</span><span className="text-emerald-500 dark:text-emerald-400">+{interestDue.toFixed(2)} $LORE</span></div>
                                                    <div className="flex justify-between border-t border-slate-200 dark:border-slate-600 pt-1 mt-1 font-bold text-slate-900 dark:text-white"><span>Total Payback</span><span>{totalRepayCost.toFixed(2)} $LORE</span></div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-xl">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-indigo-800 dark:text-indigo-300 uppercase">Health Impact</span>
                                            <span className={`text-sm font-black ${getHealthColor(previewHF)}`}>{previewHF >= 999 ? '∞' : previewHF.toFixed(2)}</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all ${getHealthColor(previewHF).replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')}`} style={{ width: `${Math.min(100, (previewHF / 3) * 100)}%` }}></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-500/30">
                                            <div className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 text-center">Current: {currentHF >= 999 ? '∞' : currentHF.toFixed(2)} → New: {previewHF >= 999 ? '∞' : previewHF.toFixed(2)}</div>
                                            {(activeModal.type === 'borrow' || activeModal.type === 'repay') && <div className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70 text-center font-bold flex items-center justify-center gap-1"><Icon.Percent className="w-3 h-3"/> Rate: {previewRate}%</div>}
                                        </div>
                                    </div>
                                    
                                    {previewHF < 1.0 && <div className="flex gap-2 items-center text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50"><Icon.AlertTriangle className="w-4 h-4"/> Transaction would cause liquidation.</div>}

                                    <Button onClick={executeTransaction} disabled={previewHF < 1.0 || isOverLimit || ((activeModal.type === 'borrow' || activeModal.type === 'repay') && (!amountInput || amountInput <= 0))}>CONFIRM TRANSACTION</Button>
                                </div>
                            ) : modalStep === 2 ? (
                                <div className="text-center py-12 space-y-4"><Icon.Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto"/><p className="font-bold text-slate-900 dark:text-white">Confirming on Chain...</p></div>
                            ) : (
                                <div className="text-center py-8"><div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4"><Icon.Check className="w-8 h-8"/></div><h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Success!</h4><p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Values have been updated.</p><Button onClick={() => setActiveModal(null)} variant="secondary">CLOSE</Button></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Lending;