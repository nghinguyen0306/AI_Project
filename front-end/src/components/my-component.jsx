import React from 'react';
const MyComponent = ()=> {
    return (
        <div>
            my component
        </div>
    )
}

// src/app/page.jsx or another file where you use the UploadPage component
// src/app/page.jsx or another file where you use the UploadPage component

import dynamic from 'next/dynamic';

const UploadPage = dynamic(() => import('./upload'), { 
    ssr: false // This ensures the component is only rendered on the client side
});

export default function UploadPage() {
    return (
        <div>
            <h1>Upload Page</h1>
            <UploadPage />
        </div>
    );
}
  
