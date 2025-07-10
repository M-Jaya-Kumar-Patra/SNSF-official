import React, { useState, useRef } from 'react';
import { FaImage } from 'react-icons/fa';
import Image from "next/image";


const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError('Some files were skipped due to size/type restrictions.');
    } else {
      setError('');
    }

    setSelectedImages(validFiles);
    setPreviewUrls(validFiles.map(file => URL.createObjectURL(file)));
  };
  const getOptimizedCloudinaryUrl = (url) => {
    if (!url?.includes("res.cloudinary.com")) return url;
    return url.replace("/upload/", "/upload/w_800,h_800,c_fit,f_auto,q_90/");
  };


  return (
    <div className="p-6 py-3 pt-1  mx-auto bg-white rounded-xl  space-x-4 flex">

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Stylized upload box */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 h-28 w-28 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
        onClick={() => fileInputRef.current.click()}
      >
        <FaImage className="text-4xl text-blue-500 mb-2" />
        <span className="text-gray-600"></span>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-2 overflow-auto scrollbar-hide">
        {previewUrls.map((url, idx) => (
          <Image
            key={idx}
            src={getOptimizedCloudinaryUrl(url)}
            alt={`Preview ${idx}`}
            className="w-28 h-28 rounded border"
            width={100}
            height={100}
          />
        ))}
      </div>

      
    </div>
  );
};

export default ImageUploader;
