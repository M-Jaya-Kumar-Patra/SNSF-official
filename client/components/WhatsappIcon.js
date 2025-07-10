import React from 'react'
import Image from 'next/image'

const WhatsappIcon = () => {

const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };

  
  return (
    <div className="!w-5 !h-5 mx-0 relative">
      <Image
        src={getOptimizedCloudinaryUrl("/images/whatsapp.png")}
        alt="WhatsApp Icon"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>

    
  )
}

export default WhatsappIcon
