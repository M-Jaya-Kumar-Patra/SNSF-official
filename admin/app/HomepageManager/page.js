"use client";

import { useEffect, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Switch from "@mui/material/Switch";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Image from "next/image";
import {
  deleteMultipleData,
  editData,
  fetchDataFromApi,
  postData,
} from "@/utils/api";

const sections = [
  { value: "bestsellers", label: "Customer Favorites" },
  { value: "trendingNow", label: "Trending Now" },
  { value: "dealsOfTheWeek", label: "Hot Deals" },
  { value: "curatedLook", label: "Curated Looks" },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [alignment, setAlignment] = useState("bestsellers");
  const [selectedItems, setSelectedItems] = useState([]);
  const [leftSelected, setLeftSelected] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [open, setOpen] = useState(false);

  const loadAllProducts = async () => {
    const res = await fetchDataFromApi("/api/product/gaps");
    if (res.success) {
      setAllProducts([...(res.data || [])].reverse());
    }
  };

  const loadSectionItems = async () => {
    const res = await fetchDataFromApi(`/api/home-sections?sectionName=${alignment}`);
    if (res.success) {
      setSelectedItems(
        (res.data || []).map((item) => ({
          ...item,
          productData: item.product || null,
          status: item.enabled,
        }))
      );
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    loadSectionItems();
  }, [alignment]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const safeProducts = allProducts.filter(Boolean);
    if (!query) return safeProducts;
    return safeProducts.filter((product) =>
      (product?.name || "").toLowerCase().includes(query)
    );
  }, [searchQuery, allProducts]);

  const availableProducts = filteredProducts.filter(
    (product) => product?._id && !selectedItems.some((item) => item.productId === product._id)
  );

  const toggleLeftSelection = (product) => {
    setLeftSelected((prev) =>
      prev.some((item) => item._id === product._id)
        ? prev.filter((item) => item._id !== product._id)
        : [...prev, product]
    );
  };

  const handleAddSelected = () => {
    if (!leftSelected.length) {
      alert("Select at least 1 item");
      return;
    }
    setOpen(true);
  };

  const confirmAdd = async () => {
    await Promise.all(
      leftSelected.map((product, index) =>
        postData("/api/home-sections", {
          sectionName: alignment,
          productId: product._id,
          enabled: true,
          index: selectedItems.length + index,
        })
      )
    );

    setLeftSelected([]);
    setOpen(false);
    loadSectionItems();
  };

  const deleteItem = async (id) => {
    await deleteMultipleData(`/api/home-sections/${id}`, {});
    setSelectedItems((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleStatus = async (id, status) => {
    await editData(`/api/home-sections/${id}`, { enabled: !status });
    setSelectedItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, status: !status } : item))
    );
  };

  const moveUp = (index) => {
    if (index === 0) return;
    setSelectedItems((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index) => {
    if (index === selectedItems.length - 1) return;
    setSelectedItems((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const applyOrder = async () => {
    await postData("/api/home-sections/reorder", {
      items: selectedItems.map((item, index) => ({ id: item._id, index })),
    });
    alert("Order applied");
    loadSectionItems();
  };

  return (
    <div className="admin-page px-6 py-4">
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[var(--admin-accent)]">
            Homepage
          </p>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)]">
            Manage Home Sections
          </h1>
          <p className="text-sm text-[var(--admin-muted)]">
            Control which products appear on homepage sections.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleAddSelected}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
          >
            <AddIcon fontSize="small" />
            Add Selected ({leftSelected.length})
          </button>

          <button
            onClick={applyOrder}
            className="flex items-center gap-2 rounded-xl bg-[var(--admin-accent)] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[var(--admin-accent-strong)]"
          >
            <CheckIcon fontSize="small" />
            Apply Order
          </button>
        </div>
      </div>

      <ToggleButtonGroup
        value={alignment}
        exclusive
        onChange={(_, value) => value && setAlignment(value)}
        fullWidth
        className="mb-4 rounded-xl bg-[var(--admin-surface)] shadow-sm"
      >
        {sections.map((section) => (
          <ToggleButton key={section.value} value={section.value}>
            {section.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <div className="mb-4 flex h-11 items-center gap-2 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 shadow-sm">
        <SearchIcon className="text-[var(--admin-muted)]" />
        <input
          type="text"
          placeholder="Search products..."
          className="w-full bg-transparent text-sm text-[var(--admin-text)] outline-none placeholder:text-[var(--admin-muted)]"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm">
          <div className="border-b border-[var(--admin-border)] p-3 font-semibold text-[var(--admin-text)]">
            Available Products
          </div>
          <div className="max-h-[65vh] overflow-auto">
            {availableProducts.map((product) => {
              const active = leftSelected.some((item) => item._id === product._id);

              return (
                <button
                  type="button"
                  key={product._id}
                  onClick={() => toggleLeftSelection(product)}
                  className={`flex w-full gap-3 border-b border-[var(--admin-border)] p-3 text-left transition ${
                    active
                      ? "bg-blue-50 text-slate-950"
                      : "hover:bg-[var(--admin-surface-soft)]"
                  }`}
                >
                  <Image
                    src={product.images?.[0] || "/images/placeholder.jpg"}
                    width={60}
                    height={60}
                    className="rounded-md border border-[var(--admin-border)] object-cover"
                    alt={product.name || "Product image"}
                  />
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {product.name || "Untitled product"}
                    </div>
                    <div className="truncate text-xs text-[var(--admin-muted)]">
                      {product.brand || "S N Steel Fabrication"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm lg:col-span-2">
          <div className="border-b border-[var(--admin-border)] p-3 font-semibold text-[var(--admin-text)]">
            Selected Products
          </div>

          {selectedItems.length === 0 ? (
            <div className="p-8 text-center text-sm text-[var(--admin-muted)]">
              No products selected for this section.
            </div>
          ) : (
            selectedItems.map((item, index) => {
              const product = item.productData;

              return (
                <div
                  key={item._id}
                  className="grid grid-cols-[44px_72px_1fr_76px_150px] items-center border-b border-[var(--admin-border)] p-3"
                >
                  <div className="text-center font-semibold text-[var(--admin-muted)]">
                    {index + 1}
                  </div>

                  <Image
                    src={product?.images?.[0] || "/images/placeholder.jpg"}
                    width={60}
                    height={60}
                    className="rounded-md border border-[var(--admin-border)] object-cover"
                    alt={product?.name || "Missing product"}
                  />

                  <div className="min-w-0">
                    <div className="truncate font-medium text-[var(--admin-text)]">
                      {product?.name || "Product missing or deleted"}
                    </div>
                    {!product && (
                      <div className="text-xs text-red-500">
                        Remove this row or add the product again.
                      </div>
                    )}
                  </div>

                  <Switch
                    checked={!!item.status}
                    onChange={() => toggleStatus(item._id, item.status)}
                  />

                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => moveUp(index)}>
                      <ArrowUpwardIcon />
                    </button>
                    <button type="button" onClick={() => moveDown(index)}>
                      <ArrowDownwardIcon />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item._id)}
                      className="font-medium text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

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
