const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const db = mongoose.connect('url');
const bookRouter = express.Router();
const port = process.env.PORT || 3000;
const Book = require('./models/bookModel');

// for req body seperation
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

bookRouter.route('/books')
    .post((req,res)=>{
        const book = new Book(req.body);
        book.save();
        return res.status(201).json(book);
    })
    .get((req,res)=>{
        // automatically find in monggose db
        const query = {};
        // /api/books?genre=Fantasy
        if(req.query.genre){
            query.genre = req.query.genre;
        }


        Book.find(query,(err,books)=>{
            if(err){
                return res.send(err);
            }
             // Hateoas
             const returnBooks = books.map((book)=>{
                 let newBook = book.toJSON();
                 newBook.links = {};
                 newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
                 return newBook;
             });

            return res.json(returnBooks);
        })
    });

// Finding By id

bookRouter.route('/books/:bookId')
    .get((req,res)=>{
        // automatically find in monggose db
        const query = {};
        // /api/books?genre=Fantasy
        if(req.query.genre){
            query.genre = req.query.genre;
        }


        Book.findById(query,(err,books)=>{
            if(err){
                return res.send(err);
            }

           

            return res.json(books);
        })
    })
    .put((req,res)=>{
        // automatically find in monggose db
        const query = {};
        // /api/books?genre=Fantasy
        if(req.query.genre){
            query.genre = req.query.genre;
        }


        Book.findById(query,(err,books)=>{
            if(err){
                return res.send(err);
            }
            books.title = req.body.title;
            books.author = req.body.author;
            books.genre = req.body.genre;
            books.read = req.body.read;
            books.save();
            return res.json(books);
        })
    })
    .delete((req,res)=>{
        req.book.remove((err)=>{
            if(err){
                return res.send(err);
            }
            return res.sendStatus(204);
        })
    });

// also patch is there


app.use('/api',bookRouter);
app.get('/',(req,res)=>{
    res.send('Welcome to my API');
})


app.listen(port, ()=>{
    console.log('Running on port '+ port);
});