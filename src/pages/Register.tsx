import api from '../Api.ts';
import {useState} from 'react';
import {useForm, SubmitHandler} from 'react-hook-form'; // Add SubmitHandler import
import {zodResolver} from '@hookform/resolvers/zod';
import {motion} from 'framer-motion';
import {User, Mail, Lock, Phone, MapPin, ArrowRight} from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom';
import {AxiosError} from "axios";
import * as z from "zod";

const registerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register: React.FC = () => {
    const {register, handleSubmit, formState: {errors, isSubmitting}} = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema), // Use Zod schema for validation
    });
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const navigate = useNavigate();
    const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        try {
            const response = await api.post('/auth/register/', data);
            if (response.status === 201) {
                setSubmitSuccess('Account created successfully. Please log in to continue.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            const error = err as AxiosError;
            console.error('Error details:', error.response?.data);  // Log the response data to inspect the error
            setSubmitError((error.response?.data as { detail?: string })?.detail || 'Registration failed');
            setTimeout(() => {
                setSubmitError(null);
            }, 2000);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <motion.div
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-200"
            >
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Join Our Community</h2>
                <p className="text-gray-600 text-center mb-5">Create your account and start your journey with us</p>
                {submitError && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                    >
                        {submitError}
                    </motion.div>
                )}
                {submitSuccess && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
                    >
                        Registration successful! Welcome aboard!
                    </motion.div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First
                                Name</label>
                            <div className="relative">
                                <input
                                    id="firstName"
                                    {...register('firstName')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="John"
                                />
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                            {errors.firstName &&
                                <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last
                                Name</label>
                            <div className="relative">
                                <input
                                    id="lastName"
                                    {...register('lastName')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="Doe"
                                />
                                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email"
                                   className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    {...register('email')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="john@example.com"
                                />
                                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    {...register('password')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone
                                Number</label>
                            <div className="relative">
                                <input
                                    id="phoneNumber"
                                    {...register('phoneNumber')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="+1 (555) 123-4567"
                                />
                                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="address"
                                   className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <div className="relative">
                                <input
                                    id="address"
                                    {...register('address')}
                                    className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                    placeholder="123 Main St, City, Country"
                                />
                                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                            </div>
                        </div>
                    </div>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gray-800 text-white py-3 px-6 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                    >
                        <span>{isSubmitting ? 'Registering...' : 'Create Account'}</span>
                        <ArrowRight className="h-5 w-5"/>
                    </motion.button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-gray-800 font-medium hover:underline"
                        >
                            Log in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
};

export default Register;
