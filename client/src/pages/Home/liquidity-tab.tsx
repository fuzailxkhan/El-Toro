import { Grid, Typography } from "@mui/material"
import TabsComponent from "./tabs"
import { useState } from "react"
import AddLiquidity from "@components/LiquidityTabs/add-liquidity"
import RemoveLiquidity from "@components/LiquidityTabs/remove-liquidity"
import { LiquidityContainer } from "./styles"


const LiquidityTab = () => {
    const [tab, setTab] = useState(0)

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTab(newValue)
      }

      const renderLiquidityTab = () => {
        if (tab === 0) return <AddLiquidity />
        else return <RemoveLiquidity />
      }
    
  return (
    <Grid container xs={10} md={3.5}>
      <Grid
        container
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        gap={'12px'}
        mt={'50px'}
      >
        <Typography fontSize={'40px'} fontWeight={'600'} color={'#F6F6F6'}>
          Liquidate Toro
        </Typography>
        <Typography
          fontSize={'16px'}
          fontWeight={'500'}
          color={'#F6F6F6'}
          sx={{ opacity: '0.7' }}
        >
          Provide liquidity and maximize your yield.  
        </Typography>
      </Grid>

      <LiquidityContainer mt={'24px'} minHeight={'516px'} container>
        <TabsComponent
          value={tab}
          setValue={setTab}
          handleChange={handleTabChange}
          tabNames={[
            { name: 'Add Liquidity' },
            { name: 'Remove' },
          ]}
          xsValue={12}
          mdValue={12}
        />

        {renderLiquidityTab()}
      </LiquidityContainer>
    </Grid>
  )
}

export default LiquidityTab
