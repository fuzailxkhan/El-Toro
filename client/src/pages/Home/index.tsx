import React from 'react'
import TabsComponent from './tabs'
import StakingTab from './staking-tab'
import GovernanceTab from './governance-tab'
// import ClaimTab from './claim-tab'
import { Grid } from '@mui/material'
import { FormContainerStyled } from '@components/FormContainer/styles'
import StatsTab from './stats-tab'
import Analytics from './analytics'


const Home = () => {
  const [tab, setTab] = React.useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue)
  }

  const renderTab = () => {
    if (tab === 0) return <StakingTab />
    // else if (tab === 1) return <h1>Hello</h1>
    else if (tab === 1) return <StatsTab />
    else if (tab===2) return <Analytics />
  }

  return (
    <Grid
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      columnGap={2}
    >

      <Grid container justifyContent={'center'}>
        <TabsComponent
          value={tab}
          setValue={setTab}
          handleChange={handleTabChange}
          tabNames={[
            { name: 'Staking' },
            // { name: 'Swap' }, // Disabled tab
            { name: 'Statistics' },
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
