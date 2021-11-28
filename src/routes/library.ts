import { Router } from 'express';
import * as libraryController from '../controller/library';

import authMiddleware from '../middleware/authentication';

const router = Router();

// POST Requests
router.post('/issue', authMiddleware, libraryController.issueBook);
router.post('/return', authMiddleware, libraryController.returnBook);
router.post('/book/add', authMiddleware, libraryController.addNewBook);
router.post('/author/add', authMiddleware, libraryController.addAuthor);
router.post('/user/add', authMiddleware, libraryController.addUser);
// GET Requests
router.get('/book', libraryController.getBooks);
router.get('/book/ACC/:authorId/:bookId', libraryController.getBook);
router.get('/search/book/name/:query', libraryController.searchBookByName);
router.get(
  '/search/book/author/name/:authorName',
  libraryController.searchBookByAuthorName
);
router.get(
  '/search/book/author/id/:authorId',
  libraryController.searchBookByAuthorId
);
router.get('/author', libraryController.getAuthors);
router.get('/author/:authorId', libraryController.getAuthor);
router.get('/search/author/id/:authorId', libraryController.searchAuthorById);
router.get(
  '/search/author/name/:authorName',
  libraryController.searchAuthorByName
);
router.get(
  '/borrower/:borrowerId',
  authMiddleware,
  libraryController.getBorrower
);
router.get('/user', authMiddleware, libraryController.getUsers);
// PUT Requests
router.put('/author/:authorId', authMiddleware, libraryController.editAuthor);
router.put(
  '/book/ACC/:authorId/:bookId',
  authMiddleware,
  libraryController.updateBook
);
router.put('/user/:userId', authMiddleware, libraryController.updateUser);
// DELETE Requests
router.delete(
  '/book/ACC/:authorId/:bookId',
  authMiddleware,
  libraryController.deleteBook
);
router.delete(
  '/author/:authorId',
  authMiddleware,
  libraryController.deleteAuthor
);
router.delete('/user/:userId', authMiddleware, libraryController.deleteUser);

export default router;
