
 

    
    export class CreateDriverDTO  {
        
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
        // CREATEBY
        public createBy: number = 0;
    } 