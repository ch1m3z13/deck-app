import React, { useState, useEffect } from 'react';
import { Icon } from '../Icons';

// Import all pages
import Marketplace from '../../pages/Marketplace';
import GalleryMint from '../../pages/GalleryMint';
import Lending from '../../pages/Lending';
import Redeem from '../../pages/Redeem';
import MyOffers from '../../pages/MyOffers';
import FirstMate from '../../pages/FirstMate';

const MasterShell = () => {
    const [currentView, setCurrentView] = useState('Marketplace');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);

    // Dark Mode Effect
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.body.classList.add('bg-[#020617]');
        } else {
            document.documentElement.classList.remove('dark');
            document.body.classList.remove('bg-[#020617]');
        }
    }, [darkMode]);

    const menuItems = [
        { id: 'Marketplace', label: 'Marketplace', icon: Icon.Skull },
        { id: 'Mint', label: 'Mint Gallery', icon: Icon.Zap },
        { id: 'Vault', label: 'Quartermaster’s Vault', icon: Icon.Lock },
        { id: 'Redeem', label: 'Redeem', icon: Icon.Flame },
        { id: 'Offers', label: 'My Offers', icon: Icon.Inbox },
        { id: 'FirstMate', label: 'First Mate', icon: Icon.FileSignature },
    ];

    const handleNav = (id) => {
        setCurrentView(id);
        setMobileMenuOpen(false);
        window.scrollTo(0, 0);
    };

    return (
        <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-[#020617] text-white' : 'bg-[#FAFAFA] text-slate-900'}`}>
            
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/90 dark:bg-[#020617]/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
                    
                    {/* Brand */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav('Marketplace')}>
                        <div className="bg-slate-900 dark:bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                            <Icon.Skull className="w-5 h-5" />
                        </div>
                        <span className="font-serif font-black text-xl tracking-wider hidden md:block">THE LORE</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full border border-slate-200 dark:border-slate-700/50">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${currentView === item.id ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-md transform scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* User & Theme Controls */}
                    <div className="flex items-center gap-3">
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            {darkMode ? <Icon.Sun className="w-5 h-5" /> : <Icon.Moon className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-2 px-1.5 py-1.5 pl-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm hover:border-indigo-500/50 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-end mr-1 hidden sm:block">
                                <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">Captain</span>
                                <span className="text-xs font-black text-slate-900 dark:text-white leading-none">0x71...89</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md"></div>
                        </div>

                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {mobileMenuOpen ? <Icon.X className="w-5 h-5"/> : <Icon.Menu className="w-5 h-5"/>}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute top-16 left-0 w-full bg-white dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in">
                        <div className="p-4 grid gap-2">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNav(item.id)}
                                    className={`p-4 rounded-xl flex items-center gap-4 transition-colors ${currentView === item.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-transparent'}`}
                                >
                                    <div className={`p-2 rounded-lg ${currentView === item.id ? 'bg-indigo-200 dark:bg-indigo-800' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                        <item.icon className="w-5 h-5"/>
                                    </div>
                                    <span className="font-bold text-sm">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
                {currentView === 'Marketplace' && <Marketplace />}
                {currentView === 'Mint' && <GalleryMint />}
                {currentView === 'Vault' && <Lending/>}
                {currentView === 'Redeem' && <Redeem />}
                {currentView === 'Offers' && <MyOffers />}
                {currentView === 'FirstMate' && <FirstMate />}
            </main>
        </div>
    );
};

export default MasterShell;