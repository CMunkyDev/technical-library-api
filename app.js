const express = require('express');
const router = express.Router();
const app = express();
const port = process.env.PORT || 8008;
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.disable('x-powered-by');
app.use(bodyParser.json());
app.use(morgan('dev'));



const booksRoutes = require('./routes/books.routes');
app.use('/books', booksRoutes);

const authorsRoutes = require('./routes/authors.routes');
app.use('/books/:bookId/authors', authorsRoutes);



app.use((err, req, res, next) => {
    res.status(err.status).json({error: err});
});

app.use((req, res) => {
    res.status(404).json({error: {status: 404, message: 'Not Found.'}});
});

const listener = () => console.log(`listening on port ${port}`);
app.listen(port, listener);