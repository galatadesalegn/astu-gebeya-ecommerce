import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Idempotent Admin Seeder
 * Creates the first admin from .env if no admin exists in the database.
 */
export const seedAdmin = async () => {
    try {
        // 1. Check if ANY admin already exists
        const adminCount = await User.countDocuments({ role: 'Admin' });

        if (adminCount > 0) {
            // Admin already exists, do nothing (Best practice: manage via dashboard now)
            return;
        }

        // 2. No admin found, read from .env
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.warn('⚠️ No Admin found in DB and ADMIN_EMAIL/ADMIN_PASSWORD not set in .env. Skipping seeder.');
            return;
        }

        // 3. Create the admin user
        // Note: Password hashing is handled by the User model's pre-save hook
        const admin = new User({
            name: 'System Admin',
            email: email.toLowerCase().trim(),
            password,
            role: 'Admin',
            adminRole: 'Super Admin',
            isVerified: true,
            emailVerified: true
        });

        // We use save() to trigger the pre-save password hashing hook
        await admin.save();

        console.log('✅ First Admin created successfully from .env');
        console.log(`   Email: ${email}`);
        console.log('   Note: You can now remove ADMIN_EMAIL and ADMIN_PASSWORD from .env');

    } catch (error) {
        console.error('❌ Error in Admin Seeder:', error.message);
    }
};
