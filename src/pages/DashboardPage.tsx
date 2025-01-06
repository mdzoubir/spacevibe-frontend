import { useState, useEffect } from 'react';
import { Plus, Home, Pencil, Trash } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../Api';
import { z } from 'zod';

const houseSchema = z.object({
    name: z.string().min(1, 'House name is required'),
    width: z.number().min(1, 'Width must be greater than 0'),
    length: z.number().min(1, 'Length must be greater than 0'),
    floors: z.number().min(1, 'Floors must be greater than 0'),
});

type HouseForm = z.infer<typeof houseSchema> & {
    id: number;
};

export default function DashboardPage() {
    const [houses, setHouses] = useState<HouseForm[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newHouse, setNewHouse] = useState<HouseForm>({
        name: '',
        width: 0,
        length: 0,
        floors: 1,
        id: 0,
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);  // For success messages
    const [errorMessage, setErrorMessage] = useState<string | null>(null);  // For error messages
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHouses();
    }, []);

    const fetchHouses = async () => {
        try {
            const response = await api.get<HouseForm[]>('/houses/');
            setHouses(response.data);
        } catch (error) {
            console.error('Error fetching houses:', error);
        }
    };

    const handleCreateHouse = async () => {
        try {
            // Validate with Zod
            houseSchema.parse(newHouse);
            setLoading(true);
            // Create house after validation
            await api.post('/houses/', newHouse);
            setIsCreating(false);
            setSuccessMessage('House created successfully!');
            setTimeout(() => setSuccessMessage(null), 2000)
            fetchHouses();
            setNewHouse({ name: '', width: 0, length: 0, floors: 1, id: 0 });
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation error
                setErrorMessage('Validation failed: Please check your input fields.');
            } else {
                // Handle other errors
                setErrorMessage('Error creating house. Please try again.');
            }
            setTimeout(() => setErrorMessage(null), 2000)
        }finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">My Houses</h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition duration-150 ease-in-out"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Add House</span>
                    </button>
                </div>

                {/* Success or Error Message */}
                {errorMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                    >
                        {errorMessage}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="my-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
                    >
                        {successMessage}
                    </motion.div>
                )}

                {isCreating && (
                    <div className="flex items-center justify-center my-4">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white p-8 rounded-2xl w-full border border-gray-200"
                        >
                            <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Add New House</h2>
                            <p className="text-gray-600 text-center mb-8">Fill in the details of the house</p>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={newHouse.name}
                                        onChange={(e) => setNewHouse({ ...newHouse, name: e.target.value })}
                                        className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                        placeholder="Enter house name"
                                    />
                                    {/* Validation error message */}
                                    {newHouse.name.length < 1 && (
                                        <p className="text-sm text-red-600">Name is required.</p>
                                    )}
                                </div>
                                {/* Other fields with similar validation */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Width (m)</label>
                                        <input
                                            type="number"
                                            value={newHouse.width}
                                            onChange={(e) => setNewHouse({ ...newHouse, width: Number(e.target.value) })}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter width"
                                        />
                                        {newHouse.width <= 0 && (
                                            <p className="text-sm text-red-600">Width must be greater than 0.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Length (m)</label>
                                        <input
                                            type="number"
                                            value={newHouse.length}
                                            onChange={(e) => setNewHouse({ ...newHouse, length: Number(e.target.value) })}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter length"
                                        />
                                        {newHouse.length <= 0 && (
                                            <p className="text-sm text-red-600">Length must be greater than 0.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                                        <input
                                            type="number"
                                            value={newHouse.floors}
                                            onChange={(e) => setNewHouse({ ...newHouse, floors: Number(e.target.value) })}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter number of floors"
                                        />
                                        {newHouse.floors < 1 && (
                                            <p className="text-sm text-red-600">Floors must be at least 1.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        onClick={() => setIsCreating(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreateHouse}
                                        disabled={loading}
                                        className={`px-4 py-2 rounded-md text-white transition duration-150 ease-in-out ${loading ? 'bg-gray-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                                    >
                                        {loading ? 'Creating...' : 'Create House'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Houses List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {houses.map((house) => (
                        <div key={house.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <Home className="h-6 w-6 text-blue-600"/>
                                        <h3 className="text-xl font-semibold text-gray-800">{house.name}</h3>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-400 hover:text-blue-600 transition-colors duration-150"
                                            aria-label="Edit house">
                                            <Pencil className="h-5 w-5"/>
                                        </button>
                                        <button
                                            className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                                            aria-label="Delete house">
                                            <Trash className="h-5 w-5"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <p>Width: {house.width}m</p>
                                    <p>Length: {house.length}m</p>
                                    <p>Floors: {house.floors}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-500">Total Area</span>
                                        <span className="text-lg font-semibold text-blue-600">
                                            {(house.width * house.length).toFixed(2)}m²
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
