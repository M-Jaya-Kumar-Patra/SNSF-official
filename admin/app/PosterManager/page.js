"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { IoMdClose } from "react-icons/io";

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Switch,
} from "@mui/material";

import UploadBox from "@/components/UploadBox";
import { fetchDataFromApi, postData, deleteData, putData } from "@/utils/api";
import { useAlert } from "@/app/context/AlertContext";

const PosterManager = () => {
  const alert = useAlert();

  const [posters, setPosters] = useState([]);
  const [form, setForm] = useState({
    image: [],
    name: "",
    index: 0,
    url: "",
    enabled: true,
  });
  const [preview, setPreview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  // =============================
  // DATA LOGIC (UNCHANGED)
  // =============================
  const getData = async () => {
    const res = await fetchDataFromApi("/api/poster/getAll");
    setPosters(res?.data || []);
  };

  useEffect(() => {
    getData();
  }, []);

  const setPreviewsFun = (imageUrls) => {
    setPreview(imageUrls);
    setForm((prev) => ({ ...prev, image: imageUrls }));
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image.length)
      return alert.alertBox({ type: "error", msg: "Please upload an image" });

    if (!form.name.trim())
      return alert.alertBox({ type: "error", msg: "Please enter name" });

    const res = await postData("/api/poster/create", form, true);

    if (!res.error) {
      alert.alertBox({ type: "success", msg: "Created successfully" });
      setShowModal(false);
      setPreview([]);
      setForm({ image: [], name: "", index: 0, url: "", enabled: true });
      getData();
    } else {
      alert.alertBox({ type: "error", msg: res.message });
    }
  };

  const confirmDelete = async () => {
    const res = await deleteData(`/api/poster/${selectedId}`);
    if (!res.error) {
      alert.alertBox({ type: "success", msg: "Deleted successfully" });
      getData();
    }
    setDeleteDialog(false);
  };

  const moveItem = (index, direction) => {
    setPosters((prev) => {
      const arr = [...prev];
      if (direction === "up" && index > 0)
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      if (direction === "down" && index < arr.length - 1)
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const applyOrder = async () => {
    const itemsToUpdate = posters.map((i, idx) => ({ id: i._id, index: idx }));
    await postData("/api/poster/reorder", { posters: itemsToUpdate });
    alert.alertBox({ type: "success", msg: "Order applied!" });
    getData();
  };

  // =============================
  // UI (REFINED)
  // =============================
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 px-6 py-4">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Poster Manager
          </h1>
          <p className="text-sm text-slate-500">
            Manage homepage posters and banners
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <AddIcon fontSize="small" /> Add Poster
          </button>

          <button
            onClick={applyOrder}
            className="flex items-center gap-2 bg-blue-600 hover:bg-slate-900 text-white px-4 py-2 rounded-lg shadow"
          >
            Save Order
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 rounded-lg shadow-sm mb-4">
        <SearchIcon className="text-slate-400" />
        <input
          type="text"
          placeholder="Search poster..."
          className="w-full outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
        />
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-center border-collapse">
          <thead className="bg-slate-100 text-slate-700 text-sm">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">URL</th>
              <th className="p-3">Name</th>
              <th className="p-3">Index</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {posters
              .filter((p) => p.name.toLowerCase().includes(search))
              .map((poster, idx) => (
                <tr
                  key={poster._id}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="p-3">
                    <Image
                      src={poster.image[0]}
                      width={120}
                      height={80}
                      className="rounded-md object-cover mx-auto cursor-pointer"
                      alt="poster"
                      onClick={() => window.open(poster.url, "_blank")}
                    />
                  </td>

                  <td className="p-3 text-sm break-all">{poster.url}</td>
                  <td className="p-3 font-medium">{poster.name}</td>
                  <td className="p-3 font-semibold">{poster.index}</td>

                  <td className="p-3">
                    <Switch
                      checked={poster.status}
                      onChange={async () => {
                        const updated = posters.map((i) =>
                          i._id === poster._id
                            ? { ...i, status: !i.status }
                            : i
                        );
                        setPosters(updated);

                        const res = await putData(
                          `/api/poster/${poster._id}`,
                          { status: !poster.status }
                        );

                        if (res.error) {
                          alert.alertBox({
                            type: "error",
                            msg: res.message || "Update failed",
                          });
                          setPosters(posters);
                        }
                      }}
                    />
                  </td>

                  <td className="p-3 flex justify-center gap-3">
                    <ArrowUpwardIcon
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => moveItem(idx, "up")}
                    />
                    <ArrowDownwardIcon
                      className="cursor-pointer hover:text-blue-600"
                      onClick={() => moveItem(idx, "down")}
                    />
                    <DeleteOutlineIcon
                      className="cursor-pointer text-red-600"
                      onClick={() => {
                        setSelectedId(poster._id);
                        setDeleteDialog(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRM */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ADD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
          <div className="w-[650px] bg-white rounded-xl p-6 max-h-[90%] overflow-auto">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2 border-b pb-2">
              <IoMdClose
                className="cursor-pointer"
                onClick={() => setShowModal(false)}
              />
              Add New Poster
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="font-semibold mb-2">Upload Image</div>

              <div className="grid grid-cols-4 gap-4 mb-4">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <span
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center cursor-pointer"
                      onClick={() => {
                        const updated = preview.filter((_, idx) => idx !== i);
                        setPreview(updated);
                        setForm((prev) => ({ ...prev, image: updated }));
                      }}
                    >
                      <IoMdClose />
                    </span>
                    <img
                      src={img}
                      className="w-full h-[150px] object-cover rounded-md border"
                    />
                  </div>
                ))}

                <UploadBox
                  multiple
                  name="images"
                  url="/api/poster/uploadImages"
                  setPreviewsFun={setPreviewsFun}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  label="Name"
                  name="name"
                  size="small"
                  value={form.name}
                  onChange={handleInput}
                />
                <TextField
                  label="Index"
                  name="index"
                  size="small"
                  type="number"
                  value={form.index}
                  onChange={handleInput}
                />
              </div>

              <TextField
                label="Redirect URL"
                name="url"
                size="small"
                className="w-full mt-4"
                value={form.url}
                onChange={handleInput}
              />

              <div className="flex justify-between items-center mt-4">
                <span className="font-semibold">Enabled</span>
                <Switch
                  checked={form.enabled}
                  onChange={() =>
                    setForm((prev) => ({
                      ...prev,
                      enabled: !prev.enabled,
                    }))
                  }
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowModal(false);
                    setPreview([]);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="contained" color="success" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosterManager;
