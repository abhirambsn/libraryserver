import { Document } from 'mongoose';
import BookType from '../types/BookType';
import UserType from '../types/UserType';

interface BorrowerType extends Document {
  _id?: string;
  user: UserType;
  books: BookType[];
  dateOfIssue: Date;
  dueDate: Date;
  dateOfReturn?: Date;
  fine?: number;
}

export default BorrowerType;
