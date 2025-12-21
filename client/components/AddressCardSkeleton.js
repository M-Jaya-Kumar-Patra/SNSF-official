import Skeleton from "@mui/material/Skeleton";

const AddressCardSkeleton = () => {
  return (
    <div className="border p-3 sm:p-5 my-2 sm:my-4 rounded-md sm:rounded-xl shadow-md bg-white flex justify-between">
      
      {/* LEFT CONTENT */}
      <div className="flex-1 space-y-2">
        <Skeleton
          variant="text"
          width="40%"
          height={22}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />

        <Skeleton
          variant="text"
          width="85%"
          height={18}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />

        <Skeleton
          variant="text"
          width="70%"
          height={18}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />

        <Skeleton
          variant="text"
          width="55%"
          height={16}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />

        <Skeleton
          variant="text"
          width="30%"
          height={14}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />
      </div>

      {/* RIGHT ACTION ICONS */}
      <div className="flex gap-3 sm:gap-4 pr-1 sm:pr-2 pt-1">
        <Skeleton
          variant="circular"
          width={28}
          height={28}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />
        <Skeleton
          variant="circular"
          width={28}
          height={28}
          sx={{ bgcolor: "rgba(203,213,225,0.6)" }}
        />
      </div>
    </div>
  );
};


export default AddressCardSkeleton;