import { useState } from 'react';
import { Icon } from '../components/Icons';

// Mock Data
const ASSETS = [
    { id: 808, class: "Dreadnought", rank: "Lvl 5", backing: 52400, ask: 49600, type: "DISCOUNT", artColor: "from-purple-900 via-slate-900 to-black", attributes: [{ trait: "Class", value: "Dreadnought" }, { trait: "Hull", value: "Ethereal" }, { trait: "Origin", value: "Base" }, { trait: "Yield", value: "5.4%" }, { trait: "Royalty", value: "0.5%" }] },
    { id: 204, class: "Galleon", rank: "Lvl 2", backing: 10100, ask: 11200, type: "PREMIUM", artColor: "from-amber-700 via-slate-900 to-black", attributes: [{ trait: "Class", value: "Galleon" }, { trait: "Hull", value: "Gold" }, { trait: "Origin", value: "Optimism" }, { trait: "Yield", value: "5.4%" }, { trait: "Royalty", value: "0.5%" }] },
    { id: 112, class: "Frigate", rank: "Lvl 1", backing: 1000, ask: 960, type: "DISCOUNT", artColor: "from-blue-900 via-slate-900 to-black", attributes: [{ trait: "Class", value: "Frigate" }, { trait: "Hull", value: "Steel" }, { trait: "Origin", value: "Base" }, { trait: "Yield", value: "5.4%" }, { trait: "Royalty", value: "0.5%" }] },
    { id: 55, class: "Skiff", rank: "Lvl 0", backing: 100, ask: 120, type: "PREMIUM", artColor: "from-slate-600 via-slate-800 to-black", attributes: [{ trait: "Class", value: "Skiff" }, { trait: "Hull", value: "Wood" }, { trait: "Origin", value: "Base" }, { trait: "Yield", value: "5.4%" }, { trait: "Royalty", value: "0.5%" }] },
    { id: 445, class: "Galleon", rank: "Lvl 3", backing: 12500, ask: 15000, type: "PREMIUM", artColor: "from-emerald-900 via-slate-900 to-black", attributes: [{ trait: "Class", value: "Galleon" }, { trait: "Hull", value: "Runed" }, { trait: "Origin", value: "Mainnet" }, { trait: "Yield", value: "5.4%" }, { trait: "Royalty", value: "0.5%" }] }
];

const ACTIVITY = [
    { event: "Sale", price: 49200, from: "0x22...11", to: "0x8a...42", date: "2m ago" },
    { event: "List", price: 49600, from: "0x8a...42", to: "-", date: "1m ago" },
    { event: "Offer", price: 48500, from: "0x99...99", to: "-", date: "10m ago" },
];

// Components
const Badge = ({ type, show }) => {
    if (!show) return null;
    if (type === "DISCOUNT") return <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap"><Icon.TrendingUp className="w-3 h-3"/> ARB OPP</div>;
    if (type === "OWNED") return <div className="bg-slate-500/10 text-slate-600 dark:text-slate-300 border border-slate-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap"><Icon.User className="w-3 h-3"/> IN WALLET</div>;
    return <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap"><Icon.Zap className="w-3 h-3"/> PREMIUM</div>;
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white shadow-lg",
        secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white",
    };
    return (
        <button onClick={onClick} disabled={disabled || loading} className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
        </button>
    );
};

