import React from 'react';
import DefaultLayout from './containers/DefaultLayout';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Manga = React.lazy(() => import('./views/manga'));
const Chapters = React.lazy(() => import('./views/Chapters'));
const ShowChapter = React.lazy(() => import('./views/Chapters/ShowChapter'));
const EditChapter = React.lazy(() => import('./views/Chapters/Edit Chapter/EditChapter'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const MangaDetails = React.lazy(() => import('./views/manga/ShowDetails'));
const EditManga = React.lazy(() => import('./views/manga/Edit Manga/EditManga'));


// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: DefaultLayout },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/failedMangas', name: 'Failed-mangas', component: Cards },
  { path: '/base/failedImages', name: 'Failed-images', component: Breadcrumbs },
  { path: '/base/failedChapters', name: 'Failed-chapters', component: Carousels },
  { path: '/manga', exact: true, name: 'Manga', component: Manga },
  { path: '/manga/ShowDetails', exact: true, name: 'Manga-Details', component: MangaDetails },
  { path: '/manga/ShowDetails/EditManga', exact: true, name: 'Edit-Manga-Details', component: EditManga },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/chapters',exact: true, name: 'Chapters', component: Chapters },
  { path: '/chapters/ShowChapter:id',exact: true, name: 'ShowChapter', component: ShowChapter },
  { path: '/chapters/ShowChapter/EditChapter',exact: true, name: 'Edit Chapter', component: EditChapter },
  { path: '/users', exact: true,  name: 'Users', component: Users },
  { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
