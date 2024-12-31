import mongoose from "mongoose"
import 'dotenv/config';

const connectToDb=()=>{
    // MongoDB connection URI from .env file
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ChatMateDb';

// Connect to MongoDB
mongoose.connect(MONGO_URI) 
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Connection error:', err));


}

export default connectToDb;