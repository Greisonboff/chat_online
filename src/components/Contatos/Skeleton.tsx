import { Skeleton } from "@mui/material"

export default function SkeletonContatos() {
    return (
        <li className='min-h-16 flex  gap-4 border border-black rounded-lg mx-1 my-3 p-2 cursor-pointer hover:border-gray-400'
        >
            <Skeleton variant="circular" width={80} height={80} />
            <div className="flex items-center w-[50%]">
                <Skeleton variant="rectangular" className="w-[100%]" height="1em"/>
            </div>
        </li>
    )
}