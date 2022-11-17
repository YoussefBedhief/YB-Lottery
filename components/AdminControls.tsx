import {
  StarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ReceiptRefundIcon,
} from "@heroicons/react/24/solid"
import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react"
import { ethers } from "ethers"
import toast from "react-hot-toast"
import { currency } from "../constante"

function AdminControls() {
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: totalCommission } = useContractRead(
    contract,
    "operatorTotalCommission"
  )
  const { mutateAsync: restartDraw } = useContractWrite(contract, "restartDraw")
  const { mutateAsync: RefundAll } = useContractWrite(contract, "RefundAll")
  const { mutateAsync: WithdrawCommission } = useContractWrite(
    contract,
    "WithdrawCommission"
  )
  const { mutateAsync: DrawWinnerTicket } = useContractWrite(
    contract,
    "DrawWinnerTicket"
  )
  const drawWinner = async () => {
    const notification = toast.loading("Drawing a lucky winner...")
    try {
      await DrawWinnerTicket([{}])
      toast.success("A winner has been selected successfully!", {
        id: notification,
      })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }
  const restart = async () => {
    const notification = toast.loading("Restarting...")
    try {
      await restartDraw([{}])
      toast.success("Draw restarted successfully!", {
        id: notification,
      })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }
  const refund = async () => {
    const notification = toast.loading("Refunding all players...")
    try {
      await RefundAll([{}])
      toast.success("Refund successfully!", {
        id: notification,
      })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }
  const withdrawCommission = async () => {
    const notification = toast.loading("Withdrawing Commisiong...")
    try {
      await WithdrawCommission([{}])
      toast.success("Commission withdrawn successfully!", {
        id: notification,
      })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }

  return (
    <div className="text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border">
      <h2 className="font-bold">Admin Control</h2>
      <p className="mb-5">
        Total commission to be withdrawn:{" "}
        {totalCommission &&
          ethers.utils.formatEther(totalCommission?.toString())}{" "}
        {currency}
      </p>
      <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
        <button onClick={drawWinner} className="admin-button">
          <StarIcon className="h-6 mx-auto mb-2" />
          Draw a Winner
        </button>
        <button onClick={withdrawCommission} className="admin-button">
          <CurrencyDollarIcon className="h-6 mx-auto mb-2" /> Withdraw
          Commission
        </button>
        <button onClick={restart} className="admin-button">
          <ArrowPathIcon className="h-6 mx-auto mb-2" />
          Restart The Draw
        </button>
        <button onClick={refund} className="admin-button">
          <ReceiptRefundIcon className="h-6 mx-auto mb-2" />
          Refund All
        </button>
      </div>
    </div>
  )
}

export default AdminControls
