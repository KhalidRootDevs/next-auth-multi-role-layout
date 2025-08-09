import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { Icons } from './icons';
import { DialogDescription } from '@radix-ui/react-dialog';
import PDFViewer from './pdf-viewer';

const DropzoneSingleFile = ({ name }: { name: string }) => {
  const { watch, setValue } = useFormContext();
  const file = watch(name);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles?.length) return;

      const uploadedFile = acceptedFiles[0];
      const fileWithPreview = Object.assign(uploadedFile, {
        preview: URL.createObjectURL(uploadedFile)
      });

      setValue(name, fileWithPreview);
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx']
    },
    maxSize: 1024 * 3000, // 3MB limit
    onDrop
  });

  const fileName =
    typeof file === 'string'
      ? file.split('/').pop()
      : file?.name || 'No file selected';

  const fileUrl = typeof file === 'string' ? file : file?.preview;
  const isPdf = fileUrl?.endsWith('.pdf');

  return (
    <>
      <div {...getRootProps()}>
        <div className="relative flex min-h-40 w-full items-center justify-center rounded-xl border-2 border-dashed transition">
          {file ? (
            <div className="">
              <div className="flex flex-col items-center justify-center gap-5">
                <p className="text-sm font-medium">{fileName}</p>

                {isPdf ? (
                  <button
                    type="button"
                    className="text-xs text-blue-600 underline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    View File
                  </button>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600"
                  >
                    View File
                  </a>
                )}
              </div>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 hover:bg-destructive/10"
                onClick={() => setValue(name, '')}
              >
                <Icons.trash className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          ) : (
            <div className="">
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center gap-1 text-sm">
                <span className="font-medium">Drag & Drop file</span>
                <span>or</span>
                <Button type="button" variant="outline">
                  Browse
                </Button>
                <p className="my-3">Max Size: 3MB (.pdf, .docx, .xlsx)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="h-[80vh] max-w-5xl">
          <div className="h-[70vh] w-full">
            <DialogHeader>
              <DialogTitle>Company Policy</DialogTitle>
              <DialogDescription>
                Preview of the uploaded policy document.
              </DialogDescription>
            </DialogHeader>

            <PDFViewer link={fileUrl} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DropzoneSingleFile;
