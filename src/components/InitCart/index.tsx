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
        // Sadece kullanıcı giriş yapmışsa sepeti çek
        if (session?.user) {
            dispatch(fetchCartAsync());
        }
    }, [session, dispatch]); // Session değişirse (login/logout) tekrar çalışır

    return null; // UI render etmez, sadece mantık çalıştırır
}