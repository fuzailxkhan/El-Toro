import { Box, Grid, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import { TabStyled, TabText } from './styles'

interface ITab {
  name: string
  disabled?: boolean
}

interface ITabsComponent {
  value: number
  setValue: React.Dispatch<React.SetStateAction<number>>
  handleChange: (event: React.SyntheticEvent, newValue: number) => void
  tabNames: ITab[]
  xsValue: number
  mdValue: number
}

const TabsComponent = ({
  value,
  setValue,
  handleChange,
  tabNames,
  xsValue,
  mdValue,
}: ITabsComponent) => {
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const handleTabClick = (index: number) => {
    if (!tabNames[index].disabled) {
      setValue(index)
    }
  }

  return (
    <Grid
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: '#222222',
        borderRadius: '16px',
        height: '68px',
        overflow: 'hidden',
      }}
      // xs={10}
      // md={3.5}
      xs={xsValue}
      md={mdValue}
      container
    >
      {/* <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Staking" {...a11yProps(0)} />
          <Tab label="Governance" {...a11yProps(1)} />
          <Tab label="Statistics" {...a11yProps(2)} />
        </Tabs> */}
      <Grid container overflow={'hidden'}>
        {/* <Grid item xs={4}>Staking</Grid>
          <Grid item xs={4}>Governance</Grid>
          <Grid item xs={4}>Governance</Grid> */}
        {/* <TabStyled
            item
            xs={4}
            active={value === 0}
            onClick={() => setValue(0)}
          >
            <Typography
              fontSize={'20px'}
              color={value === 0 ? '#03D9AF' : '#828284'}
            >
              Staking
            </Typography>
          </TabStyled>
          <TabStyled item xs={4} active={value === 1} position={'relative'}>
            {' '}
            <Typography
              fontSize={'9px'}
              color={'#00C795'}
              position={'absolute'}
              top={'6px'}
            >
              Coming Soon!
            </Typography>
            <Typography
              fontSize={'20px'}
              color={value === 1 ? '#03D9AF' : '#828284'}
            >
              Governance
            </Typography>
          </TabStyled>
          <TabStyled
            item
            xs={4}
            active={value === 2}
            onClick={() => setValue(2)}
          >
            <Typography
              fontSize={'20px'}
              color={value === 2 ? '#03D9AF' : '#828284'}
            >
              Statistics
            </Typography>
          </TabStyled> */}

        {tabNames.map((tabName, index) => (
          <TabStyled
            key={index}
            item
            xs={12 / tabNames.length} // Adjust column width based on the number of tabs
            active={value === index}
            // onClick={() => setValue(index)}
            onClick={() => handleTabClick(index)}
          >
            {tabName.disabled && (
              <Typography
                fontSize={'14px'}
                color={'#00C795'}
                position={'absolute'}
                top={'6px'}
              >
                Coming Soon!
              </Typography>
            )}

            <TabText
              color={value === index ? '#03D9AF' : '#828284'}
            >
              {tabName.name}
            </TabText>

            {value === index && (
              <Grid
                position={'absolute'}
                bottom={'8px'}
                height={'4px'}
                width={'12px'}
                bgcolor={'#03D9AF'}
              />
            )}
          </TabStyled>
        ))}
      </Grid>
    </Grid>
  )
}

export default TabsComponent
