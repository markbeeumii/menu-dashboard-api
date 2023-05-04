const submenus = [
  {
    name: 'Dashboard',
    url: '/'
  },
  {
    name: 'Category',
    url: '',
    children: [
      {
        name: 'Category List',
        url: '/category/list'
      },
      {    
        name: 'Add Category',
        url: '/category/create'
      }
    ]
  },
  {
    name: 'Menus',
    url: '',
    children: [
      {
        name: 'Menu List',
        url: '/menu/list'
      },
      {    
        name: 'Add Menu',
        url: '/menu/create'
      }
    ]
  }
]

export default submenus;