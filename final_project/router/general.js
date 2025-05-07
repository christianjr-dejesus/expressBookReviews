const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userwithSameUsername = users.filter((user) => {
      return user.username === username;
  });

  return userwithSameUsername.length > 0;
}

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password })
      return res.status(200).json({ message: "User registered" })
    }
    else {
      return res.status(404).json({ message: "User already exists" })
    }
  }
  return res.status(404).json({ message: "Unable to register user" })
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books');
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching book list");
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send("Book not found");
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send("No books found by this author");
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send("No books found with this title");
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/books/review/${isbn}`);
    res.send(response.data);
  } catch (error) {
    res.status(404).send("No reviews found for this book");
  }
});

module.exports.general = public_users;
