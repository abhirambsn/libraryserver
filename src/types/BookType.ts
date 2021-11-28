import { Document } from 'mongoose';
import AuthorType from '../types/AuthorType';

interface BookType extends Document {
  _id?: string;
  name: string;
  author: AuthorType;
  accession_no: string;
  price: number;
  copies: number;
}

export default BookType;
