import * as React from 'react'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import { useEffect } from 'react'

export default function ProgressBar(props: any) {

  const { currentTimeStamp, totalDuration, lastTimeStampInSeconds: stakeTime } = props

  console.log('values', { stakeTime, totalDuration, currentTimeStamp }) // the time to unstake, total duration, current time

  const stakeDuration = stakeTime - totalDuration
  const elapsedTime: number = currentTimeStamp - totalDuration

  const percentageLeft = (elapsedTime / stakeDuration) * 100
  const percentagePassed = 100 - percentageLeft

  console.log(
    `Percentage of stake time passed: ${percentagePassed.toFixed(2)}%`,
  )
  console.log(`Percentage of stake time left: ${percentageLeft.toFixed(2)}%`)

  const [progress, setProgress] = React.useState(0)
  const [buffer, setBuffer] = React.useState(10)

  const progressRef = React.useRef(() => {})
  React.useEffect(() => {
    console.log('progress', progress)
    setProgress(percentagePassed)

  }, [])



  return (
    <Box sx={{ width: '100%' }}>
      <LinearProgress variant="buffer" value={progress} valueBuffer={buffer} />
    </Box>
  )
}
