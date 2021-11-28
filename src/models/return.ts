import { model, Schema, Model } from 'mongoose';
import uniqid from 'uniqid';
import ReturnType from '../types/ReturnType';
import Book from '../models/book';

const genId = () => uniqid('return-');

const calcFine = (dateOfIssue: Date, dateOfReturn: Date) => {
  const fineCost = 1;
  const diffTime = dateOfIssue.getTime() - dateOfReturn.getTime();
  const diffInDays = diffTime / (1000 * 3600 * 24);
  return diffInDays > 0 ? diffInDays * fineCost : 0;
};

const schema = new Schema({
  _id: { type: 'string', default: genId },
  borrower: { type: 'string', ref: 'Borrower', required: true },
  book: { type: 'string', ref: 'Book', required: true },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  fine: { type: 'number', default: 0 },
});

schema.pre('save', async function (next) {
  if (this.dateOfReturn) {
    this.fine = calcFine(this.dateOfIssue, this.dateOfReturn);
  } else {
    this.fine = 0;
  }
  next();
});

schema.post('save', async function (_, next) {
  await Book.findOneAndUpdate(
    { _id: this.book },
    { $inc: { 'book.copies': -1 } }
  );
  next();
});

const Return: Model<ReturnType> = model('Return', schema);

export default Return;
