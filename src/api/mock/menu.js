module.exports = {
    menus: [
      {
        key: 1,
        name: 'Machines',
        icon: 'laptop',
        child: [
          {
            name: 'Create Form',
            key: 102,
            url: '/form'
          },
          {
            name: 'Table',
            key: 103,
            url: '/table'
          },
          // {
          //   name: 'Calendar',
          //   key: 104,
          //   url: '/calendar'
          // },
          // {
          //   name: 'Timeline',
          //   key: 105,
          //   url: '/timeline'
          // },
          // {
          //   name: 'Steps',
          //   key: 106,
          //   url: '/steps'
          // },
          {
            name: 'Machines List',
            key: 107,
            url: '/table-list'
          },

        ]
      },
      {
        key: 2,
        name: 'Requests',
        icon: 'notification',
        child: [
          {
            name: 'Cards',
            key: 201,
            url: '/cards'
          },
          {
            name: 'Test',
            key: 202
          }
        ]
      }
    ]
  }
