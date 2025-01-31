import styled from '@emotion/styled'
import { Button, ButtonProps } from '@mui/material'

interface ContainerProps extends ButtonProps {
  height?: string
  width?: string
  padding?: string
  radius?: string
}

export const ContainedButton = styled(Button)<ContainerProps>(
  ({ theme, height, width, padding, radius }) => ({
    width: width || '100%',
    padding: padding || '10px',
    height: height || '55px',
    borderRadius: radius || '13px',
  }),
)
