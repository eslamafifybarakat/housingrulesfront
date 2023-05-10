
 

    
    export class UpdateDriverDTO  {
        
        // ID
        public id: number = 0;
        // NAME
        public name: string = null;
        // TANKID
        public tankId: number = 0;
        // SUPERVISORID
        public supervisorId: number = 0;
        // DRIVERSTATUS
        public driverStatus: DriverStatus = DriverStatus.Available;
        // USERID
        public userId: string = null;
        // LASTMODIFIEDBY
        public lastModifiedBy: number = 0;
    } 