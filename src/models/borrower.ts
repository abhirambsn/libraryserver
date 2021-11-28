import { model, Schema, Model } from 'mongoose';
import uniqid from 'uniqid';
import BorrowerType from '../types/BorrowerType';
import { schema as BookSchema } from './book';
import BookType from '../types/BookType';
import Book from './book';

const genId = () => uniqid('borrow-');

const schema = new Schema(
  {
    _id: { type: 'string', default: genId },
    user: { type: 'string', ref: 'User' },
    books: [BookSchema],
    dateOfIssue: { type: Date, required: true, default: Date.now },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

schema.post('save', function (_, next) {
  this.books.map(async (book: BookType) => {
    await Book.findOneAndUpdate(
      { _id: book._id },
      { $inc: { 'book.copies': -1 } }
    );
  });
  next();
});

const Borrower: Model<BorrowerType> = model('Borrower', schema);
export default Borrower;
