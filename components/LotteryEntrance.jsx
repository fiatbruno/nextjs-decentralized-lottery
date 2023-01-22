import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "@web3uikit/core"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")

    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
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

    useEffect(() => {
        if (isWeb3Enabled) {
            // try to read the raffle entrance fee
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
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
        <div>
            <h1>Welcome to the fucking lottery 🍾</h1>
            {raffleAddress ? (
                <div>
                    <p>Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</p>
                    <br />
                    <p>I hope you know this won&#39;t make your rich tho ❌ ➡ 💰</p>
                    <p>Focus on building value for the community 🤸‍♀️</p>
                    <p>That&#39;s what success is made of. There is no shortcut 😌</p>
                    <p>That being said ...</p>
                    <br />
                    <button
                        onClick={async function () {
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                // IMPORTANT: Always add this onError: to all your run contract functions
                                onError: (error) => console.log(error),
                            })
                        }}
                    >
                        Enter Raffle 🔄
                    </button>
                </div>
            ) : (
                <div> No Raffle Address Detected 🤷</div>
            )}
        </div>
    )
}
