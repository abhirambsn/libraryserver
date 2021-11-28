import { Document } from 'mongoose';

interface UserType extends Document {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export default UserType;
