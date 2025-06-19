import React, { useEffect, useState } from 'react'
import { fetchDataFromApi } from '@/utils/api'
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';


const Reviews = (props) => {

    const [reviews, setReviews] = useState([])

    useEffect(() => {
        console.log("Current productId passed to review fetch:", props.productId)


        fetchDataFromApi(`/api/user/getReviews?productId=${props.productId}`).then((res) => {
            console.log("Fetching the reviews", res)
            console.log(res)
            setReviews(res.reviews)
            
        })
    }, [props.productId])


    return (
        <div className=' text-black font-bold text-[22px] border-y  mt-5 border-slate-400 py-1'>
            Customer reviews
            {reviews?.length > 0 && reviews?.map((review, index) => {
                return (
                    <div className=' w-full p-2 py-3   border-t flex justify-between'  key={index}>
                        <div>
                            <h2 className='text-black font-semibold text-lg'>{review.userName}</h2>
                            <p className='text-gray-600 font-normal text-base'>{review?.review}</p>
                        </div>
                        <div>
                            <Rating name="read-only" value={review?.rating} readOnly size='small' />
                        </div>

                    </div>
                )
            })}

        </div>
    )
}

export default Reviews
