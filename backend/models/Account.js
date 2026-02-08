import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Account name is required'],
        trim: true,
        maxlength: [50, 'Account name cannot exceed 50 characters']
    },
    balance: {
        type: Number,
        default: 0,
        min: [0, 'Balance cannot be negative']
    }
}, {
    timestamps: true
});

// Ensure unique account names per user
accountSchema.index({ userId: 1, name: 1 }, { unique: true });

const Account = mongoose.model('Account', accountSchema);

export default Account;
