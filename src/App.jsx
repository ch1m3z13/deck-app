import React, { useState, useEffect } from 'react';
import { 
    Search, Filter, ArrowUpRight, TrendingUp, 
    ArrowDown, Activity, Wallet, Skull, Anchor,
    Crosshair, Zap, BarChart3, ChevronDown, ChevronLeft,
    Clock, Copy, ExternalLink, ShieldCheck, X, Check,
    MoreHorizontal, Coins, User, List, LogOut, Menu
} from 'lucide-react';

// --- MOCK DATA ENGINE ---

const CURRENT_USER = "0x71...89";

const ASSETS = [
    {
        id: 808,
        class: "Dreadnought",
        rank: "Lvl 5",
        backing: 52400,
        ask: 49600, // USDC
        seller: "0x8a...42",
        type: "DISCOUNT", 
        artColor: "from-purple-900 via-slate-900 to-black",
        history: [49000, 49500, 48000, 49600],
        attributes: [
            { trait: "Class", value: "Dreadnought" },
            { trait: "Hull", value: "Ethereal" },
            { trait: "Origin", value: "Base" },
            { trait: "Yield", value: "5.4%" }
        ]
    },
    {
        id: 204,
        class: "Galleon",
        rank: "Lvl 2",
        backing: 10100,
        ask: 11200, // USDC
        seller: "0xb4...99",
        type: "PREMIUM",
        artColor: "from-amber-700 via-slate-900 to-black",
        history: [10800, 11000, 11100, 11200],
        attributes: [
            { trait: "Class", value: "Galleon" },
            { trait: "Hull", value: "Gold Plated" },
            { trait: "Origin", value: "Optimism" },
            { trait: "Yield", value: "5.4%" }
        ]
    },
    {
        id: 112,
        class: "Frigate",
        rank: "Lvl 1",
        backing: 1000,
        ask: 960, // USDC
        seller: "0x12...ff",
        type: "DISCOUNT",
        artColor: "from-blue-900 via-slate-900 to-black",
        history: [920, 940, 950, 960],
        attributes: [
            { trait: "Class", value: "Frigate" },
            { trait: "Hull", value: "Steel" },
            { trait: "Origin", value: "Base" },
            { trait: "Yield", value: "5.4%" }
        ]
    },
    {
        id: 445,
        class: "Galleon",
        rank: "Lvl 3",
        backing: 12500,
        ask: 15000,
        seller: "0xaa...bb",
        type: "PREMIUM",
        artColor: "from-emerald-900 via-slate-900 to-black",
        history: [14000, 14500, 14800, 15000],
        attributes: [
            { trait: "Class", value: "Galleon" },
            { trait: "Hull", value: "Runed" },
            { trait: "Origin", value: "Mainnet" },
            { trait: "Yield", value: "5.4%" }
        ]
    }
];

const MY_ASSETS = [
    {
        id: 777,
        class: "Frigate",
        rank: "Lvl 1",
        backing: 2500,
        ask: null, // Not listed
        seller: CURRENT_USER,
        type: "OWNED",
        artColor: "from-slate-800 via-slate-900 to-black",
        attributes: [
            { trait: "Class", value: "Frigate" },
            { trait: "Hull", value: "Iron" },
            { trait: "Origin", value: "Base" },
            { trait: "Yield", value: "5.4%" }
        ]
    }
];

const ACTIVITY = [
    { event: "Sale", price: 49200, from: "0x22...11", to: "0x8a...42", date: "2m ago" },
    { event: "List", price: 49600, from: "0x8a...42", to: "-", date: "1m ago" },
    { event: "Offer", price: 48500, from: "0x99...99", to: "-", date: "10m ago" },
];

// --- UTILITY COMPONENTS ---

const Badge = ({ type }) => {
    if (type === "DISCOUNT") {
        return (
            <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap">
                <TrendingUp size={10} /> ARB OPP
            </div>
        );
    }
    if (type === "OWNED") {
        return (
            <div className="bg-slate-500/10 text-slate-600 border border-slate-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap">
                <User size={10} /> IN WALLET
            </div>
        );
    }
    return (
        <div className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm whitespace-nowrap">
            <Zap size={10} /> PREMIUM
        </div>
    );
};

// --- CORE PAGES ---

