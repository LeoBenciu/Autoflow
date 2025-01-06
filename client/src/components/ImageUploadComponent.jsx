import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { X } from 'lucide-react'
import { Button } from './ui/button'

const ImageUploadComponent = () => {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const handleFileSelect = (e) =>{
        const files = Array.from(e.target.files);
        setSelectedFiles(prev=> [...prev, ...files]);

        const newPreviews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));
        setPreviews(prev=> [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setSelectedFiles(prev=> prev.filter((_, i) => i !== index));

        URL.revokeObjectURL(previews[index].url);
        setPreviews(prev=> prev.filter((_, i)=> i!== index));
    };

    useEffect(()=>{
        return ()=> {
            previews.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, []);

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Input id='pictures' type='file' multiple accept='image/*'
        onChange={handleFileSelect}
        className="cursor-pointer border-red-500 bg-red-200 text-transparent
         font-bold"/>
      </div>


        {previews.length > 0 &&(
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                {previews.map((preview,index)=>(
                     <div key={index} className="relative group">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <p className="text-sm text-gray-500 mt-1 truncate">{preview.name}</p>
                     </div>                ))}
            </div>
        )}
    </div>
  )
}

export default ImageUploadComponent;
