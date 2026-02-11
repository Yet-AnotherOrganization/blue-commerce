
import { ProductParams } from "../constants/constants";

export const getActiveUserFromStorage = ():void => {
    if (typeof window !== 'undefined') {
      // Check if the code is running in a browser environment
    }
  };

  export const handleLogOut = async():Promise<void> =>{
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
    localStorage.setItem('tempCart',JSON.stringify([]))
  }

  export const calculateTotalCost =
  (cart: any):any => {
      if (cart) {
          try {
              const totalPrice =
                  cart.reduce((accumulator:number, item:any) => {
                      if (item && item.price) { return accumulator + Number(item.price); } return accumulator;
                  }, 0); return <span>${totalPrice}</span>;
          }
          catch (err) { console.log(err) }
      }
  };