import mongoose, { model } from 'mongoose';

// create shemaa..
//  with that schema create a model which is the actual collection in ur document...
//  and for that created model we can add some static functions ....

const OtpSchema=mongoose.Schema({
    email: {
      type:String,
      required: true,
      },
      otp: {
        type: Number,
        required: true
      },
      purpose:{
        type:String,
        trim:true,
        required:true,
        lowercase:true
      },
      createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: 60*15*1000 // expiry
      }
    
})


// Static method 
OtpSchema.statics.generateOtp = function () {
    const otp = Math.floor(100000 + Math.random() * 900000); // Ensures a 6-digit number
    return otp.toString(); // Return as a string
};

// save otp...
OtpSchema.statics.saveOtp=async function (email,otp,purpose){
  const otpDoc = new this({
    email:email,
    otp:otp,
    purpose
  })
  
  try{
    await otpDoc.save()
    return otpDoc
  }
  catch(err){
    console.log(err);
    throw new Error("Can't insert Otp");
  }
}

OtpSchema.statics.verifyOtp = async function (email,usedOtp){

  console.log(email,usedOtp);
  const givenOtp=Number(usedOtp);
  
  try {
    const row = await this.findOne({ email }); 

    if (!row) {
      throw new Error("No Records Found."); // OTP not found for email
    }

    if (row.otp != givenOtp) {
      throw new Error("Incorrect Otp");
    }

    return 200; 
  } catch (err) {
    console.error("Error:", err.message);
    throw new Error(err.message);
  }
}

const Otp=mongoose.model("otp",OtpSchema);
export default Otp;