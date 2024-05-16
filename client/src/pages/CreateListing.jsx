import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { app } from '../firebase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
export const CreateListing = () => {
    const navigate = useNavigate();
    const {currentUser} = useSelector(state=>state.user)
    const [files,setFiles] = useState([])
    // (files);

    const [formData,setFormData] = useState({
        imageUrls:[],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:5000,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false,
    })
    // console.group(formData)
    const [error,setError] = useState(false);
    const [loading,setLoading] = useState(false)
    const [imageUploadError,setImageUploadError]=useState(false)
    const [uploading,setUploading] = useState(false)
    const handleImageSubmit = (e) => {
        if (files.length === 0) {
            setImageUploadError("Please select at least one Image");
            toast.error('Please select at least one Image');
        } else if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];
    
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
    
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setUploading(false);
                })
                .catch(() => {
                    setImageUploadError('Image upload failed. Please try again.');
                    setUploading(false);
                    toast.error('Image upload failed. Please try again.');
                });
    
        } else {
            setImageUploadError('You can upload only 6 images per listing');
            setUploading(false);
            toast.error('You can upload only 6 images per listing');
        }
    }
    
    const storeImage = async(file)=>{
        return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName= new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                (`Upload is ${progress}% done`);
              },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL)
                })
            }
        )
        })
        
    }

      const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };
  (formData)
    const handleChange =(e)=>{
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }
        if(e.target.id==='parking' || e.target.id==='offer' || e.target.id==='furnished'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if(e.target.type==='number' || e.target.type==='textarea' || e.target.type==='text'){
            setFormData({
                ...formData,
                [e.target.id] : e.target.value,
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          if (formData.imageUrls.length < 1 || uploading )
             {
                return toast.error('you must have to submit atleast one image');
             }
          if (+formData.regularPrice < +formData.discountPrice)
            return toast.error('Discount price must be lower than regular price');
          setLoading(true);
          setError(false);
          const res = await fetch('/api/listing/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...formData,
              userRef: currentUser._id,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success === false) {
            setError(data.message);
            toast.error(data.message)
          }
          navigate(`/listing/${data._id}`);
          toast.success("Listing Created Successfully")
        } catch (error) {
          setError(error.message);
          setLoading(false);
          toast.error(error.message)
        }
      };

  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 ' >
            <div className='flex flex-col gap-4 flex-1'>
                <input onChange={handleChange} value={formData.name} type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62'minLength='10' required />
                <textarea onChange={handleChange} value={formData.description} className='border p-3 rounded-lg' type='text' placeholder='Description' name="" id="description"></textarea>
                <input onChange={handleChange} value={formData.address} type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' maxLength='62'minLength='10' required />
                <div className='flex flex-wrap gap-6' >
                    <div className='flex gap-2'>
                        <input onChange={handleChange} checked={formData.type==='sale'} type="checkbox" className='w-5' id='sale' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='rent' onChange={handleChange} checked={formData.type==='rent'} />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='parking' onChange={handleChange} value={formData.parking} />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='furnished' onChange={handleChange} value={formData.furnished} />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" className='w-5' id='offer' onChange={handleChange} value={formData.offer} />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6' >
                    <div className='flex items-center gap-2' > 
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
                        <p>Bedrooms</p>
                    </div>
                    <div className='flex items-center gap-2' > 
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
                        <p>Bathrooms</p>
                    </div>
                    <div className='flex items-center gap-2' > 
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='regularPrice' min='4000' max='1000000000' onChange={handleChange} value={formData.regularPrice} required />
                        <div className='flex flex-col items-center' >
                            <p>Regular Price</p>
                            <span>(₹ / month)</span>
                        </div>
                        
                    </div>
                    {
                        formData.offer && (
                            <div className='flex items-center gap-2' > 
                        <input className='p-3 border border-gray-300 rounded-lg' type="number" id='discountPrice' min='0' max='1000000' onChange={handleChange} value={formData.discountPrice} required />
                        <div className='flex flex-col items-center' >
                            <p>Discount Price</p>
                            <span>(₹ / month)</span>
                        </div>
                    </div>
                        )
                    }
                    
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold' >Images:
                    <span className='font-normal text-grey-600 ml-2' >The first Image will be cover(max 6)</span>
                </p>
                <div className='flex gap-4' >
                    <input disabled={uploading} onChange={(e)=>setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type="file" name="" id="images" accept="image/*" multiple required />
                    <button type='button' onClick={handleImageSubmit} className='text-green-700 p-3 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{uploading ?  'Uploading' : 'upload'}</button>
                </div>
                {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
                <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80' >{loading ? 'Creating' : 'Create Listing'}</button>
            </div>
        </form>
    </main>
  )
}
