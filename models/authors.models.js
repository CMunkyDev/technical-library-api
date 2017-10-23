const fs = require('fs');
const uuid = require('uuid/v4');
const authorDataPath = '../data/authors.json';
var authorList = grabJSONData();


function dataIn (path) {
    return fs.readFileSync(path, 'utf-8');
}

function dataOut (path, data) {
    fs.writeFileSync(path, data);
}

function prepDataIn (dataString) {
    return JSON.parse(dataString);
}

function prepDataOut (data) {
    return JSON.stringify(data);
}

function grabJSONData () {
    return prepDataIn(dataIn(authorDataPath));
}

function giveJSONData() {
    dataOut(authorDataPath, prepDataOut(authorList));
}

function getAllAuthors () {
    return authorList;
}

function addAuthor(firstName, lastName) {
    if (!firstName || !lastName) {
        return next({status: 400, message: 'Need both first and last name of author to be created.'})
    } else {
        let newAuthor = { "firstName": firstName, "lastName": lastName, "id": uuid() };
        authorList.push(newAuthor)
        giveJSONData();
        return newAuthor;
    }
}

function checkAuthorIdByName(firstName, lastName) {
    return authorList.find(item => (item.firstName == firstName && item.lastName == lastName));
}

function findAuthor(authorID) {
    let author = authorList.find(item => item.id == authorID);
    return author ? author : next({status: 404, message: `Author with ID of ${authorID} not found.`});
}

function removeAuthor(authorID) {
    let author = findAuthor(authorID);
    if (author) {
        let index = authorList.indexOf(author);
        let removed = authorList.splice(index, 1);
        giveJSONData();
        return removed;
    }
}

function checkCreateReplacementAuthorObject (authorID, replacementObject) {
    let repObj = replacementObject;
    if (!repObj.firstName) {
        return next({status: 400, message: "Author object needs a firstName key-value pair"})
    } else if (!repObj.lastName) {
        return next({status: 400, message: "Author object needs a lastName key-value pair"})
    } else {
        repObj.id = authorID;
        return repObj
    }
}

function replaceAuthor(authorID, replacementObject) {
    let author = findAuthor(authorID);
    let index = authorList.indexOf(author);
    let repObj = checkCreateReplacementAuthorObject(replacementObject);
    if (author && repObj && index > -1) {
        authorList[index] = repObj;
        giveJSONData();
        return repObj;
    } else {
        return next({status: 500, message: "Something has gone wrong and the author data has not been modified."})
    }
}

function updateAuthor(authorID, updateObject) {
    let author = findAuthor(authorID);
    let index = authorList.indexOf(author);
    let updObj = updateObject;
    if (author && updateObject && index > -1) {
        for(let key in updObj) {
            if (key != 'id') {
                authorList[index].key = updObj.key;
            } else {
                next({ status: 400, message: `Author ID cannot be changed.` })
            }
        }
        giveJSONData();
        return repObj;
    } else {
        return next({ status: 500, message: "Something has gone wrong and the author data has not been modified." })
    }
}

console.log(addAuthor('durr','hurr'));
console.log(getAllAuthors());