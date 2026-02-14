'use client'
import '../../../components/css/index.css'
import { ProductParams } from '../../../constants/constants';
import { calculateTotalCost } from '../../../utils/clientOnlyUtils';
import { CartItemWithProduct, ProductType } from '../../../types/product';

type TotalComponentProps = { cart: CartItemWithProduct[] }

export const TotalComponent = ({ cart }: TotalComponentProps) => {
  return (

    <div className='total-component text-center p-2'>
      <p>SELECTED PRODUCTS ({cart.length}) </p>
      <p className='text-[3rem]'>${calculateTotalCost(cart)}</p>
      <button disabled={cart.length > 0 ? false : true} className='p-3 bg-blue-600 text-white rounded-xl hover:brightness-125 hover:translate-y-[-3px] transition-all'>CHECKOUT</button>
    </div>
  );
}