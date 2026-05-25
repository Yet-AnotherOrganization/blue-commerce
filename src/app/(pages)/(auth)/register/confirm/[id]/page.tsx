import { prisma } from '@/lib/prisma';
import React from 'react'

type Props = {
  params: { id: string }
}

const Confirmed = async ({ params }: Props) => {

  const {id} = params;

  const user = await prisma.user.findFirst({
    where:{
      activateAccountCode: id
    }
  });



  return (
    user ?
    <div>{user.id}'s </div>
    :
    <div></div>
  )
}

export default Confirmed