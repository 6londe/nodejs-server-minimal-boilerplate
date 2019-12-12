import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
}, { timestamps: true });

userSchema.statics = {

  async createUser(body) {
    const user = await this.create(body);
    return user;
  },

  async getUser(id) {
    const user = await this.findById(id);
    return user;
  },

  async updateUser(id, body) {
    const user = await this.findByIdAndUpdate(id, body, { new: true });
    return user;
  },

  async deleteUser(id) {
    const user = await this.findByIdAndDelete(id);
    return user;
  },

  async listUsers(query) {
    const { offset, limit } = query;
    delete query.offset;
    delete query.limit;
    const users = this.find(query).skip(offset || 0).limit(limit || 10);
    return users;
  },

  transform(user) {
    const transformed = {};
    const fields = ['id', 'name', 'email', 'createdAt'];
    fields.forEach((field) => { transformed[field] = user[field]; });
    return transformed;
  },
};

export default mongoose.model('User', userSchema);
