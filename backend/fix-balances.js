import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Account from './models/Account.js';
import Transaction from './models/Transaction.js';

dotenv.config();

async function recalculateAccountBalances() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const accounts = await Account.find();

        for (const account of accounts) {
            console.log(`\n📊 Account: ${account.name}`);
            console.log(`   Current Balance: ₹${account.balance.toLocaleString()}`);

            // Get all transactions for this account
            const transactions = await Transaction.find({ accountId: account._id });

            // Recalculate balance from scratch
            let calculatedBalance = 0;

            transactions.forEach(t => {
                if (t.type === 'income') {
                    calculatedBalance += parseFloat(t.amount);
                } else {
                    calculatedBalance -= parseFloat(t.amount);
                }
            });

            console.log(`   Calculated Balance: ₹${calculatedBalance.toLocaleString()}`);
            console.log(`   Transactions: ${transactions.length}`);

            // Update if different
            if (account.balance !== calculatedBalance) {
                console.log(`   ⚠️  Mismatch detected! Updating...`);
                account.balance = calculatedBalance;
                await account.save();
                console.log(`   ✅ Fixed!`);
            } else {
                console.log(`   ✅ Balance is correct`);
            }
        }

        console.log('\n✅ All accounts checked!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

recalculateAccountBalances();
