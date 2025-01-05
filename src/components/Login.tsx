'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import {Link, useNavigate} from 'react-router-dom'; // Import Link for navigation
import api from '../Api';
import {AxiosError} from "axios";
import {useAuth} from "../context/AuthContext.tsx";

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(false);

        try {
            const response = await api.post('/auth/login/', data);
            if (response.status === 200) {
                login(response.data); // Store the tokens in localStorage and update state
                setSubmitSuccess(true);
                navigate('/dashboard'); // Navigate to the dashboard
            }
        } catch (err) {
            const error = err as AxiosError<{ detail: string }>;
            setSubmitError(error.response?.data?.detail || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
            >
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 text-center mb-8">Log in to your account</p>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                {...register('email')}
                                className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                placeholder="your@email.com"
                            />
                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                {...register('password')}
                                className="w-full pl-10 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gray-800 text-white py-3 px-6 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{isSubmitting ? 'Logging in...' : 'Log In'}</span>
                        <ArrowRight className="h-5 w-5" />
                    </motion.button>
                </form>
                {submitError && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                    >
                        {submitError}
                    </motion.div>
                )}
                {submitSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
                    >
                        Login successful! Welcome back!
                    </motion.div>
                )}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-gray-800 font-medium hover:underline">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
