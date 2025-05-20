import { Routes, Route } from "react-router-dom"
import { Login, Signup, Home, UserProtectedWrapper, ProfilePage, ForgotPassword, AddCollege, CollegeProtectedWrapper } from "./pages"
import { Error, Layout } from "./components"
import Unauthorized from "./components/Unauthorized"
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

function App() {

  const client = new QueryClient();

  return (
    <>
      <QueryClientProvider client={client}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Error />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* This layout element will help us to keep navbar on every route without re-rendering */}
          <Route path="/" element={<Layout />}>
            <Route path="/" element={
              <UserProtectedWrapper>
                <Home />
              </UserProtectedWrapper>
            } />
            <Route path="/profile" element={
              <UserProtectedWrapper>
                <ProfilePage />
              </UserProtectedWrapper>
            } />

            {/* college-protected routes */}
            <Route path="/add-college" element={
              <UserProtectedWrapper>
                <CollegeProtectedWrapper>
                  <AddCollege />
                </CollegeProtectedWrapper>
              </UserProtectedWrapper>
            } />
          </Route>
        </Routes>
      </QueryClientProvider>
    </>
  )
}

export default App
