const fs = require('fs');
const uuid = require('uuid/v4');
const bookDataPath = '../data/books.json';
var bookData = grabJSONData();


function dataIn(path) {
    return fs.readFileSync(path, 'utf-8');
}

function dataOut(path) {
    fs.writeFileSync(path);
}

function prepDataIn(dataString) {
    return JSON.parse(dataString);
}

function prepDataOut(data) {
    return JSON.stringify(data);
}

function grabJSONData() {
    return prepDataIn(dataIn(bookDataPath));
}

function giveJSONData() {
    dataOut(prepDataOut(bookData));
}

function getAllBooks() {
    return bookData;
}

function addBook(firstName, lastName) {
    if (!firstName || !lastName) {
        return next({ status: 400, message: 'Need both first and last name of book to be created.' })
    } else {
        let newBook = { "firstName": firstName, "lastName": lastName, "id": uuid() };
        bookData.push(newBook)
        giveJSONData();
        return newBook;
    }
}

function findBook(bookID) {
    let book = bookData.find(item => item.id == bookID);
    return book ? book : next({ status: 404, message: `Book with ID of ${bookID} not found.` });
}

function removeBook(bookID) {
    let book = findBook(bookID);
    if (book) {
        let index = bookData.indexOf(book);
        let removed = bookData.splice(index, 1);
        giveJSONData();
        return removed;
    }
}

function checkCreateReplacementBookObject(bookID, replacementObject) {
    let repObj = replacementObject;
    if (!repObj.firstName) {
        return next({ status: 400, message: "Book object needs a firstName key-value pair" })
    } else if (!repObj.lastName) {
        return next({ status: 400, message: "Book object needs a lastName key-value pair" })
    } else {
        repObj.id = bookID;
        return repObj
    }
}

function replaceBook(bookID, replacementObject) {
    let book = findBook(bookID);
    let index = bookData.indexOf(book);
    let repObj = checkCreateReplacementBookObject(replacementObject);
    if (book && repObj && index > -1) {
        bookData[index] = repObj;
        giveJSONData();
        return repObj;
    } else {
        return next({ status: 500, message: "Something has gone wrong and the book data has not been modified." })
    }
}

function updateBook(bookID, updateObject) {
    let book = findBook(bookID);
    let index = bookData.indexOf(book);
    let updObj = updateObject;
    if (book && updateObject && index > -1) {
        for (let key in updObj) {
            if (key != 'id') {
                bookData[index].key = updObj.key;
            } else {
                next({ status: 400, message: `Book ID cannot be changed.` })
            }
        }
        giveJSONData();
        return repObj;
    } else {
        return next({ status: 500, message: "Something has gone wrong and the book data has not been modified." })
    }
}

console.log(bookData);