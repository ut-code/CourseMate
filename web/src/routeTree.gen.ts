/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'

// Create Virtual Routes

const SignupLazyImport = createFileRoute('/signup')()
const LoginLazyImport = createFileRoute('/login')()
const HomeLazyImport = createFileRoute('/home')()
const FriendsLazyImport = createFileRoute('/friends')()
const ChatLazyImport = createFileRoute('/chat')()
const SettingsIndexLazyImport = createFileRoute('/settings/')()
const SettingsProfileLazyImport = createFileRoute('/settings/profile')()
const SettingsDisclaimerLazyImport = createFileRoute('/settings/disclaimer')()
const SettingsContactLazyImport = createFileRoute('/settings/contact')()
const SettingsAboutUsLazyImport = createFileRoute('/settings/about-us')()
const EditProfileLazyImport = createFileRoute('/edit/profile')()
const EditCoursesLazyImport = createFileRoute('/edit/courses')()
const ChatIdLazyImport = createFileRoute('/chat/$id')()

// Create/Update Routes

const SignupLazyRoute = SignupLazyImport.update({
  path: '/signup',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/signup.lazy').then((d) => d.Route))

const LoginLazyRoute = LoginLazyImport.update({
  path: '/login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/login.lazy').then((d) => d.Route))

const HomeLazyRoute = HomeLazyImport.update({
  path: '/home',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/home.lazy').then((d) => d.Route))

const FriendsLazyRoute = FriendsLazyImport.update({
  path: '/friends',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/friends.lazy').then((d) => d.Route))

const ChatLazyRoute = ChatLazyImport.update({
  path: '/chat',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/chat.lazy').then((d) => d.Route))

const SettingsIndexLazyRoute = SettingsIndexLazyImport.update({
  path: '/settings/',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/index.lazy').then((d) => d.Route),
)

const SettingsProfileLazyRoute = SettingsProfileLazyImport.update({
  path: '/settings/profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/profile.lazy').then((d) => d.Route),
)

const SettingsDisclaimerLazyRoute = SettingsDisclaimerLazyImport.update({
  path: '/settings/disclaimer',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/disclaimer.lazy').then((d) => d.Route),
)

const SettingsContactLazyRoute = SettingsContactLazyImport.update({
  path: '/settings/contact',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/contact.lazy').then((d) => d.Route),
)

const SettingsAboutUsLazyRoute = SettingsAboutUsLazyImport.update({
  path: '/settings/about-us',
  getParentRoute: () => rootRoute,
} as any).lazy(() =>
  import('./routes/settings/about-us.lazy').then((d) => d.Route),
)

const EditProfileLazyRoute = EditProfileLazyImport.update({
  path: '/edit/profile',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/edit/profile.lazy').then((d) => d.Route))

const EditCoursesLazyRoute = EditCoursesLazyImport.update({
  path: '/edit/courses',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/edit/courses.lazy').then((d) => d.Route))

const ChatIdLazyRoute = ChatIdLazyImport.update({
  path: '/chat/$id',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/chat_.$id.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/chat': {
      id: '/chat'
      path: '/chat'
      fullPath: '/chat'
      preLoaderRoute: typeof ChatLazyImport
      parentRoute: typeof rootRoute
    }
    '/friends': {
      id: '/friends'
      path: '/friends'
      fullPath: '/friends'
      preLoaderRoute: typeof FriendsLazyImport
      parentRoute: typeof rootRoute
    }
    '/home': {
      id: '/home'
      path: '/home'
      fullPath: '/home'
      preLoaderRoute: typeof HomeLazyImport
      parentRoute: typeof rootRoute
    }
    '/login': {
      id: '/login'
      path: '/login'
      fullPath: '/login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
    '/signup': {
      id: '/signup'
      path: '/signup'
      fullPath: '/signup'
      preLoaderRoute: typeof SignupLazyImport
      parentRoute: typeof rootRoute
    }
    '/chat/$id': {
      id: '/chat/$id'
      path: '/chat/$id'
      fullPath: '/chat/$id'
      preLoaderRoute: typeof ChatIdLazyImport
      parentRoute: typeof rootRoute
    }
    '/edit/courses': {
      id: '/edit/courses'
      path: '/edit/courses'
      fullPath: '/edit/courses'
      preLoaderRoute: typeof EditCoursesLazyImport
      parentRoute: typeof rootRoute
    }
    '/edit/profile': {
      id: '/edit/profile'
      path: '/edit/profile'
      fullPath: '/edit/profile'
      preLoaderRoute: typeof EditProfileLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/about-us': {
      id: '/settings/about-us'
      path: '/settings/about-us'
      fullPath: '/settings/about-us'
      preLoaderRoute: typeof SettingsAboutUsLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/contact': {
      id: '/settings/contact'
      path: '/settings/contact'
      fullPath: '/settings/contact'
      preLoaderRoute: typeof SettingsContactLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/disclaimer': {
      id: '/settings/disclaimer'
      path: '/settings/disclaimer'
      fullPath: '/settings/disclaimer'
      preLoaderRoute: typeof SettingsDisclaimerLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/profile': {
      id: '/settings/profile'
      path: '/settings/profile'
      fullPath: '/settings/profile'
      preLoaderRoute: typeof SettingsProfileLazyImport
      parentRoute: typeof rootRoute
    }
    '/settings/': {
      id: '/settings/'
      path: '/settings'
      fullPath: '/settings'
      preLoaderRoute: typeof SettingsIndexLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/chat': typeof ChatLazyRoute
  '/friends': typeof FriendsLazyRoute
  '/home': typeof HomeLazyRoute
  '/login': typeof LoginLazyRoute
  '/signup': typeof SignupLazyRoute
  '/chat/$id': typeof ChatIdLazyRoute
  '/edit/courses': typeof EditCoursesLazyRoute
  '/edit/profile': typeof EditProfileLazyRoute
  '/settings/about-us': typeof SettingsAboutUsLazyRoute
  '/settings/contact': typeof SettingsContactLazyRoute
  '/settings/disclaimer': typeof SettingsDisclaimerLazyRoute
  '/settings/profile': typeof SettingsProfileLazyRoute
  '/settings': typeof SettingsIndexLazyRoute
}

export interface FileRoutesByTo {
  '/chat': typeof ChatLazyRoute
  '/friends': typeof FriendsLazyRoute
  '/home': typeof HomeLazyRoute
  '/login': typeof LoginLazyRoute
  '/signup': typeof SignupLazyRoute
  '/chat/$id': typeof ChatIdLazyRoute
  '/edit/courses': typeof EditCoursesLazyRoute
  '/edit/profile': typeof EditProfileLazyRoute
  '/settings/about-us': typeof SettingsAboutUsLazyRoute
  '/settings/contact': typeof SettingsContactLazyRoute
  '/settings/disclaimer': typeof SettingsDisclaimerLazyRoute
  '/settings/profile': typeof SettingsProfileLazyRoute
  '/settings': typeof SettingsIndexLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/chat': typeof ChatLazyRoute
  '/friends': typeof FriendsLazyRoute
  '/home': typeof HomeLazyRoute
  '/login': typeof LoginLazyRoute
  '/signup': typeof SignupLazyRoute
  '/chat/$id': typeof ChatIdLazyRoute
  '/edit/courses': typeof EditCoursesLazyRoute
  '/edit/profile': typeof EditProfileLazyRoute
  '/settings/about-us': typeof SettingsAboutUsLazyRoute
  '/settings/contact': typeof SettingsContactLazyRoute
  '/settings/disclaimer': typeof SettingsDisclaimerLazyRoute
  '/settings/profile': typeof SettingsProfileLazyRoute
  '/settings/': typeof SettingsIndexLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/chat'
    | '/friends'
    | '/home'
    | '/login'
    | '/signup'
    | '/chat/$id'
    | '/edit/courses'
    | '/edit/profile'
    | '/settings/about-us'
    | '/settings/contact'
    | '/settings/disclaimer'
    | '/settings/profile'
    | '/settings'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/chat'
    | '/friends'
    | '/home'
    | '/login'
    | '/signup'
    | '/chat/$id'
    | '/edit/courses'
    | '/edit/profile'
    | '/settings/about-us'
    | '/settings/contact'
    | '/settings/disclaimer'
    | '/settings/profile'
    | '/settings'
  id:
    | '__root__'
    | '/chat'
    | '/friends'
    | '/home'
    | '/login'
    | '/signup'
    | '/chat/$id'
    | '/edit/courses'
    | '/edit/profile'
    | '/settings/about-us'
    | '/settings/contact'
    | '/settings/disclaimer'
    | '/settings/profile'
    | '/settings/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  ChatLazyRoute: typeof ChatLazyRoute
  FriendsLazyRoute: typeof FriendsLazyRoute
  HomeLazyRoute: typeof HomeLazyRoute
  LoginLazyRoute: typeof LoginLazyRoute
  SignupLazyRoute: typeof SignupLazyRoute
  ChatIdLazyRoute: typeof ChatIdLazyRoute
  EditCoursesLazyRoute: typeof EditCoursesLazyRoute
  EditProfileLazyRoute: typeof EditProfileLazyRoute
  SettingsAboutUsLazyRoute: typeof SettingsAboutUsLazyRoute
  SettingsContactLazyRoute: typeof SettingsContactLazyRoute
  SettingsDisclaimerLazyRoute: typeof SettingsDisclaimerLazyRoute
  SettingsProfileLazyRoute: typeof SettingsProfileLazyRoute
  SettingsIndexLazyRoute: typeof SettingsIndexLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  ChatLazyRoute: ChatLazyRoute,
  FriendsLazyRoute: FriendsLazyRoute,
  HomeLazyRoute: HomeLazyRoute,
  LoginLazyRoute: LoginLazyRoute,
  SignupLazyRoute: SignupLazyRoute,
  ChatIdLazyRoute: ChatIdLazyRoute,
  EditCoursesLazyRoute: EditCoursesLazyRoute,
  EditProfileLazyRoute: EditProfileLazyRoute,
  SettingsAboutUsLazyRoute: SettingsAboutUsLazyRoute,
  SettingsContactLazyRoute: SettingsContactLazyRoute,
  SettingsDisclaimerLazyRoute: SettingsDisclaimerLazyRoute,
  SettingsProfileLazyRoute: SettingsProfileLazyRoute,
  SettingsIndexLazyRoute: SettingsIndexLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/chat",
        "/friends",
        "/home",
        "/login",
        "/signup",
        "/chat/$id",
        "/edit/courses",
        "/edit/profile",
        "/settings/about-us",
        "/settings/contact",
        "/settings/disclaimer",
        "/settings/profile",
        "/settings/"
      ]
    },
    "/chat": {
      "filePath": "chat.lazy.tsx"
    },
    "/friends": {
      "filePath": "friends.lazy.tsx"
    },
    "/home": {
      "filePath": "home.lazy.tsx"
    },
    "/login": {
      "filePath": "login.lazy.tsx"
    },
    "/signup": {
      "filePath": "signup.lazy.tsx"
    },
    "/chat/$id": {
      "filePath": "chat_.$id.lazy.tsx"
    },
    "/edit/courses": {
      "filePath": "edit/courses.lazy.tsx"
    },
    "/edit/profile": {
      "filePath": "edit/profile.lazy.tsx"
    },
    "/settings/about-us": {
      "filePath": "settings/about-us.lazy.tsx"
    },
    "/settings/contact": {
      "filePath": "settings/contact.lazy.tsx"
    },
    "/settings/disclaimer": {
      "filePath": "settings/disclaimer.lazy.tsx"
    },
    "/settings/profile": {
      "filePath": "settings/profile.lazy.tsx"
    },
    "/settings/": {
      "filePath": "settings/index.lazy.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
