import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockDocuments } from '@/data/mockData';
import { FileText, Download, Trash2, Plus, FilePlus, Printer, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Document, DocumentTemplate } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

type DocumentType = 'contract' | 'medical' | 'admin' | 'training' | 'template';

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'template-1',
    title: 'Contratto Standard Calciatore',
    type: 'contract',
    content: `Contratto di prestazione sportiva tra la società {teamName} e l'atleta {playerName}, nato il {birthDate} a {birthPlace}. L'atleta si impegna a svolgere l'attività sportiva per la stagione {season}.`,
    fields: ['teamName', 'playerName', 'birthDate', 'birthPlace', 'season'],
    createdBy: 'admin-1'
  },
  {
    id: 'template-2',
    title: 'Certificato Medico Sportivo',
    type: 'medical',
    content: `Si certifica che l'atleta {playerName}, nato il {birthDate}, è idoneo alla pratica sportiva agonistica per lo sport {sportType} fino alla data {expiryDate}.`,
    fields: ['playerName', 'birthDate', 'sportType', 'expiryDate'],
    createdBy: 'admin-1'
  }
];

const uploadSchema = z.object({
  title: z.string().min(3, { message: 'Il titolo deve essere di almeno 3 caratteri' }),
  type: z.enum(['contract', 'medical', 'admin', 'training', 'template']),
  file: z.instanceof(FileList).refine(files => files.length === 1, {
    message: 'È necessario selezionare un file',
  }),
  teamId: z.string().optional()
});

const templateSchema = z.object({
  templateId: z.string(),
  playerId: z.string().optional(),
  teamId: z.string().optional(),
  season: z.string().optional(),
  additionalFields: z.record(z.string()).optional()
});

type UploadFormData = z.infer<typeof uploadSchema>;
type TemplateFormData = z.infer<typeof templateSchema>;

