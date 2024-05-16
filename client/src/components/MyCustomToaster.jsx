import React from 'react';
import { Toaster } from 'react-hot-toast';
import '../styles/MyCustomToaster.css';

const MyCustomToaster = () => {
  return (
    <div>
      {/* Your other components */}
      <Toaster
        className="my-toaster"
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          zIndex: 9999, // Ensure the toaster is above other elements
        }}
        toastOptions={{
          // Define default options for the toasts
          duration: 5000,
        }}
      />
    </div>
  );
};

export default MyCustomToaster;
