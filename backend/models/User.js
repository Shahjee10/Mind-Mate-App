import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String, // hashed password for manual signup users
  },
  name: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String, // URL to user avatar/profile picture
  },
  provider: {
    type: String,
    enum: ['manual', 'github', 'google'], // extendable for OAuth providers
    default: 'manual',
  },
  providerId: {
    type: String, // OAuth provider user id (GitHub, Google, etc.)
  },
  isVerified: {
    type: Boolean,
    default: false, // true only after OTP verification
  },
}, {
  timestamps: true, // createdAt, updatedAt
});

// Optional: method to hide password field when sending user data as JSON
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
