import React from 'react';
import { Icon } from '../components/Icons';

const Vault = () => {
    return (
        <div className="animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white mb-6">Quartermaster's Vault</h1>
            <div className="grid lg:grid-cols-12 gap-8">
                 <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                     <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4">Collateral</h3>
                     <div className="text-center py-10 text-slate-400 italic">No assets locked.</div>
                 </div>
                 <div className="lg:col-span-7 bg-slate-900 dark:bg-indigo-950/20 rounded-3xl p-8 border border-slate-800 dark:border-indigo-500/20 text-white relative overflow-hidden">
                     <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Icon.ShieldAlert className="w-5 h-5 text-emerald-400"/> Risk Monitor</h3>
                     <div className="text-2xl font-mono font-bold mt-2">HF: ∞</div>
                 </div>
            </div>
        </div>
    );
};

export default Vault;