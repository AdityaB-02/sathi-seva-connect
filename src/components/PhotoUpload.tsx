import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  Download,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export const PhotoUpload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthContext();

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles || !user) return;

    const validFiles = Array.from(selectedFiles).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isImage) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      uploadFiles(validFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('user-photos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          throw error;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(fileName);

        const uploadedFile: UploadedFile = {
          id: data.path,
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploadedAt: new Date()
        };

        // Update progress
        const progress = ((index + 1) / filesToUpload.length) * 100;
        setUploadProgress(progress);

        return uploadedFile;
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      setFiles(prev => [...prev, ...uploadedFiles]);
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const { error } = await supabase.storage
        .from('user-photos')
        .remove([fileId]);

      if (error) {
        throw error;
      }

      setFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      console.error('Delete error:', error);
      toast.error("Failed to delete file");
    }
  };

  const downloadFile = async (file: UploadedFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-photos')
        .download(file.id);

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("File downloaded successfully");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Please log in to upload photos</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
          
          {uploading ? (
            <div className="space-y-4">
              <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploading files...</p>
                <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% complete</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Upload Photos</h3>
                <p className="text-muted-foreground">
                  Drag and drop your images here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: JPG, PNG, GIF, WebP (Max 10MB per file)
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Uploaded Photos ({files.length})
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 bg-black/50 hover:bg-black/70"
                      onClick={() => downloadFile(file)}
                    >
                      <Download className="w-3 h-3 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => deleteFile(file.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <p className="font-medium text-sm truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
