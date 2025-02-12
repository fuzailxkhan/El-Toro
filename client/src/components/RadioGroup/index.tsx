import React, { useState } from 'react'
import { styled } from '@mui/material/styles'

import './index.css'

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '33% 33% 33%',
  gridTemplateRows: '60px',
  width: '100%',
  marginTop: 10,
}))

const options = [
  {
    label: 'slow',
    value: 'safeLow',
  },
  {
    label: 'medium',
    value: 'average',
  },
  {
    label: 'fast',
    value: 'fast',
  },
]

type Props = {
  selected: string
  setSelected: (arg: string) => void
}

const RadioGroup: React.FC<Props> = ({ selected, setSelected }) => {
  return (
    <Container>
      {options.map((option, index) => {
        const checked = option.value === selected
        return (
          <div style={{ textAlign: 'center' }} key={index}>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: '1 1 auto' }}>
                <input
                  type="radio"
                  //   name={name}
                  checked={checked}
                  value={option.value}
                  onChange={() => setSelected(option.value)}
                />
              </div>
              <p style={{ fontSize: 12 }}>{option.label}</p>
            </label>
          </div>
        )
      })}
    </Container>
  )
}

export default RadioGroup
