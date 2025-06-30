import { configureStore } from "@reduxjs/toolkit"
import qaComplianceReducer from "./qaComplianceSlice"

export const store = configureStore({
  reducer: {
    qaCompliance: qaComplianceReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
