import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.page').then( m => m.WelcomePage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'groups',
    loadComponent: () => import('./pages/groups/groups.page').then( m => m.GroupsPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'group/:groupName',
    loadComponent: () => import('./pages/group/group.page').then( m => m.GroupPage)
  },
  {
    path: 'upcoming',
    loadComponent: () => import('./pages/upcoming/upcoming.page').then( m => m.UpcomingPage)
  },
  {
    path: 'knockouts',
    loadComponent: () => import('./pages/knockouts/knockouts.page').then( m => m.KnockoutsPage)
  },
  {
    path: 'played',
    loadComponent: () => import('./pages/played/played.page').then( m => m.PlayedPage)
  },
];
