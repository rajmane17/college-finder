import React from "react";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";

const AddCollege = () => {
    const isDark = useSelector((state) => state.theme.darkMode);
    const navigate = useNavigate();
    const [error, setError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [collegeImage, setCollegeImage] = React.useState(null);
    const [tempImage, setTempImage] = React.useState(null);
    const [programInput, setProgramInput] = React.useState("");

    const [formData, setFormData] = React.useState({
        name: "",
        description: "",
        location: "",
        city: "",
        programs: [],
        collegeImage: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        //get the file
        const file = e.target.files[0];
        setCollegeImage(file);

        // This will help to show the image preview
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const handleAddProgram = () => {
        if (programInput.trim()) {
            setFormData((prev) => ({
                ...prev,
                programs: [...prev.programs, programInput.trim()],
            }));
            setProgramInput("");
        }
    };

    const handleRemoveProgram = (index) => {
        setFormData((prev) => ({
            ...prev,
            programs: prev.programs.filter((_, i) => i !== index),
        }));
    };

    const handleErr = (error) => {
        console.log(error);
        setError(error.response?.data?.message || "An error occurred");
    }

    const handleAddCollege = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create a new FormData object - fixed the naming collision
            const formDataToSend = new FormData();

            // Append all form data fields
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("city", formData.city);
            formDataToSend.append("programs", JSON.stringify(formData.programs));

            // Append the collegeImage file
            if (collegeImage) {
                formDataToSend.append("collegeImage", collegeImage);
            }

            const accessToken = localStorage.getItem("accessToken");

            const axiosInstance = axios.create({
                baseURL: import.meta.env.VITE_BASE_URL,
                withCredentials: true,
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                }
            });

            const response = await axiosInstance.post("/api/v1/colleges", formDataToSend);
            const data = response.data.data;

            navigate(`/college/${data._id}`);

        } catch (error) {
            handleErr(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`w-full min-h-screen ${isDark ? "text-white" : "text-black"} px-2 py-4 ${isDark ? "bg-zinc-900" : "bg-white"}`}>
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col lg:flex-row gap-6 mt-4">
                    {/* Left column - image and note */}
                    <div className="w-full lg:w-1/2 flex flex-col items-center justify-start pt-4 px-4">
                        <div className="flex gap-2 mb-2 w-full">
                            <span className={`text-md font-semibold italic ${isDark ? "text-white" : "text-black"}`}>Note:</span>
                            <p className={`text-md font-medium italic ${isDark ? "text-white" : "text-black"}`}>You are adding a new college to our db</p>
                        </div>
                        <div className="w-full h-[290px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg shadow-md">
                            {tempImage ? (
                                <img
                                    className="w-full h-full object-cover"
                                    src={tempImage}
                                    alt="college-image"
                                />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}>
                                    <Upload className={`h-8 w-8 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                                </div>
                            )}
                        </div>
                        <label className="w-full">
                            <button
                                className={`w-full mt-2 px-4 py-2 border rounded-md text-sm 
                                font-medium focus:outline-none focus:ring-2 focus:ring-offset-2
                                ${isDark ? "bg-blue-800 border-blue-700 text-white hover:bg-blue-700" : "bg-blue-600 border-blue-600 text-white hover:bg-blue-700"}`}
                                onClick={() => document.getElementById('imageInput').click()}
                                type="button"
                            >
                                Choose Photo
                            </button>
                            <input
                                id="imageInput"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Right column - form */}
                    <div className={`w-full lg:w-1/2 flex flex-col py-4 px-4 rounded-lg shadow-md ${isDark ? "bg-zinc-800" : "bg-slate-200"}`}>
                        <h2 className="text-xl font-bold mb-4 underline">Add College Information</h2>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleAddCollege} className="space-y-4">
                            <div className="flex flex-col w-full mb-3">
                                <label className="mb-1 font-medium">College Name</label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full ${isDark ? "bg-zinc-700 text-white" : "bg-slate-100"}`}
                                    required
                                />
                            </div>

                            <div className="flex flex-col w-full mb-3">
                                <label className="mb-1 font-medium">Description</label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`w-full ${isDark ? "bg-zinc-700 text-white" : "bg-slate-100"}`}
                                    rows={3}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col w-full">
                                    <label className="mb-1 font-medium">Location</label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className={`w-full ${isDark ? "bg-zinc-700 text-white" : "bg-slate-100"}`}
                                        required
                                    />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="mb-1 font-medium">City</label>
                                    <Input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={`w-full ${isDark ? "bg-zinc-700 text-white" : "bg-slate-100"}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full mb-3">
                                <label className="mb-1 font-medium">Programs</label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={programInput}
                                        onChange={(e) => setProgramInput(e.target.value)}
                                        className={`flex-1 ${isDark ? "bg-zinc-700 text-white" : "bg-slate-100"}`}
                                        placeholder="Add a program"
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleAddProgram}
                                        className={`${isDark ? "bg-blue-800 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                    >
                                        Add
                                    </Button>
                                </div>

                                {formData.programs.length > 0 && (
                                    <div className={`mt-2 p-3 rounded-md border ${isDark ? "bg-zinc-700 border-zinc-600" : "bg-white border-gray-200"}`}>
                                        <p className="mb-1 font-medium">Added Programs:</p>
                                        <ul className={`divide-y ${isDark ? "divide-zinc-600" : "divide-gray-200"}`}>
                                            {formData.programs.map((program, index) => (
                                                <li key={index} className="flex justify-between items-center py-2">
                                                    <span>{program}</span>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleRemoveProgram(index)}
                                                        variant="destructive"
                                                        className="h-8 text-xs"
                                                    >
                                                        Remove
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {isLoading ? (
                                <div className="flex items-center justify-center p-2 rounded bg-blue-600 text-white">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <span>Adding new college...</span>
                                </div>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-2 font-medium mt-6 ${isDark ? "bg-blue-800 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                                >
                                    Submit College
                                </Button>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCollege;