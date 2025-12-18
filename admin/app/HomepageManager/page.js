"use client";
import * as React from "react";
import { useState, useEffect } from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Switch from "@mui/material/Switch";
import Image from "next/image";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import CheckIcon from "@mui/icons-material/Check";
import {
  fetchDataFromApi,
  postData,
  editData,
  deleteMultipleData,
} from "@/utils/api";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [alignment, setAlignment] = useState("bestsellers");

  const [selectedItems, setSelectedItems] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);

  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [open, setOpen] = useState(false);

  // =============================
  // DATA LOGIC (UNCHANGED)
  // =============================
  const loadAllProducts = async () => {
    const res = await fetchDataFromApi(`/api/product/gaps`);
    if (res.success) {
      setAllProducts(res.data.reverse());
      setFilteredProducts(res.data);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadSectionItems = async () => {
    const res = await fetchDataFromApi(
      `/api/home-sections?sectionName=${alignment}`
    );
    if (res.success) {
      setSelectedItems(
        res.data.map((item) => ({
          ...item,
          productData: item.product, // ✅ keep product nested
          status: item.enabled,
        }))
      );
    }
  };

  useEffect(() => {
    loadSectionItems();
  }, [alignment]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(allProducts);
      return;
    }
    setFilteredProducts(
      allProducts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, allProducts]);

  const availableProducts = filteredProducts.filter(
    (prd) => !selectedItems.some((s) => s.productId === prd._id)
  );

  const toggleLeftSelection = (prd) => {
    setLeftSelected((prev) =>
      prev.some((i) => i._id === prd._id)
        ? prev.filter((i) => i._id !== prd._id)
        : [...prev, prd]
    );
  };

  const handleAddSelected = () => {
    if (!leftSelected.length) return alert("Select at least 1 item");
    setOpen(true);
  };

  const confirmAdd = async () => {
    await Promise.all(
      leftSelected.map((prd, idx) =>
        postData(`/api/home-sections`, {
          sectionName: alignment,
          productId: prd._id,
          enabled: true,
          index: selectedItems.length + idx,
        })
      )
    );
    setLeftSelected([]);
    setOpen(false);
    loadSectionItems();
  };

  const deleteItem = async (id) => {
    await deleteMultipleData(`/api/home-sections/${id}`, {});
    setSelectedItems((prev) => prev.filter((i) => i._id !== id));
  };

  const toggleStatus = async (id, status) => {
    await editData(`/api/home-sections/${id}`, { enabled: !status });
    setSelectedItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, status: !status } : i))
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setSelectedItems((prev) => {
      const arr = [...prev];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
      return arr;
    });
  };

  const moveDown = (index) => {
    if (index === selectedItems.length - 1) return;
    setSelectedItems((prev) => {
      const arr = [...prev];
      [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
      return arr;
    });
  };

  const applyOrder = async () => {
    await postData(`/api/home-sections/reorder`, {
      items: selectedItems.map((i, idx) => ({ id: i._id, index: idx })),
    });
    alert("Order applied");
    loadSectionItems();
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
            Manage Home Sections
          </h1>
          <p className="text-sm text-slate-500">
            Control which products appear on homepage sections
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleAddSelected}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <AddIcon fontSize="small" />
            Add Selected ({leftSelected.length})
          </button>

          <button
            onClick={applyOrder}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
          >
            <CheckIcon fontSize="small" />
            Apply Order
          </button>
        </div>
      </div>

      {/* TABS */}
      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={(e, v) => v && setAlignment(v)}
        fullWidth
        className="mb-4 bg-white rounded-lg shadow-sm"
      >
        <ToggleButton value="bestsellers">Customer Favorites</ToggleButton>
        <ToggleButton value="trendingNow">Trending Now</ToggleButton>
        <ToggleButton value="dealsOfTheWeek">Hot Deals</ToggleButton>
        <ToggleButton value="curatedLook">Curated Looks</ToggleButton>
      </ToggleButtonGroup>

      {/* SEARCH */}
      <div className="flex items-center gap-2 h-11 px-4 bg-white border border-slate-200 rounded-lg shadow-sm mb-4">
        <SearchIcon className="text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 font-semibold border-b">Available Products</div>
          <div className="max-h-[65vh] overflow-auto">
            {availableProducts.map((prd) => {
              const active = leftSelected.some((i) => i._id === prd._id);
              return (
                <div
                  key={prd._id}
                  onClick={() => toggleLeftSelection(prd)}
                  className={`flex gap-3 p-3 border-b cursor-pointer ${
                    active ? "bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <Image
                    src={prd.images?.[0] || "/fallback.png"}
                    width={60}
                    height={60}
                    className="rounded-md border"
                    alt={prd.name}
                  />
                  <div>
                    <div className="font-medium">{prd.name}</div>
                    <div className="text-xs text-slate-500">{prd.brand}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3 font-semibold border-b">Selected Products</div>

          {selectedItems.map((item, idx) => (
            <div
              key={item._id}
              className="grid grid-cols-[50px_80px_1fr_80px_160px] items-center p-3 border-b"
            >
              <div className="text-center font-semibold">{idx + 1}</div>

              <Image
                src={item.productData?.images?.[0] || "/fallback.png"}
                width={60}
                height={60}
                className="rounded-md border"
                alt={item.productData.name}
              />

              <div className="font-medium">{item.productData?.name}</div>

              <Switch
                checked={!!item.status}
                onChange={() => toggleStatus(item._id, item.status)}
              />

              <div className="flex gap-2 justify-end">
                <button onClick={() => moveUp(idx)}>
                  <ArrowUpwardIcon />
                </button>
                <button onClick={() => moveDown(idx)}>
                  <ArrowDownwardIcon />
                </button>
                <button
                  onClick={() => deleteItem(item._id)}
                  className="text-red-600 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIRM DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Add</DialogTitle>
        <DialogContent>
          Add <strong>{leftSelected.length}</strong> items to this section?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={confirmAdd}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
