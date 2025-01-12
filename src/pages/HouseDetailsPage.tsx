import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Ruler, Layers, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from "../components/layouts/DashboardLayout.tsx";
import House3DModel from "../components/House3DModel";
import api from "../Api.ts"; // Import the 3D model component

interface HouseDetails {
    id: number;
    name: string;
    width: number;
    length: number;
    floors: number;
}

export default function HouseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [house, setHouse] = useState<HouseDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchHouseDetails();
        }
    }, [id]);

    const fetchHouseDetails = async () => {
        try {
            setLoading(true);
            const response = await api.get<HouseDetails>(`/houses/${id}/`);
            setHouse(response.data);
        } catch (error) {
            console.error('Error fetching house details:', error);
            setError('Failed to load house details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto px-2 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard')}
                    className="mb-6 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                {/* House Detail Card */}
                {house && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                        <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <Home className="w-10 h-10 text-indigo-600" />
                                    <h1 className="text-3xl font-bold text-gray-900">{house.name}</h1>
                                </div>
                                <span className="text-sm font-medium text-gray-500">ID: {house.id}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Width */}
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Ruler className="w-6 h-6 text-indigo-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Width</h2>
                                    </div>
                                    <p className="text-3xl font-bold text-indigo-700">{house.width}m</p>
                                </div>

                                {/* Length */}
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Ruler className="w-6 h-6 text-indigo-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Length</h2>
                                    </div>
                                    <p className="text-3xl font-bold text-indigo-700">{house.length}m</p>
                                </div>

                                {/* Floors */}
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Layers className="w-6 h-6 text-indigo-600" />
                                        <h2 className="text-lg font-semibold text-gray-900">Floors</h2>
                                    </div>
                                    <p className="text-3xl font-bold text-indigo-700">{house.floors}</p>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Information</h2>
                                <p className="text-gray-600">
                                    This house has a total area of {house.width * house.length} square meters.
                                    With {house.floors} {house.floors === 1 ? 'floor' : 'floors'}, the total living space
                                    is approximately {house.width * house.length * house.floors} square meters.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* 3D Model Section (outside the card) */}
                {house && (
                    <div className="my-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3D Model of the House</h2>
                        <div style={{width: '100%', height: '80vh'}} className="border-4 border-black">
                            <House3DModel width={house.width} height={10} length={house.length} />
                        </div>
                    </div>
                )}

                {/* Loading and Error Handling */}
                {loading && (
                    <div className="text-center py-12">
                        <motion.div
                            animate={{rotate: 360}}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="inline-block w-8 h-8 border-t-2 border-indigo-500 rounded-full"
                        />
                    </div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
                        role="alert"
                    >
                        <span className="block sm:inline">{error}</span>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
