"use client"


const SessionWrapper =  ({children}) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  )
}

export default SessionWrapper
