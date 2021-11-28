import { model, Schema, Model } from 'mongoose';
import uniqid from 'uniqid';
import UserType from '../types/UserType';

const genId = () => uniqid('user-');

const userSchema = new Schema(
  {
    _id: { type: 'string', default: genId },
    email: { type: 'string', required: true },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    phoneNumber: { type: 'string', required: true },
  },
  { timestamps: true }
);

const User: Model<UserType> = model('user', userSchema);
export default User;
