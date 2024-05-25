const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/user'); 
const imagePath = "../public/img/user.png";

mongoose.connect('mongodb://localhost:27017/mi_redsocial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    ejecutar(imagePath); o
})
.catch(err => console.log(err));

const ejecutar = async (imagePath) => {
    try {
        const hashedPassword = await bcrypt.hash("securePassword", 12); 

        const adminExists = await User.findOne({ email: "admin@example.com" });
        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        await User.create({
            name: "Admin",
            surname: "User",
            bio: "Admin bio",
            nick: "AdminNick",
            email: "admin@example.com",
            password: hashedPassword,
            role: "role_admin",
            image: imagePath 
        });
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.disconnect();
    }
};

ejecutar()