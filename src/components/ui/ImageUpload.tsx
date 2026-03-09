import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X } from 'lucide-react';

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    maxFiles?: number;
    minFiles?: number;
}

export function ImageUpload({ value = [], onChange, maxFiles = 10, minFiles = 3 }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (value.length + acceptedFiles.length > maxFiles) {
            alert(`You can only upload up to ${maxFiles} images.`);
            return;
        }

        setIsUploading(true);

        try {
            const uploadPromises = acceptedFiles.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                // We will define this API route next
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const data = await response.json();
                return data.url;
            });

            const uploadedUrls = await Promise.all(uploadPromises);
            onChange([...value, ...uploadedUrls]);
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Failed to upload some images. Please try again.');
        } finally {
            setIsUploading(false);
        }
    }, [value, maxFiles, onChange]);

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        disabled: isUploading || value.length >= maxFiles,
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-black'}
          ${(isUploading || value.length >= maxFiles) ? 'opacity-50 cursor-not-allowed' : ''}
        `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center space-y-2">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                    <p className="text-sm font-medium">
                        {isUploading ? 'Uploading...' : 'Click or drag photos here'}
                    </p>
                    <p className="text-xs text-gray-500">
                        {value.length} of {maxFiles} max uploaded. {value.length < minFiles ? `(Need ${minFiles - value.length} more)` : ''}
                    </p>
                </div>
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {value.map((url, index) => (
                        <div key={index} className="relative group aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={url}
                                alt={`Upload ${index + 1}`}
                                className="object-cover w-full h-full border border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-white border border-black shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
