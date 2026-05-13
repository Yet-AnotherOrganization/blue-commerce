import React, { createContext, useRef, useState } from 'react'

type Props = {}

type ConfirmResolver = (value: boolean) => void;

const ConfirmContext = createContext<any>(null);

const ConfirmProvider = (props: Props) => {

    const [config, setConfig] = useState({ open: false, text: ''});

    const resolveRef = useRef<ConfirmResolver | null>(null);

    const ask = (text:string): Promise<boolean> => {
        setConfig({open: true, text});

        return new Promise((resolve) => {
            resolveRef.current = resolve;
        })
    }


    return (
    <ConfirmContext.Provider >

    </ConfirmContext.Provider>
  )
}

export default ConfirmContext