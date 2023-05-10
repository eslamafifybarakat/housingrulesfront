 export  enum OrderStatus
{
    Pending = 0,// "AUTOMATIC",

    AssignedToDriver = 1, // ( FIELDUSER )

    DriverArrivedToCustomer = 2, // ( FIELDUSER )

    DriverArrivedAtStation = 3, // ( GATE1USER ) - not allowed to Cancel

    Completed = 4, // ( GATE2USER ) - not allowed to Cancel

    Cancelled = 5
}
export enum PropertyType
{

    Residential,

     Governmental,

     Commercial
}
export enum PaymentMethod
{
     Cash,
     Mada,
     Transfer,
     Credit
}
export enum DriverStatus
{
     Available,
     Busy,
     Away
}
export enum TankSize
{
    Size13, Size20, Size32
}
export enum OrderOrigin
{
    WhatsApp, TMS, Call
}
export enum CancellatinCauses
{
    Inquiry, PriceIssue, UncoveredLocation
}
export enum WalletStatus
{
    Active = 1,
    Inactive = 2,
    Deleted = 3,
    Suspended = 4
}
export enum WalletTransactionType
{
    Deposit = 1,
    Withdraw = 2,
    Allocate = 3
}
export enum WalletTransactionSource
{
    PaymentGetway = 1,
    ManualEntry = 2,
    InternalSettlement = 3
}
