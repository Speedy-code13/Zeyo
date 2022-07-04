import mongoose from "mongoose";


class Database{
    constructor(){
        this.connected = false
    }

    connect()
    {
        mongoose.connect(process.env.MONGODB_SRV)
        .then(() =>{
            console.log("Connected to the database!")
            this.connected = true
        })
        .catch(err =>{
            console.log(err)
        })
    }
}

export default Database