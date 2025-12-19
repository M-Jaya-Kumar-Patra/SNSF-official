"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { IoMdClose } from "react-icons/io";
import { 
  CircularProgress, LinearProgress, Box, Typography,
  Dialog, DialogActions, DialogTitle, Button, TextField, ToggleButton, ToggleButtonGroup 
} from "@mui/material";

import { fetchDataFromApi, postData, deleteData } from "@/utils/api";
import { useAlert } from "@/app/context/AlertContext";

const VideoManager = () => {
  const alert = useAlert();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [mode, setMode] = useState('upload'); 
  const [form, setForm] = useState({
    title: "",
    description: "",
    videoFile: null, 
    youtubeLink: "",
    isActive: true,
  });

  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const getData = async () => {
    setLoading(true);
    const res = await fetchDataFromApi("/api/videos/getAll");
    setVideos(res?.data || []);
    setLoading(false);
  };

  useEffect(() => { getData(); }, []);

  const handleModeChange = (e, newMode) => {
    if (newMode) setMode(newMode);
  };

  const extractYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // --- HELPER: Upload with Progress (XHR) ---
  const uploadFileWithProgress = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("video", file);
      const token = localStorage.getItem("accessToken");

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/api/videos/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(new Error("Upload failed"));
        }
      };

      xhr.onerror = () => reject(new Error("Network Error"));
      xhr.send(formData);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert.alertBox({ type: "error", msg: "Title is required" });

    setUploading(true);
    setUploadProgress(0);

    try {
      let payload = {
        title: form.title,
        description: form.description,
        isActive: form.isActive,
        sourceType: mode,
      };

      // --- CASE 1: YOUTUBE ---
      if (mode === 'youtube') {
        const yId = extractYoutubeId(form.youtubeLink);
        if (!yId) throw new Error("Invalid YouTube URL");
        
        payload.videoUrl = yId; 
        // Use hqdefault because maxresdefault is not always available
        payload.thumbnail = `https://img.youtube.com/vi/${yId}/hqdefault.jpg`; 
      } 
      // --- CASE 2: FILE UPLOAD ---
      else {
        if (!form.videoFile) throw new Error("Please select a file");
        
        // Use the custom XHR uploader for progress
        const uploadData = await uploadFileWithProgress(form.videoFile);
        
        if (!uploadData.success) throw new Error(uploadData.message);

        payload.videoUrl = uploadData.url;
        payload.thumbnail = uploadData.thumbnail;
        payload.publicId = uploadData.publicId;
      }

      // Save to DB
      const createRes = await postData("/api/videos/create", payload, true);
      if (!createRes.error) {
        alert.alertBox({ type: "success", msg: "Video saved!" });
        setShowModal(false);
        setForm({ title: "", description: "", videoFile: null, youtubeLink: "", isActive: true });
        getData();
      } else {
        alert.alertBox({ type: "error", msg: createRes.message });
      }

    } catch (error) {
      console.error(error);
      alert.alertBox({ type: "error", msg: error.message || "Something went wrong" });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const confirmDelete = async () => {
    await deleteData(`/api/videos/${selectedId}`);
    setDeleteDialog(false);
    getData();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-black" >Video Manager</h1>
        <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <AddIcon /> Add Video
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-black">
            <thead className="bg-slate-100 border-b">
                <tr>
                    <th className="p-3">Video</th>
                    <th className="p-3">Details</th>
                    <th className="p-3">Source</th>
                    <th className="p-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {videos.map(v => {
                    // Determine the clickable URL
                    const linkUrl = v.sourceType === 'youtube' 
                        ? `https://www.youtube.com/watch?v=${v.videoUrl}`
                        : v.videoUrl;

                    return (
                    <tr key={v._id} className="border-b hover:bg-slate-50">
                        {/* THUMBNAIL (Clickable) */}
                        <td className="p-3 w-[120px]">
                            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="block relative w-24 h-14 bg-black rounded overflow-hidden group border border-slate-200">
                                <Image 
                                    src={v.thumbnail || "/placeholder.jpg"} 
                                    fill 
                                    className="object-cover group-hover:opacity-80 transition" 
                                    alt="thumb" 
                                    unoptimized // Fixes some external image issues
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/30">
                                    <OpenInNewIcon className="text-white text-sm"/>
                                </div>
                            </a>
                        </td>

                        {/* DETAILS */}
                        <td className="p-3">
                            <a href={linkUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-blue-600 hover:underline flex items-center gap-1">
                                {v.title}
                                <OpenInNewIcon fontSize="inherit" className="text-slate-400 text-[10px]"/>
                            </a>
                            <div className="text-xs text-slate-500 max-w-[300px] truncate">{v.description}</div>
                        </td>

                        {/* SOURCE */}
                        <td className="p-3">
                            {v.sourceType === 'youtube' ? 
                                <span className="text-red-600 flex items-center gap-1 text-xs font-bold"><YouTubeIcon fontSize="small"/> YouTube</span> : 
                                <span className="text-blue-600 flex items-center gap-1 text-xs font-bold"><CloudUploadIcon fontSize="small"/> Upload</span>
                            }
                        </td>

                        {/* ACTIONS */}
                        <td className="p-3 text-right">
                            <DeleteOutlineIcon className="text-red-500 cursor-pointer hover:scale-110 transition" onClick={() => { setSelectedId(v._id); setDeleteDialog(true); }} />
                        </td>
                    </tr>
                )})}
            </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white w-[500px] rounded-xl p-6 relative">
                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Add Video</h2>
                    {!uploading && <IoMdClose className="cursor-pointer text-2xl" onClick={() => setShowModal(false)} />}
                </div>

                {uploading ? (
                    <div className="text-center py-8">
                        <Box sx={{ width: '100%', mb: 2 }}>
                            <LinearProgress variant="determinate" value={uploadProgress} sx={{height: 10, borderRadius: 5}}/>
                        </Box>
                        <Typography variant="h6" color="text.secondary">{uploadProgress}% Uploaded</Typography>
                        <p className="text-xs text-slate-400 mt-2">Please wait, do not close this window...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <ToggleButtonGroup value={mode} exclusive onChange={handleModeChange} fullWidth size="small">
                            <ToggleButton value="upload"><CloudUploadIcon className="mr-2"/> Upload File</ToggleButton>
                            <ToggleButton value="youtube"><YouTubeIcon className="mr-2 text-red-600"/> YouTube Link</ToggleButton>
                        </ToggleButtonGroup>

                        <TextField label="Title" size="small" fullWidth value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
                        <TextField label="Description" multiline rows={2} size="small" fullWidth value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />

                        {mode === 'youtube' ? (
                             <TextField label="YouTube URL" placeholder="Paste link (Shorts supported)" size="small" fullWidth value={form.youtubeLink} onChange={(e) => setForm({...form, youtubeLink: e.target.value})} />
                        ) : (
                            <div className="border-2 border-dashed border-slate-300 p-6 text-center rounded cursor-pointer relative hover:bg-slate-50 transition">
                                <input type="file" accept="video/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setForm({...form, videoFile: e.target.files[0]})} />
                                <div className="pointer-events-none">
                                    <CloudUploadIcon className="text-4xl text-slate-400 mb-2"/>
                                    <p className="text-sm font-medium text-slate-600">{form.videoFile ? form.videoFile.name : "Click to select video"}</p>
                                    <p className="text-xs text-slate-400 mt-1">Max 50MB</p>
                                </div>
                            </div>
                        )}

                        <Button type="submit" variant="contained" color="primary" size="large" className="mt-2">
                            {mode === 'youtube' ? 'Save Link' : 'Upload Video'}
                        </Button>
                    </form>
                )}
            </div>
        </div>
      )}
      
      {/* DELETE CONFIRM */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogActions>
            <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default VideoManager;