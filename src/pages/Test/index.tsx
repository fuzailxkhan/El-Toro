import { useState } from 'react'
import { ethers } from 'ethers'
import { databaseAbi, rewardPoolAbi, virtuaAbi } from './abi'
const AddNetwork = require('adding-default-hardhat')

const Test = () => {
  const VirtuaStakingAddress = '0xb4e9A5BC64DC07f890367F72941403EEd7faDCbB'
  const RewardPoolAddress = '0xDC57724Ea354ec925BaFfCA0cCf8A1248a8E5CF1'
  const StakingDatabaseAddress = '0xfc073209b7936A771F77F63D42019a3a93311869'

  const [showVirtuaAddress, setVirtuaAddress] = useState('')
  const [showRewardAddress, setRewardAddress] = useState('')
  const [showDatabaseAddress, setDatabaseAddress] = useState('')

  async function fetchContract() {
    if (window.ethereum) {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      const VirtuaStakingInstance = new ethers.Contract(
        VirtuaStakingAddress,
        virtuaAbi,
        provider,
      )
      const RewardPoolInstance = new ethers.Contract(
        RewardPoolAddress,
        rewardPoolAbi,
        provider,
      )
      const StakingDatabaseInstance = new ethers.Contract(
        StakingDatabaseAddress,
        databaseAbi,
        provider,
      )

      setVirtuaAddress(VirtuaStakingInstance.address)
      setRewardAddress(RewardPoolInstance.address)
      setDatabaseAddress(StakingDatabaseInstance.address)
    }
  }

  return (
    <div>
      <h1>My React App</h1>
      <button
        onClick={() =>
          AddNetwork({
            selectedChainIndex: 0,
            daystimestamp: 10,
            addContract: fetchContract(),
          })
        }
      >
        Add Network
      </button>
      <h3>Virtua Address: {showVirtuaAddress}</h3>
      <h3>RewardPool Address: {showRewardAddress}</h3>
      <h3>Database Address: {showDatabaseAddress}</h3>
    </div>
  )
}
export default Test
