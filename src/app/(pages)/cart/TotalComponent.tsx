'use client'
import { ProductParams } from '../../../constants/constants';
import { calculateTotalCost } from '../../../utils/clientOnlyUtils';
import { FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../../../redux/hooks';
import { emptyCart } from '../../../redux/slices/cartSlice';
import { CartItemWithProduct } from '@/types/cart';

type TotalComponentProps = { cart: CartItemWithProduct[] }

export const TotalComponent = ({ cart }: TotalComponentProps) => {

  const dispatch = useAppDispatch();

  return (

    <div className='total-component text-center p-2 flex flex-col items-center justify-center'>
      <p>SELECTED PRODUCTS ({cart.length}) </p>
      <p className='text-[3rem]'>${calculateTotalCost(cart)}</p>
      <div className='flex gap-4'>
        <button className='px-4 py-2 bg-orange-400 inline-flex items-center justify-center rounded-xl gap-2' onClick={() => dispatch(emptyCart())}> <FaTrash /> EMPTY CART</button>
        <button disabled={cart.length > 0 ? false : true} className='p-3 bg-blue-600 text-white rounded-xl hover:brightness-125 hover:translate-y-[-3px] transition-all'>CHECKOUT</button>
      </div>
    </div>
  );
}