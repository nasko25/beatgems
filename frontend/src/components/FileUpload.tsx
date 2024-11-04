"use client";

import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import ProgressBar from "react-bootstrap/ProgressBar";
import Modal from "react-bootstrap/Modal";
import { CheckCircle } from "lucide-react";
import { CloseButton } from "react-bootstrap";
import { IconButton } from "@mui/material";

export default function UploadModal(props: {
  isOpen: boolean;
  setIsOpen: (_: boolean) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadFinished, setIsUploadFinished] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setProgress(0);
      setIsUploadFinished(false);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploadFinished(true);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 500);
  };

  const handleUpload = () => {
    if (file) {
      simulateUpload();
    }
  };

  const handleOpenChange = (open: boolean) => {
    props.setIsOpen(open);
    if (!open) {
      setFile(null);
      setProgress(0);
      setIsUploading(false);
      setIsUploadFinished(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Modal
      show={props.isOpen}
      onHide={() => handleOpenChange(false)}
      centered={true}
      contentClassName="sm:max-w-[425px] m-auto select-none"
    >
      {/* what opens the dialog: <DialogTrigger asChild>
        <Button>Open File Upload</Button>
      </DialogTrigger> */}

      <button
        type="button"
        className="absolute right-4 close-button top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
        onClick={(_) => handleOpenChange(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-x h-4 w-4"
        >
          <path d="M18 6 6 18"></path>
          <path d="m6 6 12 12"></path>
        </svg>
        <span className="sr-only">Close</span>
      </button>

      <Modal.Body className="m-2 max-[640px]:text-center">
        <h2 className="text-lg font-bold leading-none tracking-tight">
          Upload File
        </h2>
        <p className="text-sm" style={{ color: "#71717a" }}>
          Choose a file to upload and track the progress.
        </p>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-3">
            <input
              id="file"
              type="file"
              className="col-span-3"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="col-span-1 !py-2 !font-medium !text-sm"
              variant="dark"
            >
              Upload
            </Button>
          </div>
          {(isUploading || isUploadFinished) && (
            <ProgressBar now={progress} className="w-full" />
          )}
          {isUploadFinished && (
            <div className="flex items-center justify-center text-green-500">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span>Upload finished successfully!</span>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
