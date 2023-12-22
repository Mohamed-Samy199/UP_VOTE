import mongoose from "mongoose"

export const connectDB = async () =>{
    return mongoose
    .connect(process.env.DB_URL_LOCAL)
    .then(res => console.log("DB Connect Success..."))
    .catch(error => console.log({message : 'Fail Connect' , error}))
}
mongoose.set('strictQuery' , true)