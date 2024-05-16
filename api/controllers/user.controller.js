import Listing from "../model/lisitng.model.js";
import User from "../model/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'
export const test =(req,res)=>{
    res.send("hello world")
}

// update route
export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only update your own account!'));
    try {
      if (req.body.password) {
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar,
          },
        },
        { new: true }
      );
  
      const { password, ...rest } = updatedUser._doc;
  
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };


  // delete route
  export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id)
      return next(errorHandler(401, 'You can only delete your own account!'));
    try {
      // Delete user's listings
      await Listing.deleteMany({ userRef: req.user.id });
  
      // Delete user account
      await User.findByIdAndDelete(req.user.id);
      res.clearCookie('access_token');
      res.status(200).json('User and associated listings have been deleted!');
    } catch (error) {
      next(error);
    }
  };
  
   

  // show listings
  export const getUserListing =async(req,res,next)=>{


    if(req.user.id === req.params.id){
      try {
        const lisitngs = await Listing.find({userRef:req.params.id});
        res.status(200).json(lisitngs)
      } catch (error) {
        next(error)
      }
    }
    else{
      return next(errorHandler(401,'You have only view your own listing'))
    }

  }

  // get user

export const getUser =async (req,res,next)=>{

  try {
    const user = await User.findById(req.params.id)
  if(!user){
    return next(errorHandler(404,"User not defined"))
  }
  const {password: pass, ...rest} = user._doc;
  res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
  
}