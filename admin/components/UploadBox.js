import React, { useState } from "react";
import { FaRegImages } from "react-icons/fa6";
import { useAlert } from "@/app/context/AlertContext";
import { uploadImages } from "@/utils/api";


const UploadBox = (props) => {
    const [previews, setPreviews] = useState([])
    const [uploading, setUploading] = useState(false)

    const alert = useAlert();
    

    let selectedImages = [];

    const formData = new FormData();

    const  onChangeFile = async (e, apiEndPoint) =>{
        try {
            setPreviews([]);
            const files = e.target.files;

            console.log(files)
            setUploading(true);

            for(var i = 0; i<files.length; i++){
                if(files[i] && ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(files[i].type)){
                    const file = files[i];
                    
                    selectedImages.push(file);
                    formData.append(props?.name, file)
                    console.log("hii loop") 

                }else{
                    alert.alertBox("error", "Please select a valid JPG, PNG or webp image file.")
                    setUploading(false);
                    return false
                }
            }

            uploadImages(apiEndPoint, formData).then((res) => {
                console.log("hi fun")
              setUploading(false);
              console.log(res?.images )
              props.setPreviewsFun( res?.images )
            }
            )
        } catch (error) {
            console.log(error)
            
        }
    }

    return (
        <div className='uploadBox p-3 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative'>
            <FaRegImages className='text-[40px] opacity-35 pointer-events-none' />
            <h4 className='text-[14px] pointer-events-none'>Image Upload</h4>
            
            <input
                type='file' accept="image/*"
                multiple={props.multiple !== undefined ? props.multiple : false}
                className='absolute top-0 left-0 w-full h-full z-50 opacity-0'
                onChange={(e)=>
                    onChangeFile(e, props?.url)
                }
                name = {props?.name}
            />
        </div>
    );
};

export default UploadBox;
