import * as React from 'react'
import {useAsync, getUser, useLocalStorage} from 'utils/utils'
// import {FullPageSpinner, FullPageErrorFallback} from 'components/lib'

async function bootstrapAppData() {
    const loggedInUserID = useLocalStorage({key:'currentUser'})?.id ?? 1
    const user = await getUser({userID: loggedInUserID})
    return user
  }

const AuthContext = React.createContext()
AuthContext.displayName = 'AuthContext'

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    run,
    setData,
  } = useAsync()

  React.useEffect(() => {
    const appDataPromise = bootstrapAppData()
    run(appDataPromise)
  }, [run])

  const login = React.useCallback(
    // This should actually do something in the future, for now, we're just
    // setting the current user to whatever user object we're passed
    user => setData(user),
    [setData],
  )

  const value = React.useMemo(
    () => ({user, login}),
    [user, login],
  )

  if (isLoading || isIdle) {
    return 'loading'
    // return <FullPageSpinner />
  }

  if (isError) {
    return 'error'
    // return <FullPageErrorFallback error={error} />
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />
  }

  throw new Error(`Unhandled status: ${status}`)
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`)
  }
  return context
}

function useClient() {
  const {user} = useAuth()
  const token = user?.token
  return React.useCallback(
    (endpoint, config) => client(endpoint, {...config, token}),
    [token],
  )
}

export {AuthProvider, useAuth, useClient}
