import { TankSize } from "../enums";




    export class TankDTO  {

        // ID
        public id: number = 0;
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
    }
