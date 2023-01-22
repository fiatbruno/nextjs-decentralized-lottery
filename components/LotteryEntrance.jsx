import { useWeb3Contract, useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumberOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }
    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
        })
    }

    return (
        <div className="p-5">
            <h2 className="py-1 px-1 font-semibold text-2xl underline">Welcome to the lottery 🍾</h2>
            {raffleAddress ? (
                <div>
                    <div className=" font-extrabold py-2 px-1">
                        Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                    <div className="py-4 px-1">
                        <p>I hope you know this won&#39;t make your rich 💰</p>
                        <p>Focus on building value for the community 🤸‍♀️</p>
                        <p>That&#39;s what success is made of. There is no shortcut 😌</p>
                        <p>That being said ...</p>
                    </div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterRaffle({
                                // Checks to see if tx has been successfully sent to metamask
                                onSuccess: handleSuccess,
                                // IMPORTANT: Always add this onError: to all your run contract functions
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Raffle</div>
                        )}
                    </button>
                    <div className="px-1 py-1">Number of Players: {numPlayers}</div>
                    <div className="px-1 py-1">Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div> No Raffle Address Detected 🤷</div>
            )}
        </div>
    )
}
