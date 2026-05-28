import Sidebar from '../Sidebar'
import { FaHeart} from "react-icons/fa";
import Link from 'next/link';
import CartAndControls from './CartAndControls';
import HeaderSearchbar from './HeaderSearchbar';


const Header = () => {
  // const headerRef = useRef(null)

  // const cartText = useRef(null)
  // const formRef = useRef<HTMLInputElement>(null)





  // useEffect(() => {
  //   const headerInfo = () => {

  //     // const storedCartData = JSON.parse(localStorage.getItem('cart'));
  //     // const cartLength = storedCartData ? storedCartData.length : 0; // Use 0 if the cart data is not available
  //     // setCartLen(cartLength);

  //     // setIsMobile(window.innerWidth < 768 ? true : false)
  //   };

  //   headerInfo()



  //   const fetch = async () => {

  //     // const currentUser = JSON.parse(localStorage.getItem('user'));
  //     // setUser(currentUser ? currentUser : { uid: randomUUID() })
  //     // if (currentUser) {
  //     //   await listenCart(currentUser.uid);

  //     // } else {
  //     //   console.log("Couldn't fetch current user");
  //     // }
  //   };

  //   fetch();

  //   const header = headerRef.current;
  //   let prevScrollPos = window.scrollY;

  //   // const scrollHandler = () => {
  //   //   let currentScrollPos = window.scrollY;

  //   //   if (currentScrollPos > prevScrollPos) {
  //   //     header?.classList.add('collapse');
  //   //     header?.classList.remove('show');
  //   //   } else if (currentScrollPos < prevScrollPos) {
  //   //     header?.classList.remove('collapse');
  //   //     header?.classList.add('show');
  //   //   }

  //   //   prevScrollPos = currentScrollPos;
  //   // };

  //   // window.addEventListener('scroll', scrollHandler);

  //   // return () => window.removeEventListener('scroll', scrollHandler);
  // }
  //   , [cart]); // cart was added later on

  // useEffect(() => {

  //   // if (cartLen > prevCartLen) {
  //   //   if (cartText.current instanceof HTMLElement) {
  //   //     cartText.current.style.color = 'rgb(0,255,0)';
  //   //     setTimeout(() => {
  //   //       cartText.current.style.color = 'rgb(83, 176, 255)';
  //   //     }, 2000);
  //   //   }
  //   // } else if (cartLen < prevCartLen) {
  //   //   if (cartText.current instanceof HTMLElement) {
  //   //     cartText.current.style.color = 'red';
  //   //     setTimeout(() => {
  //   //       cartText.current.style.color = 'rgb(83, 176, 255)';
  //   //     }, 2000);
  //   //   }
  //   // }

  //   // Update the previous cart length
  //   // setPrevCartLen(cartLen);
  // }, []);










  return (
    <header className='text-md max-lg:text-sm'>

      <div style={{ 'zIndex': '10000' }} className=' w-[100vw] bg-[#1e3a8a] text-white flex flex-col border-b-8 border-blue-100 p-4 px-2 md:px-8 lg:px-16 gap-2'>

        <div className='flex justify-end gap-4 text-neutral-200 text-[10px] md:text-xs max-lg:hidden'>
          <Link href="/orders">My Orders</Link>
          <Link href="#">Amazing Opportunities</Link>
          <Link href="#">Customer Services</Link>
          <Link href="#">Become a Seller</Link>
        </div>

        <div className='flex justify-between  items-center w-full'>
          <div className='flex items-center justify-center gap-2 h-full lg:flex'>
            <Link href="/" className='flex gap-2'>
              {/* <img loading='lazy' src="" alt="" className='object-cover w-[4rem] h-auto lg:w-[5rem] rounded-[50%] border-4 border-black-800' /> */}
              <h1 className='hidden lg:flex items-center font-bold md:text-[15px] lg:text-[20px]'>
                <span className='text-blue-500'>Blu</span>E-Commerce</h1>
              <h1 className='lg:hidden flex text-[22px] max-lg:text-sm px-10 max-lg:px-2 font-bold'>BluE</h1>
            </Link>
          </div>


          <HeaderSearchbar />

          {/* <Link href="/cart"> */}
          <CartAndControls />


          <Link
            href='/favorites'
            className='inline-flex items-center justify-center gap-1 bg-white text-blue-400 px-2 py-2 border-2 rounded-xl hover:text-red-600 hover:border-red-600 transition-all duration-300'>
            <FaHeart /> <span className='max-lg:hidden inline'>Favorites</span>
          </Link>



          <div className='flex gap-[20px] justify-between items-center'>
            <Sidebar />

          </div>
        </div>

      </div>



    </header>
  )
}

export default Header