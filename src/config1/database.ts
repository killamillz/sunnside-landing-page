import mongoose, {ConnectOptions} from "mongoose";

export const connectDatabase = async()=>{
     try {
          const connect = mongoose.connect(`mongodb+srv://killamillz0:Berbatov94_@cluster0.78xg8at.mongodb.net/`,{
               useNewUrlParser:true,
               useUnifiedTopology:true
     
          } as ConnectOptions);
          return console.log(`MongoDb connected Successfully`)
     } catch (error) {
          console.log("ERROR", error)
     }
}
