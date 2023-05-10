
 

    
    export class ListOrderHistoryDTO  {
        
        // ORDERID
        public orderId: number = 0;
        // OLDSTATUS
        public oldStatus: OrderStatus = OrderStatus.Pending;
        // NEWSTATUS
        public newStatus: OrderStatus = OrderStatus.Pending;
        // ORDER
        public order: OrderDTO = null;
    } 