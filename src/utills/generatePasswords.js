const crypto = require('crypto');

// Character sets for password generation
const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const DIGITS = "0123456789";
const SPECIAL_CHARACTERS = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";
const ALL_CHARACTERS = UPPERCASE + LOWERCASE + DIGITS + SPECIAL_CHARACTERS;

// Password length
const PASSWORD_LENGTH = 10;

// Set to keep track of generated passwords to ensure uniqueness
const generatedPasswords = new Set();

/**
 * Generates a unique 10-character password containing upper and lower case
 * alphabetic characters, numeric characters, and special characters.
 *
 * @return {string} a unique password string
 */
module.exports = function generateUniquePassword() {
    let password;
    do {
        password = [];

        // Ensure at least one character from each character set is included
        password.push(UPPERCASE.charAt(crypto.randomInt(0, UPPERCASE.length)));
        password.push(LOWERCASE.charAt(crypto.randomInt(0, LOWERCASE.length)));
        password.push(DIGITS.charAt(crypto.randomInt(0, DIGITS.length)));
        password.push(SPECIAL_CHARACTERS.charAt(crypto.randomInt(0, SPECIAL_CHARACTERS.length)));

        // Fill the rest of the password length with random characters from all sets
        for (let i = 4; i < PASSWORD_LENGTH; i++) {
            password.push(ALL_CHARACTERS.charAt(crypto.randomInt(0, ALL_CHARACTERS.length)));
        }

        // Shuffle the characters in the password to ensure randomness
        for (let i = password.length - 1; i > 0; i--) {
            const randomIndex = crypto.randomInt(0, i + 1);
            [password[i], password[randomIndex]] = [password[randomIndex], password[i]];
        }

        password = password.join('');
    } while (generatedPasswords.has(password)); // Ensure password uniqueness

    generatedPasswords.add(password);
    return password;
}

// Example usage
// console.log(generateUniquePassword());
