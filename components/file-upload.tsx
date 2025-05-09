"use client";

import * as React from "react";
import { UploadCloud, X, FileIcon, AlertCircle, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "./ui/textarea";
import { getAiResult } from "@/server/ai";

interface FileUploadProps {
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: Record<string, string[]>;
  className?: string;
  disabled?: boolean;
  onFilesChange?: (files: File[]) => void;
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = {
    "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    "application/pdf": [".pdf"],
  },
  className,
  disabled = false,
  onFilesChange,
}: FileUploadProps) {
  const [aiResult, setAiResult] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [files, setFiles] = React.useState<File[]>([]);
  const [prompt, setPrompt] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<
    Record<string, number>
  >({});

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);

      if (rejectedFiles.length > 0) {
        const errorMessages = rejectedFiles.map((file) => {
          if (file.errors[0].code === "file-too-large") {
            return `${file.file.name} is too large. Max size is ${formatBytes(
              maxSize
            )}.`;
          }
          if (file.errors[0].code === "file-invalid-type") {
            return `${file.file.name} has an invalid file type.`;
          }
          return `${file.file.name}: ${file.errors[0].message}`;
        });
        setError(errorMessages.join(" "));
        return;
      }

      if (files.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }

      const newFiles = [...files, ...acceptedFiles];
      setFiles(newFiles);

      // Simulate upload progress for demonstration
      acceptedFiles.forEach((file) => {
        simulateUploadProgress(file.name);
      });

      if (onFilesChange) {
        onFilesChange(newFiles);
      }
    },
    [files, maxFiles, maxSize, onFilesChange]
  );

  const simulateUploadProgress = (fileName: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress((prev) => ({
        ...prev,
        [fileName]: progress,
      }));
    }, 300);
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    const removedFile = newFiles.splice(index, 1)[0];
    setFiles(newFiles);

    // Remove progress for this file
    setUploadProgress((prev) => {
      const updated = { ...prev };
      delete updated[removedFile.name];
      return updated;
    });

    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
    );
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept,
    disabled,
    maxFiles,
  });

  const onSubmit = async () => {
    setIsLoading(true);

    const result = await getAiResult(prompt, files[0]);
    setAiResult(result);

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {aiResult && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-muted-foreground">{aiResult}</p>
          <Button onClick={() => setAiResult(null)}>Close</Button>
        </div>
      )}

      {!aiResult && (
        <>
          <Textarea
            placeholder="Enter your prompt here"
            rows={10}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <Card className={cn("w-full", className)}>
            <CardHeader>
              <CardTitle>File Upload</CardTitle>
              <CardDescription>
                Drag and drop files here or click to select files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Click to upload</span> or drag
                  and drop
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {Object.keys(accept)
                    .map((key) => accept[key].join(", "))
                    .join(", ")}{" "}
                  (Max {formatBytes(maxSize)})
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {files.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">
                    Uploaded Files ({files.length}/{maxFiles})
                  </div>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 border rounded-md"
                      >
                        <FileIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {file.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatBytes(file.size)}
                          </div>
                          {uploadProgress[file.name] !== undefined &&
                            uploadProgress[file.name] < 100 && (
                              <Progress
                                value={uploadProgress[file.name]}
                                className="h-1 mt-1"
                              />
                            )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-xs text-muted-foreground">
                {files.length} of {maxFiles} files
              </div>
              {files.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFiles([]);
                    setUploadProgress({});
                    if (onFilesChange) {
                      onFilesChange([]);
                    }
                  }}
                >
                  Clear All
                </Button>
              )}
            </CardFooter>
          </Card>

          <Button onClick={onSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : "Submit"}
          </Button>
        </>
      )}
    </div>
  );
}
