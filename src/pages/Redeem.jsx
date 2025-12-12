import React from 'react';
import { Icon } from '../components/Icons';
import { Button } from '../components/ui/Button';

const Redeem = () => {
    return (
        <div className="animate-slide-up">
            <div className="mb-12">
                 <h1 className="text-3xl md:text-5xl font-serif font-black text-slate-900 dark:text-white mb-2">My Barracks</h1>
                 <p className="text-slate-500 dark:text-slate-400 text-sm">Burn bonds to reclaim capital.</p>
            </div>
            <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-400">
                <Icon.Anchor className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                <p className="font-bold">No Active Treasuries</p>
                <div className="max-w-xs mx-auto mt-4">
                    <Button variant="primary">Go to Marketplace</Button>
                </div>
            </div>
        </div>
    );
};

export default Redeem;