/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import { MapPin } from 'lucide-react';
import { useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const CollegeCard = ({imageUrl="", city="", collegeName=""}) => {

    const isDarkMode = useSelector((state) => state.theme.darkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <Card className={`${isDarkMode ? "dark:bg-zinc-900" : "bg-gray-600"} max-w-md overflow-hidden rounded-md border-0 my-4 mx-4 border-2`}>
            {/* Image Section */}
            <div className="w-full h-45 min-w-xl">
                <img
                    src={imageUrl}
                    alt="college-image"
                    className="object-fit w-full h-full"/>
            </div>
            {/* <Separator /> */}
            {/* Card Content */}
            <CardContent className="flex flex-col items-start px-4 py-6">
                <h2 className="text-2xl font-bold text-white">{collegeName}</h2>
                <div className="mt-2 flex gap-2 text-white font-semi-bold">
                    <MapPin size={24} className="text-gray-500" />
                    <p>{city}</p>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-md">
                    <Link to="/college">View Details</Link>
                </Button>
            </CardFooter>
        </Card>


    );
};

export default CollegeCard;