const DocumentsPage = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [previewContent, setPreviewContent] = useState<string>('');

  const uploadForm = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      title: '',
      type: 'contract',
    }
  });

  const templateForm = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      templateId: '',
      additionalFields: {}
    }
  });

  const filteredDocuments = documents.filter(doc => {
    if (!user) return false;
    
    switch (user.role) {
      case 'admin':
        return true;
      case 'medical':
        return doc.type === 'medical';
      case 'player':
        return doc.userId === user.id;
      case 'coach':
        return doc.type === 'training' && user.teams?.some(team => team.id === doc.teamId);
      default:
        return false;
    }
  });

  const canDeleteDocuments = user?.role === 'admin';
  const canCreateDocuments = user?.role !== 'player';

  const handleDeleteDocument = (id: string) => {
    if (!canDeleteDocuments) return;

    const updatedDocuments = documents.filter(doc => doc.id !== id);
    setDocuments(updatedDocuments);
    
    toast({
      title: "Documento eliminato",
      description: "Il documento è stato eliminato con successo",
    });
  };

  const handleUploadSubmit = (data: UploadFormData) => {
    const file = data.file[0];
    
    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: data.title,
      type: data.type,
      uploadDate: new Date().toISOString(),
      userId: user?.id || '',
      teamId: data.teamId,
      url: URL.createObjectURL(file),
      category: data.type
    };
    
    setDocuments([...documents, newDocument]);
    setDialogOpen(false);
    uploadForm.reset();
    
    toast({
      title: "Documento caricato",
      description: "Il documento è stato caricato con successo",
    });
  };

  const handleTemplateChange = (templateId: string) => {
    const template = documentTemplates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    
    if (template) {
      templateForm.reset({
        templateId: template.id,
        additionalFields: {}
      });
    }
  };

  const handlePreviewTemplate = (data: TemplateFormData) => {
    if (!selectedTemplate) return;
    
    let content = selectedTemplate.content;
    
    const playerName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.name || '{playerName}';
    
    const teamName = user?.teams?.[0]?.name || '{teamName}';
    
    content = content
      .replace('{playerName}', playerName)
      .replace('{teamName}', teamName);
    
    if (data.additionalFields) {
      for (const [key, value] of Object.entries(data.additionalFields)) {
        if (typeof value === 'string') {
          content = content.replace(`{${key}}`, value);
        }
      }
    }
    
    if (data.season && typeof data.season === 'string') {
      content = content.replace('{season}', data.season);
    }
    
    setPreviewContent(content);
  };

  const handleCreateFromTemplate = (data: TemplateFormData) => {
    if (!selectedTemplate) return;
    
    const newDocument: Document = {
      id: `doc-template-${Date.now()}`,
      title: `${selectedTemplate.title} - Generato`,
      type: selectedTemplate.type || 'template',
      uploadDate: new Date().toISOString(),
      userId: user?.id || '',
      teamId: data.teamId,
      url: '#',
      category: selectedTemplate.type || 'template',
      isTemplate: true,
      templateData: {
        templateId: selectedTemplate.id,
        content: previewContent,
        additionalFields: data.additionalFields
      }
    };
    
    setDocuments([...documents, newDocument]);
    setTemplateDialogOpen(false);
    templateForm.reset();
    setPreviewContent('');
    
    toast({
      title: "Documento creato",
      description: "Il documento è stato creato con successo dal template",
    });
  };

  const handlePrintDocument = (doc: Document) => {
    toast({
      title: "Stampa in corso",
      description: "Il documento è stato inviato alla stampa",
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sportivo-blue">Documenti</h1>
        
        {canCreateDocuments && (
          <div className="flex gap-2">
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Carica Documento
            </Button>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(true)}>
              <FileEdit className="mr-2 h-4 w-4" />
              Usa Template
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Tutti</TabsTrigger>
          <TabsTrigger value="contract">Contratti</TabsTrigger>
          <TabsTrigger value="medical">Medici</TabsTrigger>
          <TabsTrigger value="admin">Amministrativi</TabsTrigger>
          <TabsTrigger value="training">Allenamenti</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDocuments.map((doc) => (
              <DocumentCard 
                key={doc.id} 
                document={doc}
                onDelete={handleDeleteDocument}
                onPrint={handlePrintDocument}
                canDelete={canDeleteDocuments}
              />
            ))}
          </div>
        </TabsContent>
        
        {['contract', 'medical', 'admin', 'training'].map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments
                .filter(doc => doc.type === type)
                .map((doc) => (
                  <DocumentCard 
                    key={doc.id} 
                    document={doc}
                    onDelete={handleDeleteDocument}
                    onPrint={handlePrintDocument}
                    canDelete={canDeleteDocuments}
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carica Documento</DialogTitle>
          </DialogHeader>
          
          <Form {...uploadForm}>
            <form onSubmit={uploadForm.handleSubmit(handleUploadSubmit)} className="space-y-4">
              <FormField
                control={uploadForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titolo</FormLabel>
                    <FormControl>
                      <Input placeholder="Inserisci il titolo del documento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={uploadForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo di documento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="contract">Contratto</SelectItem>
                        <SelectItem value="medical">Medico</SelectItem>
                        <SelectItem value="admin">Amministrativo</SelectItem>
                        <SelectItem value="training">Allenamento</SelectItem>
                        <SelectItem value="template">Template</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {user?.teams && user.teams.length > 0 && (
                <FormField
                  control={uploadForm.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squadra (opzionale)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona una squadra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {user.teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={uploadForm.control}
                name="file"
                render={({ field: { onChange, value, ...restField } }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl>
                      <Input
                        type="file" 
                        onChange={(e) => onChange(e.target.files)}
                        {...restField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="submit">Carica</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crea documento da template</DialogTitle>
          </DialogHeader>
          
          <Form {...templateForm}>
            <form onSubmit={templateForm.handleSubmit(handleCreateFromTemplate)} className="space-y-4">
              <FormField
                control={templateForm.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleTemplateChange(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona un template" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {selectedTemplate && (
                <>
                  {user?.teams && user.teams.length > 0 && (
                    <FormField
                      control={templateForm.control}
                      name="teamId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Squadra</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleziona una squadra" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {user.teams.map((team) => (
                                <SelectItem key={team.id} value={team.id}>
                                  {team.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedTemplate.type === 'contract' && (
                    <FormField
                      control={templateForm.control}
                      name="season"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stagione Sportiva</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Es: 2025-2026" 
                              {...field} 
                              value={field.value || ''} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedTemplate.fields
                    .filter(field => !['playerName', 'teamName'].includes(field))
                    .filter(field => field !== 'season')
                    .map((field) => (
                      <FormField
                        key={field}
                        control={templateForm.control}
                        name={`additionalFields.${field}` as any}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={`Inserisci ${field}`} 
                                {...formField} 
                                value={formField.value || ''} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))
                  }
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handlePreviewTemplate(templateForm.getValues())}
                  >
                    Anteprima
                  </Button>
                  
                  {previewContent && (
                    <div className="p-4 border rounded-md bg-muted">
                      <h3 className="font-medium mb-2">Anteprima del documento:</h3>
                      <div className="whitespace-pre-line">{previewContent}</div>
                    </div>
                  )}
                </>
              )}
              
              <DialogFooter>
                <Button type="submit" disabled={!selectedTemplate}>Crea Documento</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string) => void;
  onPrint: (doc: Document) => void;
  canDelete: boolean;
}

const DocumentCard = ({ document, onDelete, onPrint, canDelete }: DocumentCardProps) => {
  return (
    <Card key={document.id} className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center space-y-0 gap-4">
        <FileText className="h-8 w-8 text-sportivo-blue" />
        <CardTitle className="text-lg">{document.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Caricato il: {new Date(document.uploadDate).toLocaleDateString('it-IT')}
          </p>
          
          <div className="flex space-x-2">
            <Button variant="outline" className="flex-1" asChild>
              <a href={document.url} download>
                <Download className="mr-2 h-4 w-4" />
                Scarica
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => onPrint(document)}
            >
              <Printer className="h-4 w-4" />
            </Button>
            
            {canDelete && (
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => onDelete(document.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsPage;
