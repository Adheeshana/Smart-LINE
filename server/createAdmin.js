const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartline')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminExists) {
      console.log('Admin user already exists!');
      console.log('Email:', adminExists.email);
      console.log('Role:', adminExists.role);
      process.exit(0);
    }

    // Create new admin user
    const adminUser = await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'smartline2025',
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminUser.email);
    console.log('Role:', adminUser.role);
    console.log('\nYou can now login with:');
    console.log('Email: admin@gmail.com');
    console.log('Password: smartline2025');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
};

createAdminUser();
