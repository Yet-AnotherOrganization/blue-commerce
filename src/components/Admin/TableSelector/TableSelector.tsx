import React from 'react'
import ProductsTable from '../ProductsTable';

type Props = {
    table?: string,
    data: any[]
}

const TableSelector = (props: Props) => {

    const {table = 'PRODUCT', data} = props;

  switch(table){
    case 'PRODUCT':
        return <ProductsTable data={data} />
  }
}

export default TableSelector