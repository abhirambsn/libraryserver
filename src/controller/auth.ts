import * as jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import Staff from '../models/staff';

import { Request, Response } from 'express';
import AuthenticatedRequest from '../types/AuthenticatedRequest';

const jwtSecret = process.env.JWT_SECRET || 'TestSecret';

export const login = async (req: Request, res: Response) => {
  const data = req.body;
  const staff = await Staff.findOne({ username: data.username });
  if (!staff) {
    return res.status(401).send({ message: 'Staff not found.' });
  }
  const verify = await argon2.verify(staff.password, req.body.password);
  if (verify) {
    const { _id, username, firstName, lastName, email } = staff;
    const payload = { _id, username, firstName, lastName, email };
    const jwtToken = jwt.sign(payload, jwtSecret);
    return res.status(200).send({ user: payload, token: jwtToken });
  } else {
    return res.status(401).send({ message: 'Wrong Credentials.' });
  }
};

export const register = async (req: Request, res: Response) => {
  const data = req.body;
  data.password = await argon2.hash(data.password);
  const newStaff = await Staff.create(data);
  if (newStaff) {
    await newStaff.save();
    return res.status(201).send({ message: 'Registration Successful' });
  } else {
    return res
      .status(500)
      .send({ message: 'An Error Occured. Registration Failure' });
  }
};

export const profile = async (req: AuthenticatedRequest, res: Response) => {
  if (req.user) {
    return res.status(200).send(await Staff.findOne({ _id: req.user._id }));
  } else {
    return res.status(403).send({ message: 'Unauthorized ' });
  }
};

export const updateStaff = async (req: AuthenticatedRequest, res: Response) => {
  const data = req.body;
  const id = req.user?._id;
  if (data.password) {
    data.password = await argon2.hash(data.password);
  }
  const updateStaff = await Staff.findByIdAndUpdate(id, data);
  if (!updateStaff) {
    return res.status(500).send({ message: 'Error Occured!' });
  }
  return res
    .status(200)
    .send({ author: updateStaff, message: 'Staff updated' });
};
