export const roots = {
  auth: {
    login: '/Auth/login',
    getUserData: '/get-user-data',
    forgetPassword: '/forget-password',
  },
  dashboard: {
    customersList: 'Customers/GetAllAsync',
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
      ordersList: 'Orders/GetAllAsync',
      crateOrder: 'Orders/CreateAsync',
      updateOrder: 'Orders/UpdateAsync',
      getOrderById: 'Orders/GetByIdAsync',
    },
    users: {
      usersList: 'Auth/GetUsers',
      crateUser: 'Auth/CreateAsync',
      updateUser: 'Auth/UpdateAsync',
      getUserById: 'Auth/GetByIdAsync',
      resetPassword: 'Auth/reset-password',
    },
  }
}
