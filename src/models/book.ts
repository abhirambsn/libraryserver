import { model, Schema, Model } from 'mongoose';
import BookType from '../types/BookType';

export const schema = new Schema(
  {
    _id: { type: 'string' },
    name: { type: 'string', required: true },
    author: { type: 'string', required: true, ref: 'Author' },
    price: { type: 'number', default: 0, required: true },
    copies: { type: 'number', default: 0, required: true },
  },
  { timestamps: true }
);

const Book: Model<BookType> = model('Book', schema);
export default Book;
