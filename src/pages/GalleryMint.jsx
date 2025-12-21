import { useState, useEffect } from 'react';
import { Icon } from '../components/Icons';

// Gallery Artworks Data
const GALLERY_ARTWORKS = [
    { id: 'art_1', title: "The Crimson Tide", baseColor: "from-red-900 via-slate-900 to-black", icon: "Skull" },
    { id: 'art_2', title: "Abyssal Voyager", baseColor: "from-blue-900 via-indigo-900 to-black", icon: "Anchor" },
    { id: 'art_3', title: "Golden Era", baseColor: "from-amber-700 via-yellow-900 to-black", icon: "Zap" },
    { id: 'art_4', title: "Emerald Ghost", baseColor: "from-emerald-900 via-teal-900 to-black", icon: "TrendingUp" },
    { id: 'art_5', title: "Void Walker", baseColor: "from-purple-900 via-fuchsia-900 to-black", icon: "Skull" },
    { id: 'art_6', title: "Iron Clad", baseColor: "from-slate-700 via-gray-900 to-black", icon: "ShieldCheck" },
];

const Button = ({ children, onClick, disabled = false, loading = false, className = '' }) => (
    <button 
        onClick={onClick} 
        disabled={disabled || loading} 
        className={`w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${className}`}
    >
        {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
    </button>
);

const MintModal = ({ selectedArt, reset }) => {
    const [amount, setAmount] = useState('');
    const [previewTier, setPreviewTier] = useState('Skiff');
    const [mintState, setMintState] = useState('idle'); // idle, processing, success

    // Calculate tier based on amount
    useEffect(() => {
        const val = parseFloat(amount);
        
        if (!val || val < 100) {
            setPreviewTier('Skiff');
        } else if (val >= 50000) {
            setPreviewTier('Dreadnought');
        } else if (val >= 10000) {
            setPreviewTier('Galleon');
        } else if (val >= 1000) {
            setPreviewTier('Frigate');
        } else {
            setPreviewTier('Skiff');
        }
    }, [amount]);

    const handleMint = () => {
        setMintState('processing');
        setTimeout(() => setMintState('success'), 3000);
    };

    if (!selectedArt) return null;

    const IconComponent = Icon[selectedArt.icon] || Icon.Skull;

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={reset}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative z-10 animate-fade-in flex flex-col border border-slate-200 dark:border-slate-800">
                
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                    <h3 className="font-bold text-slate-900 dark:text-white">Mint Configuration</h3>
                    <button onClick={reset} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/>
                    </button>
                </div>

                <div className="p-6">
                    {mintState === 'idle' && (
                        <div className="space-y-8">
                            {/* Dynamic Preview */}
                            <div className="text-center">
                                <div className={`w-48 h-48 mx-auto rounded-3xl bg-gradient-to-br ${selectedArt.baseColor} relative flex items-center justify-center overflow-hidden shadow-xl transition-all duration-500 ring-4 ${previewTier === 'Dreadnought' ? 'ring-purple-500/30' : previewTier === 'Galleon' ? 'ring-amber-500/30' : previewTier === 'Frigate' ? 'ring-blue-500/30' : 'ring-slate-200 dark:ring-slate-700'}`}>
                                    <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                    <div className={`relative z-10 transition-all duration-500 text-white/30 ${previewTier === 'Dreadnought' ? 'scale-125' : previewTier === 'Galleon' ? 'scale-100' : 'scale-75'}`}>
                                        <IconComponent className="w-24 h-24"/>
                                    </div>
                                    <div className="absolute bottom-3 w-full text-center">
                                        <span className="text-white text-xs font-bold tracking-widest uppercase bg-black/20 px-2 py-0.5 rounded backdrop-blur-sm">{previewTier} Class</span>
                                    </div>
                                </div>
                                <h2 className="text-2xl font-serif font-black text-slate-900 dark:text-white mt-4">{selectedArt.title}</h2>
                            </div>

                            {/* Input Area */}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Principal Deposit</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-400 text-xl transition-colors" 
                                            placeholder="Min 100" 
                                        />
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">USDC</div>
                                    </div>
                                </div>

                                {/* Tier Progress Bar */}
                                <div className="space-y-2">
                                    <div className="grid grid-cols-4 w-full text-center text-[10px] font-bold text-slate-400 uppercase">
                                        <span>Skiff</span>
                                        <span>Frigate</span>
                                        <span>Galleon</span>
                                        <span>Dreadnought</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full relative">
                                        <div 
                                            className={`absolute top-0 h-full w-4 rounded-full transition-all duration-500 shadow-md ${previewTier === 'Dreadnought' ? 'bg-purple-500' : previewTier === 'Galleon' ? 'bg-amber-500' : previewTier === 'Frigate' ? 'bg-blue-500' : 'bg-slate-400'}`} 
                                            style={{ 
                                                left: previewTier === 'Skiff' ? '12.5%' : previewTier === 'Frigate' ? '37.5%' : previewTier === 'Galleon' ? '62.5%' : '87.5%',
                                                transform: 'translateX(-50%)'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Summary Stats */}
                                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-xs space-y-2">
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Mint Fee</span>
                                        <span className="font-bold text-slate-900 dark:text-white">0%</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Estimated Yield</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">5.4% APY</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                                        <span className="font-bold text-slate-900 dark:text-white">Total Due</span>
                                        <span className="font-bold text-slate-900 dark:text-white">${amount || 0} USDC</span>
                                    </div>
                                </div>

                                <Button onClick={handleMint} disabled={!amount || parseFloat(amount) < 100}>
                                    CONFIRM MINT
                                </Button>
                            </div>
                        </div>
                    )}

                    {mintState === 'processing' && (
                        <div className="py-12 text-center space-y-6">
                            <Icon.Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto"/>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Minting Treasury...</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">Please sign the transaction in your wallet.</p>
                            </div>
                        </div>
                    )}

                    {mintState === 'success' && (
                        <div className="py-8 text-center space-y-6">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon.Check className="w-10 h-10"/>
                            </div>
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Recruitment Complete!</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs mx-auto">
                                    You have successfully minted <strong>{selectedArt.title}</strong> ({previewTier} Class). It is now viewable in your Barracks.
                                </p>
                            </div>
                            <Button 
                                onClick={reset} 
                                className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700"
                            >
                                CLOSE
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const GalleryMint = () => {
    const [selectedArt, setSelectedArt] = useState(null);

    const reset = () => {
        setSelectedArt(null);
    };

    return (
        <div className="animate-slide-up pb-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 border border-purple-100 dark:border-purple-800">
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Art Gallery Open
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white">Select Your Guardian</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-lg">
                        Browse the collection in full fidelity. Select an artwork and deposit capital to mint. 
                    </p>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {GALLERY_ARTWORKS.map((art) => {
                    const IconComponent = Icon[art.icon] || Icon.Skull;
                    
                    return (
                        <div 
                            key={art.id} 
                            onClick={() => setSelectedArt(art)} 
                            className="group bg-white dark:bg-slate-900 rounded-3xl p-3 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative flex flex-col"
                        >
                            <div className={`aspect-square rounded-2xl bg-gradient-to-br ${art.baseColor} relative mb-3 flex items-center justify-center overflow-hidden shadow-inner`}>
                                <div className="absolute inset-0 opacity-50 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                                <div className="relative z-10 scale-125 group-hover:scale-135 transition-transform duration-500 text-white/30">
                                    <IconComponent className="w-32 h-32"/>
                                </div>
                                <div className="absolute bottom-4 left-0 w-full text-center">
                                    <span className="text-white/90 font-serif font-bold tracking-widest text-lg drop-shadow-md">{art.title}</span>
                                </div>
                            </div>
                            <div className="px-2 pb-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available</span>
                                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">MINT NOW</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Mint Modal */}
            {selectedArt && <MintModal selectedArt={selectedArt} reset={reset} />}
        </div>
    );
};

export default GalleryMint;