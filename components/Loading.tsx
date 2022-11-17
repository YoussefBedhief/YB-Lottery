import Image from "next/image"
import Logo from "../assets/ticket.png"
import PropagateLoader from "react-spinners/PropagateLoader"

function Loading() {
  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center space-x-2 mb-10">
        <Image src={Logo} alt="Logo-image" height={200} width={200} />
        <h1 className="text-white text-lg font-bold">
          Loading please wait a second
        </h1>
      </div>
      <PropagateLoader color="white" size={30} />
    </div>
  )
}

export default Loading
