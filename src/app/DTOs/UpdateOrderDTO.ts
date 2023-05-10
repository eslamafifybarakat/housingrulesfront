
 

    
    export class UpdateOrderDTO  {
        
        // ID
        public id: string = null;
        // DATETIME
        public dateTime: Date = new Date(0);
        // ORDERORIGIN
        public orderOrigin: OrderOrigin = OrderOrigin.WhatsApp;
        // PROPERTYTYPE
        public propertyType: PropertyType = PropertyType.Residential;
        // CUSTOMERMOBILENUMBER
        public customerMobileNumber: number = 0;
        // DISTRICT
        public district: string = null;
        // LOCATIONLINK
        public locationLink: string = null;
        // TANKSIZE
        public tankSize: TankSize = TankSize.Size13;
        // STATUS
        public status: OrderStatus = OrderStatus.Pending;
        // PAYMENTMETHOD
        public paymentMethod: PaymentMethod = PaymentMethod.Cash;
        // PAIDAMOUNT
        public paidAmount: number = 0;
        // SUPERVISORID
        public supervisorId: number = null;
        // CUSTOMERID
        public customerId: number = null;
        // COMMENTS
        public comments: string = null;
        // LASTMODIFIEDBY
        public lastModifiedBy: number = null;
    } 