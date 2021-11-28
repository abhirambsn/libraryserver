import User from '../models/user';
import Book from '../models/book';
import Borrower from '../models/borrower';
import Author from '../models/author';
import { Request, Response } from 'express';
import BookType from '../types/BookType';

import AuthenticatedRequest from '../types/AuthenticatedRequest';
import Return from '../models/return';

export const issueBook = async (req: AuthenticatedRequest, res: Response) => {
  const books = await Promise.all(
    req.body.bookId.map(async (bookId: string) => {
      const book = await Book.findById(bookId);
      if (!book) {
        return null;
      }
      return book;
    })
  );

  const user = await User.findOne({ _id: req.body.user });
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  const payload = {
    user,
    books: books as BookType[],
    dateOfIssue: new Date(),
    dueDate: new Date(req.body.dueDate),
  };
  const borrower = await Borrower.create(payload);
  if (!borrower) {
    return res.status(500).send({ message: 'Error Occured' });
  } else {
    return res.status(201).send({ borrower, message: 'Book Issued' });
  }
};

export const returnBook = async (req: AuthenticatedRequest, res: Response) => {
  const borrowerId = req.body.borrowerId;
  const bookId = req.body.bookId;

  const borrower = await Borrower.findById(borrowerId);
  if (!borrower) {
    return res.status(404).send({ message: 'Borrower Not Found' });
  }
  let book: BookType = undefined as unknown as BookType;

  borrower.books.map((bookVal) => {
    if (bookVal._id === bookId) {
      book = bookVal;
      return;
    }
  });
  if (!book) {
    return res
      .status(404)
      .send({ message: 'Book was not issued by this borrower' });
  }
  await Borrower.findByIdAndUpdate(borrowerId, {
    books: borrower.books.filter((bookItem) => bookItem !== book),
  });
  const returnData = await Return.create({
    borrower: borrower._id,
    book: book?._id,
    dueDate: borrower.dueDate,
    returnDate: new Date(),
  });
  if (returnData) {
    await returnData.save();
    return res
      .status(201)
      .send({ return: returnData, message: 'Book returned!' });
  } else {
    return res.status(500).send({ message: 'Error Occured!' });
  }
};

export const addNewBook = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const uid = Math.floor(Math.random() * 1000);
  const author = await Author.findById(data.author);
  if (!author) {
    return res.status(404).send({ message: 'Author not found!' });
  }
  const _id = 'ACC/' + author.acronym + '/' + uid.toString();
  data._id = _id;
  const newBook = await Book.create(data);
  if (!newBook) {
    return res.status(404).send({ message: 'An Error Occured!' });
  }
  await newBook.save();
  return res.status(201).send({ book: newBook, message: 'Book added!' });
};

export const getBooks = async (_: Request, res: Response) => {
  return res.status(200).send(await Book.find());
};

export const getBook = async (req: Request, res: Response) => {
  const id = 'ACC/' + req.params.authorId + '/' + req.params.bookId;
  const book = await Book.findById(id);
  if (!book) {
    return res.status(404).send({ message: 'Book not found' });
  }
  return res.status(200).send({ book });
};

export const addAuthor = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const newAuthor = await Author.create(data);
  if (!newAuthor) {
    return res.status(500).send({ message: 'Error Occured!' });
  }
  return res.status(200).send({ author: newAuthor, message: 'Author added' });
};

export const getAuthors = async (_: Request, res: Response) => {
  return res.status(200).send(await Author.find());
};

export const getAuthor = async (req: Request, res: Response) => {
  const id = req.params.authorId;
  const author = await Author.findById(id);
  if (!author) {
    return res.status(404).send({ message: 'Author not found' });
  }
  return res.status(200).send({ author });
};

export const editAuthor = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const id = req.params.authorId;
  const updateUser = await Author.findByIdAndUpdate(id, data);
  if (!updateUser) {
    return res.status(500).send({ message: 'Error Occured!' });
  }
  return res
    .status(200)
    .send({ author: updateUser, message: 'Author updated' });
};

export const updateBook = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const id = 'ACC/' + req.params.authorId + '/' + req.params.bookId;
  const updateBook = await Book.findByIdAndUpdate(id, data);
  if (!updateBook) {
    return res.status(500).send({ message: 'Error Occured!' });
  }
  return res.status(200).send({ author: updateBook, message: 'Book updated' });
};

export const addUser = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const newUser = await User.create(data);
  if (!newUser) {
    return res.status(404).send({ message: 'Error Occured!' });
  }
  return res.status(201).send({ user: newUser, message: 'User added!' });
};

export const getUsers = async (_: AuthenticatedRequest, res: Response) => {
  return res.status(200).send(await User.find());
};

export const getBorrower = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.borrowerId;
  const borrower = await Borrower.findById(id);
  if (!borrower) {
    return res.status(404).send({ message: 'Borrower not found' });
  }
  return res.status(200).send({ borrower });
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const id = req.params.userId;
  const updateUser = await User.findByIdAndUpdate(id, data);
  if (!updateUser) {
    return res.status(500).send({ message: 'Error Occured!' });
  }
  return res.status(200).send({ author: updateUser, message: 'User updated' });
};

export const searchBookByName = async (req: Request, res: Response) => {
  const query = req.params.query;
  const books = await Book.find({ name: { $regex: '.*' + query + '.*' } });
  return res.status(200).send(books);
};

export const searchBookByAuthorName = async (req: Request, res: Response) => {
  const authorName = req.params.authorName;
  const authors = await Author.find({
    name: { $regex: '.*' + authorName + '.*' },
  });
  const books = await Promise.all(
    authors.map(async (author) => {
      const book = await Book.find({ author: author });
      return book;
    })
  );

  return res.status(200).send(books);
};

export const searchBookByAuthorId = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  const author = await Author.findById(authorId);
  if (!author) {
    return res.status(404).send({ message: 'Author not found' });
  }
  const books = await Book.find({ author });
  return res.status(200).send(books);
};

export const searchAuthorByName = async (req: Request, res: Response) => {
  const authorName = req.params.authorName;
  const authors = await Author.find({ name: authorName });
  return res.status(200).send(authors);
};

export const searchAuthorById = async (req: Request, res: Response) => {
  const id = req.params.authorId;
  const author = await Author.findById(id);
  if (!author) {
    return res.status(404).send({ message: 'Author not found' });
  }
  return res.status(200).send({ author });
};

export const deleteBook = async (req: AuthenticatedRequest, res: Response) => {
  const id = 'ACC/' + req.params.authorId + '/' + req.params.bookId;
  const book = await Book.findByIdAndDelete(id);
  if (!book) {
    return res.status(404).send({ message: 'Book not found' });
  }
  return res.status(200).send({ book, message: 'Book deleted' });
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.body.userId;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }
  return res.status(200).send({ user, message: 'User deleted' });
};

export const deleteAuthor = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const id = req.params.authorId;
  const author = await Author.findByIdAndDelete(id);
  if (!author) {
    return res.status(404).send({ message: 'Author not found' });
  }
  return res.status(200).send({ author, message: 'Author deleted' });
};
