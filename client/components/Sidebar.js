'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useCat } from '@/app/context/CategoryContext';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import actualSlider from 'react-range-slider-input';
const RangeSlider = actualSlider.default || actualSlider;
import 'react-range-slider-input/dist/style.css';
import { FormControlLabel, Checkbox } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { postData } from '@/utils/api';
import { useRouter } from 'next/navigation';

const Sidebar = (props) => {
  const [price, setPrice] = useState([0, 80000]);
  const [rateValue, setRateValue] = useState(1);
  const { catData } = useCat();
  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr")
  }, []);

  const [filters, setFilters] = useState({
    catId: [],
    subCatId: [],
    thirdSubCatId: [],
    minPrice: 0,
    maxPrice: 80000,
    rating: 1,
    page: 1,
    limit: 50
  });

  // ✅ Count active filters and set in props
  useEffect(() => {
    const count =
      filters.catId.length +
      filters.subCatId.length +
      filters.thirdSubCatId.length +
      (filters.minPrice > 0 || filters.maxPrice < 80000 ? 1 : 0) +
      (filters.rating > 1 ? 1 : 0);

    props.setFilterCount(count);
  }, [filters]);

  const handleCheckChange = (level, value) => {
    setFilters((prev) => {
      const updated = [...prev[level]];
      const exists = updated.includes(value);

      return {
        ...prev,
        [level]: exists ? updated.filter(id => id !== value) : [...updated, value],
        page: 1
      };
    });
  };

  const filtersData = useCallback(async (customFilters) => {
    const activeFilters = customFilters || filters;
    props.setIsLoading(true);
    const res = await postData(`/api/product/filters`, activeFilters, false);
    props.setProductsData(res?.products);
    props.setIsLoading(false);
    props.setTotalPages(res?.totalPages);
    window.scrollTo(0, 0);
  }, [filters, props]);

  useEffect(() => {
    const catId = searchParams.get("catId");
    const subCatId = searchParams.get("subCatId");
    const thirdSubCatId = searchParams.get("thirdSubCatId");

    const newFilters = {
      catId: [],
      subCatId: [],
      thirdSubCatId: [],
      rating: 1,
      minPrice: 0,
      maxPrice: 80000,
      page: 1,
      limit: 50,
    };

    if (catId) newFilters.catId = [catId];
    if (subCatId) newFilters.subCatId = [subCatId];
    if (thirdSubCatId) newFilters.thirdSubCatId = [thirdSubCatId];

    setFilters(newFilters);

    // ✅ You kept this line — fine to keep it
    props.setFilterCount(newFilters.length);

    const timer = setTimeout(() => {
      filtersData(newFilters);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchParams]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      page: props.page
    }));
  }, [props]);

  const cancelFilter = () => {
    const resetFilters = {
      catId: [],
      subCatId: [],
      thirdSubCatId: [],
      minPrice: 0,
      maxPrice: 80000,
      rating: 1,
      page: 1,
      limit: 50
    };

    setFilters(resetFilters);
    setRateValue(1);
    setPrice([0, 80000]);

    filtersData(resetFilters);
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;

    if (!sidebar) return;

    function handleWheel(event) {
      const delta = event.deltaY;
      const scrollTop = sidebar.scrollTop;
      const scrollHeight = sidebar.scrollHeight;
      const offsetHeight = sidebar.offsetHeight;

      if (delta > 0 && scrollTop + offsetHeight >= scrollHeight) {
        event.preventDefault();
      } else if (delta < 0 && scrollTop <= 0) {
        event.preventDefault();
      }
    }

    sidebar.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      sidebar.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className='sidebar   sticky sm:top-[54px] text-black flex flex-col h-full sm:h-auto pl-4 sm:pl-0'
    >
      {/* Top: Apply + Clear */}
      <div className='mb-4 w-full flex gap-2 sm:gap-4 sm:mb-6 px-1 sm:px-0'>
        <Button
          variant='outlined'
          color='primary'
          size='small'
          className='w-full text-xs sm:text-base py-1 sm:py-2'
          onClick={() => {
            filtersData();
            props.setShowFilterPannel(false);
          }}
        >
          Apply
        </Button>
        <Button
          variant='outlined'
          color='error'
          size='small'
          className='w-full text-xs sm:text-base py-1 sm:py-2'
          onClick={() => {
            cancelFilter();
            props.setShowFilterPannel(false);
          }}
        >
          Clear
        </Button>
      </div>

      {/* Scrollable Filter Section */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-0">
        {/* Category Filter */}
        <div className='p-1 sm:p-2 bg-white'>
          <h3 className='text-lg font-medium font-sans mb-2'>
            Filter By Category
          </h3>
          <div className='flex flex-col ml-2 sm:ml-3'>
            {catData?.map((cat) => (
              <div key={cat._id} className='mb-1 text-nowrap '>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.catId.includes(cat._id)}
                      onChange={() => handleCheckChange('catId', cat._id)}
                      className="!p-1 sm:!p-3"
                    />
                  }
                  label={
                    <span className="text-base">{cat.name}</span>
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Price Filter */}
        <div className='p-1 sm:p-2 bg-white mt-3'>
          <h3 className='text-lg font-medium font-sans mb-3 sm:mb-4'>
            Filter By Price
          </h3>
          <Box sx={{ width: '100%' }}>
            <RangeSlider
              value={price}
              onInput={(val) => {
                setPrice(val);
                setFilters((prev) => ({
                  ...prev,
                  minPrice: val[0],
                  maxPrice: val[1],
                  page: 1,
                }));
              }}
              min={100}
              max={80000}
              step={5}
            />
            <div className='text-sm mt-2'>
              ₹{price[0]} – ₹{price[1]}
            </div>
          </Box>
        </div>

        {/* Rating Filter */}
        <div className='p-1 sm:p-2 bg-white mt-3'>
          <h3 className='text-lg font-medium font-sans mb-3 sm:mb-4'>
            Filter By Rating
          </h3>
          <Box>
            <Rating
              name='simple-controlled'
              value={rateValue}
              onChange={(event, newValue) => {
                setRateValue(newValue);
                setFilters((prev) => ({
                  ...prev,
                  rating: newValue,
                  page: 1,
                }));
              }}
              size='small'
            />
          </Box>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

//{/* Render subcategories only if this category is checked */}
// {filters.catId.includes(cat._id) && cat.children?.length > 0 && (
//   <div className="ml-6">
//     {cat.children.map((sub) => (
//       <div key={sub._id}>
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={filters.subCatId.includes(sub._id)}
//               onChange={() => handleCheckChange('subCatId', sub._id)}
//             />
//           }
//           label={sub.name}
//         />

//         {/* Render third subcategories only if this sub is checked */}
//         {filters.subCatId.includes(sub._id) && sub.children?.length > 0 && (
//           <div className="ml-6">
//             {sub.children.map((third) => (
//               <FormControlLabel
//                 key={third._id}
//                 control={
//                   <Checkbox
//                     checked={filters.thirdSubCatId.includes(third._id)}
//                     onChange={() => handleCheckChange('thirdSubCatId', third._id)}
//                   />
//                 }
//                 label={third.name}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     ))}
//   </div>
// )}
