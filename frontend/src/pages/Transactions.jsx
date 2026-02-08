import { useState, useEffect } from 'react';
import { transactionAPI, accountAPI } from '../services/api';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import { Plus, Edit2, Trash2, Filter, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        category: '',
        division: 'personal',
        description: '',
        accountId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [transRes, accRes] = await Promise.all([
                transactionAPI.getAll(),
                accountAPI.getAll(),
            ]);
            setTransactions(transRes.data);
            setAccounts(accRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTransaction) {
                await transactionAPI.update(editingTransaction._id, formData);
            } else {
                await transactionAPI.create(formData);
            }
            setModalOpen(false);
            resetForm();
            fetchData();
        } catch (error) {
            alert(error.response?.data?.error || 'Error saving transaction');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                await transactionAPI.delete(id);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.error || 'Error deleting transaction');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'expense',
            amount: '',
            category: '',
            division: 'personal',
            description: '',
            accountId: '',
        });
        setEditingTransaction(null);
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
        setFormData({
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            division: transaction.division,
            description: transaction.description || '',
            accountId: transaction.accountId._id || transaction.accountId,
        });
        setModalOpen(true);
    };

    if (loading) return <Loading fullScreen />;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Transactions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Manage your income and expenses
                    </p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Add Transaction
                </button>
            </div>

            {/* Transactions List */}
            <Card>
                <div className="space-y-3">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => {
                            const isEditable = transaction.isEditable;
                            const createdAt = new Date(transaction.createdAt);

                            return (
                                <div
                                    key={transaction._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                >
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${transaction.type === 'income'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                    }`}
                                            >
                                                {transaction.type}
                                            </span>
                                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                                {transaction.division}
                                            </span>
                                        </div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                            {transaction.category}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {transaction.description || 'No description'}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {formatDistanceToNow(createdAt, { addSuffix: true })} •{' '}
                                            {transaction.accountId?.name || 'Unknown Account'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p
                                                className={`text-xl font-bold ${transaction.type === 'income'
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                                    }`}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}₹
                                                {transaction.amount.toLocaleString()}
                                            </p>
                                            {!isEditable && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                                    <Clock className="w-3 h-3" />
                                                    Edit window closed
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditModal(transaction)}
                                                disabled={!isEditable}
                                                className={`p-2 rounded-lg transition-colors ${isEditable
                                                    ? 'hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600'
                                                    : 'opacity-50 cursor-not-allowed text-gray-400'
                                                    }`}
                                                title={isEditable ? 'Edit' : 'Edit window expired (12 hours)'}
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction._id)}
                                                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No transactions yet. Click "Add Transaction" to get started.
                        </div>
                    )}
                </div>
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    resetForm();
                }}
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Division</label>
                            <select
                                value={formData.division}
                                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                className="input"
                                required
                            >
                                <option value="personal">Personal</option>
                                <option value="office">Office</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Amount</label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="input"
                            placeholder="0.00"
                            step="0.01"
                            min="0.01"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="input"
                            placeholder="e.g., Food, Salary, Rent"
                            required
                        />
                    </div>

                    <div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Account</label>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Which account should this transaction affect? (e.g., Cash, Bank, Credit Card)
                            </p>
                            <select
                                value={formData.accountId}
                                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
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
                            {accounts.length === 0 && (
                                <p className="text-xs text-orange-500 mt-2">
                                    ⚠️ No accounts found. Please create an account first in the Accounts page.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input"
                            rows="3"
                            placeholder="Add notes..."
                        />
                    </div>

                    <div className="flex gap-3">
                        <button type="submit" className="btn btn-primary flex-1">
                            {editingTransaction ? 'Update' : 'Add'} Transaction
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setModalOpen(false);
                                resetForm();
                            }}
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

export default Transactions;
