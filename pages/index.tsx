import type { NextPage } from "next"
import { useState, useEffect } from "react"
import Head from "next/head"
import Header from "../components/Header"
import Login from "../components/Login"
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react"
import Loading from "../components/Loading"
import { ethers } from "ethers"
import { currency } from "../constante"
import toast from "react-hot-toast"
import { firework } from "../libs/utils"
import Marquee from "react-fast-marquee"
import AdminControls from "../components/AdminControls"
import Footer from "../components/Footer"
import NextDrawContainer from "../components/NextDrawContainer"
import WinningButton from "../components/WinningButton"

const Home: NextPage = () => {
  const [quantity, setQuantity] = useState<number>(1)
  const [userTickets, setUserTickets] = useState(0)
  const address = useAddress()
  const { contract, isLoading } = useContract(
    process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS
  )
  const { data: remainingTickets } = useContractRead(
    contract,
    "RemainingTickets"
  )
  const { data: expiration } = useContractRead(contract, "expiration")
  const { data: tickets } = useContractRead(contract, "getTickets")
  const { data: ticketPrice } = useContractRead(contract, "ticketPrice")
  const { data: lastWinner } = useContractRead(contract, "lastWinner")
  const { data: lastWinnerAmount } = useContractRead(
    contract,
    "lastWinnerAmount"
  )

  const { data: winning } = useContractRead(
    contract,
    "getWinningsForAddress",
    address
  )

  const { data: ticketCommission } = useContractRead(
    contract,
    "ticketCommission"
  )
  const { data: lotteryOperator } = useContractRead(contract, "lotteryOperator")

  const { mutateAsync: BuyTickets } = useContractWrite(contract, "BuyTickets")

  useEffect(() => {
    if (!tickets) return
    const totalTickets: string[] = tickets

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAdress) => (ticketAdress === address ? total + 1 : total),
      0
    )

    setUserTickets(noOfUserTickets)
  }, [tickets, address])
  useEffect(() => {
    if (winning > 0) firework()
  }, [winning])

  const handleClick = async () => {
    if (!ticketPrice) return
    const notification = toast.loading("Buying your tickets...")
    try {
      await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ])
      toast.success("Tickets purchased successfully!", { id: notification })
    } catch (error) {
      toast.error("woops something went wrong", { id: notification })
      console.error("Contract call failure", error)
    }
  }

  if (isLoading) return <Loading />

  if (!address) return <Login />

  return (
    <div className="bg-[#091B18] min-h-screen">
      <Head>
        <title>YB Lottery</title>
      </Head>
      <div className="flex-1">
        <Header />
        <Marquee
          play
          className="bg-[#0a1f1c] p-5 mb-5"
          gradient={false}
          speed={100}
        >
          <div className="flex items-center text-white space-x-2 mx-10 font-bold">
            <h4>Last Winner : {lastWinner?.toString()}</h4>
            <h5>
              Previous Winning :{" "}
              {lastWinnerAmount &&
                ethers.utils.formatEther(lastWinnerAmount?.toString())}
            </h5>
          </div>
        </Marquee>

        {lotteryOperator === address ? (
          <div className="flex justify-center">
            <AdminControls />
          </div>
        ) : null}

        {winning > 0 ? <WinningButton /> : null}

        {/*Time for the next draw */}
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start justify-center md:space-x-5">
          <NextDrawContainer />
          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2 className="">Price per Ticket</h2>
                <p>
                  {ticketPrice &&
                    ethers.utils.formatEther(ticketPrice.toString())}{" "}
                  {currency}
                </p>
              </div>
              <div className="flex text-white items-center space-x-2 bg-[#091b19] border border-[#004337] p-4">
                <p>TICKETS</p>
                <input
                  className="flex w-full bg-transparent text-right outline-none"
                  type="number"
                  min={1}
                  max={15}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5 ">
                <div className="flex text-emerald-300 italic text-sm font-extrabold items-center justify-between">
                  <p>Total cost per ticket</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex text-emerald-300 italic text-xs items-center justify-between">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex text-emerald-300 italic text-xs items-center justify-between">
                  <p>+ Network fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                onClick={handleClick}
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                className="mt-5 w-full text-lg font-semibold bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-whiteshadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed disabled:text-gray-100 text-white"
              >
                Buy {quantity} tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice)) * quantity}{" "}
                {currency}
              </button>
            </div>
            {userTickets ? (
              <div className="stats">
                <p className="text-lg mb-2">
                  You have {userTickets} in this draw
                </p>
                <div className="flex gap-x-2 gap-y-2 max-w-sm flex-wrap">
                  {Array(userTickets)
                    .fill("")
                    .map((_, index) => (
                      <p
                        key={index}
                        className="text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic"
                      >
                        {index + 1}
                      </p>
                    ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default Home
