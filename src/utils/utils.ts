import { cache } from "react";
import { ProductParams, ReviewParams, User } from "../constants/constants";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { Option } from "../constants/constants";



export const getProducts = cache(async () => {
})

export const getSpecificProduct = async (id: string):Promise<void>=> {
};

export const getAllProductsOfUser = async (id: string): Promise<void> => {
}

export const uploadDocument = async (user:any, data:any) => {

}

export const getCart = async (id: string): Promise<void> => {
};

export const listenCart = async (id: string, dispatch?: (action: {}) => void): Promise<void> => {
}

export const addToCart = async (uid: string, productId: string): Promise<void> => {

  // const user = await getUser(uid)

  // if (user) {
  //   try {
  //     const userRef = doc(db, "users", uid);
  //     await updateDoc(userRef, {
  //       cart: arrayUnion(productId)
  //     })
  //     reloadCart(uid)
  //     return 'Successful'
  //   } catch (err) { console.log(err) }
  // }
  // else {
  //   addToAnonymousCart(productId)
  // }


}

export const removeFromCart = async (uid: string, productId: string): Promise<void> => {

  // const user = await getUser(uid)

  // if (user) {
  //   try {
  //     if (!db || !uid || !productId) {
  //       console.error("Invalid parameters for removeFromCart");
  //       return undefined;
  //     }

  //     const userRef = doc(db, "users", uid);
  //     await updateDoc(userRef, {
  //       cart: arrayRemove(productId)
  //     });
  //     reloadCart(uid)
  //     localStorage.setItem('cart', JSON.stringify(await getCart(uid)))
  //     return 'Successful';
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
  // else {
  //   removeFromAnonymousCart(productId)
  // }
}

export const getUser = async (id: string): Promise<void> => {}

export const uploadMedia = async (file:any): Promise<void> => {
};

export const reloadCart = async () => {

}

export const checkUser = async (user: any):Promise<void> => {
}



export const addToAnonymousCart = (productId: string): void => {
  // const storageItem = localStorage.getItem('tempCart')
  // if(storageItem == null) return
  // let tempCart = JSON.parse(storageItem) || [];
  // tempCart.push(productId);
  // localStorage.setItem('tempCart', JSON.stringify(tempCart));
};

export const removeFromAnonymousCart = (productId: string): void => {
  // let tempCart = JSON.parse(localStorage.getItem('tempCart')) || [];
  // const updatedCart = tempCart.filter((i: string) => i !== productId)
  // localStorage.setItem('tempCart', JSON.stringify(updatedCart));
}

export const getAnonymousCart = (): void => {
  // try { return JSON.parse(localStorage.getItem('tempCart')) }
  // catch (error) { console.log(error) }
}

export const getAllProducts = async (): Promise<void> => {
  // try {
  //   const docQuery = query(collection(db, 'products'))
  //   const querySnapshot = await getDocs(docQuery)
  //   const docs = querySnapshot.docs.map((i) => { return i.data() as ProductParams })
  //   return docs
  // } catch (err) { console.log(err) }
}

export const getReviews = async (id: string): Promise<void> => {

  // const product = await getSpecificProduct(id)
  // const reviews = product.reviews
  // const updatedReviews = reviews.map(async (review: ReviewParams) => {
  //   const userObj = await getUser(review.sender)
  //   return { ...review, userObj }
  // })

  // const docPromise = await Promise.all(updatedReviews)
  // const finalDocs = docPromise.flat()
  // return finalDocs as ReviewParams[];
};






// export const handleSortCategory = (e: Option, router: AppRouterInstance, queryparams: ReadonlyURLSearchParams, pathname: string) => {
//   const current = new URLSearchParams(Array.from(queryparams.entries())); // -> has to use this form
//   current.set('sort', e.value)


//   const search = current.toString();

//   const query = search ? `?${search}` : "";

//   router.replace(`${pathname}${query}`, { scroll: false });
// };