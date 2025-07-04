import React from 'react'
import Image from 'next/image'

const WhatsappIcon = () => {
  return (
    <div className="!w-5 !h-5 mx-0 relative">
      <Image
        src="/images/whatsapp.png"
        alt="WhatsApp Icon"
        layout="fill"
        objectFit="contain"
        priority
      />
    </div>
  )
}

export default WhatsappIcon
