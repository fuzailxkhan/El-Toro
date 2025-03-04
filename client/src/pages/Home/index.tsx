import React from 'react'
import TabsComponent from './tabs'
import StakingTab from './staking-tab'
import GovernanceTab from './governance-tab'
// import ClaimTab from './claim-tab'
import { Grid } from '@mui/material'
import { FormContainerStyled } from '@components/FormContainer/styles'
import StatsTab from './stats-tab'
import Analytics from './analytics'
import SwapTab from './swap-tab'
import LiquidityTab from './liquidity-tab'


const Home = () => {
  const [tab, setTab] = React.useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const renderTab = () => {
    if (tab === 0) return <StakingTab />
    else if (tab === 1) return <SwapTab/>
    // else if (tab === 2) return <StatsTab />
    else if (tab ===2) return <LiquidityTab />
    else if (tab===3) return <Analytics />
  }

  return (
    <Grid
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      columnGap={2}
      marginBottom={'32px'}
    >

      <Grid container justifyContent={'center'}>
        <TabsComponent
          value={tab}
          setValue={setTab}
          handleChange={handleTabChange}
          tabNames={[
            { name: 'Staking' },
            { name: 'Swap' }, 
            { name: 'Liquidity' },
            { name: 'Analytics' }
          ]}
          xsValue={10}
          mdValue={5}
        />
      </Grid>
      {renderTab()}
    </Grid>
  )
}

export default Home
