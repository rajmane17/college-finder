import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Star } from 'lucide-react';

const ReviewOurApp = () => {
    const [formData, setFormData] = useState({
        rating: 0,
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (formData.rating === 0) newErrors.rating = 'Please select a rating';
        if (!formData.message.trim()) newErrors.message = 'Review message is required';
        return newErrors;
    };

    const handleRatingChange = (rating) => {
        setFormData((prev) => ({ ...prev, rating }));
        setErrors((prev) => ({ ...prev, rating: '' }));
    };

    const handleMessageChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({ ...prev, message: value }));
        setErrors((prev) => ({ ...prev, message: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Simulate form submission (e.g., API call)
        console.log('Review submitted:', formData);
        setIsSubmitted(true);
        setFormData({ rating: 0, message: '' });
        setTimeout(() => setIsSubmitted(false), 3000); // Reset success message after 3s
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 p-4 overflow-x-hidden">
            <Card className="w-full max-w-md max-h-[calc(100vh-96px)] overflow-y-auto bg-white dark:bg-black border-gray-200 dark:border-gray-700 rounded-md shadow-sm dark:shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
                        Review Our App
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isSubmitted && (
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-100 text-green-700 dark:text-green-800 rounded-md">
                            Your review has been submitted successfully!
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating" className="text-gray-900 dark:text-white">
                                Rating
                            </Label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            className={`h-6 w-6 ${formData.rating >= star
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-400 dark:text-gray-500'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.rating}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-gray-900 dark:text-white">
                                Your Review
                            </Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Your review"
                                value={formData.message}
                                onChange={handleMessageChange}
                                className={`border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 rounded-md focus:ring-0 focus:border-gray-400 dark:focus:border-gray-500 ${errors.message ? 'border-red-500' : ''
                                    }`}
                                rows={5}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 dark:bg-gray-300 hover:bg-blue-700 dark:hover:bg-gray-400 text-white dark:text-black rounded-md"
                        >
                            Submit Review
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReviewOurApp;