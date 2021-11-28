import { Document } from 'mongoose';

interface AuthorType extends Document {
  _id?: string;
  name: string;
  acronym: string;
}

export default AuthorType;
