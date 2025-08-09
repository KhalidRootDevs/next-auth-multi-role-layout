import React, { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Icons } from './icons';

interface DropzoneProps {
  name: string;
  multiple?: boolean;
  existingImages?: string[];
}

const Dropzone: React.FC<DropzoneProps> = ({
  name,
  multiple = false,
  existingImages = []
}) => {
  const { setValue, watch } = useFormContext();
  const files = watch(name) || [];

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = multiple
        ? [...files, ...acceptedFiles]
        : acceptedFiles;
      setValue(name, updatedFiles);
    },
    [files, multiple, name, setValue]
  );

  useEffect(() => {
    setValue(name, existingImages);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple
  });

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter(
      (_: File | string, i: number) => i !== index
    );
    setValue(name, updatedFiles);
  };

  const handleRemoveAllImages = () => {
    setValue(name, []);
  };

  const previewFiles = files.map((file: File | string) =>
    typeof file === 'string' ? file : URL.createObjectURL(file)
  );

  return (
    <div>
      <div
        {...getRootProps()}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed bg-gray-50 p-6 text-gray-500 transition-all duration-200 ease-in-out hover:bg-gray-100"
      >
        <input {...getInputProps()} />
        <p className="text-center text-sm font-medium">
          Drag & drop some files here, or click to select files
        </p>
      </div>

      {multiple && files.length > 0 && (
        <div className="mt-4 flex justify-start">
          <button
            type="button"
            onClick={handleRemoveAllImages}
            className="rounded border border-orange-500 px-2 py-0.5 text-xs hover:bg-orange-500 hover:text-white"
          >
            Remove All
          </button>
        </div>
      )}

      <div className="mt-4 flex flex-wrap">
        {previewFiles.map((fileUrl: string, index: number) => {
          const isExistingImage = typeof files[index] === 'string';

          return (
            <div key={index} className="relative m-2 h-24 w-24">
              <img
                src={fileUrl}
                alt={`Preview ${index}`}
                className="h-full w-full rounded-md object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 p-1 text-white shadow-md transition-colors duration-200 hover:bg-red-700"
              >
                <Icons.close className="h-4 w-4" />
              </button>
              {isExistingImage ? (
                <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-black bg-opacity-50 p-1 text-center text-xs text-white">
                  Existing Image
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 rounded-b-md bg-green-600 bg-opacity-75 p-1 text-center text-xs text-white">
                  New Image
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dropzone;
