import { useState } from 'react';
import { Icon } from '../components/Icons';

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg",
        danger: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30",
        secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white"
    };
    return (
        <button onClick={onClick} disabled={disabled || loading} className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
        </button>
    );
};

const RedemptionCard = ({ asset, onRedeem }) => {
    const total = asset.principal + asset.yield;
    
    return (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group animate-fade-in">
            <div className="flex gap-4 items-center mb-6">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${asset.artColor} flex items-center justify-center shadow-inner shrink-0`}>
                    {asset.class === 'Dreadnought' ? <Icon.Skull className="w-10 h-10 text-white/40"/> : <Icon.Anchor className="w-10 h-10 text-white/40"/>}
                </div>
                <div>
                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">{asset.class}</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white mb-1">#{asset.id}</div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-100 dark:border-emerald-900/50">
                        <Icon.TrendingUp className="w-3 h-3"/> +${asset.yield.toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Principal</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">${asset.principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Yield (5.4%)</span>
                    <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">+${asset.yield.toLocaleString()}</span>
                </div>
                <div className="h-px bg-slate-200 dark:bg-slate-700 my-1"></div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-900 dark:text-white font-bold">Total Redeemable</span>
                    <span className="font-mono font-black text-slate-900 dark:text-white">${total.toLocaleString()}</span>
                </div>
            </div>

            <Button onClick={() => onRedeem(asset)} variant="danger">
                <Icon.Flame className="w-4 h-4"/> BURN & REDEEM
            </Button>
        </div>
    );
};

const RedeemModal = ({ asset, close, onConfirmBurn }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const totalValue = asset.principal + asset.yield;
    const exitFee = totalValue * 0.005;
    const netPayout = totalValue - exitFee;

    const handleBurn = () => {
        setIsLoading(true);
        setTimeout(() => {
            setStep(2);
            setIsLoading(false);
        }, 3000);
    };

    const handleClose = () => {
        if (step === 2) {
            onConfirmBurn(asset.id);
        }
        close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={close}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-slide-up flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">
                
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                    <h3 className="font-bold text-slate-900 dark:text-white">Burn Treasury</h3>
                    <button onClick={close} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/>
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${asset.artColor} shrink-0`}></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{asset.class}</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">#{asset.id}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Gross Value</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">${totalValue.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Exit Fee (0.5%)</span>
                                    <span className="font-mono font-bold text-red-500 dark:text-red-400">-${exitFee.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                                <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                                <div className="flex justify-between text-lg">
                                    <span className="font-bold text-slate-900 dark:text-white">Net Payout</span>
                                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">${netPayout.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                                </div>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 rounded-xl p-4 flex gap-3 items-start">
                                <Icon.AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"/>
                                <div className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">
                                    <span className="font-bold block mb-1">Irreversible Action</span>
                                    Burning this NFT will destroy it permanently. You will lose all governance rights and visual utility associated with #{asset.id}.
                                </div>
                            </div>

                            <Button onClick={handleBurn} variant="danger" loading={isLoading}>
                                CONFIRM BURN
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-6">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow">
                                <Icon.Check className="w-10 h-10"/>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Treasury Reclaimed</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                                    The NFT has been burned. <strong>${netPayout.toLocaleString()} USDC</strong> has been transferred to your wallet.
                                </p>
                            </div>
                            <Button onClick={handleClose} variant="secondary">CLOSE</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Redeem = () => {
    const [selectedAsset, setSelectedAsset] = useState(null);
    
    const [myAssets, setMyAssets] = useState([
        { id: 808, class: "Dreadnought", rank: "Lvl 5", principal: 50000, yield: 2400, type: "OWNED", artColor: "from-purple-900 via-slate-900 to-black" },
        { id: 204, class: "Galleon", rank: "Lvl 2", principal: 10000, yield: 100, type: "OWNED", artColor: "from-amber-700 via-slate-900 to-black" },
        { id: 112, class: "Frigate", rank: "Lvl 1", principal: 1000, yield: 24, type: "OWNED", artColor: "from-blue-900 via-slate-900 to-black" }
    ]);

    const burnAsset = (id) => {
        setMyAssets(prev => prev.filter(asset => asset.id !== id));
        setSelectedAsset(null);
    };

    const totalValue = myAssets.reduce((acc, curr) => acc + curr.principal + curr.yield, 0);

    return (
        <div className="animate-slide-up pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4 border border-red-100 dark:border-red-900/50">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Retirement Deck
                    </div>
                    <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 dark:text-white mb-2">My Barracks</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg">
                        Manage your active treasuries. Burn bonds to reclaim capital.
                    </p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-right min-w-[200px]">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Liquidity</div>
                    <div className="text-3xl font-mono font-black text-slate-900 dark:text-white">${totalValue.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myAssets.length > 0 ? (
                    myAssets.map(asset => (
                        <RedemptionCard key={asset.id} asset={asset} onRedeem={setSelectedAsset} />
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                        <Icon.Anchor className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                        <p className="font-bold">No Active Treasuries</p>
                        <p className="text-xs mt-1">Recruit a Pirate to see it here.</p>
                    </div>
                )}
            </div>

            {selectedAsset && (
                <RedeemModal 
                    asset={selectedAsset} 
                    close={() => setSelectedAsset(null)} 
                    onConfirmBurn={burnAsset}
                />
            )}
        </div>
    );
};

export default Redeem;