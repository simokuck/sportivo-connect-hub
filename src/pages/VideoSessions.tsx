import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarIcon, Clock, Video, Play, Filter, Plus, Share2, Edit, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { Team } from '@/types';

// Mock data
const mockTeams: Team[] = [
  { id: '1', name: 'Prima Squadra', category: 'Senior' },
  { id: '2', name: 'Under 19', category: 'Youth' },
  { id: '3', name: 'Under 17', category: 'Youth' },
];

interface VideoSession {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number;
  teamId: string;
  videoUrl: string;
  tags?: string[];
  coverImage?: string;
}

const mockVideoSessions: VideoSession[] = [
  {
    id: '1',
    title: 'Analisi tattica difensiva',
    description: 'Revisione delle fasi difensive dell\'ultima partita',
    date: new Date(2023, 3, 10),
    duration: 45,
    teamId: '1',
    videoUrl: 'https://example.com/video1',
    tags: ['difesa', 'tattica'],
    coverImage: '/assets/placeholder.svg'
  },
  {
    id: '2',
    title: 'Tecnica di passaggio',
    description: 'Esercizi sulla tecnica di passaggio',
    date: new Date(2023, 3, 15),
    duration: 30,
    teamId: '2',
    videoUrl: 'https://example.com/video2',
    tags: ['tecnica', 'passaggio'],
    coverImage: '/assets/placeholder.svg'
  },
  {
    id: '3',
    title: 'Analisi avversari',
    description: 'Studio tattico del prossimo avversario',
    date: new Date(2023, 3, 18),
    duration: 60,
    teamId: '1',
    videoUrl: 'https://example.com/video3',
    tags: ['avversari', 'tattica'],
    coverImage: '/assets/placeholder.svg'
  }
];

// Form schema
const videoSessionSchema = z.object({
  title: z.string().min(1, 'Il titolo è richiesto'),
  description: z.string().optional(),
  date: z.date({
    required_error: "Seleziona una data",
  }),
  duration: z.coerce.number().min(1, 'La durata deve essere maggiore di 0'),
  teamId: z.string().min(1, 'Seleziona una squadra'),
  videoUrl: z.string().url('Inserisci un URL valido'),
  tags: z.string().optional(),
});

type VideoSessionFormValues = z.infer<typeof videoSessionSchema>;

const VideoSessions = () => {
  const [sessions, setSessions] = useState<VideoSession[]>(mockVideoSessions);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);
  const [filterTeam, setFilterTeam] = useState<string>("all"); // Changed from empty string to "all"

  const form = useForm<VideoSessionFormValues>({
    resolver: zodResolver(videoSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 30,
      videoUrl: '',
      tags: '',
    },
  });

  const handleAddSession = (data: VideoSessionFormValues) => {
    const newSession: VideoSession = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      date: data.date,
      duration: data.duration,
      teamId: data.teamId,
      videoUrl: data.videoUrl,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      coverImage: '/assets/placeholder.svg'
    };

    setSessions([...sessions, newSession]);
    setIsAddDialogOpen(false);
    form.reset();
    toast.success('Sessione video aggiunta con successo');
  };

  const handleViewSession = (session: VideoSession) => {
    setSelectedSession(session);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
    toast.success('Sessione video eliminata');
  };

  const getTeamName = (teamId: string) => {
    const team = mockTeams.find(t => t.id === teamId);
    return team ? team.name : 'Squadra non trovata';
  };

  const filteredSessions = sessions.filter(session => {
    if (activeTab === 'all') {
      return filterTeam === "all" ? true : session.teamId === filterTeam; // Updated condition
    }
    // Convert date to days old
    const daysOld = Math.floor((new Date().getTime() - session.date.getTime()) / (1000 * 3600 * 24));
    
    if (activeTab === 'recent' && daysOld <= 7) {
      return filterTeam === "all" ? true : session.teamId === filterTeam; // Updated condition
    }
    return false;
  });

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sessioni Video</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={18} />
              Aggiungi Sessione
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>Aggiungi Nuova Sessione Video</DialogTitle>
              <DialogDescription>
                Compila il form per aggiungere una nuova sessione video.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddSession)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titolo</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Titolo della sessione" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Seleziona data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Durata (minuti)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} min={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="teamId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Squadra</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona squadra" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockTeams.map((team) => (
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
                
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Video</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://..." />
                      </FormControl>
                      <FormDescription>
                        Inserisci l'URL del video da YouTube, Vimeo o altra piattaforma
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrizione</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descrizione della sessione video..."
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tag</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="tattica, difesa, attacco" />
                      </FormControl>
                      <FormDescription>
                        Inserisci i tag separati da virgola
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Salva Sessione</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tutte le sessioni</TabsTrigger>
            <TabsTrigger value="recent">Recenti</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filtra per squadra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le squadre</SelectItem> {/* Changed value from "" to "all" */}
              {mockTeams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setFilterTeam("all")}> {/* Changed from empty string to "all" */}
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {filteredSessions.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="overflow-hidden">
              <div 
                className="relative h-48 bg-cover bg-center cursor-pointer flex items-center justify-center bg-muted"
                style={{ backgroundImage: `url(${session.coverImage})` }}
                onClick={() => handleViewSession(session)}
              >
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Button size="icon" variant="ghost" className="h-16 w-16 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30">
                    <Play className="h-8 w-8 text-white" />
                  </Button>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-1">{session.title}</CardTitle>
                <CardDescription>
                  {getTeamName(session.teamId)}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {format(session.date, "dd/MM/yyyy")}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {session.duration} min
                  </div>
                </div>
                {session.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{session.description}</p>
                )}
                {session.tags && session.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {session.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t px-6 py-3">
                <Button variant="ghost" size="sm" className="gap-1">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Condividi</span>
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nessuna sessione video trovata</h3>
            <p className="text-muted-foreground mb-4">
              {filterTeam ? 'Nessuna sessione per la squadra selezionata.' : 'Aggiungi la tua prima sessione video.'}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Sessione
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* View Video Dialog */}
      {selectedSession && (
        <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedSession.title}</DialogTitle>
              <DialogDescription>
                {getTeamName(selectedSession.teamId)} · {format(selectedSession.date, "dd/MM/yyyy")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
              <Video className="h-12 w-12 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Video Preview</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Descrizione</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedSession.description || "Nessuna descrizione disponibile."}
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium mb-1">Durata</h4>
                  <p className="text-sm text-muted-foreground">{selectedSession.duration} minuti</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-1">Link</h4>
                  <a 
                    href={selectedSession.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Apri in nuova finestra
                  </a>
                </div>
              </div>
              
              {selectedSession.tags && selectedSession.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Tag</h4>
                  <div className="flex gap-1 flex-wrap">
                    {selectedSession.tags.map((tag, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default VideoSessions;
