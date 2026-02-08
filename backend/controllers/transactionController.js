import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
    try {
        const { type, amount, category, division, description, accountId, date } = req.body;

        // Validation
        if (!type || !amount || !category || !division || !accountId) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Convert amount to number to prevent string concatenation
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Verify account belongs to user
        const account = await Account.findOne({ _id: accountId, userId: req.user._id });
        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Check for sufficient balance if it's an expense
        if (type === 'expense') {
            const currentBalance = parseFloat(account.balance);
            if (currentBalance < numericAmount) {
                return res.status(400).json({
                    error: 'Insufficient balance',
                    message: `Cannot add expense of ₹${numericAmount.toLocaleString()}. Current balance is ₹${currentBalance.toLocaleString()}.`,
                    currentBalance: currentBalance,
                    requiredAmount: numericAmount
                });
            }
        }

        // Create transaction
        const transaction = await Transaction.create({
            userId: req.user._id,
            type,
            amount: numericAmount,
            category,
            division,
            description,
            accountId,
            date: date || Date.now()
        });

        // Update account balance
        if (type === 'income') {
            account.balance = parseFloat(account.balance) + numericAmount;
        } else {
            account.balance = parseFloat(account.balance) - numericAmount;
        }
        await account.save();

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
export const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .populate('accountId', 'name')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get filtered transactions
// @route   GET /api/transactions/filter
// @access  Private
export const getFilteredTransactions = async (req, res) => {
    try {
        const { type, category, division, startDate, endDate } = req.query;

        const filter = { userId: req.user._id };

        if (type) filter.type = type;
        if (category) filter.category = category;
        if (division) filter.division = division;

        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const transactions = await Transaction.find(filter)
            .populate('accountId', 'name')
            .sort({ createdAt: -1 });

        res.json(transactions);
    } catch (error) {
        console.error('Filter transactions error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
export const updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Check if transaction is within 12-hour edit window
        if (!transaction.isEditable) {
            return res.status(403).json({
                error: 'Transaction can only be edited within 12 hours of creation'
            });
        }

        const { type, amount, category, division, description } = req.body;

        // Convert amount to number
        const numericAmount = amount ? parseFloat(amount) : transaction.amount;
        if (amount && (isNaN(numericAmount) || numericAmount <= 0)) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // If amount or type changed, update account balance
        if (numericAmount !== transaction.amount || type !== transaction.type) {
            const account = await Account.findById(transaction.accountId);

            // Reverse old transaction
            if (transaction.type === 'income') {
                account.balance = parseFloat(account.balance) - parseFloat(transaction.amount);
            } else {
                account.balance = parseFloat(account.balance) + parseFloat(transaction.amount);
            }

            // Apply new transaction
            if (type === 'income') {
                account.balance = parseFloat(account.balance) + numericAmount;
            } else {
                account.balance = parseFloat(account.balance) - numericAmount;
            }

            await account.save();
        }

        // Update transaction
        transaction.type = type || transaction.type;
        transaction.amount = numericAmount;
        transaction.category = category || transaction.category;
        transaction.division = division || transaction.division;
        transaction.description = description !== undefined ? description : transaction.description;

        await transaction.save();

        res.json(transaction);
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        // Reverse transaction from account balance
        const account = await Account.findById(transaction.accountId);
        if (account) {
            if (transaction.type === 'income') {
                account.balance = parseFloat(account.balance) - parseFloat(transaction.amount);
            } else {
                account.balance = parseFloat(account.balance) + parseFloat(transaction.amount);
            }
            await account.save();
        }

        await transaction.deleteOne();

        res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get transaction categories
// @route   GET /api/transactions/categories
// @access  Private
export const getCategories = async (req, res) => {
    try {
        const categories = await Transaction.distinct('category', { userId: req.user._id });
        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};
