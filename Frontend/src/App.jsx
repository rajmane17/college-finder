import { Routes, Route } from "react-router-dom"
import { Login, Signup, Home, UserProtectedWrapper, ProfilePage, ForgotPassword } from "./pages"
import { Error, Layout } from "./components"

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/forgot-password" element={<ForgotPassword />}/>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />

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
        </Route>
      </Routes>
    </>
  )
}

export default App
