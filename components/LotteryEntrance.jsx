import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")

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
                            await enterRaffle()
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
