import { model, Schema, Model } from 'mongoose';
import uniqid from 'uniqid';
import StaffType from '../types/StaffType';

const genId = () => uniqid('staff-');

const schema = new Schema(
  {
    _id: { type: 'string', default: genId },
    email: { type: 'string', required: true },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    username: { type: 'string', required: true },
    phoneNumber: { type: 'string', required: true },
    password: { type: 'string', required: true },
  },
  { timestamps: true }
);

const Staff: Model<StaffType> = model('Staff', schema);
export default Staff;
