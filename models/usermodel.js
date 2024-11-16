import mongoose from "mongoose";


const schema = new mongoose.Schema({
    username : {type: String, required: true,unique:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

const Users = mongoose.model('Users',schema)

export default Users