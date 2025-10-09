// createAdmin.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Admin' },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const existingAdmin = await Admin.findOne({ email: 'admin@rajakaka.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin already exists!');
      console.log('Email:', existingAdmin.email);
      await mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('rajakaka@admin', salt);

    const admin = await Admin.create({
      email: 'admin@rajakaka.com',
      password: hashedPassword,
      name: 'Rajakaka Admin',
      role: 'admin'
    });

    console.log('✅ Admin created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: rajakaka@admin');
    console.log('👤 Name:', admin.name);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.connection.close();
    console.log('✅ Connection closed');

  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.connection.close();
  }
}

createAdmin();