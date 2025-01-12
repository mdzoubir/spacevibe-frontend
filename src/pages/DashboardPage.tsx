import {useState, useEffect} from 'react';
import {Plus, Home, Layers, Trash2, Edit2, Ruler, Paperclip} from 'lucide-react';
import {motion} from 'framer-motion';
import DashboardLayout from '../components/layouts/DashboardLayout';
import api from '../Api';
import {z} from 'zod';
import {useNavigate} from "react-router-dom";

const houseSchema = z.object({
    name: z.string().min(1, 'House name is required'),
    width: z.number().min(1, 'Width must be greater than 0'),
    length: z.number().min(1, 'Length must be greater than 0'),
    height: z.number().min(1, 'Height must be greater than 0'),
    floors: z.number().min(1, 'Floors must be greater than 0'),
});


type HouseForm = z.infer<typeof houseSchema> & {
    id: number;
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const [houses, setHouses] = useState<HouseForm[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingHouse, setEditingHouse] = useState<HouseForm | null>(null);
    const [newHouse, setNewHouse] = useState<HouseForm>({
        name: '',
        width: 0,
        length: 0,
        height: 0,
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
            setNewHouse({name: '', width: 0, length: 0, height: 0, floors: 1, id: 0});
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation error
                setErrorMessage('Validation failed: Please check your input fields.');
            } else {
                // Handle other errors
                setErrorMessage('Error creating house. Please try again.');
            }
            setTimeout(() => setErrorMessage(null), 2000)
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteHouse = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this house?')) {
            return;
        }

        try {
            await api.delete(`/houses/${id}/`);
            setHouses(houses.filter((house) => house.id !== id)); // Remove house from state
            setSuccessMessage('House deleted successfully!');
            setTimeout(() => setSuccessMessage(null), 2000);
        } catch (error) {
            setErrorMessage('Error deleting house. Please try again.');
            setTimeout(() => setErrorMessage(null), 2000);
        }
    };

    const handleUpdateHouse = async () => {
        if (!editingHouse) return;

        try {
            // Validate the updated house details
            houseSchema.parse(editingHouse);

            // Send the update request to the backend
            await api.put(`/houses/${editingHouse.id}/`, editingHouse);

            // Update the state with the updated house
            setHouses(houses.map((house) => (house.id === editingHouse.id ? editingHouse : house)));

            setSuccessMessage('House updated successfully!');
            setTimeout(() => setSuccessMessage(null), 2000);

            // Exit edit mode
            setEditingHouse(null);
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrorMessage('Validation failed: Please check your input fields.');
            } else {
                setErrorMessage('Error updating house. Please try again.');
            }
            setTimeout(() => setErrorMessage(null), 2000);
        }
    };


    const handleRedirect = (house: HouseForm) => {
        navigate(`/house-details/${house.id}`, { state: { house } });
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
                        <Plus className="h-5 w-5"/>
                        <span>Add House</span>
                    </button>
                </div>

                {/* Success or Error Message */}
                {errorMessage && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="my-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
                    >
                        {errorMessage}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        className="my-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm"
                    >
                        {successMessage}
                    </motion.div>
                )}

                {isCreating && (
                    <div className="flex items-center justify-center my-4">
                        <motion.div
                            initial={{opacity: 0, y: -20}}
                            animate={{opacity: 1, y: 0}}
                            transition={{duration: 0.5}}
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
                                        onChange={(e) => setNewHouse({...newHouse, name: e.target.value})}
                                        className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                        placeholder="Enter house name"
                                    />
                                    {/* Validation error message */}
                                    {newHouse.name.length < 1 && (
                                        <p className="text-sm text-red-600">Name is required.</p>
                                    )}
                                </div>
                                {/* Other fields with similar validation */}
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Width
                                            (m)</label>
                                        <input
                                            type="number"
                                            value={newHouse.width}
                                            onChange={(e) => setNewHouse({...newHouse, width: Number(e.target.value)})}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter width"
                                        />
                                        {newHouse.width <= 0 && (
                                            <p className="text-sm text-red-600">Width must be greater than 0.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Length
                                            (m)</label>
                                        <input
                                            type="number"
                                            value={newHouse.length}
                                            onChange={(e) => setNewHouse({...newHouse, length: Number(e.target.value)})}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter length"
                                        />
                                        {newHouse.length <= 0 && (
                                            <p className="text-sm text-red-600">Length must be greater than 0.</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Height
                                            (m)</label>
                                        <input
                                            type="number"
                                            value={newHouse.height}
                                            onChange={(e) => setNewHouse({...newHouse, height: Number(e.target.value)})}
                                            className="w-full pl-3 pr-3 py-2 text-sm border-b border-gray-300 focus:outline-none focus:border-gray-600 transition-colors duration-300 bg-gray-50"
                                            placeholder="Enter height"
                                        />
                                        {newHouse.height <= 0 && (
                                            <p className="text-sm text-red-600">Height must be greater than 0.</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
                                        <input
                                            type="number"
                                            value={newHouse.floors}
                                            onChange={(e) => setNewHouse({...newHouse, floors: Number(e.target.value)})}
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
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                    {houses.map((house) => (
                        <div
                            key={house.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
                        >
                            {editingHouse?.id === house.id ? (
                                <div className="p-6 space-y-4">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">Edit House</h3>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Home
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                            <input
                                                type="text"
                                                value={editingHouse.name}
                                                onChange={(e) =>
                                                    setEditingHouse({...editingHouse, name: e.target.value})
                                                }
                                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter house name"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Ruler
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                            <input
                                                type="number"
                                                value={editingHouse.width}
                                                onChange={(e) =>
                                                    setEditingHouse({
                                                        ...editingHouse,
                                                        width: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter house width"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Ruler
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                            <input
                                                type="number"
                                                value={editingHouse.length}
                                                onChange={(e) =>
                                                    setEditingHouse({
                                                        ...editingHouse,
                                                        length: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter house length"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Ruler
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                            <input
                                                type="number"
                                                value={editingHouse.height}
                                                onChange={(e) =>
                                                    setEditingHouse({
                                                        ...editingHouse,
                                                        height: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter house height"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Layers
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                            <input
                                                type="number"
                                                value={editingHouse.floors}
                                                onChange={(e) =>
                                                    setEditingHouse({
                                                        ...editingHouse,
                                                        floors: Number(e.target.value),
                                                    })
                                                }
                                                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter number of floors"
                                            />
                                        </div>
                                        <div className="flex space-x-3">
                                            <button
                                                onClick={() => setEditingHouse(null)}
                                                className="flex-1 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors duration-150"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleUpdateHouse}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="bg-indigo-50 border-2 border-indigo-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">
                                    <div className="p-6 sm:p-8 flex-grow">
                                        <div className="flex items-center space-x-4 mb-6">
                                            <Home className="w-8 h-8 text-indigo-600"/>
                                            <h3 className="text-2xl font-bold text-indigo-900">{house.name}</h3>
                                        </div>
                                        <dl className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-base">
                                            <div
                                                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                                                <div>
                                                    <dt className="text-indigo-600 font-medium">Width</dt>
                                                    <dd className="mt-1 text-xl font-semibold text-indigo-900">{house.width}m</dd>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                                                <div>
                                                    <dt className="text-indigo-600 font-medium">Length</dt>
                                                    <dd className="mt-1 text-xl font-semibold text-indigo-900">{house.length}m</dd>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                                                <div>
                                                    <dt className="text-indigo-600 font-medium">Height</dt>
                                                    <dd className="mt-1 text-xl font-semibold text-indigo-900">{house.height}m</dd>
                                                </div>
                                            </div>
                                            <div
                                                className="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                                                <div>
                                                    <dt className="text-indigo-600 font-medium">Floors</dt>
                                                    <dd className="mt-1 text-xl font-semibold text-indigo-900">{house.floors}</dd>
                                                </div>
                                            </div>
                                        </dl>
                                    </div>
                                    <div className="border-t border-indigo-200 p-4 bg-white flex justify-end space-x-3">
                                        <button
                                            onClick={() => handleRedirect(house)}
                                            className="px-4 py-2 bg-amber-400 text-white rounded-md hover:#facc15 transition-colors duration-200 flex items-center space-x-2"
                                            aria-label="Design Attachment"
                                        >
                                            <Paperclip className="w-4 h-4"/>
                                            <span>Design Attachment</span>
                                        </button>
                                        <button
                                            onClick={() => setEditingHouse(house)}
                                            className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors duration-200 flex items-center space-x-2"
                                            aria-label="Edit house"
                                        >
                                            <Edit2 className="w-4 h-4"/>
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHouse(house.id)}
                                            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors duration-200 flex items-center space-x-2"
                                            aria-label="Delete house"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
