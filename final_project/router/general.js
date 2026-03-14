const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });  
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false; 
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(300).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books,null,4))
    if(err) reject(err);
  })
  myPromise.then((success) => {
    return res.status(300).json({message: success});
  })
  .catch((err) => {
    return res.status(500).json({message: err});
  })
  //return res.status(300).json({message: JSON.stringify(books,null,4)});
  //res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let myPromise = new Promise((resolve,reject) => {
    resolve(books[isbn])
    if(books[isbn]){
        resolve(books[isbn]);
    }else{
        reject("No books found!");
    }
  })
  myPromise.then((success) => {
    return res.status(300).json({message: success});
  })
  .catch((err) => {
    return res.status(500).json({message: err});
  })
  //return res.status(300).json({message: books[isbn]});
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    // Extract the author parameter from the request URL
    const author = req.params.author;
    const isbn_keys = Object.keys(books);
    let filtered_books = {};
    let myPromise = new Promise((resolve,reject) => {
        isbn_keys.forEach(isbn => {
            if(books[isbn].author === author) {
                filtered_books = books[isbn];
            }
        });
        if(filtered_books){
            resolve(filtered_books);
        }else{
            reject("No books found!");
        }
      })
      myPromise.then((success) => {
        return res.status(300).json({message: success});
      })
      .catch((err) => {
        return res.status(500).json({message: err});
      })
    // Filter the books dictionary to find books whose author matches the extracted author parameter

    // Send the filtered_books dictionary as the response to the client
  //return res.status(300).json({message: filtered_books});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    // Extract the title parameter from the request URL
    const title = req.params.title;
    const isbn_keys = Object.keys(books);
    let filtered_books = {};
    let myPromise = new Promise((resolve,reject) => {
        isbn_keys.forEach(isbn => {
            if(books[isbn].title === title) {
                filtered_books = books[isbn];
            }
        });
        if(filtered_books){
            resolve(filtered_books);
        }else{
            reject("No books found!");
        }
      })
      myPromise.then((success) => {
        return res.status(300).json({message: success});
      })
      .catch((err) => {
        return res.status(500).json({message: err});
      })
    // Filter the books dictionary to find books whose author matches the extracted author parameter

    // Send the filtered_books dictionary as the response to the client
  //return res.status(300).json({message: filtered_books});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json({message: books[isbn].reviews});
});

module.exports.general = public_users;
