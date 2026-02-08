import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Transaction type is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0.01, 'Amount must be greater than 0']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    division: {
        type: String,
        enum: ['office', 'personal'],
        required: [true, 'Division is required']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ userId: 1, division: 1 });

// Virtual to check if transaction is editable (within 12 hours)
transactionSchema.virtual('isEditable').get(function () {
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    return this.createdAt > twelveHoursAgo;
});

// Ensure virtuals are included in JSON
transactionSchema.set('toJSON', { virtuals: true });
transactionSchema.set('toObject', { virtuals: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
