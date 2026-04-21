import { cache } from "react";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


const catchThunk = (fn: any) => {
  return (...args: any) => {
    try {
      fn(...args)
    }
    catch (err: unknown) {
    }
  }
}
export const standardizeText = (value: string) => {
  const newValue =  value
  .trim()
  .toLowerCase()
  .split(',').join('')
  .split(' ').join('')
  .split('-').join('')

  return newValue;
}


export const thunkWrapper = <T = void>(
  typePrefix: string,
  payloadCreator: (arg: T, thunkAPI: any) => Promise<any>) => {
  return createAsyncThunk<any, T>(typePrefix, async (arg, thunkAPI) => {

    try {
      return await payloadCreator(arg, thunkAPI);
    }
    catch (err) {
      if (axios.isAxiosError(err)) return thunkAPI.rejectWithValue(err.response?.data.message)

      if (err instanceof Error)
        return thunkAPI.rejectWithValue(err.message)

      else thunkAPI.rejectWithValue('Unknown error during decrementItem request.')
    }
  })
}