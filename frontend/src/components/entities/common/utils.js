// validate user input words length
// every word max length is 50
// not tested yet
const validateWordLength = function (str) {
    const maxLength = 50; // or whatever max length you want
    const reURL = /^(ftp|http|https):\/\/[^\s]+$/; // use whatever regular expression for URL matching you feel best
    const words = str.split(/\s+/);


    for (let i = 0; i < words.length; i += 1) {
        if (words[i].length > maxLength) {
            // test for url
            // but bear in mind the answer at http://stackoverflow.com/questions/1410311/regular-expression-for-url-validation-in-javascript
            // testing for url may not be fruitful
            if (!reURL.test(words[i])) {
                return false;
            }
        }
    }

    return true;
};