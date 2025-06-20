'use client';

import React, { useEffect, useState, useCallback } from 'react';
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

  const router = useRouter()


  useEffect(() => {
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrr")
  }, [])
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

  // ✅ Trigger the filter API after state is updated
  const timer = setTimeout(() => {
    filtersData(newFilters);
  }, 200);

  return () => clearTimeout(timer); // Cleanup on unmount
}, [searchParams]); // ✅ keep a stable dependency list



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

    setFilters(resetFilters);        // ✅ Update state
    setRateValue(1);                 // ✅ Reset UI rating state
    setPrice([0, 80000]);            // ✅ Reset UI price range state

    filtersData(resetFilters);       // ✅ Use new filters immediately
  };



  // useEffect(() => {
  //   filtersData();
  // }, [filtersData()]);


  return (
    <aside className='sidebar 
    sticky 
    sm:top-[-350px] 
    md:top-[-240px] 
    lg:top-[-170px] 
    xl:top-[-50px]'>

      <div className='mb-4 w-full flex gap-3'>
        <Button variant='outlined' color='primary' className='w-full' onClick={() => filtersData()}>Apply</Button>
        <Button variant='outlined' color='error' className='w-full' onClick={() => cancelFilter()}>Clear</Button>
      </div>
      {/* Category Filter */}
      <div className='p-1 bg-white text-black'>
        <h3 className='text-lg font-[500] font-sans mb-2'>Filter By Category</h3>
        <div className='flex flex-col ml-4'>
          {catData?.map((cat) => (
            <div key={cat._id} className='mb-2'>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.catId.includes(cat._id)}
                    onChange={() => handleCheckChange('catId', cat._id)}
                  />
                }
                label={cat.name}
              />


            </div>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className='p-1 bg-white text-black mt-3'>
        <h3 className='text-lg font-[500] font-sans mb-4'>Filter By Price</h3>
        <Box sx={{ width: '100%' }}>
          <RangeSlider
            value={price}
            onInput={(val) => {
              setPrice(val);
              setFilters((prev) => ({
                ...prev,
                minPrice: val[0],
                maxPrice: val[1],
                page: 1
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
      <div className='p-1 bg-white text-black mt-3'>
        <h3 className='text-lg font-[500] font-sans mb-4'>Filter By Rating</h3>
        <Box>
          <Rating
            name="simple-controlled"
            value={rateValue}
            onChange={(event, newValue) => {
              setRateValue(newValue);
              setFilters((prev) => ({
                ...prev,
                rating: newValue,
                page: 1
              }));
            }}
          />
        </Box>
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