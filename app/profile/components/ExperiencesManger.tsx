"use client";

import { useState, useEffect } from "react";
import { FormInput } from "@/app/profile/components/ui/form-input";
import { Button } from "@/app/profile/components/ui/button";
import { X, Plus } from "lucide-react";
import Popup from "./ui/popup"; // Update to use the new Popup component

export interface Experience {
    id?: string;
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
}

interface ExperienceManagerProps {
    experiences: Experience[];
    setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
    // Added to allow parent to know when fetch is complete
    onFetchComplete?: () => void;
    // Added to control whether this component should auto-fetch
    autoFetch?: boolean;
}

const ExperienceManager = ({
    experiences,
    setExperiences,
    onFetchComplete,
    autoFetch = true  // Default to true for backward compatibility
}: ExperienceManagerProps) => {
    const [showExperiencePopup, setShowExperiencePopup] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
    const [editingExperienceIndex, setEditingExperienceIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch experiences from API
    const fetchExperiences = async () => {
        try {
            setError(null);

            const response = await fetch('/api/users/experience');
            const data = await handleApiResponse(response, 'Failed to fetch experiences');
            const processedExperiences = Array.isArray(data.experiences)
                ? data.experiences
                : Array.isArray(data)
                    ? data
                    : [];

            const formattedExperiences = processedExperiences.map((exp: any) => ({
                id: exp.id || exp._id, // Handle both "id" and MongoDB's "_id"
                jobTitle: exp.jobTitle,
                company: exp.company,
                startDate: displayDate(exp.startDate),
                endDate: displayDate(exp.endDate),
                description: exp.description
            }));

            setExperiences(formattedExperiences);

            // Call the callback if provided
            if (onFetchComplete) {
                onFetchComplete();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch experiences. Please try again.');
        }
    };

    // Expose the fetch method through a ref if needed by parent components
    // This allows the parent to trigger a fetch whenever needed
    useEffect(() => {
        // Only auto-fetch if the flag is true
        if (autoFetch) {
            fetchExperiences();
        }
    }, [autoFetch]);

    const handleApiResponse = async (response: Response, errorMessage: string) => {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || errorData.message || errorMessage);
        }

        try {
            return await response.json();
        } catch (e) {
            console.error('Failed to parse JSON response:', e);
            throw new Error('Invalid response from server');
        }
    };

    const addExperience = () => {
        setCurrentExperience({
            jobTitle: '',
            company: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingExperienceIndex(null);
        setShowExperienceForm(true);
    };

    const editExperience = (index: number) => {
        const expToEdit = { ...experiences[index] };

        // Make sure dates are in the YYYY-MM format for input[type=month]
        expToEdit.startDate = displayDate(expToEdit.startDate);
        expToEdit.endDate = displayDate(expToEdit.endDate);

        setCurrentExperience(expToEdit);
        setEditingExperienceIndex(index);
        setShowExperienceForm(true);
    };

    const removeExperience = async (index: number) => {
        const expToRemove = experiences[index];
        console.log('[DELETE] Initiating removal for experience:', expToRemove);

        if (!expToRemove.id) {
            console.log('[DELETE] Local-only experience removed');
            setExperiences(prev => prev.filter((_, i) => i !== index));
            return;
        }

        try {
            console.log('[DELETE] Attempting API deletion for ID:', expToRemove.id);
            const token = localStorage.getItem('token');
            console.log('[DELETE] Using token:', token ? 'exists' : 'missing');

            const response = await fetch(`/api/users/experience/${expToRemove.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('[DELETE] Response status:', response.status);
            console.log('[DELETE] Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[DELETE] Server error response:', errorText);
                throw new Error(errorText || 'Failed to delete experience');
            }

            const responseData = await response.json();
            console.log('[DELETE] Success response:', responseData);

            setExperiences(prev => prev.filter((_, i) => i !== index));
            console.log('[DELETE] UI updated optimistically');

        } catch (err: any) {
            console.error('[DELETE] Full error:', err);
            if (err instanceof Error) {
                console.error('[DELETE] Error details:', {
                    message: err.message,
                    stack: err.stack
                });
            }
            setError(err instanceof Error ? err.message : 'Deletion failed');
            console.log('[DELETE] Re-fetching experiences to sync state');
            fetchExperiences();
        }
    };

    const handleExperienceChange = (field: keyof Experience, value: string) => {
        if (currentExperience) {
            setCurrentExperience({
                ...currentExperience,
                [field]: value
            });
        }
    };

    const saveExperienceEntry = async () => {
        if (!currentExperience) return;

        try {
            setError(null);

            // Validate required fields
            if (!currentExperience.jobTitle || !currentExperience.company || !currentExperience.startDate) {
                setError("Please fill in all required fields: Job Title, Company, and Start Date");
                return;
            }

            // Format dates for API
            const formattedExperience = {
                ...currentExperience,
                startDate: formatDate(currentExperience.startDate),
                endDate: currentExperience.endDate ? formatDate(currentExperience.endDate) : ''
            };

            // Determine if this is an update or a new entry
            const isUpdate = editingExperienceIndex !== null && currentExperience.id !== undefined;
            const method = isUpdate ? 'PUT' : 'POST';
            const url = isUpdate ? `/api/users/experience/${currentExperience.id}` : '/api/users/experience';

            // When updating, remove ID from request body
            const requestBody = isUpdate ? (({ id, ...rest }) => rest)(formattedExperience) : formattedExperience;

            console.log(`${method} Experience - Request:`, { url, body: requestBody });

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Save failed');
            }

            // Get the saved data from response
            const savedData = await response.json();
            console.log(`${method} Experience - Response:`, savedData);

            // Create a clean processed experience - use a consistent approach to ID
            const processedExperience = {
                // For updates, maintain the same ID to avoid duplication
                id: isUpdate ? currentExperience.id : (savedData.id || savedData._id || (savedData.experience && (savedData.experience.id || savedData.experience._id))),
                jobTitle: savedData.jobTitle || currentExperience.jobTitle,
                company: savedData.company || currentExperience.company,
                startDate: displayDate(savedData.startDate || currentExperience.startDate),
                endDate: displayDate(savedData.endDate || currentExperience.endDate),
                description: savedData.description || currentExperience.description
            };

            console.log(`${method} Experience - Processed for UI:`, processedExperience);

            // Update the experiences state with a more reliable approach
            setExperiences(prev => {
                if (isUpdate && editingExperienceIndex !== null) {
                    // Create a new array with the updated item at the specific index
                    const updatedExperiences = [...prev];
                    updatedExperiences[editingExperienceIndex] = processedExperience;
                    return updatedExperiences;
                } else {
                    return [...prev, processedExperience];
                }
            });

            // Reset form state
            setCurrentExperience(null);
            setEditingExperienceIndex(null);
            setShowExperienceForm(false);

            setTimeout(() => {
                fetchExperiences(); // update without refresh
            }, 300);

        } catch (err: any) {
            console.error('Experience save failed:', err);
            setError(err.message || "Failed to save experience");
        }
    };

    // Experience Form
    const renderExperienceForm = () => (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-3">
                {editingExperienceIndex !== null ? 'Edit Experience' : 'Add New Experience'}
            </h3>

            <div className="space-y-5">
                <FormInput
                    label="Job Title"
                    value={currentExperience?.jobTitle || ''}
                    onChange={(e) => handleExperienceChange('jobTitle', e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />

                <FormInput
                    label="Company"
                    value={currentExperience?.company || ''}
                    onChange={(e) => handleExperienceChange('company', e.target.value)}
                    required
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />

                <div className="grid grid-cols-2 gap-5">
                    <FormInput
                        label="Start Date"
                        type="month"
                        value={currentExperience?.startDate || ''}
                        onChange={(e) => handleExperienceChange('startDate', e.target.value)}
                        required
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                    <FormInput
                        label="End Date"
                        type="month"
                        value={currentExperience?.endDate || ''}
                        onChange={(e) => handleExperienceChange('endDate', e.target.value)}
                        className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                </div>

                <FormInput
                    label="Description"
                    value={currentExperience?.description || ''}
                    onChange={(e) => handleExperienceChange('description', e.target.value)}
                    textarea
                    rows={4}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowExperienceForm(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    onClick={saveExperienceEntry}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 shadow-sm"
                >
                    Save Experience
                </Button>
            </div>
        </div>
    );

    // Enhanced Experience List Item
    const ExperienceListItem = ({ experience, index }: { experience: Experience, index: number }) => (
        <div className="p-5 border-2 border-gray-100 rounded-xl bg-white hover:border-red-50 transition-all duration-200 shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-xl font-bold text-gray-900">{experience.jobTitle}</h4>
                    <p className="text-gray-700 font-medium mt-1">
                        {experience.company}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => editExperience(index)}
                        className="text-gray-600 hover:text-red-600 transition-colors p-1"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => removeExperience(index)}
                        className="text-gray-600 hover:text-red-600 transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-red-500" />
                    {experience.startDate} - {experience.endDate || 'Present'}
                </span>
            </div>

            {experience.description && (
                <div className="mt-4 text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    <p>{experience.description}</p>
                </div>
            )}
        </div>
    );

    // Calendar Icon Component (add this at the top of your file)
    const CalendarIcon = ({ className }: { className?: string }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
    );

    // Helper functions for date formatting
    const formatDate = (date: string): string => {
        if (!date) return '';

        if (/^\d{4}-\d{2}$/.test(date)) {
            return `${date}-01`;
        }

        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            console.error(`Invalid date: ${date}`);
            return ''; // Return empty to avoid breaking things
        }

        // Format as YYYY-MM-DD for API
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const displayDate = (apiDate: string): string => {
        if (!apiDate) return '';

        if (/^\d{4}-\d{2}$/.test(apiDate)) {
            return apiDate;
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(apiDate)) {
            return apiDate.substring(0, 7);
        }

        const parsedDate = new Date(apiDate);
        if (isNaN(parsedDate.getTime())) {
            return ''; // Invalid date
        }

        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}`;
    };

    return (
        <>
            <div className="mb-1 flex-1 w-full md:w-1/2">
                <span
                    onClick={() => setShowExperiencePopup(true)}
                    className="cursor-pointer text-red-600 hover:text-red-700 font-medium transition-colors flex items-center gap-1.5 group"
                >
                    Check Out Experience
                    <span className="text-gray-500 group-hover:text-red-600 transition-colors">
                        ({experiences.length})
                    </span>
                </span>
            </div>

            {/* Experience Popup */}
            <Popup
                isOpen={showExperiencePopup}
                onClose={() => setShowExperiencePopup(false)}
                title="Professional Experience"
            >
                {showExperienceForm ? renderExperienceForm() : (
                    <div className="space-y-5">
                        {experiences.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-gray-500 text-lg font-medium">No experiences yet</p>
                                <p className="text-gray-400 mt-1">Add your first professional experience</p>
                            </div>
                        ) : (
                            experiences.map((experience, index) => (
                                <div key={index} className="group">
                                    <ExperienceListItem experience={experience} index={index} />
                                </div>
                            ))
                        )}
                        <div className="pt-2">
                            <Button
                                type="button"
                                onClick={addExperience}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 shadow-sm flex items-center justify-center gap-2"
                            >
                                <Plus size={18} />
                                Add New Experience
                            </Button>
                        </div>
                    </div>
                )}
            </Popup>

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
            )}
        </>
    );

};

// Export the component
export default ExperienceManager;

// Also export the fetchExperiences function so it can be called from outside if needed
export { ExperienceManager };