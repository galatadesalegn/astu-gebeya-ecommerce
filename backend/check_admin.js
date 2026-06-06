import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}).select('+password');
        console.log('Total Users:', users.length);

        users.forEach(u => {
            console.log(`- ${u.email} [${u.role}] Verified: ${u.isVerified}/${u.emailVerified}`);
        });

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@astugebeya.com';
        const admin = await User.findOne({ email: adminEmail.toLowerCase().trim() }).select('+password');

        if (admin) {
            console.log('\nAdmin record found:');
            console.log('Role:', admin.role);
            console.log('Verified:', admin.isVerified);
            console.log('Email Verified:', admin.emailVerified);
        } else {
            console.log('\nNo user found with email:', adminEmail);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUsers();
