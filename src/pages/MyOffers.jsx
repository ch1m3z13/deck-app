import React, { useState } from 'react';
import { Icon } from '../components/Icons';

const MyOffers = () => {
    const [view, setView] = useState('received');
    return (
        <div className="animate-slide-up">
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white mb-8">My Offers</h1>
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex mb-8">
                <button onClick={() => setView('received')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase ${view === 'received' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>Received</button>
                <button onClick={() => setView('sent')} className={`px-6 py-2 rounded-lg text-xs font-bold uppercase ${view === 'sent' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'}`}>Sent</button>
            </div>h
            <div className="text-center py-12 text-slate-500">No active offers found.</div>
        </div>
    );
};

export default MyOffers;