import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path'
dotenv.config();

mongoose.connect(process.env.MONGOURL).then(() => {
    console.log("Database connection successful");
}).catch((err) => {
    console.error("Database connection error:", err);
});

const app = express();
const __dirname = path.resolve();
// Middleware
app.use(express.json());
app.use(cookieParser())
// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing",listingRouter);

app.use(express.static(path.join(__dirname,'/client/dist')))

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'client','dist','index.html'));
})

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server Error';
    console.error(`Error ${statusCode}: ${message}`);
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
