import express from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import crypto from 'node:crypto';

const app = express();

type Store = Map<'requestId', string>;
const asyncLocalStorage = new AsyncLocalStorage<Store>();

app.use((req, res, next) => {
  asyncLocalStorage.run(new Map<'requestId', string>(), () => {
    (asyncLocalStorage.getStore() as Store).set('requestId', crypto.randomUUID());
    next();
  });
});

app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = { id, name: 'User Name' };
  const requestId = asyncLocalStorage.getStore()?.get('requestId');
  res.json({ requestId, user });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
