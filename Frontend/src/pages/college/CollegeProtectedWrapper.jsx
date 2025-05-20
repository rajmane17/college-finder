/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useEffect } from "react"

const CollegeProtectedWrapper = ({ children }) => {
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");

    const applicantType = useSelector((state) => state.auth.applicantType);

    useEffect(() => {
        if (applicantType !== "reviewer" || !accessToken) {
            navigate("/unauthorized");
        }
    }, [accessToken, applicantType])

    return (
        <>
            {children}
        </>
    )
}

export default CollegeProtectedWrapper;