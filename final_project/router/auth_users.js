const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(300).json({message: "Login successful!"});
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    // Extract username and review parameters from request URL
    const isbn = req.params.isbn;
    const username = 'user126';//req.authorization.username;
    const review = req.query.review;
    let book = books[isbn];  // Retrieve book object associated with isbn
    
    if (book) {  // Check if friend exists
        // Update review if provided in request body
        if (review) {
            books[isbn].reviews[username]=review;//{"message":"Review added/updated successfully","reviews":{"newuser":"Great book!"}}
            return res.status(300).json({message: "Review added/updated successfully", reviews:{user123:review}});
        }
        return res.status(300).json({message: 'No review was provided!'});
    } else {
        // Respond if friend with specified email is not found
        res.send("Unable to find specified book!");
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
      // Extract username and review parameters from request URL
      const isbn = req.params.isbn;
      const username = 'user126';//req.session.authorization.username;
      let book = books[isbn];  // Retrieve book object associated with isbn
      
      if (book) {  // Check if friend exists
          // Update review if provided in request body
              delete books[isbn].reviews.username;
              return res.status(404).json({message: `Deleted book review with the isbn ${isbn} for user ${username}.`});
      } else {
          // Respond if friend with specified email is not found
          res.send("Unable to find specified book!");
      }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
