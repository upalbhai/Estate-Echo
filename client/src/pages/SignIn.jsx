import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart,signInFailure,signInSuccess} from '../redux/user/userSlice';
import { Oath } from '../components/Oath';
import toast from 'react-hot-toast';
const SignIn = () => {
  const dispatch = useDispatch();
  const [formData,setFormData]=useState({});
  const {loading,error} = useSelector((state)=>state.user)
  const navigate = useNavigate();
  const handleChange =(e)=>{
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value,
      }
    )
  }
  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify(formData),
      }
    )
    const data = await res.json();
    if(data.success===false){
      dispatch(signInFailure(data.message));
      toast.error(error);
      return;
    }
    dispatch(signInSuccess(data));
    toast.success('sign in successfully')
    navigate('/')
    }
    catch(error){
      useDispatch(signInFailure(error.message))
      toast.error(error.message);
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl text-center font-semibold my-7' >Sign In</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4' >
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} required/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} required/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' :'Sign Up'}</button>
        <Oath />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an Account?</p>
        <Link to='/signup'>
          <span className='text-blue-700' >Sign Up</span>
        </Link> 
      </div>
      {/* {error &&  <p className='text-red-500'>{error}</p>} */}
    </div>
  )
}

export default SignIn;