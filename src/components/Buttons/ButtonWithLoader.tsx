/* eslint-disable @typescript-eslint/no-empty-function */
import { CircularProgress } from '@mui/material'
import React from 'react'
import GoldButton from './GoldButton'
import OutlinedButton from './OutlinedButton'

export enum ButtonTypes {
  FILLED = 'filled',
  OUTLINED = 'outlined',
}

type Props = {
  type: ButtonTypes
  loading?: boolean
  text: string
  onClick: (e: any) => void
  style?: React.CSSProperties
  disabled?: boolean
}

const ButtonWithLoader: React.FC<Props> = ({
  type,
  loading,
  text,
  onClick,
  style,
  disabled,
}) => {
  const children = loading ? (
    <CircularProgress
      sx={{ color: type === ButtonTypes.FILLED ? '#191915' : '#A18841' }}
      size={15}
    />
  ) : (
    text
  )

  return type === ButtonTypes.FILLED ? (
    <GoldButton
      style={style}
      onClick={!disabled ? onClick : () => {}}
      disabled={disabled}
    >
      {children}
    </GoldButton>
  ) : (
    <OutlinedButton style={style} onClick={onClick}>
      {children}
    </OutlinedButton>
  )
}

export default ButtonWithLoader
