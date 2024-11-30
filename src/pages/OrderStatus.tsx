import React, { useEffect, useState } from 'react'

interface OrderStatus{
    order_id : number;
    status : string;
}

class OrderStatus extends Component<Props, State> {
  state = {}

  render() {
    return (
      <div>OrderStatus</div>
    )
  }
}

export default OrderStatus