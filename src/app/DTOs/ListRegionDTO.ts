
 

    
    export class ListRegionDTO  {
        
        // ID
        public id: number = 0;
        // ARNAME
        public arName: string = null;
        // ENNAME
        public enName: string = null;
        // ISVIEW
        public isView: boolean = false;
        // COUNTRYID
        public countryId: number = 0;
        // COUNTRY
        public country: Country = null;
        // CITIES
        public cities: City[] = [];
    } 