import * as React from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(90deg, #4CBCF8 0.21%, #60378E 106.24%)',
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  borderRadius: '20px',
}))

export default function DetailContainer() {
  return (
    <Grid
      item
      container
      marginTop={2}
      xs={10}
      md={4}
      justifyContent={'space-between'}
      rowSpacing={2}
    >
      <Grid item md={3.8} xs={12}>
        <Item>
          <Typography color={'primary'} variant="h3" fontWeight={700}>
            Total Staked
          </Typography>
          <Typography
            color={'primary'}
            variant="h4"
            fontWeight={600}
            marginTop={1}
          >
            {' '}
            174,245,921 VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            $ 174,245,921
          </Typography>
        </Item>
      </Grid>
      <Grid item md={3.8} xs={12}>
        <Item>
          <Typography color={'primary'} variant="h3" fontWeight={700}>
            {' '}
            Your Staked
          </Typography>
          <Typography
            color={'primary'}
            variant="h4"
            fontWeight={600}
            marginTop={1}
          >
            {' '}
            174,245,921 VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            $ 174,245,921
          </Typography>
        </Item>
      </Grid>
      <Grid item md={3.8} xs={12}>
        <Item>
          <Typography color={'primary'} variant="h3" fontWeight={700}>
            {' '}
            Your Reward
          </Typography>
          <Typography
            color={'primary'}
            variant="h4"
            fontWeight={600}
            marginTop={1}
          >
            {' '}
            174,245,921 VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            $ 174,245,921
          </Typography>
        </Item>
      </Grid>
    </Grid>
  )
}
