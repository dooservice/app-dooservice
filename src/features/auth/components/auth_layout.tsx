import * as React from 'react'
import { Link } from 'react-router-dom'
import Logo from '@/components/logo'
import { Card, CardContent, CardFooter } from '@/components/card'

interface AuthLayoutProps extends React.PropsWithChildren {
  title: string
  action?: string | React.ReactNode
  wide?: boolean
}

const AuthLayout: React.FunctionComponent<AuthLayoutProps> = ({ title, action, wide, children }) => (
  <div className={`flex min-h-screen flex-1 space-y-6 flex-col justify-center sm:mx-auto sm:w-full ${wide ? 'sm:max-w-md' : 'sm:max-w-sm'}`}>
    <div className="flex justify-center">
      <Link to="/" className="flex items-center space-x-4">
        <Logo className="h-12 w-12" width={48} height={48} />
      </Link>
    </div>
    <Card>
      <CardContent>
        <header>
          <h2 className="mt-2 text-center text-3xl italic leading-9 tracking-tight text-neutral-800 dark:text-neutral-200 font-instrument">
            {title}
          </h2>
        </header>
      </CardContent>
      <CardFooter className="block py-6">{children}</CardFooter>
    </Card>
    {action ? <p className="text-sm text-center font-medium text-neutral-500 dark:text-neutral-400">{action}</p> : null}
  </div>
)

export default AuthLayout
