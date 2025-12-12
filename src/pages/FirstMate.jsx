import React from 'react';
import { Icon } from '../components/Icons';

const FirstMate = () => {
    return (
        <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 dark:text-white mb-2">First Mate Protocol</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mb-8">Dead man's switch protocol settings.</p>
            
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Legacy Timer</h3>
                    <div className="text-3xl font-mono font-black text-slate-900 dark:text-white">335 Days Remaining</div>
                </div>
            </div>
        </div>
    );
};

export default FirstMate;