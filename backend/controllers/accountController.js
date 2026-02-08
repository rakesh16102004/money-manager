import Account from '../models/Account.js';
import Transfer from '../models/Transfer.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

// @desc    Create new account
// @route   POST /api/accounts
// @access  Private
export const createAccount = async (req, res) => {
    try {
        const { name, balance } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Account name is required' });
        }

        // Check if account with same name exists for user
        const existingAccount = await Account.findOne({
            userId: req.user._id,
            name
        });

        if (existingAccount) {
            return res.status(400).json({ error: 'Account with this name already exists' });
        }

        const account = await Account.create({
            userId: req.user._id,
            name,
            balance: balance || 0
        });

        res.status(201).json(account);
    } catch (error) {
        console.error('Create account error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get all accounts
// @route   GET /api/accounts
// @access  Private
export const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(accounts);
    } catch (error) {
        console.error('Get accounts error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Get single account
// @route   GET /api/accounts/:id
// @access  Private
export const getAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json(account);
    } catch (error) {
        console.error('Get account error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Update account
// @route   PUT /api/accounts/:id
// @access  Private
export const updateAccount = async (req, res) => {
    try {
        const { name } = req.body;

        const account = await Account.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (name) {
            // Check if new name conflicts with existing account
            const existingAccount = await Account.findOne({
                userId: req.user._id,
                name,
                _id: { $ne: req.params.id }
            });

            if (existingAccount) {
                return res.status(400).json({ error: 'Account with this name already exists' });
            }

            account.name = name;
        }

        await account.save();
        res.json(account);
    } catch (error) {
        console.error('Update account error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Delete account
// @route   DELETE /api/accounts/:id
// @access  Private
export const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Delete all transactions associated with this account
        const deleteResult = await Transaction.deleteMany({
            accountId: req.params.id,
            userId: req.user._id
        });

        // Delete the account
        await account.deleteOne();

        res.json({
            message: 'Account deleted successfully',
            deletedTransactions: deleteResult.deletedCount
        });
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};

// @desc    Transfer money between accounts
// @route   POST /api/accounts/transfer
// @access  Private
export const transferMoney = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { fromAccountId, toAccountId, amount, description } = req.body;

        // Validation
        if (!fromAccountId || !toAccountId || !amount) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Transfer amount must be greater than 0' });
        }

        if (fromAccountId === toAccountId) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Cannot transfer to the same account' });
        }

        // Get accounts
        const fromAccount = await Account.findOne({
            _id: fromAccountId,
            userId: req.user._id
        }).session(session);

        const toAccount = await Account.findOne({
            _id: toAccountId,
            userId: req.user._id
        }).session(session);

        if (!fromAccount || !toAccount) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'One or both accounts not found' });
        }

        // Check sufficient balance
        if (fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Insufficient balance in source account' });
        }

        // Perform transfer
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        await fromAccount.save({ session });
        await toAccount.save({ session });

        // Create transfer record
        const transfer = await Transfer.create([{
            userId: req.user._id,
            fromAccountId,
            toAccountId,
            amount,
            description
        }], { session });

        await session.commitTransaction();

        res.status(201).json({
            transfer: transfer[0],
            fromAccount,
            toAccount
        });
    } catch (error) {
        await session.abortTransaction();
        console.error('Transfer error:', error);
        res.status(500).json({ error: error.message || 'Server error during transfer' });
    } finally {
        session.endSession();
    }
};

// @desc    Get transfer history
// @route   GET /api/accounts/transfers
// @access  Private
export const getTransfers = async (req, res) => {
    try {
        const transfers = await Transfer.find({ userId: req.user._id })
            .populate('fromAccountId', 'name')
            .populate('toAccountId', 'name')
            .sort({ createdAt: -1 });

        res.json(transfers);
    } catch (error) {
        console.error('Get transfers error:', error);
        res.status(500).json({ error: error.message || 'Server error' });
    }
};
