import React, { useState, useEffect } from 'react';
import { Icon } from '../components/Icons';
import { Button } from '../components/ui/Button';

const GALLERY_ARTWORKS = [
    { id: 'art_1', title: "The Crimson Tide", baseColor: "from-red-900 via-slate-900 to-black", icon: "Skull" },
    { id: 'art_2', title: "Abyssal Voyager", baseColor: "from-blue-900 via-indigo-900 to-black", icon: "Anchor" },
    { id: 'art_3', title: "Golden Era", baseColor: "from-amber-700 via-yellow-900 to-black", icon: "Zap" },
];

const MintGallery = () => {
    const [selectedArt, setSelectedArt] = useState(null);
    const [amount, setAmount] = useState('');
    const [previewTier, setPreviewTier] = useState('Skiff');

    useEffect(() => {
        const val = parseFloat(amount);
        if (!val) setPreviewTier('Skiff');
        else if (val >= 50000) setPreviewTier('Dreadnought');
        else if (val >= 10000) setPreviewTier('Galleon');
        else if (val >= 1000) setPreviewTier('Frigate');
        else setPreviewTier('Skiff');
    }, [amount]);

    return (
        <div className="w-full animate-slide-up">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white">Select Your Guardian</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg">Browse the collection in full fidelity. Select an artwork and deposit capital to mint.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {GALLERY_ARTWORKS.map((art) => (
                    <div key={art.id} onClick={() => setSelectedArt(art)} className="group bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 cursor-pointer relative flex flex-col">
                        <div className={`aspect-square rounded-2xl bg-gradient-to-br ${art.baseColor} relative mb-3 flex items-center justify-center overflow-hidden shadow-inner`}>
                            <div className="relative z-10 scale-125 text-white/30">
                                <Icon.Skull className="w-32 h-32"/>
                            </div>
                            <div className="absolute bottom-4 left-0 w-full text-center">
                                <span className="text-white/90 font-serif font-bold tracking-widest text-lg drop-shadow-md">{art.title}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedArt && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedArt(null)}></div>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 animate-fade-in flex flex-col p-6">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-slate-900 dark:text-white">Mint Configuration</h3>
                             <button onClick={() => setSelectedArt(null)}><Icon.X className="w-5 h-5 dark:text-white"/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Principal Deposit</label>
                                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono font-bold text-slate-900 dark:text-white" placeholder="Min 100" />
                            </div>
                            <div className="text-center text-xs font-bold text-emerald-500 uppercase">Tier: {previewTier}</div>
                            <Button>Confirm Mint</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MintGallery;