import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3000;

// Custom middleware to log requests
app.use((request, _response, next) => {
  console.log('Request received', request.url);
  next();
});

// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing cookies
app.use(cookieParser());

const users = [
  {
    name: 'Manuel',
    username: 'manuel123',
    password: '123abc',
  },
  {
    name: 'Leon',
    username: 'lmachens',
    password: 'asdc',
  },
  {
    name: 'Anke',
    username: 'anke9000',
    password: 'ab',
  },
  {
    name: 'Philipp',
    username: 'phgrtz',
    password: 'pw123!',
  },
];

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);
  response.send(foundUser);
});

app.post('/api/login', (request, response) => {
  const loginData = request.body;
  const user = users.find((user) => user.username === loginData.username);
  if (user) {
    const isPasswordCorrect = users.some(
      (userPassword) => userPassword.password === loginData.password
    );
    if (isPasswordCorrect) {
      response.setHeader('Set-Cookie', `username=${user.username}`);
      response.send(`${user.name} youre now logged in`);
    } else response.status(403).send('Incorrect Password');
  } else response.status(404).send('User doesnt exist');
});

/* app.post('/api/login', (request, response) => {
  const loginData = request.body;
  const isLoginDataCorrect = users.some((user) => user.username === loginData.username && user.password === loginData.password);
  console.log(isLoginDataCorrect);
  if (isLoginDataCorrect) {
    response.send(`${loginData.username} youre now logged in`);
  }
  else {
    response.status(409).send('User doesnt exist');
  }
}); */

app.post('/api/users', (request, response) => {
  const newUser = request.body;
  const isNameKnown = users.includes(newUser.name);
  if (!isNameKnown) {
    users.push(newUser.name);
    response.send(`${newUser.name} added`);
  } else {
    response.status(409).send(`${newUser.name} is already here`);
  }
});

app.delete('/api/users/:username', (request, response) => {
  const userIndex = users.findIndex(
    (userIndex) => userIndex.username === request.params.username
  );
  if (userIndex === -1) {
    response.status(404).send('User not found');
  } else {
    users.splice(userIndex, 1);
    response.send(users);
  }
});

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This user is unknown');
  }
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
