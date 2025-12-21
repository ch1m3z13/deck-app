import { useState } from 'react';
import { Icon } from '../components/Icons';

const StatusBadge = ({ status }) => {
    const styles = {
        "Best Offer": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        "Winning": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
        "Active": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        "Outbid": "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        "Expired": "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20"
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${styles[status] || styles["Active"]}`}>
            {status}
        </span>
    );
};

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, loading = false }) => {
    const variants = {
        primary: "bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 shadow-lg",
        secondary: "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-100 dark:hover:border-indigo-500 text-slate-900 dark:text-white",
        danger: "bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 transition-colors",
        accept: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
    };
    return (
        <button onClick={onClick} disabled={disabled || loading} className={`rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
            {loading ? <Icon.Loader2 className="w-4 h-4 animate-spin"/> : children}
        </button>
    );
};

const OfferItem = ({ offer, type, onAction }) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = (actionType) => {
        setIsLoading(true);
        setTimeout(() => {
            setIsExiting(true);
            setTimeout(() => {
                onAction(offer.id, actionType);
            }, 400);
        }, 1500);
    };

    return (
        <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center gap-4 hover:border-indigo-500/30 transition-all shadow-sm ${isExiting ? 'animate-slide-out' : 'animate-fade-in'}`}>
            
            <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${offer.img} shrink-0`}></div>
                <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{offer.class}</div>
                    <div className="text-lg font-black text-slate-900 dark:text-white">#{offer.nftId}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full items-center">
                <div>
                    <div className="text-[10px] text-slate-400 uppercase mb-1">Offer Price</div>
                    <div className="font-mono font-bold text-slate-900 dark:text-white text-lg">${offer.offer.toLocaleString()}</div>
                </div>
                
                <div className="hidden md:block">
                    <div className="text-[10px] text-slate-400 uppercase mb-1">From</div>
                    <div className="font-mono text-sm text-indigo-500 dark:text-indigo-400">{offer.from || "You"}</div>
                </div>

                <div className="flex flex-col items-end md:items-start">
                    <div className="text-[10px] text-slate-400 uppercase mb-1">Status</div>
                    <StatusBadge status={offer.status} />
                </div>
            </div>

            <div className="w-full md:w-auto flex justify-end gap-2 border-t md:border-t-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
                {type === 'received' ? (
                    <>
                        <Button variant="danger" className="p-3 w-12" onClick={() => handleAction('reject')} loading={isLoading}>
                            {!isLoading && <Icon.X className="w-5 h-5" />}
                        </Button>
                        <Button variant="accept" className="py-3 px-6 w-full md:w-auto" onClick={() => onAction(offer.id, 'accept')}>
                            <Icon.Check className="w-4 h-4" /> Accept
                        </Button>
                    </>
                ) : (
                    <Button variant="secondary" className="py-3 px-6 w-full md:w-auto" onClick={() => handleAction('cancel')} loading={isLoading}>
                        {!isLoading && <Icon.Trash2 className="w-4 h-4" />} Cancel Offer
                    </Button>
                )}
            </div>
        </div>
    );
};

