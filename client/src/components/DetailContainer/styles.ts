import { Grid, styled } from '@mui/material'

export const Container = styled(Grid)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: '1px solid red',
}))
