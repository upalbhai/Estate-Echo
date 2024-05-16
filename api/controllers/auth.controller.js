import User from "../model/user.model.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
export const signup=async(req,res,next)=>{
    const {username,email,password}=req.body;
    const hashPassword = bcryptjs.hashSync(password,12)
    const newUser = new User({username,email,password:hashPassword});
    try{
        await newUser.save();
        res.status(201).json("user created successfully")
    }
    catch(error){
        next(error)
    }
    
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User Not Found'));
        }
        const isValidPassword = await bcryptjs.compare(password, validUser.password);
        if (!isValidPassword) {
            return next(errorHandler(403, 'Wrong credentials'));
        }
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        const {password:pass,...rest}=validUser._doc
        res
            .cookie('access_token', token, { httpOnly: true })
            .status(200)
            .json(rest);
    } catch (error) {
        // Handle errors
        console.error(error);
        return next(errorHandler(500, 'Internal Server Error'));
    }
}


//google auth
export const google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photoURL
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('access_token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
}


// sign out route
export const signOut=async(req,res,next)=>{
    try {
        res.clearCookie('access-token');
        res.status(200).json('User has been logout successfully')
    } catch (error) {
        next(error)
    }
}