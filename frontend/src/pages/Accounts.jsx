import { useState, useEffect } from 'react';
import { accountAPI } from '../services/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { Plus, ArrowRightLeft, Wallet, Trash2 } from 'lucide-react';

const Accounts = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [transferData, setTransferData] = useState({
        fromAccountId: '',
        toAccountId: '',
        amount: '',
        description: '',
    });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await accountAPI.getAll();
            setAccounts(response.data);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAccount = async (e) => {
        e.preventDefault();
        try {
            await accountAPI.create({ name: newAccountName, balance: 0 });
            setModalOpen(false);
            setNewAccountName('');
            fetchAccounts();
        } catch (error) {
            alert(error.response?.data?.error || 'Error creating account');
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        try {
            await accountAPI.transfer(transferData);
            setTransferModalOpen(false);
            setTransferData({
                fromAccountId: '',
                toAccountId: '',
                amount: '',
                description: '',
            });
            fetchAccounts();
        } catch (error) {
            alert(error.response?.data?.error || 'Error transferring money');
        }
    };


    const handleDeleteAccount = async (accountId, accountName) => {
        try {
            // First, get transaction count for this account
            const transactionsResponse = await accountAPI.getAll();
            const account = transactionsResponse.data.find(acc => acc._id === accountId);

            // Fetch all transactions to count how many belong to this account
            const { transactionAPI } = await import('../services/api');
            const allTransactions = await transactionAPI.getAll();
            const accountTransactionCount = allTransactions.data.filter(
                t => t.accountId?._id === accountId || t.accountId === accountId
            ).length;

            // Show detailed confirmation
            const warningMessage = accountTransactionCount > 0
                ? `⚠️ WARNING: You are about to delete "${accountName}"!\n\n` +
                `This will permanently delete:\n` +
                `• The account "${accountName}"\n` +
                `• ${accountTransactionCount} transaction${accountTransactionCount !== 1 ? 's' : ''} associated with this account\n\n` +
                `This action CANNOT be undone!\n\n` +
                `Are you absolutely sure you want to continue?`
                : `Are you sure you want to delete "${accountName}"?\n\n` +
                `This account has no transactions.\n\n` +
                `This action cannot be undone.`;

            const confirmed = window.confirm(warningMessage);

            if (!confirmed) return;

            // Delete the account
            const response = await accountAPI.delete(accountId);

            // Show success message with details
            const deletedCount = response.data.deletedTransactions || 0;
            if (deletedCount > 0) {
                alert(`✅ Account "${accountName}" deleted successfully!\n\n${deletedCount} transaction${deletedCount !== 1 ? 's were' : ' was'} also deleted.`);
            }

            fetchAccounts();
        } catch (error) {
            alert(error.response?.data?.error || 'Error deleting account');
        }
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Accounts
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your accounts and transfers
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setTransferModalOpen(true)}
                        className="btn btn-secondary flex items-center gap-2"
                    >
                        <ArrowRightLeft className="w-5 h-5" />
                        Transfer
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        New Account
                    </button>
                </div>
            </div>

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length > 0 ? (
                    accounts.map((account) => (
                        <Card key={account._id} className="relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16" />

                            {/* Delete Button */}
                            <button
                                onClick={() => handleDeleteAccount(account._id, account.name)}
                                className="absolute top-3 right-3 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all hover:scale-110 z-10"
                                title="Delete Account"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>

                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        <Wallet className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {account.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Account
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                        Current Balance
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        ₹{account.balance.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Card>
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                No accounts yet. Click "New Account" to create one.
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Create Account Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Create New Account"
                size="sm"
            >
                <form onSubmit={handleCreateAccount} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Account Name</label>
                        <input
                            type="text"
                            value={newAccountName}
                            onChange={(e) => setNewAccountName(e.target.value)}
                            className="input"
                            placeholder="e.g., Savings, Cash, Credit Card"
                            required
                        />
                    </div>
                    <div className="flex gap-3">
                        <button type="submit" className="btn btn-primary flex-1">
                            Create Account
                        </button>
                        <button
                            type="button"
                            onClick={() => setModalOpen(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Transfer Modal */}
            <Modal
                isOpen={transferModalOpen}
                onClose={() => setTransferModalOpen(false)}
                title="Transfer Money"
            >
                <form onSubmit={handleTransfer} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">From Account</label>
                        <select
                            value={transferData.fromAccountId}
                            onChange={(e) =>
                                setTransferData({ ...transferData, fromAccountId: e.target.value })
                            }
                            className="input"
                            required
                        >
                            <option value="">Select Account</option>
                            {accounts.map((account) => (
                                <option key={account._id} value={account._id}>
                                    {account.name} (₹{account.balance.toLocaleString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">To Account</label>
                        <select
                            value={transferData.toAccountId}
                            onChange={(e) =>
                                setTransferData({ ...transferData, toAccountId: e.target.value })
                            }
                            className="input"
                            required
                        >
                            <option value="">Select Account</option>
                            {accounts.map((account) => (
                                <option key={account._id} value={account._id}>
                                    {account.name} (₹{account.balance.toLocaleString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount</label>
                        <input
                            type="number"
                            value={transferData.amount}
                            onChange={(e) =>
                                setTransferData({ ...transferData, amount: e.target.value })
                            }
                            className="input"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Description (Optional)
                        </label>
                        <input
                            type="text"
                            value={transferData.description}
                            onChange={(e) =>
                                setTransferData({ ...transferData, description: e.target.value })
                            }
                            className="input"
                            placeholder="Transfer note..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="btn btn-primary flex-1">
                            Transfer
                        </button>
                        <button
                            type="button"
                            onClick={() => setTransferModalOpen(false)}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Accounts;
