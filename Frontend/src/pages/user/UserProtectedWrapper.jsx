/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const UserProtectedWrapper = ({children}) => {

    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    
    // Use this for debugging
    // const state = useSelector((state) => state);
    // console.log(state);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        if ( !accessToken || !isAuthenticated) {
            navigate("/login");
        }
    }, [accessToken, isAuthenticated])

  return (
    <>
      {children}
    </>
  )
}

export default UserProtectedWrapper
