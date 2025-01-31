import { styled } from '@mui/material/styles'

export default styled('div')(({ theme }) => ({
  // background: `linear-gradient(${theme.palette.background.paper}, ${theme.palette.background.default})`,
  padding: 20,
  // borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  height: '100%',
}))
