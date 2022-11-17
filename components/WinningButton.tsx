import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { currency } from "../constante"

function WinningButton() {
  const address = useAddress()

  const { contract } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: winning } = useContractRead(
    contract,
    "getWinningsForAddress",
    address
  )
  const { mutateAsync: WithdrawWinnings } = useContractWrite(
    contract,
    "WithdrawWinnings"
  )

  const withDrawingWinings = async () => {
    const notification = toast.loading("Withdrawing winnings...")
    try {
      await WithdrawWinnings([{}])
      toast.success("Winning withdrawn successfully!", { id: notification })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }
  return (
    <div className="max-w-md md:max-w-2xl lg:max-w-4xl mt-5 mx-auto">
      <button
        onClick={withDrawingWinings}
        className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center w-full rounded-xl"
      >
        <p className="font-bold">Congratulation you are our lucky Winner</p>
        <p>
          Total winning : {ethers.utils.formatEther(winning.toString())}{" "}
          {currency}
        </p>
        <br />
        <p className="font-semibold">Click here to withdraw your prize</p>
      </button>
    </div>
  )
}

export default WinningButton
