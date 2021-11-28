import { Document } from 'mongoose';

interface ReturnType extends Document {
  _id?: string;
  borrower: string;
  book: string;
  dueDate: Date;
  returnDate: Date;
  fine?: number;
}

export default ReturnType;
