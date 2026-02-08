import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    fromAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    toAccountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Transfer amount is required'],
        min: [0.01, 'Transfer amount must be greater than 0']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    }
}, {
    timestamps: true
});

// Index for efficient querying
transferSchema.index({ userId: 1, createdAt: -1 });

const Transfer = mongoose.model('Transfer', transferSchema);

export default Transfer;
