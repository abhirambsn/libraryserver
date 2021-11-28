import app from './app';
import http from 'http';

import { connect } from 'mongoose';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

connect(process.env.MONGO_URI as string, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log('Database Connected!');
  server.listen(port, () => {
    console.log(`Server listening on ${port}`);
  });
});
