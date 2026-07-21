import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import { 
  Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, 
  Send, ShieldCheck, Clock, CheckCircle2, AlertCircle, Plus, Search, Filter
} from 'lucide-react';

export default function Wallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [transferAmount, setTransferAmount] = useState('1');
  const [transferReason, setTransferReason] = useState('');
  const [modalError, setModalError] = useState('');
  const [modalSuccess, setModalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const walletData = await api.getWallet();
      setWallet(walletData);
      
      const txData = await api.getTransactions();
      setTransactions(txData);
    } catch (err) {
      console.warn("Using fallback wallet data for local session.");
      setWallet({
        wallet_id: "mock-wallet-101",
        user_email: user?.email || "nandini@email.com",
        balance: user?.credits || 3.0,
        is_frozen: false,
        created_at: new Date().toISOString()
      });
      setTransactions([
        {
          transaction_id: "tx-welcome-01",
          wallet_id: "mock-wallet-101",
          sender_email: "System",
          receiver_email: user?.email || "nandini@email.com",
          amount: 1.0,
          type: "Welcome Bonus",
          reason: "Welcome Skill Credit Bonus on Account Registration",
          status: "Success",
          balance_after: 1.0,
          created_at: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
          transaction_id: "tx-reward-02",
          wallet_id: "mock-wallet-101",
          sender_email: "alex@email.com",
          receiver_email: user?.email || "nandini@email.com",
          amount: 2.0,
          type: "Transfer In",
          reason: "Python & Data Structures Tutoring Session",
          status: "Success",
          balance_after: 3.0,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWalletData();
  }, []);

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalSuccess('');

    const amountNum = parseFloat(transferAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setModalError("Please enter a valid transfer amount greater than 0.");
      return;
    }

    if (wallet && amountNum > wallet.balance) {
      setModalError(`Insufficient balance. You currently have ${wallet.balance} Credits.`);
      return;
    }

    if (!recipientEmail || !recipientEmail.includes('@')) {
      setModalError("Please enter a valid recipient email address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.transferCredits(
        recipientEmail,
        amountNum,
        transferReason || "Peer Credit Transfer"
      );
      setModalSuccess(res.message || "Transfer completed successfully!");
      setRecipientEmail('');
      setTransferReason('');
      setTransferAmount('1');
      
      // Reload wallet balance
      setTimeout(() => {
        loadWalletData();
        setShowTransferModal(false);
        setModalSuccess('');
      }, 1500);
    } catch (err) {
      setModalError(err.response?.data?.error || err.response?.data?.message || "Transfer failed. Please check recipient email.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiver_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'credit') {
      return matchesSearch && (tx.type.includes('In') || tx.type.includes('Bonus') || tx.type.includes('Refund') || tx.type.includes('Credit'));
    }
    if (activeTab === 'debit') {
      return matchesSearch && (tx.type.includes('Out') || tx.type.includes('Debit'));
    }
    return matchesSearch;
  });

  const totalReceived = transactions
    .filter(t => t.receiver_email === (user?.email || "nandini@email.com"))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.sender_email === (user?.email || "nandini@email.com") && t.sender_email !== "System")
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold font-outfit text-white flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20">
                <WalletIcon className="w-6 h-6" />
              </div>
              Skill Credit Wallet
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your reciprocal Skill Credits, track transactions, and transfer credits to peers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadWalletData}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Refresh Wallet"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 text-white font-semibold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-brand-indigo/20 transition-all active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Transfer Credits
            </button>
          </div>
        </div>

        {/* Balance Overview Card & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Wallet Balance Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 sm:p-8 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand-indigo/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Wallet Balance</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                wallet?.is_frozen ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {wallet?.is_frozen ? 'Frozen' : 'Verified Wallet'}
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-3 relative z-10">
              <span className="text-4xl sm:text-5xl font-black font-outfit text-white tracking-tight">
                {loading ? '...' : wallet?.balance?.toFixed(2) || '0.00'}
              </span>
              <span className="text-lg font-semibold text-brand-indigo">Skill Credits</span>
            </div>

            <p className="text-xs text-slate-500 mt-2 relative z-10">
              1 Skill Credit = 1 Hour of peer-to-peer session exchange.
            </p>

            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-slate-500">Total Received</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">+{totalReceived.toFixed(2)} Credits</div>
                </div>
                <div className="w-px h-8 bg-slate-800"></div>
                <div>
                  <div className="text-xs text-slate-500">Total Spent</div>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">-{totalSpent.toFixed(2)} Credits</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Last updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Quick Info & Security Badge Card */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-brand-indigo font-semibold text-sm">
                <ShieldCheck className="w-4 h-4" />
                Atomic Wallet Security
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                All transactions are verified by backend API validators. Balances update atomically to prevent duplicate transfers or negative balances.
              </p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Registration Bonus</span>
                <span className="text-emerald-400 font-semibold">+1.0 Free Credit</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Teaching Reward</span>
                <span className="text-emerald-400 font-semibold">+1.0 Credit / hr</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Session Cancellation</span>
                <span className="text-slate-300 font-semibold">100% Auto Refund</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-outfit text-white">Transaction History</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time log of all credit additions, debits, transfers, and refunds.</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search transaction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl focus:outline-none focus:border-brand-indigo w-48 sm:w-64"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'all' ? 'bg-brand-indigo text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveTab('credit')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'credit' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Credits
                </button>
                <button
                  onClick={() => setActiveTab('debit')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'debit' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Debits
                </button>
              </div>
            </div>
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="py-12 text-center text-slate-500 text-sm animate-pulse">Loading transaction records...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-400">No transaction records found.</p>
              <p className="text-xs text-slate-500">Transfers or reward credits will appear here automatically.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => {
                const isIncoming = tx.type.includes('In') || tx.type.includes('Bonus') || tx.type.includes('Refund') || tx.type.includes('Credit') || tx.receiver_email === user?.email;
                return (
                  <div
                    key={tx.transaction_id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isIncoming ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isIncoming ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white truncate">{tx.type}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            {tx.transaction_id.substring(0, 12)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {tx.reason || (isIncoming ? `From: ${tx.sender_email}` : `To: ${tx.receiver_email}`)}
                        </p>
                        
                        <div className="text-[11px] text-slate-500 mt-1">
                          {new Date(tx.created_at).toLocaleDateString()} &bull; {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-base font-bold font-outfit ${isIncoming ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isIncoming ? '+' : '-'}{tx.amount.toFixed(2)} Credits
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Bal after: {tx.balance_after?.toFixed(2) || '0.00'}
                      </div>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                        {tx.status || "Success"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Transfer Credits Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-brand-indigo" />
                Transfer Skill Credits
              </h3>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {modalError}
              </div>
            )}

            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Recipient Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. peer@email.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Credit Amount</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-indigo"
                />
                <div className="text-[11px] text-slate-500 mt-1">Available balance: {wallet?.balance || 0} Credits</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Note / Reason (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Tutoring Session Exchange"
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-brand-indigo"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-brand-indigo hover:bg-brand-indigo/90 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-indigo/20 cursor-pointer"
                >
                  {submitting ? 'Transferring...' : 'Confirm Transfer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
