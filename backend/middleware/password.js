

const passwordValidator = require("password-validator")



// Create a schema
const passwordSchema = new passwordValidator();

// Le schéma que doit respecter le mot de passe
passwordSchema
    .is().min(5)                                    // Minimum length 8
    .is().max(10)                                  // Maximum length 100
    .has().uppercase(1)                              // Must have uppercase letters
    .has().lowercase()                              // Must have lowercase letters
    .has().digits(2)                                // Must have at least 2 digits
    .has().not().spaces()                           // Should not have spaces
    .has().not("_")                                   // Should not have underscore
    .has().not("=")                                   // Should not have equal sign
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values

    

// Validate against a password string
console.log(passwordSchema.validate('validPASS123'));
// => true
console.log(passwordSchema.validate('invalidPASS'));
// => false

// Get a full list of rules which failed
console.log(passwordSchema.validate('joke', { list: true }));
// => [ 'min', 'uppercase', 'digits' ]

// EXPORTATION DU MODULE

module.exports = (req, res, next) => {

    if (passwordSchema.validate(req.body.password)) {
        next();

    } else {
        let messages = '';

        const arr = passwordSchema.validate(req.body.password, { details: true })

        for (let i = 0; i < arr.length; i++) {
            messages += arr[i].message + " *** ";
        }

        return res
            .status(400)
            .json({
                message:
                    `Le mot de passe n'est pas assez fort ${messages}`
            });
    }
}
