'use client';
import Input from '@/components/Common/Input';
import SelectWithSearch from '@/components/Common/SelectWithSearch';
import { countries } from '@/constants/constants';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { onboardingAddData, onboardingNextStep, onboardingPrevStep, onboardingSetData } from '@/redux/slices/uiSlice';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'sonner';

type Props = {}

const RegisterForm = (props: Props) => {

    const { onboardingData, onboardingStep } = useAppSelector(state => state.uiReducer)
    const dispatch = useAppDispatch();
    const [flag, setFlag] = useState('TR');
    const router = useRouter();

    const btnContent = onboardingStep !== 3 ? <>Next<FaChevronRight /></> : 'Finish'

    let currentForm: React.ReactNode;

    function getFlagEmoji(countryCode: string) {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    switch (onboardingStep) {
        case 1:
            currentForm =
                <React.Fragment key='step-1'>
                    <Input id='name' label='Full Name' placeholder='Enter full name' defaultValue={onboardingData.name} />
                    <Input id='email' label='E-mail' placeholder='example@info.com' type='email' defaultValue={onboardingData.email} />
                    <Input id='password' label='Password' placeholder='A strong password' type='password' defaultValue={onboardingData.password} />
                    <Input id='confirmPassword' label='Password Confirm' placeholder='Same as your password' type='password' defaultValue={onboardingData.confirmPassword} />
                </React.Fragment>
            break;
        case 2:
            currentForm =
                <React.Fragment key='step-2'>
                    <Input id='phone' label='Phone Number' placeholder='e.g: +90 555 444 33 22' type='phone' defaultValue={onboardingData.phone} />
                    <Input id='defaultDeliveryLocation' label='Delivery Location' placeholder='e.g: Sillicon Valley, CA' type='string' defaultValue={onboardingData.defaultDeliveryLocation} />

                    <div className='flex flex-col'>
                        <label htmlFor="" className='pl-2 text-stone-600 pb-1'>Country</label>
                        <div className='flex items-center justify-center'>
                            <SelectWithSearch classes='w-full' searchPlaceholder='Enter a country name...' items={countries} id='country' placeholder='Select your country' defaultSelected={onboardingData.country} onChange={(e) => setFlag(e)} />
                            <span className='px-2'>
                                {getFlagEmoji(flag)}
                            </span>
                        </div>
                    </div>
                </React.Fragment>
            break;
        case 3:
            currentForm =
                <React.Fragment key='step-3'>
                    <Input label='Terms & Conditions' id='terms' type='checkbox' placeholder='I accept the Terms & Conditions' defaultChecked={onboardingData.terms} />
                    <Input label='Newsletter' id='newsletter' type='checkbox' placeholder='I want to receive promotions and offers.' defaultChecked={onboardingData.newsletter} optional={true} />
                </React.Fragment>
            break;
    }

    const handleStep = async (e: FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>, direction: 'NEXT' | 'BACK') => {
        e.preventDefault();

        const formElement = 'currentTarget' in e && e.currentTarget instanceof HTMLFormElement
            ? e.currentTarget
            : (e.target as HTMLElement).closest('form');

        if (!formElement) return;

        const formData = new FormData(formElement) as Record<string, any>;
        const stepFields = Object.fromEntries(formData.entries());

        const checkboxes = formElement.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach((checkbox) => {
            const input = checkbox as HTMLInputElement;

            stepFields[input.name] = input.checked;
        });

        dispatch(onboardingAddData(stepFields));

        if (direction === 'NEXT') {
            if (onboardingStep < 3) {
                dispatch(onboardingNextStep());
            } else {
                axios.post('/api/auth/register', { ...onboardingData, ...stepFields })
                    .then((res) => {
                        if (res.status == 201) {
                            // toast.success('You were successfully registered.');
                            router.replace('/register/confirm-email')
                        }
                    })
                    .catch((err) => {
                        if (err instanceof AxiosError) {
                            toast.error(err.response?.data?.data?.details?.join(' | ') || err.response?.data.message || 'An unknown error has occurred.')
                            console.log(err.response)
                        }
                        else {
                            console.log(err)
                        }
                    })

            }
        } else if (direction === 'BACK') {
            dispatch(onboardingPrevStep());
        }


    }

    useEffect(() => console.log(onboardingData), [onboardingData])

    return (
        <div className="relative mt-20 flex flex-col px-4 py-8 rounded-md bg-white shadow-md border items-center  border-stone-400 md:min-w-[500px]">
            <div className="flex flex-col justify-center items-center">
                {
                    onboardingStep == 1 ?
                        <>
                            <h3 className="font-medium md:text-xl">Welcome to BluE-Commerce</h3>
                            <span className="md:text-xs text-[0.6rem] text-wrap font-light">Convenient and affordable e-commerce with the highest quality products.</span>
                        </>
                        : onboardingStep == 2 ?
                            <>
                                <h3 className="font-medium md:text-xl">Extra Details</h3>
                                <span className="text-xs font-light">These informations will make it easier for us to give you the perfect experience</span>
                            </>
                            :
                            <>
                                <h3 className="font-medium text-xl">Just about ready</h3>
                                <span className="text-xs font-light">Almost good to go, we'll need these details for an even better experience.</span>
                            </>
                }
            </div>
            <form
                onSubmit={(e) => handleStep(e, 'NEXT')}
                className='flex flex-col pt-8 gap-4 w-full px-8 min-h-[400px]'>
                {currentForm}
                <div className='md:w-full flex gap-4 mt-auto'>
                    {
                        onboardingStep > 1 && <button
                            onClick={(e) => {
                                handleStep(e, 'BACK')
                            }}
                            type='button'
                            className='bg-white py-2 text-stone-600 rounded-md shadow-md hover:brightness-[95%] flex-1 transition-all duration-150 inline-flex items-center justify-center gap-2'><FaChevronLeft />Back</button>
                    }
                    <button
                        type='submit' className='bg-blue-600 py-2 text-white rounded-md shadow-md hover:brightness-[115%] flex-[2] transition-all duration-150 mt-auto inline-flex items-center justify-center gap-4'>{btnContent}</button>
                </div>
            </form>

            <span className='absolute bottom-1 right-1 text-xs text-stone-400'>{onboardingStep}/3</span>
        </div>
    )
}

export default RegisterForm