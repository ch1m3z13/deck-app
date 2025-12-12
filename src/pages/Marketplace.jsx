import React, { useState } from 'react';
import { Icon } from '../components/Icons';
import { Button } from '../components/ui/Button';

// Dummy Data
const ASSETS = [
    { id: 808, class: "Dreadnought", rank: "Lvl 5", backing: 52400, ask: 49600, type: "DISCOUNT", artColor: "from-purple-900 via-slate-900 to-black" },
    { id: 204, class: "Galleon", rank: "Lvl 2", backing: 10100, ask: 11200, type: "PREMIUM", artColor: "from-amber-700 via-slate-900 to-black" },
    { id: 112, class: "Frigate", rank: "Lvl 1", backing: 1000, ask: 960, type: "DISCOUNT", artColor: "from-blue-900 via-slate-900 to-black" },
    { id: 55, class: "Skiff", rank: "Lvl 0", backing: 100, ask: 120, type: "PREMIUM", artColor: "from-slate-600 via-slate-800 to-black" },
];

const AssetCard = ({ item }) => (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col h-full">
        <div className={`h-64 rounded-2xl bg-gradient-to-br ${item.artColor} relative mb-3 flex items-center justify-center overflow-hidden shrink-0`}>
            <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 text-white/20">
                {item.class === "Dreadnought" ? <Icon.Skull className="w-16 h-16"/> : <Icon.Anchor className="w-16 h-16"/>}
            </div>
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-white border border-white/10">#{item.id}</div>
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
            </div>
            <Button className="mt-2">BUY NOW</Button>
        </div>
    </div>
);

const Marketplace = () => {
    const [filter, setFilter] = useState('Live');

    return (
        <div className="space-y-8 animate-slide-up pb-12">
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

            <div className="flex overflow-x-auto pb-2 hide-scrollbar">
                <div className="flex p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm w-max">
                    {['Live', 'Skiff', 'Frigate', 'Galleon', 'Dreadnought', 'Discount'].map((tab) => (
                        <button 
                            key={tab} 
                            onClick={() => setFilter(tab)}
                            className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all ${filter === tab ? 'bg-[#0F172A] dark:bg-indigo-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {ASSETS.map((item) => (
                    <AssetCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

export default Marketplace;