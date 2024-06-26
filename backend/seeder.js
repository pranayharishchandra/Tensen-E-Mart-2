import mongoose  from 'mongoose';
import dotenv    from 'dotenv';
import colors    from 'colors';
import users     from './data/users.js';
import products  from './data/products.js';
import User      from './models/userModel.js';
import Product   from './models/productModel.js';
import Order     from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

/**
 * In general, "dotenv.config()" and "connectDB()" should be done "only once" in the lifecycle of your application. However, if you run the "seeder" script "independently" (outside the main application runtime), you need to ensure that both environment variables are loaded and the database is connected within that script as well.
 */
const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
// '-d' is the 3rd arguement after filepaths
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

/**
 * Using process.exit(1) in a MERN application should be done judiciously. It's typically used to handle critical errors where the application cannot recover and needs to stop. However, it's important to implement error handling and logging to gracefully handle errors without abruptly terminating the server, ensuring the stability and reliability of your application.
 * 
 */