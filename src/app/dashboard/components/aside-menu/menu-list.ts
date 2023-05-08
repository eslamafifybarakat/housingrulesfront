export const menuList = [
  {
    id: 'dashboard',
    text: 'Dashboard',
    icon: 'fa-house',
    routerLink: '/dashboard',
    state: false
  },
  {
    id: 'provider',
    text: 'Provider',
    icon: 'fa-user',
    routerLink: '/dashboard/users',
    state: false
  },
  {
    id: 'calendar',
    text: 'Calendar',
    icon: 'fa-calendar-day',
    routerLink: '/dashboard/calendar',
    state: false
  },
  {
    id: 'serviceLocation',
    text: 'Service Location',
    icon: 'fa-list-check',
    routerLink: 'f',
    state: false
  },
  {
    id: 'steppers',
    text: 'Steppers',
    icon: 'pi pi-pause',
    state: false,
    children: [
      {
        text: 'Individual Steps',
        icon: 'pi pi-users',
        routerLink: '/dashboard/individual-steps',
        state: false
      },
      {
        text: 'Dependant Steps',
        icon: 'layers',
        routerLink: '/dashboard/dependant-steps',
        state: false
      },
      {
        text: 'Cutomize Stepper',
        icon: 'layers',
        routerLink: '/dashboard/cutomize-steps',
        state: false
      },
    ],
  },
  {
    id: 'test',
    text: 'Test',
    icon: 'pi pi-pause',
    state: false,
    children: [
      {
        text: 'individual-steps',
        icon: 'pi pi-users',
        routerLink: '/dashboard/individual-steps',
        state: false
      },
      {
        text: 'dependant-steps',
        icon: 'layers',
        routerLink: '/dashboard/dependant-steps',
        state: false
      },
    ],
  },
  {
    id: 'appointments',
    text: 'Appointments',
    icon: 'fa-list-check',
    routerLink: 's',
    state: false
  },
  {
    id: 'patients',
    text: 'Patients',
    icon: 'fa-user',
    routerLink: 'a',
    state: false
  },
  {
    text: 'sideMenu.dates',
    icon: 'fa-user',
    routerLink: '/dashboard/dates',
    state: false
  },
  {
    id: 'suit',
    text: 'Suit',
    icon: 'fa-suitcase',
    state: false,
    children: [
      {
        text: 'Category',
        icon: 'category',
        routerLink: '/product/category',
      },
      {
        text: 'Sub Category',
        icon: 'layers',
        routerLink: '/product/sub-category',
      },
      {
        text: 'Product',
        icon: 'all_inbox',
        routerLink: '/product/manage',
      },
    ],
  },
  // {
  //   text: 'Suit',
  //   icon: 'fa-suitcase',
  //   state: false,
  //   children: [
  //     {
  //       text: 'Category',
  //       icon: 'category',
  //       routerLink: '/product/category',
  //     },
  //     {
  //       text: 'Sub Category',
  //       icon: 'layers',
  //       routerLink: '/product/sub-category',
  //     },
  //     {
  //       text: 'Product',
  //       icon: 'all_inbox',
  //       routerLink: '/product/manage',
  //     },
  //   ],
  // },
  // {
  //   text: 'Suit',
  //   icon: 'fa-suitcase',
  //   state: false,
  //   children: [
  //     {
  //       text: 'Category',
  //       icon: 'category',
  //       routerLink: '/product/category',
  //     },
  //     {
  //       text: 'Sub Category',
  //       icon: 'layers',
  //       routerLink: '/product/sub-category',
  //     },
  //     {
  //       text: 'Product',
  //       icon: 'all_inbox',
  //       routerLink: '/product/manage',
  //     },
  //   ],
  // },

];
