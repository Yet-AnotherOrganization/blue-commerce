import { cache } from "react";
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Stripe from 'stripe';
import 'dotenv/config'

// const catchThunk = (fn: any) => {
//   return (...args: any) => {
//     try {
//       fn(...args)
//     }
//     catch (err: unknown) {
//     }
//   }
// }
export const standardizeText = (value: string) => {
  const newValue = value
    .trim()
    .toLowerCase()
    .split(',').join('')
    .split(' ').join('')
    .split('-').join('')

  return newValue;
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[.,'\-_~]/g, ''); // Efficient regex instead of .map
};



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


let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (!apiKey) {
      throw new Error("STRIPE_SECRET_KEY is missing from environment variables.");
    }

    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2026-04-22.dahlia' as any, // Cast if your local SDK types aren't matching the dahlia release string yet
      typescript: true,
    });
  }
  
  return stripeInstance;
}

