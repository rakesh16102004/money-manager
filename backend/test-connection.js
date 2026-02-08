import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🔍 MongoDB Connection Debugger');
console.log('================================\n');

// Show connection string (hide password)
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file');
    process.exit(1);
}

// Parse and display connection details
try {
    const hiddenUri = uri.replace(/:([^@]+)@/, ':****@');
    console.log('📝 Connection String (password hidden):');
    console.log(hiddenUri);
    console.log('');

    // Extract details
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/([^?]*)/);
    if (match) {
        console.log('📊 Connection Details:');
        console.log(`   Username: ${match[1]}`);
        console.log(`   Password: ${match[2].substring(0, 3)}***`);
        console.log(`   Cluster:  ${match[3]}`);
        console.log(`   Database: ${match[4] || '(not specified)'}`);
        console.log('');
    }

    // Attempt connection
    console.log('🔌 Attempting to connect...\n');
    
    mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000
    })
    .then(() => {
        console.log('✅ SUCCESS! MongoDB connected successfully!');
        console.log('');
        console.log('Your connection string is correct.');
        console.log('You can now run your backend server.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ CONNECTION FAILED!');
        console.error('');
        console.error('Error:', err.message);
        console.error('');
        
        if (err.message.includes('bad auth')) {
            console.error('🔧 SOLUTION:');
            console.error('   1. Go to MongoDB Atlas → Database Access');
            console.error('   2. Delete the current user');
            console.error('   3. Create a NEW user with a simple password');
            console.error('   4. Update your .env file with the new credentials');
            console.error('');
            console.error('   OR');
            console.error('');
            console.error('   Use local MongoDB instead:');
            console.error('   MONGODB_URI=mongodb://localhost:27017/money-manager');
        } else if (err.message.includes('ENOTFOUND')) {
            console.error('🔧 SOLUTION:');
            console.error('   Check your internet connection');
            console.error('   Verify the cluster URL is correct');
        }
        
        process.exit(1);
    });

} catch (error) {
    console.error('❌ Error parsing connection string:', error.message);
    process.exit(1);
}
