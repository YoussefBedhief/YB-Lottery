import { useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import React from "react"
import { currency } from "../constante"
import CountDownTimer from "./CountDownTimer"

function NextDrawContainer() {
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: totalPool } = useContractRead(contract, "CurrentWinningReward")
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  )
  return (
    <div className="stats-container">
      <h1 className="text-5xl text-white font-semibold text-center">
        The Next Draw
      </h1>
      <div className="flex justify-between space-x-2 p-2">
        <div className="stats">
          <h2 className="text-sm">Total Pool</h2>
          <p className="text-xl">
            {totalPool && ethers.utils.formatEther(totalPool.toString())}{" "}
            {currency}
          </p>
        </div>
        <div className="stats">
          <h2 className="text-sm">Tickets Remaining</h2>
          <p className="text-xl">{remainingTickets?.toNumber()} </p>
        </div>
      </div>
      <div className="mt-5 mb-3">
        <CountDownTimer />
      </div>
    </div>
  )
}

export default NextDrawContainer
