import { Backdrop, Gradient } from '../../assets'
import { Grid, Typography, styled } from '@mui/material'

export const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: '1px solid red',
}))

export const FormContainer = styled(Grid)(({ theme }) => ({
  height: '40rem',
  //width: '40rem',
  borderRadius: '20px',
  background: theme.palette.background.paper,
  boxShadow: '-1px -1px 14px 8px rgba(0,0,0,0.75)',
}))

export const DetailContainer = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRadius: '12px',
  padding: '20px 16px',
}))

interface ILockupOptionChip {
  active: boolean
}

export const LockupOptionChip = styled(Grid, {
  shouldForwardProp: prop => prop !== 'active',
})<ILockupOptionChip>(({ theme, active }) => ({
  border: active ? '1px solid #9247FF' : '0px solid',
  background: theme.palette.background.default,
  borderRadius: '100px',
  padding: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
}))

export const TabStyled = styled(Grid, {
  shouldForwardProp: prop => prop !== 'active',
})<ILockupOptionChip>(({ theme, active }) => ({
  background: active ? '#1B2E2A' : 'transparent',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  position: 'relative',
}))

export const StatsBox = styled(Grid)(({ theme }) => ({
  minHeight: '132px',
  borderRadius: '24px',
  border: '1.5px solid #F6F6F61A',
  boxShadow: '0px -30px 77px 0px #000000',
  // background: "#0E0E0E",
  backdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  backgroundImage: `url(${Backdrop})`,
  backgroundColor: '#020202',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  padding: '24px 42px',

  [theme.breakpoints.down('md')]: {
    marginTop:"20px"
    // Adjust height as per requirement
  },
}))

export const StatsBoxLarge = styled(Grid)(({ theme }) => ({
  minHeight: '340px',
  borderRadius: '24px',
  border: '1.5px solid #F6F6F61A',
  boxShadow: '0px -30px 77px 0px #000000',
  // background: "#0E0E0E",
  backdropFilter: 'blur(10px)',
  boxSizing: 'border-box',
  backgroundImage: `url(${Backdrop})`,
  backgroundColor: '#020202',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  padding: '30px',
}))

export const StakingContainer = styled(Grid)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px',
  background: '#020202',
  border: '1.5px solid #F6F6F61A',
  backgroundImage: `url(${Backdrop})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  alignContent: 'flex-start',
}))

export const AddLiquidityContainer = styled(Grid)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px',
  background: '#020202',
  border: '1.5px solid #F6F6F61A',
  backgroundImage: `url(${Backdrop})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  alignContent: 'flex-start',
}))

export const LiquidityContainer = styled(Grid)(({ theme }) => ({
  padding: '24px',
  borderRadius: '24px',
  background: '#020202',
  border: '1.5px solid #F6F6F61A',
  backgroundImage: `url(${Backdrop})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  alignContent: 'flex-start',
}))

export const InputContainer = styled(Grid)(({ theme }) => ({
  padding: '16px 24px 16px 24px',
  gap: '12px',
  borderRadius: '16px',
  border: '1.5px solid #FFFFFF14',
  marginTop: '32px',
}))

export const TabText = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
}))
