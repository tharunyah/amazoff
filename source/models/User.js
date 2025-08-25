import { DataTypes } from 'sequelize'
import sequelize from '../db.js'
import bcrypt from 'bcryptjs'

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validdate: {isEmail: true},
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

//creating a hook to has the password before the user is created
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

export default User;