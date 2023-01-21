import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants/index"
import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    // const { runContractFunction: enterRaffe } = useWeb3Contract({
    //     abi: abi,
    //     contractAddress: raffleAddress, // specify the networkId
    //     functionName: "enterRaffle",
    //     params: {},
    //     msgValue: "",
    // })

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
                const entranceFeeFromContract = await getEntranceFee()
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <h1>Welcome to the fucking lottery 🍾</h1>
            <p>I hope you know this won&#39;t make your rich tho ❌ ➡ 💰</p>
            <p>Focus on building value for the community 🤸‍♀️</p>
            <p>That&#39;s what success is made of. There is no shortcut 😌</p>
        </div>
    )
}