const AssetCard = ({ item, onClick }) => (
    <div onClick={onClick} className="group bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col h-full">
        <div className={`h-64 rounded-2xl bg-gradient-to-br ${item.artColor} relative mb-3 flex items-center justify-center overflow-hidden shrink-0`}>
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 scale-90 md:scale-100 text-white/20">
                {item.class === "Dreadnought" ? <Icon.Skull className="w-16 h-16"/> : item.class === "Galleon" ? <Icon.Anchor className="w-16 h-16"/> : item.class === "Frigate" ? <Icon.Crosshair className="w-16 h-16"/> : <Icon.Coins className="w-16 h-16"/>}
            </div>
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-white border border-white/10">#{item.id}</div>
            <div className="absolute top-3 right-3"><Badge type={item.type} show={true} /></div>
        </div>
        
        <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-serif font-black text-slate-900 dark:text-white text-lg leading-none">{item.class}</h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1">{item.rank}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-black text-slate-900 dark:text-white">${item.ask?.toLocaleString() ?? '-'}</div>
                        <div className="text-[10px] font-mono font-medium text-slate-400">USDC</div>
                    </div>
                </div>

                {item.ask < item.backing && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700 mb-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Backing</span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-200">${item.backing.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px]">Delta</span>
                            <span className="font-mono font-bold text-emerald-600 flex items-center gap-1">
                                +${(item.backing - item.ask).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            {item.ask && <Button className="mt-2" onClick={(e) => { e.stopPropagation(); onClick(); }}>BUY NOW</Button>}
        </div>
    </div>
);

const TradeModal = ({ asset, close, type }) => {
    const [step, setStep] = useState(1);
    
    if (!asset) return null;

    const titles = { buy: "Complete Purchase", offer: "Make an Offer", list: "List for Sale" };

    const processTransaction = () => {
        setStep(2); 
        setTimeout(() => setStep(3), 2500); 
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-fade-in flex flex-col border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                    <h3 className="font-bold text-slate-900 dark:text-white">{titles[type]}</h3>
                    <button onClick={close} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/></button>
                </div>

                <div className="p-6">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${asset.artColor} mb-4 shadow-lg shrink-0 flex items-center justify-center`}>
                            {asset.class === "Dreadnought" ? <Icon.Skull className="w-12 h-12 text-white/30" /> : <Icon.Anchor className="w-12 h-12 text-white/30" />}
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">{asset.class}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">#{asset.id}</div>
                            <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-medium">Backed: ${asset.backing.toLocaleString()}</div>
                        </div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-4">
                            {type !== 'buy' ? (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Set Amount (USDC)</label>
                                    <div className="relative">
                                        <input type="number" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 text-lg" placeholder="0.00" />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">USDC</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">Total Price</span>
                                    <div className="text-xl font-black text-slate-900 dark:text-white">${asset.ask?.toLocaleString()}</div>
                                </div>
                            )}
                            
                            <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800 pt-4">
                                <div className="flex justify-between"><span>Protocol Fee</span><span>0%</span></div>
                                <div className="flex justify-between"><span>Creator Royalty</span><span>{type === 'buy' ? '0.5%' : '0%'}</span></div>
                                <div className="flex justify-between"><span>Gas Estimate</span><span className="flex items-center gap-1"><Icon.Fuel className="w-3 h-3"/> $0.42</span></div>
                            </div>

                            <Button onClick={processTransaction}>
                                {type === 'buy' ? 'CONFIRM PURCHASE' : type === 'list' ? 'CONFIRM LISTING' : 'SIGN OFFER'}
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center py-12 space-y-4">
                            <Icon.Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto"/>
                            <p className="font-bold text-slate-900 dark:text-white">Confirming on Chain...</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Please sign the transaction in your wallet.</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon.Check className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Success!</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                {type === 'buy' ? 'Asset successfully acquired.' : 'Transaction submitted.'}
                            </p>
                            <Button onClick={close} variant="secondary">CLOSE</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NFTDetail = ({ asset, goBack, openModal }) => {
    if (!asset) return null;

    return (
        <div className="animate-slide-up pb-12 w-full">
            <button onClick={goBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white text-sm font-bold mb-6 transition-colors">
                <Icon.ChevronLeft className="w-4 h-4" /> BACK TO DECK
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
                <div className="lg:col-span-5 space-y-6 w-full">
                    <div className="w-full flex flex-col items-center">
                        <div className={`w-full max-w-md lg:max-w-none aspect-square rounded-3xl bg-gradient-to-br ${asset.artColor} relative flex items-center justify-center overflow-hidden shadow-2xl mx-auto ring-1 ring-black/5 dark:ring-white/10`}>
                            <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                            <div className="relative z-10 scale-150 text-white/20">
                                {asset.class === "Dreadnought" ? <Icon.Skull className="w-32 h-32"/> : asset.class === "Galleon" ? <Icon.Anchor className="w-32 h-32"/> : asset.class === "Frigate" ? <Icon.Crosshair className="w-32 h-32"/> : <Icon.Coins className="w-32 h-32"/>}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 w-full max-w-md lg:max-w-none mx-auto">
                        {asset.attributes.map((attr, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{attr.trait}</div>
                                <div className="font-bold text-slate-900 dark:text-white text-sm truncate">{attr.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6 w-full">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white leading-tight">{asset.class} #{asset.id}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1"><Icon.ShieldCheck className="w-4 h-4 text-emerald-500"/> Verified Treasury</span>
                            <span className="flex items-center gap-1"><Icon.Wallet className="w-4 h-4"/> Owner: {asset.seller || "0x8a...42"}</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm w-full">
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
                            <div>
                                {asset.type === "OWNED" ? (
                                    <div className="text-sm font-bold text-slate-500 dark:text-slate-400">This asset is in your wallet.</div>
                                ) : (
                                    <>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Price</div>
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">${asset.ask?.toLocaleString()}</span>
                                            <span className="text-sm md:text-xl font-mono text-slate-400 font-medium">USDC</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="text-left md:text-right">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Backed Value</div>
                                <div className="text-2xl md:text-3xl font-mono font-bold text-slate-700 dark:text-slate-300">${asset.backing.toLocaleString()}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {asset.type === "OWNED" ? (
                                <>
                                    <Button onClick={() => openModal('list', asset)}>
                                        <Icon.List className="w-4 h-4"/> List for Sale
                                    </Button>
                                    <Button variant="secondary">
                                        <Icon.LogOut className="w-4 h-4"/> Redeem
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => openModal('buy', asset)}>
                                        <Icon.Wallet className="w-4 h-4"/> Buy Now
                                    </Button>
                                    <Button variant="secondary" onClick={() => openModal('offer', asset)}>
                                        <Icon.Clock className="w-4 h-4"/> Make Offer
                                    </Button>
                                </>
                            )}
                        </div>
                        <div className="mt-6 flex flex-wrap gap-y-2 items-center justify-between text-[10px] text-slate-400 uppercase font-bold border-t border-slate-100 dark:border-slate-800 pt-4">
                            <span>Market Fee: 0%</span>
                            <span>Creator Royalty: 0.5%</span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 w-full">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-bold text-slate-900 dark:text-white text-sm">Item Activity</div>
                        <div className="overflow-x-auto w-full">
                            <table className="w-full text-sm text-left whitespace-nowrap min-w-[300px]">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">
                                    <tr>
                                        <th className="px-4 py-3 md:px-6">Event</th>
                                        <th className="px-4 py-3 md:px-6">Price</th>
                                        <th className="px-4 py-3 md:px-6">From</th>
                                        <th className="px-4 py-3 md:px-6">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {ACTIVITY.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-4 py-3 md:px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {row.event === "Sale" ? <Icon.Coins className="w-3 h-3 text-emerald-500 shrink-0"/> : <Icon.ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0"/>}
                                                {row.event}
                                            </td>
                                            <td className="px-4 py-3 md:px-6 font-mono text-slate-700 dark:text-slate-300">${row.price.toLocaleString()}</td>
                                            <td className="px-4 py-3 md:px-6 text-indigo-600 dark:text-indigo-400 font-mono text-xs cursor-pointer hover:underline">{row.from}</td>
                                            <td className="px-4 py-3 md:px-6 text-slate-400 text-xs">{row.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Marketplace = () => {
    const [view, setView] = useState('list'); // 'list' or 'detail'
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [modal, setModal] = useState(null);
    const [filter, setFilter] = useState('Live');
    
    const filteredAssets = ASSETS.filter(asset => {
        if (filter === 'Live') return true;
        if (filter === 'Discount') return asset.type === 'DISCOUNT';
        return asset.class === filter;
    });

    const openDetail = (asset) => {
        setSelectedAsset(asset);
        setView('detail');
        window.scrollTo(0, 0);
    };

    const goBack = () => {
        setView('list');
        setSelectedAsset(null);
        window.scrollTo(0, 0);
    };

    if (view === 'detail' && selectedAsset) {
        return (
            <>
                <NFTDetail 
                    asset={selectedAsset} 
                    goBack={goBack}
                    openModal={(type, asset) => setModal({ type, asset })}
                />
                {modal && <TradeModal asset={modal.asset} type={modal.type} close={() => setModal(null)} />}
            </>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up pb-12">
            {/* Stats Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { label: "Floor (Skiff)", val: "$120", sub: "USDC" },
                    { label: "Vol (24h)", val: "$347k", sub: "USDC" },
                    { label: "Yield", val: "5.4%", sub: "APY" },
                    { label: "Spread", val: "+2.1%", sub: "Avg Arb" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className="text-xl font-black text-slate-900 dark:text-white">{stat.val}</div>
                        <div className="text-[10px] font-mono font-medium text-slate-400">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="sticky top-16 z-30 bg-gray-50/95 dark:bg-slate-950/95 backdrop-blur-md py-4 -mx-4 px-4 md:px-0">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm w-max">
                            {['Live', 'Skiff', 'Frigate', 'Galleon', 'Dreadnought', 'Discount'].map((tab) => (
                                <button 
                                    key={tab} 
                                    onClick={() => setFilter(tab)}
                                    className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${filter === tab ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative w-full md:w-auto group">
                        <Icon.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input type="text" placeholder="Search ID..." className="pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-medium w-full md:w-64 focus:outline-none focus:border-indigo-600 shadow-sm" />
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredAssets.map((item) => (
                    <AssetCard key={item.id} item={item} onClick={() => openDetail(item)} />
                ))}
            </div>

            {modal && <TradeModal asset={modal.asset} type={modal.type} close={() => setModal(null)} />}
        </div>
    );
};

export default Marketplace;