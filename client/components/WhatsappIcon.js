import React from 'react'
import Image from 'next/image'

const WhatsappIcon = () => {
  return (
    <div className="w-6 h-6 mx-2 relative">
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
