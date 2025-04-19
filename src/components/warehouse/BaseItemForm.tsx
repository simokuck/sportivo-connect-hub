
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BaseItem } from '@/types/warehouse';
import { Image, Upload, Link as LinkIcon, Camera } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const baseItemSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  sku: z.string().min(1, "Il codice SKU è obbligatorio"),
  category: z.string().min(1, "La categoria è obbligatoria"),
  brand: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  image: z.string().optional(),
});

type BaseItemFormValues = z.infer<typeof baseItemSchema>;

interface BaseItemFormProps {
  item?: BaseItem;
  onSubmit: (data: BaseItemFormValues) => void;
  onCancel: () => void;
}

export function BaseItemForm({ item, onSubmit, onCancel }: BaseItemFormProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(item?.image || null);
  const [isCameraDialogOpen, setIsCameraDialogOpen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const form = useForm<BaseItemFormValues>({
    resolver: zodResolver(baseItemSchema),
    defaultValues: {
      name: item?.name || '',
      sku: item?.sku || '',
      category: item?.category || '',
      brand: item?.brand || '',
      description: item?.description || '',
      notes: item?.notes?.join('\n') || '',
      image: item?.image || '',
    },
  });

  const handleSubmit = (values: BaseItemFormValues) => {
    const notesArray = values.notes 
      ? values.notes.split('\n').filter(note => note.trim().length > 0) 
      : [];
    
    // Aggiungi l'immagine selezionata
    const dataToSubmit = {
      ...values,
      image: selectedImage || undefined,
      notes: notesArray.length > 0 ? values.notes : undefined,
    };
    
    onSubmit(dataToSubmit);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageDataUrl = event.target?.result as string;
      setSelectedImage(imageDataUrl);
      form.setValue('image', imageDataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (url: string) => {
    setSelectedImage(url);
    form.setValue('image', url);
  };

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Errore nell'accesso alla fotocamera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Imposta dimensioni canvas
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Disegna il frame corrente sul canvas
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Converti in data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageDataUrl);
      form.setValue('image', imageDataUrl);
      
      // Chiudi la fotocamera e il dialogo
      stopCamera();
      setIsCameraDialogOpen(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome articolo *</FormLabel>
                <FormControl>
                  <Input placeholder="Nome dell'articolo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Codice SKU *</FormLabel>
                <FormControl>
                  <Input placeholder="Codice articolo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria *</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Maglia, Pantaloncino, Accessorio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Es. Nike, Adidas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descrizione dell'articolo"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Immagine</FormLabel>
              <div className="space-y-4">
                <Tabs defaultValue="upload">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="upload" className="flex items-center gap-1">
                      <Upload size={16} /> Carica
                    </TabsTrigger>
                    <TabsTrigger value="url" className="flex items-center gap-1">
                      <LinkIcon size={16} /> URL
                    </TabsTrigger>
                    <TabsTrigger value="camera" className="flex items-center gap-1">
                      <Camera size={16} /> Fotocamera
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="upload" className="pt-4">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                    />
                  </TabsContent>
                  <TabsContent value="url" className="pt-4">
                    <Input 
                      placeholder="https://example.com/image.jpg" 
                      value={field.value || ''}
                      onChange={(e) => handleUrlChange(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="camera" className="pt-4">
                    <Dialog open={isCameraDialogOpen} onOpenChange={setIsCameraDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" className="w-full">
                          <Camera className="mr-2 h-4 w-4" />
                          Apri fotocamera
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Scatta una foto</DialogTitle>
                          <DialogDescription>
                            Utilizza la fotocamera per scattare una foto dell'articolo
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center">
                          {showCamera ? (
                            <>
                              <video 
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-auto max-h-[300px] border rounded"
                              ></video>
                              <canvas ref={canvasRef} className="hidden"></canvas>
                              <div className="flex justify-center gap-2 mt-4">
                                <Button type="button" onClick={capturePhoto} className="flex items-center">
                                  <Camera className="mr-2 h-4 w-4" />
                                  Scatta
                                </Button>
                                <Button variant="outline" type="button" onClick={stopCamera}>
                                  Annulla
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Button type="button" onClick={startCamera} className="flex items-center">
                              <Camera className="mr-2 h-4 w-4" />
                              Avvia fotocamera
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TabsContent>
                </Tabs>
                
                {/* Anteprima immagine */}
                {selectedImage && (
                  <div className="mt-4 relative">
                    <div className="relative w-40 h-40 border rounded overflow-hidden">
                      <img 
                        src={selectedImage} 
                        alt="Anteprima articolo"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                        onClick={() => {
                          setSelectedImage(null);
                          form.setValue('image', '');
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Note aggiuntive (una per riga)"
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Annulla
          </Button>
          <Button type="submit">
            {item ? 'Aggiorna articolo' : 'Crea articolo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
