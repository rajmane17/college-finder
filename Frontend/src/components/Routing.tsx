import { Route, Routes } from "react-router-dom";
import { AddCollege, CollegeProtectedWrapper, ForgotPassword, Home, Login, ProfilePage, Signup, UserProtectedWrapper } from "../pages";
import Unauthorized from "./Unauthorized";
import Error from "./Error";
import Layout from "./Layout";
import ContactForm from "../pages/ContactMe";
import ReviewOurApp from "../pages/ReviewOurPage";

export default function RoutingPage() {
    return (
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
            <Route path="/contact" element={
              <UserProtectedWrapper>
                <ContactForm />
              </UserProtectedWrapper>
            } />
            <Route path="/review" element={
              <UserProtectedWrapper>
                <ReviewOurApp />
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
    )
}