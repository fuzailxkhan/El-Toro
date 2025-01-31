import { Input } from '@mui/material'
import { darken, styled } from '@mui/material/styles'

export default styled(Input)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  outline: 'none',
  border: 'none',
  borderBottom: `1px solid ${theme.palette.primary.main}`,
  padding: '5px',
  transition: 'all 0.25s ease',
  '&::placeholder': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '&:focus': {
    borderBottom: `1px solid ${darken(theme.palette.primary.main, 0.5)}`,
  },
}))
