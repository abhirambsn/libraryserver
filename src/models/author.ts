import { model, Schema, Model } from 'mongoose';
import uniqid from 'uniqid';
import AuthorType from '../types/AuthorType';

const getAcronym = (str: string) =>
  str
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

const genId = () => uniqid('author-');

const schema = new Schema(
  {
    _id: { type: 'string', default: genId },
    name: { type: 'string', required: true },
    acronym: { type: 'string' },
  },
  {
    timestamps: true,
  }
);

schema.pre('save', function (next) {
  this.acronym = getAcronym(this.name);
  next();
});

const Author: Model<AuthorType> = model('Author', schema);
export default Author;
