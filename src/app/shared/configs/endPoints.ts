export const roots = {
  auth: {
    login: '/Auth/login',
    getUserData: '/get-user-data',
    forgetPassword: '/forget-password',
  },
  dashboard: {
    customersList: 'Customers/GetAllAsync',
    districtsList: 'Regions/GetAllDistrictsAsync',
    tanks: {
      tanksList: 'Tanks/GetAllAsync',
      CreateAsync: 'Tanks/CreateAsync',
      UpdateAsync: 'Tanks/UpdateAsync',
      Delete: 'Tanks/SoftDelete',
      tankToggleStatus: 'switch_status_tanks'
    },
    serviceAgents: {
      serviceAgentsList: 'ServicesAgents/GetAllAsync',
      CreateAsync: 'ServicesAgents/CreateAsync',
      UpdateAsync: 'ServicesAgents/UpdateAsync',
      Delete: 'ServicesAgents/SoftDelete',
      serviceAgentToggleStatus: 'switch_status_service_agent'
    },
    addressedPlaces: {
      getAllAddresses: 'AddressedPlaces/GetAllAsync',
      createAddress: 'AddressedPlaces/CreateAsync',
      updateAddress: 'AddressedPlaces/UpdateAsync',
      deleteAddress:'AddressedPlaces/SoftDelete',
      getByIdAsync:'AddressedPlaces/GetByIdAsync',
      GetAllByCustomerIdAsync:'AddressedPlaces/GetAllByCustomerIdAsync'
    },
    drivers: {
      driversList: 'Drivers/GetAllAsync',
      createDriver: 'Drivers/CreateAsync',
      updateDriver: 'Drivers/UpdateAsync',
      deleteDriver: 'Drivers/SoftDelete',
      getDriverById: 'Drivers/GetByIdAsync',
    },
    supervisors: {
      supervisorsList: 'SuperVisors/GetAllAsync',
      createSupervisor: 'SuperVisors/CreateAsync',
      updateSupervisor: 'SuperVisors/UpdateAsync',
      deleteSupervisor: 'SuperVisors/SoftDelete',

      supervisorToggleStatus: 'switch_status_supervisors'
    },
    orders: {
      gatesList: 'Orders/GetAllOrderForSettlement',
      updateOrderDriverArrivedAtStation: 'Orders/DriverArrivedAtStation',
      updateOrderComplete: 'Orders/CompleteOrder',
      confirmSettlementeOrderList: 'Settlement/CreateOrderRecivable',
      orderDriverArrivedToStationList: 'Orders/GetAllOrderDriverArrivedToStation',
      ordersList: 'Orders/GetAllAsync',
      ordersByTypeList: 'Orders/GetOrdersByUserIdParm',
      crateOrder: 'Orders/CreateAsync',
      updateOrder: 'Orders/UpdateAsync',
      getOrderById: 'Orders/GetByIdAsync',
      checkCustomerHasOpendedOrders: 'Orders/GetOrderByCustomerIdAsync',
      GetOrdersQL: 'Orders/GetOrdersQL',
      cancelOrder: "Orders/CancelOrder",
      getByIdAsync: 'Orders/GetByIdAsync'
    },
    users: {
      usersList: 'Auth/GetUsers',
      crateUser: 'Auth/CreateAsync',
      updateUser: 'Auth/UpdateAsync',
      getUserById: 'Auth/GetByIdAsync',
      resetPassword: 'Auth/reset-password',
      Delete:'Auth/DeleteUserAsync'
    },
    customers: {
      customersList: 'Customers/GetAllAsync',
      customersShortList: 'Customers/GetAllShortAsync',
      createCustomer: 'Customers/CreateAsync',
      updateCustomer: 'Customers/UpdateAsync',
      getCustomerById: 'Customers/GetByIdAsync',
      deleteCustomer: 'Customers/SoftDelete',
      CanSubmitOrder: 'Customers/CanSubmitOrder',
      createAsyncSchudle: 'Customers/CreateAsyncSchudle',
      getByIdAsyncOrderSchedule: 'Customers/GetByIdAsyncOrderSchedule',
      getByIdAsync: 'Customers/GetByIdAsync'
    },
    financialSettlements: {
      getUsersByUserType: 'Auth/GetUsersByUserType?userType=7',
      getAllByRecivedByAsync: 'Settlement/GetAllOrderRecivableAsync',
      createAsync: 'FinancialSettlementes/CreateAsync'
    },
    reports: {
      getReportsCategory: "getReportsCategory",
      downloadOrdersExample: 'orders_sample',
      orderDetailsList: 'Orders/GetAllAsync',
      orderSearch: 'order-search',
    }
  }
}
