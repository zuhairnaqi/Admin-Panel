export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      badge: {
        variant: 'info',
        text: 'NEW',
      },
    },
    // {
    //   title: true,
    //   name: 'Dashboard',
    //   wrapper: {            // optional wrapper object
    //     element: '',        // required valid HTML5 element tag
    //     attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    //   },
    //   class: ''             // optional class names space delimited list for title item ex: "text-center"
    // },
    // {
    //   name: 'Failed Images',
    //   url: '/theme/colors',
    //   icon: 'icon-drop',
    // },
    // {
    //   name: 'Failed Mangas',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
    // {
    //   name: 'Missing Chapters',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
    {
      title: true,
      name: 'Main Navigation',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Updates',
      url: '/base',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Check for updates',
          url: '/base/checkforupdates',
          icon: 'icon-puzzle',
        },
        {
          name: 'Failed Mangas',
          url: '/base/failedMangas',
          icon: 'icon-puzzle',
        },
        // {
        //   name: 'Failed Chapters',
        //   url: '/base/failedChapters',
        //   icon: 'icon-puzzle',
        // }
      ],
    },
    {
      title: true,
      name: 'Mangas',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''        
    },
    {
      name: 'Mangas',
      url: '/manga',
      icon: 'icon-cursor',
    },
    {
      title: true,
      name: 'Chapters',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''        
    },
    {
      name: 'Chapters',
      url: '/chapters',
      icon: 'icon-pie-chart',
    },
    {
      title: true,
      name: 'Logout',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''        
    },
    {
      name: 'Logout',
      url: '/icons',
      icon: 'icon-logout',
    },
  ],
};
