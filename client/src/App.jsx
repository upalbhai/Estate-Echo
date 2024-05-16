
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import About from './pages/About'
import Header from './components/Header'
import { PrivateRoute } from './components/PrivateRoute'

import MyCustomToaster from './components/MyCustomToaster'
import { CreateListing } from './pages/CreateListing'
import { UpdateListing } from './pages/UpdateListing'
import { Listing } from './pages/Listing'
import { Search } from './pages/Search'
import Footer from './components/Footer'
// import { useEffect } from 'react';
// import { useDispatch,useSelector } from 'react-redux';
function App() {
  
  return (
    <BrowserRouter>
    
    <MyCustomToaster/>
    <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />} >
          
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />

        </Route>
        
        <Route path="/about" element={<About />} />
        
      </Routes>
    <Footer />
    </BrowserRouter>
  )
}

export default App