const AcceptModal = ({ offer, close, confirm }) => {
    const [step, setStep] = useState(1);

    const process = () => {
        setStep(2);
        setTimeout(() => {
            setStep(3);
        }, 2500);
    };

    const finish = () => {
        confirm();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-10 animate-fade-in flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
                    <h3 className="font-bold text-slate-900 dark:text-white">Accept Offer</h3>
                    <button onClick={close} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon.X className="w-5 h-5 text-slate-900 dark:text-white"/>
                    </button>
                </div>
                <div className="p-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="flex gap-4 items-center">
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${offer.img} shrink-0`}></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Selling</div>
                                    <div className="text-lg font-black text-slate-900 dark:text-white">#{offer.nftId}</div>
                                </div>
                            </div>
                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 text-center">
                                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">You Receive</div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white">${offer.offer.toLocaleString()}</div>
                                <div className="text-xs font-mono text-slate-400 mt-1">Net (0% Fee)</div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
                                You are about to transfer ownership of this asset to <strong>{offer.from}</strong>. This action is irreversible.
                            </div>
                            <Button onClick={process} variant="accept">CONFIRM SALE</Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="text-center py-12 space-y-4">
                            <Icon.Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto"/>
                            <p className="font-bold text-slate-900 dark:text-white">Processing Sale...</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Exchanging Assets on Chain.</p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon.Check className="w-8 h-8"/>
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2">Offer Accepted!</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                                Funds have been transferred to your wallet.
                            </p>
                            <Button onClick={finish} variant="secondary">CLOSE</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Toast = ({ message, type }) => (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50 animate-toast-in">
        {type === 'success' ? <Icon.Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" /> : <Icon.Trash2 className="w-4 h-4 text-slate-400" />}
        <span className="text-sm font-bold">{message}</span>
    </div>
);

const MyOffers = () => {
    const [view, setView] = useState('received');
    const [activeModal, setActiveModal] = useState(null);
    const [toast, setToast] = useState(null);

    const [receivedOffers, setReceivedOffers] = useState([
        { id: 101, nftId: 777, class: "Frigate", offer: 11000, from: "0xaa...12", status: "Best Offer", expiry: "2 Days", img: "from-blue-900 to-black" },
        { id: 102, nftId: 777, class: "Frigate", offer: 9500, from: "0xbb...34", status: "Active", expiry: "12 Hours", img: "from-blue-900 to-black" },
    ]);

    const [sentOffers, setSentOffers] = useState([
        { id: 201, nftId: 808, class: "Dreadnought", offer: 48000, status: "Outbid", expiry: "5 Days", img: "from-purple-900 to-black" },
        { id: 202, nftId: 204, class: "Galleon", offer: 12000, status: "Winning", expiry: "1 Day", img: "from-amber-700 to-black" },
    ]);

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleAction = (id, actionType) => {
        if (actionType === 'accept') {
            const offer = receivedOffers.find(o => o.id === id);
            setActiveModal({ type: 'accept', offer });
        } else if (actionType === 'reject') {
            setReceivedOffers(prev => prev.filter(o => o.id !== id));
            showToast("Offer Rejected", "info");
        } else if (actionType === 'cancel') {
            setSentOffers(prev => prev.filter(o => o.id !== id));
            showToast("Offer Cancelled", "info");
        }
    };

    const confirmAccept = () => {
        setReceivedOffers(prev => prev.filter(o => o.id !== activeModal.offer.id));
        setActiveModal(null);
        showToast("Offer Accepted Successfully", "success");
    };

    return (
        <div className="animate-slide-up pb-12">
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-900 dark:text-white mb-2">My Offers</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Manage incoming bids and outgoing liquidity.</p>
            </div>

            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl inline-flex mb-8">
                <button 
                    onClick={() => setView('received')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${view === 'received' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Icon.Inbox className="w-4 h-4"/> Received
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ml-1 transition-colors ${view === 'received' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                        {receivedOffers.length}
                    </span>
                </button>
                <button 
                    onClick={() => setView('sent')}
                    className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-2 transition-all ${view === 'sent' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
                >
                    <Icon.Send className="w-4 h-4"/> Sent
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ml-1 transition-colors ${view === 'sent' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>
                        {sentOffers.length}
                    </span>
                </button>
            </div>

            <div className="space-y-4">
                {view === 'received' ? (
                    receivedOffers.length > 0 ? (
                        receivedOffers.map(offer => <OfferItem key={offer.id} offer={offer} type="received" onAction={handleAction} />)
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><Icon.Inbox className="w-8 h-8"/></div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">No Active Offers</p>
                        </div>
                    )
                ) : (
                    sentOffers.length > 0 ? (
                        sentOffers.map(offer => <OfferItem key={offer.id} offer={offer} type="sent" onAction={handleAction} />)
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400"><Icon.Send className="w-8 h-8"/></div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">No Sent Offers</p>
                        </div>
                    )
                )}
            </div>

            {activeModal && (
                <AcceptModal 
                    offer={activeModal.offer} 
                    close={() => setActiveModal(null)} 
                    confirm={confirmAccept} 
                />
            )}

            {toast && <Toast message={toast.msg} type={toast.type} />}
        </div>
    );
};

export default MyOffers;