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
      supervisorsList: 'Tanks/GetAllAsync',
      createSupervisor: 'Tanks/CreateAsync',
      updateSupervisor: 'Tanks/UpdateAsync',
      deleteSupervisor: 'Tanks/Delete',
      // supervisorsList: 'SuperVisors/GetAllAsync',
      // createSupervisor: 'SuperVisors/CreateAsync',
      // updateSupervisor: 'SuperVisors/UpdateAsync',
      // deleteSupervisor: 'SuperVisors/Delete',

      supervisorToggleStatus: 'switch_status_supervisors'
    },
    orders: {
      ordersList: 'orders'
    },
  }
}
