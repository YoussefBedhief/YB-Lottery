import Image from "next/image"
import React from "react"
import Logo from "../assets/ticket.png"
import { ConnectWallet } from "@thirdweb-dev/react"

function Login() {
  return (
    <div className="bg-[#091b18] min-h-screen flex flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center mb-10">
        <Image alt="Logo-image" src={Logo} width={400} height={400} />
        <h1 className="text-6xl text-white font-bold">YB Lottery</h1>
        <h2 className="text-white my-5 mt-3">
          Get started by logging in with your wallet
        </h2>
        <ConnectWallet
          accentColor="#fff"
          colorMode="light"
          className="outline-none "
        />
      </div>
    </div>
  )
}

export default Login
