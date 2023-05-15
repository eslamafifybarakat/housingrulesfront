



    export class CreateTankDTO  {

        // NAME
        public name: string = null;
        // TANKSIZE
        public tankSize: TankSize = TankSize.Size13;
        // plateNumber
        public plateNumber: string = null;
        // ISWORKING
        public isWorking: boolean = false;
        // ISAVAILABLE
        public isAvailable: boolean = false;
        // CREATEBY
        public createBy: number = 0;
    }
