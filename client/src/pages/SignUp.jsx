import React, { useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import { Oath } from '../components/Oath';
import toast from 'react-hot-toast';
const SignUp = () => {
  
  const [formData,setFormData]=useState({});
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
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
      setLoading(true)
      const res = await fetch('/api/auth/signup',
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
      setError(data.message);
      setLoading(false);
      toast.error(data.message);
      return;
    }
    setLoading(false)
    setError(null);
    navigate('/signin');
    toast.success('signup successfully')
    }
    catch(error){
      setLoading(false);
      setError(error.message);
      toast.error(error.message);
    }
    
  }
  return (
    <div className='p-3 max-w-lg mx-auto' >
      <h1 className='text-3xl text-center font-semibold my-7' >Sign Up</h1>
      <form onSubmit={submitHandler} className='flex flex-col gap-4' >
        <input type="text" placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange} required/>
        <input type="email" placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange} required/>
        <input type="password" placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} required/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'Loading...' :'Sign Up'}</button>
        <Oath />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an Account?</p>
        <Link to='/signin'>
          <span className='text-blue-700' >Sign In</span>
        </Link> 
      </div>
      {error &&  <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default SignUp;