// 1. HOME: The Live Terminal
const MarketHome = ({ navigate, assets }) => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Header - Mobile Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {[
                    { label: "Floor (Frigate)", val: "$960", sub: "USDC" },
                    { label: "Total Vol (24h)", val: "$347k", sub: "USDC" },
                    { label: "Yield APY", val: "5.4%", sub: "Aave V3" },
                    { label: "Arb Spread", val: "+2.1%", sub: "Avg Discount", color: "text-emerald-600" }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</div>
                        <div className={`text-xl md:text-2xl font-black text-slate-900 ${stat.color || ''}`}>{stat.val}</div>
                        <div className="text-xs font-mono font-medium text-slate-400">{stat.sub}</div>
                    </div>
                ))}
            </div>

            {/* Filters & Search - Stacked on Mobile */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    <div className="flex p-1 bg-white border border-slate-200 rounded-xl shadow-sm w-max">
                        {['Live', 'Dreadnought', 'Galleon', 'Discount'].map((tab, i) => (
                            <button key={tab} className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${i === 0 ? 'bg-[#0F172A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="relative w-full md:w-auto group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-600 transition-colors" />
                    <input type="text" placeholder="Search ID..." className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium w-full md:w-64 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-sm" />
                </div>
            </div>

            {/* Grid - 1 Col Mobile, 4 Col Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {assets.map((item) => (
                    <div key={item.id} onClick={() => navigate('detail', item)} className="group bg-white rounded-3xl p-3 border border-slate-200 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative">
                        <div className={`h-64 rounded-2xl bg-gradient-to-br ${item.artColor} relative mb-3 flex items-center justify-center overflow-hidden`}>
                            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 scale-90 md:scale-100">
                                {item.class === "Dreadnought" ? <Skull size={64} className="text-white/20" /> : <Anchor size={64} className="text-white/20" />}
                            </div>
                            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-white border border-white/10">#{item.id}</div>
                            <div className="absolute top-3 right-3"><Badge type={item.type} /></div>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-serif font-black text-slate-900 text-lg leading-none">{item.class}</h3>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{item.rank}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-slate-900">${item.ask.toLocaleString()}</div>
                                    <div className="text-[10px] font-mono font-medium text-slate-400">USDC</div>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3 group-hover:border-indigo-100 transition-colors">
                                <div className="flex justify-between items-center text-xs mb-2">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Backing</span>
                                    <span className="font-mono font-bold text-slate-700">${item.backing.toLocaleString()}</span>
                                </div>
                                <div className="h-px w-full bg-slate-200 mb-2"></div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 font-bold uppercase text-[10px]">Delta</span>
                                    {item.ask < item.backing ? (
                                        <span className="font-mono font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                                            +${(item.backing - item.ask).toLocaleString()} Profit
                                        </span>
                                    ) : (
                                        <span className="font-mono font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
                                            +${(item.ask - item.backing).toLocaleString()} Premium
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm bg-[#0F172A] hover:bg-slate-800 text-white`}>
                                BUY NOW
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 2. PROFILE: The Barracks
const UserProfile = ({ navigate, myAssets }) => {
    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <button onClick={() => navigate('home')} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold transition-colors">
                <ChevronLeft size={16} /> MARKET
            </button>

            {/* Profile Header */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shrink-0"></div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-2 font-mono">{CURRENT_USER}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                        <span className="px-3 py-1 bg-slate-100 rounded-full">Captain Lvl 4</span>
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full">Active Yield: 5.4%</span>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-6 md:pt-0">
                    <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Net Worth</div>
                        <div className="text-2xl font-black text-slate-900">$2,500</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">Yield Earned</div>
                        <div className="text-2xl font-black text-emerald-600">+$124</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 overflow-x-auto hide-scrollbar">
                <div className="flex gap-8 w-max px-2">
                    {['My Barracks (1)', 'Listings', 'Activity', 'Offers'].map((tab, i) => (
                        <button key={tab} className={`pb-4 text-sm font-bold tracking-wide transition-colors ${i === 0 ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {myAssets.map((item) => (
                    <div key={item.id} className="group bg-white rounded-3xl p-3 border border-slate-200 hover:shadow-xl transition-all relative">
                        <div className={`h-48 rounded-2xl bg-gradient-to-br ${item.artColor} relative mb-3 flex items-center justify-center overflow-hidden`}>
                            <Anchor size={48} className="text-white/20" />
                            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-white border border-white/10">#{item.id}</div>
                        </div>
                        <div className="px-2 pb-2">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-serif font-black text-slate-900 text-lg">{item.class}</h3>
                                <span className="text-xs font-mono font-bold text-slate-500">Backed: ${item.backing}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => navigate('detail', item)} className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs">
                                    MANAGE
                                </button>
                                <button className="py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200">
                                    LIST FOR SALE
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 3. NFT DETAIL: The Deep Dive
const NFTDetail = ({ asset, goBack, openModal }) => {
    if (!asset) return null;

    return (
        <div className="animate-in slide-in-from-right-8 fade-in duration-300">
            <button onClick={goBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-sm font-bold mb-6 transition-colors">
                <ChevronLeft size={16} /> BACK TO DECK
            </button>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Left: Visuals - Full width on mobile */}
                <div className="lg:col-span-5 space-y-6">
                    <div className={`aspect-square rounded-3xl bg-gradient-to-br ${asset.artColor} relative flex items-center justify-center overflow-hidden shadow-2xl`}>
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                        <div className="relative z-10 scale-150">
                            {asset.class === "Dreadnought" ? <Skull size={120} className="text-white/20" /> : <Anchor size={120} className="text-white/20" />}
                        </div>
                    </div>
                    {/* Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        {asset.attributes.map((attr, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 text-center">
                                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{attr.trait}</div>
                                <div className="font-bold text-slate-900">{attr.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Data & Action */}
                <div className="lg:col-span-7 space-y-8">
                    {/* Header Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900">{asset.class} #{asset.id}</h1>
                                <Badge type={asset.type} />
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-500"/> Verified</span>
                                <span className="flex items-center gap-1"><Wallet size={14} /> Owner: {asset.seller}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors"><ExternalLink size={18}/></button>
                            <button className="p-3 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-colors"><MoreHorizontal size={18}/></button>
                        </div>
                    </div>

                    {/* Price Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8">
                            <div>
                                {asset.type === "OWNED" ? (
                                    <div className="text-sm font-bold text-slate-500">This asset is in your wallet.</div>
                                ) : (
                                    <>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Price</div>
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-4xl md:text-5xl font-black text-slate-900">${asset.ask.toLocaleString()}</span>
                                            <span className="text-sm md:text-xl font-mono text-slate-400 font-medium">USDC</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 md:text-right">Backing Value</div>
                                <div className="text-2xl md:text-3xl font-mono font-bold text-slate-700 md:text-right">${asset.backing.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {asset.type === "OWNED" ? (
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => openModal('list', asset)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2"
                                >
                                    <List size={18} /> List for Sale
                                </button>
                                <button className="bg-white border-2 border-slate-100 hover:border-red-100 hover:text-red-600 text-slate-900 font-bold py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors">
                                    <LogOut size={18} /> Redeem (Burn)
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => openModal('buy', asset)}
                                    className="bg-[#0F172A] hover:bg-slate-800 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                                >
                                    <Wallet size={18} /> Buy Now
                                </button>
                                <button 
                                    onClick={() => openModal('bid', asset)}
                                    className="bg-white border-2 border-slate-100 hover:border-indigo-100 text-slate-900 font-bold py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Clock size={18} /> Make Offer
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Activity Table - Horizontal Scroll on Mobile */}
                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200">
                        <div className="p-4 border-b border-slate-100 font-bold text-slate-900 text-sm">Item Activity</div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-3">Event</th>
                                        <th className="px-6 py-3">Price</th>
                                        <th className="px-6 py-3">From</th>
                                        <th className="px-6 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {ACTIVITY.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                                                {row.event === "Sale" ? <Coins size={14} className="text-emerald-500"/> : <ArrowUpRight size={14} className="text-slate-400"/>}
                                                {row.event}
                                            </td>
                                            <td className="px-6 py-4 font-mono">${row.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-indigo-600 font-mono text-xs cursor-pointer hover:underline">{row.from}</td>
                                            <td className="px-6 py-4 text-slate-400 text-xs">{row.date}</td>
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

// 3. UNIVERSAL MODAL (Buy / List / Bid)
const TradeModal = ({ asset, close, type }) => {
    const [step, setStep] = useState(1);
    
    if (!asset) return null;

    const titles = {
        buy: "Complete Purchase",
        bid: "Make an Offer",
        list: "List for Sale"
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}></div>
            {/* Added max-h and overflow-y-auto to fix mobile fit */}
            <div className="bg-white w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-in zoom-in-95 duration-200">
                
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 sticky top-0 backdrop-blur-sm z-10">
                    <h3 className="font-bold text-slate-900">{titles[type]}</h3>
                    <button onClick={close} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={18}/></button>
                </div>

                <div className="p-6">
                    <div className="flex gap-4 mb-6">
                        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${asset.artColor} shrink-0`}></div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase">{asset.class}</div>
                            <div className="text-lg font-black text-slate-900">#{asset.id}</div>
                            <div className="text-xs font-mono text-emerald-600 font-medium">Backed: ${asset.backing.toLocaleString()}</div>
                        </div>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-4">
                            {type === 'list' || type === 'bid' ? (
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Set Price (USDC)</label>
                                    <input type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600" placeholder="0.00" />
                                </div>
                            ) : (
                                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <span className="text-sm font-bold text-slate-600">Total Price</span>
                                    <div className="text-xl font-black text-slate-900">${asset.ask?.toLocaleString()}</div>
                                </div>
                            )}
                            
                            <div className="space-y-2 text-xs text-slate-500 font-medium">
                                <div className="flex justify-between"><span>Protocol Fee</span><span>0%</span></div>
                                <div className="flex justify-between"><span>Royalties</span><span>0%</span></div>
                            </div>

                            <button onClick={() => setStep(2)} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
                                {type === 'list' ? 'CONFIRM LISTING' : 'CONFIRM TRANSACTION'}
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                                <Check size={32} strokeWidth={3} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 mb-2">Success!</h4>
                            <p className="text-slate-500 text-sm mb-6">Transaction confirmed on chain.</p>
                            <button onClick={close} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold py-3 rounded-xl transition-colors">CLOSE</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 4. MAIN APP SHELL
const App = () => {
    const [view, setView] = useState('home'); 
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [modal, setModal] = useState(null); 
    const [mobileMenu, setMobileMenu] = useState(false);

    const navigate = (page, asset = null) => {
        if (asset) setSelectedAsset(asset);
        setView(page);
        setMobileMenu(false);
        window.scrollTo(0,0);
    };

    return (
        <div className="w-full min-h-screen bg-[#FAFAFA] font-sans text-slate-900 pb-20 relative">
            
            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 h-16 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('home')}>
                    <div className="bg-[#0F172A] p-1.5 rounded-lg text-white">
                        <Skull size={18} />
                    </div>
                    <span className="font-black text-lg tracking-widest text-slate-900 font-serif hidden md:block">THE DECK</span>
                </div>
                
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('profile')} className="flex items-center gap-2 px-1 py-1 pl-3 bg-white border border-slate-200 hover:border-slate-300 rounded-full shadow-sm transition-all group">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 hidden sm:block">2,500 USDC</span>
                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <span className="text-xs font-mono font-bold text-slate-900">0x71...89</span>
                            <ChevronDown size={14} className="text-slate-400" />
                        </div>
                    </button>
                    {/* Mobile Menu Toggle */}
                    <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2 bg-slate-100 rounded-lg text-slate-600">
                        {mobileMenu ? <X size={20}/> : <Menu size={20}/>}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {mobileMenu && (
                <div className="fixed top-16 left-0 w-full bg-white border-b border-slate-200 p-4 z-30 shadow-xl md:hidden animate-in slide-in-from-top-4">
                    <div className="flex flex-col gap-2">
                        <button onClick={() => navigate('home')} className="p-3 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Market Home</button>
                        <button onClick={() => navigate('profile')} className="p-3 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">My Profile</button>
                        <button className="p-3 text-left font-bold text-slate-600 hover:bg-slate-50 rounded-xl">Analytics</button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {view === 'home' && <MarketHome navigate={navigate} assets={ASSETS} />}
                {view === 'profile' && <UserProfile navigate={navigate} myAssets={MY_ASSETS} />}
                {view === 'detail' && <NFTDetail asset={selectedAsset} goBack={() => navigate('home')} openModal={(type, a) => setModal({type, asset: a})} />}
            </main>

            {/* Modals */}
            {modal && (
                <TradeModal 
                    asset={modal.asset} 
                    type={modal.type} 
                    close={() => setModal(null)} 
                />
            )}

        </div>
    );
};

export default App;