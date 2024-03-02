import mongoose from "mongoose";
import getEnvironment from "../config/process.config.js";

export default async function mongoLoader(){
    const env = getEnvironment();
    await mongoose.connect(env.DB_URL);
}