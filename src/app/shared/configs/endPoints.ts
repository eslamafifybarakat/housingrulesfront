export const roots = {
  auth: {
    login: '/api/login',
    getUserData: '/get-user-data',
    forgetPassword: '/forget-password',
  },
  dashboard: {
    tanks: {
      tanksList: 'Tanks/GetAllAsync',
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
      supervisorsList: 'supervisors',
      supervisorToggleStatus: 'switch_status_supervisors'
    },
    orders: {
      ordersList: 'orders'
    },
  }
}
