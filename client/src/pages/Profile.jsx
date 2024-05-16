import React, { useRef, useState, useEffect } from 'react';

import { getStorage, ref, uploadBytesResumable,getDownloadURL } from 'firebase/storage';
import { app } from '../firebase';
import { deleteUserFailure, deleteUserStart, deleteUserSuccess,signOutUserSuccess, signOutUserFailure, signOutUserStart, updateUserFailure,updateUserStart,updateUserSuccess } from '../redux/user/userSlice';
import { useDispatch,useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
    const dispatch = useDispatch();
    const fileRef = useRef(null);
    const { currentUser,loading,error } = useSelector((state) => state.user);
    const [file, setFile] = useState(null);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError,setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess,setUpdateSuccess] = useState(false);
    const [showListingsError,setShowListingsError] = useState(false)
    
    const [userListings,setUserListings]=useState([

    ])

    const handleChange =(e)=>{
        setFormData({...formData,[e.target.id]: e.target.value})
    }
    console.log(formData)
    console.log(filePerc)
    useEffect(() => {
        if (file) {
            handleUpload(file);
        }
    }, [file]);

    const handleUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setFilePerc(Math.round(progress));
            },
            (error) => {
              setFileUploadError(true);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                setFormData({ ...formData, avatar: downloadURL })
              );
            }
          );
    };

    const handleSubmit = async (e)=>{
      e.preventDefault();
      try {
        dispatch(updateUserStart());
        const res = await fetch(`/api/user/update/${currentUser._id}`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body:JSON.stringify(formData),
        });
        const data = await res.json();
        if(data.success === false){
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data))
        setUpdateSuccess(true);
        toast.success('User update successfully')
      } catch (error) {
        dispatch(updateUserFailure(error.message));
        toast.error(error.message)
      }
    }
    const handleDelete = async () => {
      try {
        dispatch(deleteUserStart());
        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess(data));
        toast.success('Account deleted successfully')
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    };
    const handleSignOut=async()=>{
      try {
        dispatch(signOutUserStart());
        const res= await fetch('/api/auth/signout');
        const data = await res.json();
        if(data.success===false){
          dispatch(signOutUserFailure(data.message));
          return;
        }
        dispatch(signOutUserSuccess(data));
        toast.success("Sign out successfully")
      } catch (error) {
        dispatch(signOutUserFailure(data.message));
        toast.error('There is an error in signin out')
      }
    }

    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if(data==""){
          return toast.error('you does not have any listings')
        }
        if (data.success === false) {
          setShowListingsError(true);
          toast.error("Error occures")
          return;
        }
  
        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };
    
    const handleListingDelete = async (listingId) => {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success === false) {
          toast.error(data.message)
          return;
        }
        toast.success('Listing deleted successfully')
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId)
        );
      } catch (error) {
        toast.error(error.message);
      }
    };

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4' action=''>
                <input type='file' onChange={(e) => setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
                <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
                <input type='text' defaultValue={currentUser.username} placeholder='username' id='username' className='border p-3 rounded-lg' onChange={handleChange}/>
                <input type='email' defaultValue={currentUser.email} placeholder='email' id='email' className='border p-3 rounded-lg' onChange={handleChange}/>
                <input type='password' placeholder='password' id='password' className='border p-3 rounded-lg' defaultValue={currentUser.password} onChange={handleChange} />
                <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>{loading ? 'loading...' :'Update'} </button>
                <Link to={'/create-listing'} className='bg-green-700 text-white rounded-lg p-3 text-center hover:opacity-95 uppercase' >
                  Create Lisitng
                </Link>
            </form>
            <div className='flex justify-between mt-5'>
                <span onClick={handleDelete} className='text-red-700 cursor-pointer'>Delete Account</span>
                <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
            </div>
            <button onClick={handleShowListings}  className='text-green-700 w-full ' >Show Listing</button>
            {/* <p className='text-red-700 mt-5' >{error ? error : ""}</p> */}
            {/* <p className='text-green-700 mt-5' >{updateSuccess ? 'User update successfully' : ''}</p> */}
            {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
</div>

        

    );
};

export default Profile;
