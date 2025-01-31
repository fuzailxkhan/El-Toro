import { ReactNode, useEffect, useMemo, useState } from 'react'
import { FormContainerStyled } from './styles'
import { Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

interface FormContainerProps {
  children: ReactNode
}

interface StyledPaperProps {
  bg: string
}

const Item = styled(Paper, {
  shouldForwardProp: prop => prop !== 'success',
})<StyledPaperProps>(({ theme, bg }) => ({
  background: bg,
  padding: '35px 20px',
  color: theme.palette.text.secondary,
  borderRadius: '20px',
}))

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  
  return (
    <Grid
      container
      flexDirection={'row'}
      justifyContent={'center'}
      columnGap={2}
    >
      <FormContainerStyled
        item
        container
        marginTop={5}
        xs={10}
        md={3.5}
        borderRadius={'20px'}
        display={'flex'}
        flexDirection={'column'}
      >
        <Grid container justifyContent={'center'} padding={'10px 20px'}>
          {children}
        </Grid>
      </FormContainerStyled>

      {/* <Grid
        item
        container
        marginTop={5}
        xs={10}
        md={2}
        borderRadius={'20px'}
        display={'flex'}
        flexDirection={'column'}
        rowGap={1}
        justifyContent={'space-between'}
      >
        {' '}
        <Item bg="linear-gradient(90deg, #4CBCF8 0.21%, #60378E 106.24%)">
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
            {totalStakedAmount} VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            ${totalStakedAmount}
          </Typography>
        </Item>
        <Item bg="linear-gradient(90deg, #C3844A 0.21%, #DCBD4E 106.24%)">
          <Typography color={'primary'} variant="h3" fontWeight={700}>
            Total User Staked
          </Typography>
          <Typography
            color={'primary'}
            variant="h4"
            fontWeight={600}
            marginTop={1}
          >
            {' '}
            {userStakedAmount} VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            ${userStakedAmount}
          </Typography>
        </Item>
        <Item bg="linear-gradient(90deg, #44CC7A 0.21%, #37698E 106.24%)">
          <Typography color={'primary'} variant="h3" fontWeight={700}>
            User Reward
          </Typography>
          <Typography
            color={'primary'}
            variant="h4"
            fontWeight={600}
            marginTop={1}
          >
            {' '}
            {userReward} VNR
          </Typography>
          <Typography color={'primary'} variant="h6">
            ${userReward}
          </Typography>
        </Item>
      </Grid> */}
    </Grid>
  )
}

export default FormContainer
