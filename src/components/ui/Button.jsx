import React from 'react';
import { Icon } from '../Icons';

export const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-[#0F172A] hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg",
        secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white",
        danger: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30",
        pulse: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-200 animate-pulse-slow",
        accept: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
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