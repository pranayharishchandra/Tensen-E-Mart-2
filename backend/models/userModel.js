import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// not necessary to make "matchPassword" method of userSchema, just done for cleanliness
// Match "user" entered password to hashed password in database
// this.password is the password of the "user" object which was fetched using User.findOne({email}) in userControllerx
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('email: ', this.email, ', password: ', this.password, 'entered passowrd: ', enteredPassword, '\n')
  return await bcrypt.compare(enteredPassword, this.password);
};

// middleware - Encrypt password using bcrypt if new password given
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // checking, if password not changed... no need to do hashing
    // go to next middleware or operation
    next();
  }

  const salt    = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);

  next() // function to proceed with saving the document to the database or executing the next middleware in the chain.
});

const User = mongoose.model('User', userSchema);

export default User;

/** Encrypt password using bcrypt

===> userSchema.pre('save', ...):
This line registers a pre-hook "middleware" function for the save event of documents created from the userSchema. This means that before a document is saved to the database, this middleware function will be executed.

===> async function (next) { ... }:
This is the middleware function itself. It accepts next as a parameter, which is a function that needs to be called once the middleware completes its tasks.

===> if (!this.isModified('password')) { ... }:
This line checks whether the password field of the user document has been modified. If the password hasn't been modified, it means that the document is not new and the password hasn't changed. In this case, the middleware skips the password hashing process and proceeds to the next middleware or operation.

===> const salt = await bcrypt.genSalt(10);:
If the password has been modified, the middleware generates a salt using bcrypt.genSalt(). This salt is used to hash the password securely.

===> this.password = await bcrypt.hash(this.password, salt);:
After the salt is generated, the middleware hashes the user's password using bcrypt.hash(). The hashed password is then assigned back to the password field of the user document.

===> next();:
Finally, the middleware calls the next() function to proceed with saving the document to the database or executing the next middleware in the chain.

next()  function to proceed with saving the document to the database or executing the next middleware in the chain.
 */


/** bcrypt.genSalt(10)
 * bcrypt.genSalt(10), you're instructing bcrypt to use a cost factor of 10, which means it will perform 2^10 (1024) rounds of hashing when generating the password hash. This provides a good balance between security and computational overhead. However, higher values (e.g., 12, 14, etc.) may be used for even greater security at the expense of increased computation time.
 */

/** doesn't bycrypt provide you method to decrypt the hashed password

  bcrypt is a one-way hashing algorithm, which means it's designed to be irreversible. It doesn't provide a method to decrypt the hashed password back to its original plaintext form.

  When you use bcrypt to hash a password, it applies a salt and cryptographic hashing function to the plaintext password, resulting in a fixed-length string of characters known as the hash.
 */

/** line 39
  In the provided code, this.isModified() is indeed a built-in method provided by Mongoose. It is used within a Mongoose middleware function to check whether a """specific document field""" has been modified.

  Here's how it works:

  this: Within Mongoose middleware functions, this refers to the document being operated on. In this case, it refers to the document being saved.

  isModified(): This method is provided by Mongoose and is used to check whether a specific document field has been modified since it was loaded from the database or since the last save operation. It returns true if the field has been modified, and false otherwise.
*/

/** what if the user is just creating a new account then also it will run?
  Yes, even when a user is creating a new account, the userSchema.pre('save') middleware will run. This middleware is triggered before saving a new document (i.e., before inserting a new user record into the database) as well as before updating an existing document.

  In Mongoose, the pre('save') middleware is not specific to updates; it runs before both creation and update operations. Therefore, when a new user account is being created and saved to the database, the pre('save') middleware will still execute.
 */

/** this.isModified('password') will it give true when new user created

  Yes, when a new user is being created and saved to the database, this.isModified('password') will evaluate to true within the pre('save') middleware. This is because the 'password' field is being set for the first time during the creation of the user account, so it is considered "modified" from its initial state (which is undefined or whatever default value is specified).
 */