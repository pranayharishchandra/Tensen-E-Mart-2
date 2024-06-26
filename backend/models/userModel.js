import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

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
    timestamps: true, // Use the timestamps option in the `second argument` of the Schema constructor to keep schema-wide settings separate from field definitions.
  }
);


// this.password is the password of the "user" document which was fetched using User.findOne({email}) in userController
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('email: ', this.email, ', password: ', this.password, 'entered passowrd: ', enteredPassword, '\n')
  return await bcrypt.compare(enteredPassword, this.password);
};


// [[ middleware ]] - Encrypt password using bcrypt if new password given
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    // checking, if password not changed... no need to do hashing
    // go to next middleware or operation
    next();
  }

  //* Method 1: (async - non-blocking - better performance)
  const salt    = await bcrypt.genSalt(10);
  this.password = bcrypt.hash(this.password, salt);

  //* Method 2: syncronous:  Might cause performance issues in a high-traffic environment because it blocks the event loop.
// this.password = bcrypt.hashSync(this.password, 10);
  // method 2 can be used when creating dummy JSON data, in a javascript

  next() // function to proceed with saving the document to the database or executing the next middleware in the chain.
});

const User = mongoose.model('User', userSchema);
//* const MODEL_NAME = mongoose.model('COLLECTION_NAME', schemaName)
export default User;

// schemas ⁠ define the shape and constraints of your data, 
// while ⁠ models ⁠ use those schemas to interact with the database.



/*
  * bcrypt.genSalt(10)
 - 10 is somewhat mid value
 - higher values (e.g., 12, 14, etc.) may be used for even greater security at the expense of increased computation time.
 */

/*
  * doesn't bycrypt provide you method to decrypt the hashed password,
  as hashed means one way encryption resulting in a fixed-length string of characters known as the hash.
 */

/*
  * line 39: userSchema.pre('save', async function (next) { this.isModified() ...... }

  In the provided code, this.isModified() is indeed a built-in method provided by Mongoose. It is used within a Mongoose middleware function to check whether a """specific document field""" has been modified.

  Here's how it works:

  "this": Within Mongoose middleware functions, 
  *"this" refers to the document being operated on. In this case, it refers to the document being saved.

*/

/*
  * what if the user is just creating a new account then also it will run?
 
  Yes, even when a user is creating a new account, the userSchema.pre('save') middleware will run.
  This middleware is triggered before saving a new document 
  * (i.e., before inserting a new user record into the database) as well as before updating an existing document.

  In Mongoose, the pre('save') middleware is not specific to updates; it runs before both creation and update operations. Therefore, when a new user account is being created and saved to the database, the pre('save') middleware will still execute.
 */

/*
  * this.isModified('password') will it give true when new user created or the mentioned field modified i.e. password 

  Yes, when a new user is being created and saved to the database, this.isModified('password') will evaluate to true within the pre('save') middleware.
  * This is because the 'password' field is being set for the first time during the creation of the user account, so it is considered "modified" from its initial state (which is undefined or whatever default value is specified).
 */

/*
  * using next() 
  * Future Proofing: Extensibility: While the current file """may not have another middleware""", 
    calling next() makes your code more modular and future-proof. 
    If you decide to add more middleware functions later, the flow will remain consistent.
*/

/*
* WORKING OF FOLLWING CODE SINPPET
* -SNIPPET:
//* this: refers to the "document"
userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log('email: ', this.email, ', password: ', this.password, 'entered passowrd: ', enteredPassword, '\n')
  return await bcrypt.compare(enteredPassword, this.password);
};

 |-> userSchema.methods.matchPassword = async (enteredPassword) => { }
 |->       user.        matchPassword         (password)
*|->  document.        method                (parameter)

* -WORKING:
* (snippet from "userController.js", function-"authUser")
const { email, password } = req.body;
const user = await User.findOne({ email }); //* "user" is the document, "User" is the model

if (user && (await user.matchPassword(password))) { ... generate token ... } 
else { res.status(401); throw new Error('Invalid email or password'); }
*/

