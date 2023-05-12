export const roots = {
  auth: {
    login: '/api/login',
    getUserData: '/get-user-data',
    forgetPassword: '/forget-password',
  },
  dashboard: {
    customersList: 'Customers/GetAllAsync',
    tanks: {
      tanksList: 'Tanks/GetAllAsync',
      CreateAsync: 'Tanks/CreateAsync',
      UpdateAsync: 'Tanks/UpdateAsync',
      Delete: 'Tanks/Delete',
      tankToggleStatus: 'switch_status_tanks'
    },
    drivers: {
      driversList: 'Drivers/GetAllAsync',
      createDriver: 'Drivers/CreateAsync',
      updateDriver: 'Drivers/UpdateAsync',
      deleteDriver: 'Drivers/Delete',
      getDriverById: 'Drivers/GetByIdAsync',
    },
    supervisors: {
      supervisorsList: 'SuperVisors/GetAllAsync',
      createSupervisor: 'SuperVisors/CreateAsync',
      updateSupervisor: 'SuperVisors/UpdateAsync',
      deleteSupervisor: 'SuperVisors/Delete',

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
