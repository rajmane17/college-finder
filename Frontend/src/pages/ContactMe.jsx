import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Simulate form submission (e.g., API call)
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000); // Reset success message after 3s
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100 p-4 overflow-x-hidden">
            <Card className="w-full max-w-md max-h-[calc(100vh-96px)] overflow-y-auto">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Contact Me</CardTitle>
                </CardHeader>
                <CardContent>
                    {isSubmitted && (
                        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                            Your message has been sent successfully!
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Your email"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.email}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input
                                id="subject"
                                name="subject"
                                type="text"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={errors.subject ? 'border-red-500' : ''}
                            />
                            {errors.subject && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder="Your message"
                                value={formData.message}
                                onChange={handleChange}
                                className={errors.message ? 'border-red-500' : ''}
                                rows={5}
                            />
                            {errors.message && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1" /> {errors.message}
                                </p>
                            )}
                        </div>

                        <Button type="submit" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactForm;