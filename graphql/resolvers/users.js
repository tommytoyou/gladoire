const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userInputError, UserInputError } = require('apollo-server');

const { validateRegisterInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

module.exports = {
    Mutation: {
        async register(
            _, 
            {
            registerInput: { email, username, password, confirmPassword }
            }, 
            context, 
            info
            ){
            // here I will validate user data
            const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword)
            if(!valid){
                throw new UserInputError('Errors', { errors })
            }
            //and make sure user doesnt already exist
            const user = User.findOne({username});
            if(user){
                    throw new UserInputError('n This username is taken', {
                        errors: {
                            username: 'This username is taken'
                        }
                    })
            }
            //Hash the password auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString()
            }) 

            const res = await newUser.save();

            const token = jwt.sign({
                id: res.id,
                email: res.email,
                username: res.username
            }, SECRET_KEY, { expiresIn: '1h'});
            
            return {
                ...res._doc,
                id: res.id,
                token
            }
        }
    }
}