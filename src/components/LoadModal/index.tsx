import { BsCloudDownload } from "react-icons/bs";
export default function LoadModal(){
    return(
        <div className="w-full h-[100vh] bg-gray-600 bg-opacity-70 flex items-center justify-center absolute">
            <BsCloudDownload className="text-[60px] animate-bounce"/>
        </div>
    )
}