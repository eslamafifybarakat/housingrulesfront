export const roots = {
  auth: {
    login: '/api/login',
    getUserData: '/get-user-data',
    forgetPassword: '/forget-password',
  },
  dashboard: {
    tanks: {
      tanksList: 'Tanks/GetAllAsync',
      CreateAsync: 'Tanks/CreateAsync',
      UpdateAsync: 'Tanks/UpdateAsync',
      tankToggleStatus: 'switch_status_tanks'
    },
    drivers: {
      driversList: 'drivers',
      getDriverById: '/drivers/get_data',
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
