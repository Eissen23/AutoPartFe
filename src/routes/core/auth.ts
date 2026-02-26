import { lazy } from 'react'
import type { RouteObject } from 'react-router'

const LoginPage = lazy(() => import("#src/pages/auths/login"))
const SignUpPage = lazy(() => import('#src/pages/auths/signup'))

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    Component : LoginPage
  },
  {
    path: '/signup',
    Component: SignUpPage
  },
]
