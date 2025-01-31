import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@redux/configureStore'
// import { bindActionCreators } from '@reduxjs/toolkit'
// import { ActionCreators } from '@redux/slices/counterSlice'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>() // eslint-disable-line
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// export const useActions = () => {
//   const dispatch = useDispatch()

//   return bindActionCreators(ActionCreators, dispatch)
// }
// export { default as useContract } from './useContract'
// export { useStakingManager } from './useContract/useStakingManager'
// export { useStakingDatabase } from './useContract/useStakingDatabase'

export { default as useAxios } from './useAxios'
// export { default as useTransactionCost } from './useTransactionCost'
// export { default as useGetTotalStake } from './useGetTotalStake'
