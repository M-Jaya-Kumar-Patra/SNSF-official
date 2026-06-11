import React, { useRef, useState } from "react";
import { FaImage } from "react-icons/fa";
import { uploadImages } from "@/utils/api";

const ImageUploader = ({ uploadUrl = "/api/image/upload", onUploaded }) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setError(
      validFiles.length !== files.length
        ? "Some files were skipped due to size/type restrictions."
        : ""
    );
    setSelectedImages(validFiles);
    setPreviewUrls(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleUpload = async () => {
    if (!selectedImages.length) {
      setError("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    selectedImages.forEach((file) => formData.append("images", file));

    setUploading(true);
    const response = await uploadImages(uploadUrl, formData);
    setUploading(false);

    if (response?.error) {
      setError(response.message || "Upload failed. Try again.");
      return;
    }

    setError("");
    onUploaded?.(response);
  };

  return (
    <div className="flex gap-4 rounded-xl bg-[var(--admin-surface)] p-4">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />

      <button
        type="button"
        className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--admin-border)] text-[var(--admin-muted)] transition hover:bg-[var(--admin-surface-soft)]"
        onClick={() => fileInputRef.current?.click()}
      >
        <FaImage className="mb-2 text-4xl text-[var(--admin-accent)]" />
        <span className="text-xs font-semibold">Images</span>
      </button>

      <div className="min-w-0 flex-1">
        {error && <p className="mb-2 text-sm text-red-500">{error}</p>}

        <div className="flex gap-2 overflow-auto">
          {previewUrls.map((url, index) => (
            <img
              key={`${url}-${index}`}
              src={url}
              alt={`Preview ${index + 1}`}
              className="h-28 w-28 rounded-xl border border-[var(--admin-border)] object-cover"
            />
          ))}
        </div>

        {selectedImages.length > 0 && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="mt-3 rounded-xl bg-[var(--admin-accent)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
