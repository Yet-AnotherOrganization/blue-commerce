'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCartAsync } from "../../redux/slices/cartSlice";
import { useAppDispatch } from "../../redux/hooks";

export default function InitCart() {
    const { data: session } = useSession();
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            if (session?.user) {
                const res = await dispatch(fetchCartAsync());
            }
        })()
    }, [session, dispatch]);

    return null;
}