import React, { useState } from "react";
import { PiFilePdfBold } from "react-icons/pi";
import { useAlert } from "@/app/context/AlertContext";
import { uploadImages } from "@/utils/api"; // You can rename this to uploadFiles if needed

const PDFUploadBox = (props) => {
  const [uploading, setUploading] = useState(false);
  const alert = useAlert();

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const file = e.target.files[0];

      if (!file || file.type !== "application/pdf") {
        alert.alertBox("error", "Please select a valid PDF file.");
        return;
      }

      const formData = new FormData();
      console.log("KKKKkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",file)
      formData.append(props?.name || "pdf", file);

      setUploading(true);

      const res = await uploadImages(apiEndPoint, formData);

      if (res?.file || res?.url || res?.pdf) {
        alert.alertBox({ type: "success", msg: "PDF uploaded successfully" });
        props.setPreviewFun(res?.file || res?.url || res?.pdf);
      } else {
        alert.alertBox("error", "Failed to upload PDF.");
      }

      setUploading(false);
    } catch (err) {
      console.error(err);
      alert.alertBox("error", "Something went wrong during PDF upload.");
      setUploading(false);
    }
  };

  return (
    <div className='uploadBox p-3 rounded-md border border-dashed border-gray-400 h-[150px] w-full bg-gray-100 hover:bg-gray-200 cursor-pointer flex items-center justify-center flex-col relative'>
      <PiFilePdfBold className='text-[40px] text-red-600 opacity-70 pointer-events-none' />
      <h4 className='text-[14px] text-black pointer-events-none'>{uploading ? "Uploading..." : "Upload PDF"}</h4>

      <input
        type="file"
        accept="application/pdf"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => onChangeFile(e, props?.url)}
        name={props?.name || "pdf"}
      />
    </div>
  );
};

export default PDFUploadBox;
