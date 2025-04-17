
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Sample sports data
const initialSports = [
  { id: 'sport-1', name: 'Calcio', active: true },
  { id: 'sport-2', name: 'Basket', active: false },
  { id: 'sport-3', name: 'Pallavolo', active: false },
  { id: 'sport-4', name: 'Calcio a 5', active: false },
  { id: 'sport-5', name: 'Tennis', active: false },
];

// Sample roles data
const initialRoles = [
  { id: 'role-1', name: 'Allenatore', sportId: 'sport-1', permissions: ['view_players', 'edit_trainings', 'view_calendar'] },
  { id: 'role-2', name: 'Giocatore', sportId: 'sport-1', permissions: ['view_calendar', 'view_documents'] },
  { id: 'role-3', name: 'Medico', sportId: 'sport-1', permissions: ['view_players', 'edit_medical', 'view_calendar'] },
  { id: 'role-4', name: 'Admin', sportId: null, permissions: ['all'] },
];

// Available permissions
const availablePermissions = [
  { id: 'view_players', name: 'Visualizza giocatori' },
  { id: 'edit_players', name: 'Modifica giocatori' },
  { id: 'view_calendar', name: 'Visualizza calendario' },
  { id: 'edit_calendar', name: 'Modifica calendario' },
  { id: 'view_documents', name: 'Visualizza documenti' },
  { id: 'edit_documents', name: 'Modifica documenti' },
  { id: 'edit_trainings', name: 'Gestisci allenamenti' },
  { id: 'edit_medical', name: 'Gestione dati medici' },
  { id: 'all', name: 'Accesso completo' },
];

const sportFormSchema = z.object({
  name: z.string().min(2, { message: 'Il nome deve essere di almeno 2 caratteri' }),
  active: z.boolean().default(false),
});

const roleFormSchema = z.object({
  name: z.string().min(2, { message: 'Il nome deve essere di almeno 2 caratteri' }),
  sportId: z.string().nullable(),
  permissions: z.array(z.string()),
});

const generalSettingsSchema = z.object({
  appName: z.string().min(3, { message: 'Il nome deve essere di almeno 3 caratteri' }),
  mainColor: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Colore non valido' }),
  maintenanceMode: z.boolean().default(false),
  defaultLanguage: z.string(),
  enableBiometric: z.boolean().default(true),
});

const DevSettings = () => {
  const { user } = useAuth();
  
  const [sports, setSports] = useState(initialSports);
  const [roles, setRoles] = useState(initialRoles);
  const [editingSport, setEditingSport] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  
  const sportForm = useForm({
    resolver: zodResolver(sportFormSchema),
    defaultValues: {
      name: '',
      active: false,
    }
  });
  
  const roleForm = useForm({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: '',
      sportId: null,
      permissions: [],
    }
  });
  
  const generalSettingsForm = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: 'Sportivo Connect',
      mainColor: '#1f66b8',
      maintenanceMode: false,
      defaultLanguage: 'it',
      enableBiometric: true,
    }
  });

  // Only allow access to users with role 'admin'
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  const handleAddSport = (data: z.infer<typeof sportFormSchema>) => {
    const newSport = {
      id: `sport-${Date.now()}`,
      name: data.name,
      active: data.active,
    };
    
    setSports([...sports, newSport]);
    sportForm.reset();
    
    toast({
      title: "Sport aggiunto",
      description: `Lo sport ${data.name} è stato aggiunto con successo`,
    });
  };
  
  const handleUpdateSport = (data: z.infer<typeof sportFormSchema>) => {
    if (!editingSport) return;
    
    const updatedSports = sports.map(sport => 
      sport.id === editingSport ? { ...sport, ...data } : sport
    );
    
    setSports(updatedSports);
    setEditingSport(null);
    sportForm.reset();
    
    toast({
      title: "Sport aggiornato",
      description: `Lo sport ${data.name} è stato aggiornato con successo`,
    });
  };
  
  const handleEditSport = (sport: any) => {
    setEditingSport(sport.id);
    sportForm.reset({
      name: sport.name,
      active: sport.active,
    });
  };
  
  const handleDeleteSport = (id: string) => {
    setSports(sports.filter(sport => sport.id !== id));
    
    // Also delete roles associated with this sport
    setRoles(roles.filter(role => role.sportId !== id));
    
    toast({
      title: "Sport eliminato",
      description: "Lo sport è stato eliminato con successo",
    });
  };
  
  const handleAddRole = (data: z.infer<typeof roleFormSchema>) => {
    const newRole = {
      id: `role-${Date.now()}`,
      name: data.name,
      sportId: data.sportId,
      permissions: data.permissions,
    };
    
    setRoles([...roles, newRole]);
    roleForm.reset();
    
    toast({
      title: "Ruolo aggiunto",
      description: `Il ruolo ${data.name} è stato aggiunto con successo`,
    });
  };
  
  const handleUpdateRole = (data: z.infer<typeof roleFormSchema>) => {
    if (!editingRole) return;
    
    const updatedRoles = roles.map(role => 
      role.id === editingRole ? { ...role, ...data } : role
    );
    
    setRoles(updatedRoles);
    setEditingRole(null);
    roleForm.reset();
    
    toast({
      title: "Ruolo aggiornato",
      description: `Il ruolo ${data.name} è stato aggiornato con successo`,
    });
  };
  
  const handleEditRole = (role: any) => {
    setEditingRole(role.id);
    roleForm.reset({
      name: role.name,
      sportId: role.sportId,
      permissions: role.permissions,
    });
  };
  
  const handleDeleteRole = (id: string) => {
    setRoles(roles.filter(role => role.id !== id));
    
    toast({
      title: "Ruolo eliminato",
      description: "Il ruolo è stato eliminato con successo",
    });
  };
  
  const handleSaveGeneralSettings = (data: z.infer<typeof generalSettingsSchema>) => {
    console.log("Saving general settings:", data);
    
    toast({
      title: "Impostazioni salvate",
      description: "Le impostazioni generali sono state salvate con successo",
    });
  };
  
  const handleDuplicateSport = (sport: any) => {
    const newSport = {
      ...sport,
      id: `sport-${Date.now()}`,
      name: `${sport.name} (copia)`,
    };
    
    setSports([...sports, newSport]);
    
    toast({
      title: "Sport duplicato",
      description: `Lo sport ${sport.name} è stato duplicato con successo`,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue mb-6">Impostazioni Sviluppatore</h1>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Generale</TabsTrigger>
          <TabsTrigger value="sports">Sport</TabsTrigger>
          <TabsTrigger value="roles">Ruoli</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Impostazioni Generali</CardTitle>
              <CardDescription>
                Configura le impostazioni base dell'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...generalSettingsForm}>
                <form onSubmit={generalSettingsForm.handleSubmit(handleSaveGeneralSettings)} className="space-y-4">
                  <FormField
                    control={generalSettingsForm.control}
                    name="appName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Applicazione</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="mainColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Colore Principale</FormLabel>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <div 
                            className="w-10 h-10 border rounded" 
                            style={{ backgroundColor: field.value }}
                          />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="defaultLanguage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lingua Predefinita</FormLabel>
                        <FormControl>
                          <select 
                            className="w-full p-2 border rounded"
                            {...field}
                          >
                            <option value="it">Italiano</option>
                            <option value="en">Inglese</option>
                            <option value="es">Spagnolo</option>
                            <option value="fr">Francese</option>
                            <option value="de">Tedesco</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="maintenanceMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Modalità Manutenzione</FormLabel>
                          <FormDescription>
                            Attiva la modalità manutenzione per bloccare l'accesso all'app
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={generalSettingsForm.control}
                    name="enableBiometric"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Accesso Biometrico</FormLabel>
                          <FormDescription>
                            Abilita l'accesso biometrico per gli utenti
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Salva Impostazioni</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Sport</CardTitle>
              <CardDescription>
                Aggiungi e configura nuovi sport supportati dall'applicazione
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Stato</TableHead>
                    <TableHead className="w-[150px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sports.map((sport) => (
                    <TableRow key={sport.id}>
                      <TableCell>{sport.name}</TableCell>
                      <TableCell>
                        {sport.active ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Attivo
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Inattivo
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditSport(sport)}
                          >
                            Modifica
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDuplicateSport(sport)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteSport(sport.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Card>
                <CardHeader>
                  <CardTitle>{editingSport ? 'Modifica Sport' : 'Aggiungi nuovo Sport'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...sportForm}>
                    <form 
                      onSubmit={sportForm.handleSubmit(editingSport ? handleUpdateSport : handleAddSport)} 
                      className="space-y-4"
                    >
                      <FormField
                        control={sportForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={sportForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                              <FormLabel>Attivo</FormLabel>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex gap-2">
                        <Button type="submit">
                          {editingSport ? 'Aggiorna' : 'Aggiungi'}
                        </Button>
                        {editingSport && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditingSport(null);
                              sportForm.reset();
                            }}
                          >
                            Annulla
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestione Ruoli</CardTitle>
              <CardDescription>
                Configura i ruoli e le autorizzazioni per ogni sport
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Sport</TableHead>
                    <TableHead>Permessi</TableHead>
                    <TableHead className="w-[100px]">Azioni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.name}</TableCell>
                      <TableCell>
                        {role.sportId 
                          ? sports.find(sport => sport.id === role.sportId)?.name || 'Sport non trovato'
                          : 'Globale (tutti gli sport)'
                        }
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.includes('all') ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Tutti i permessi
                            </span>
                          ) : (
                            role.permissions.map(permission => (
                              <span 
                                key={permission}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {availablePermissions.find(p => p.id === permission)?.name || permission}
                              </span>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditRole(role)}
                          >
                            Modifica
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteRole(role.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <Card>
                <CardHeader>
                  <CardTitle>{editingRole ? 'Modifica Ruolo' : 'Aggiungi nuovo Ruolo'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...roleForm}>
                    <form 
                      onSubmit={roleForm.handleSubmit(editingRole ? handleUpdateRole : handleAddRole)} 
                      className="space-y-4"
                    >
                      <FormField
                        control={roleForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={roleForm.control}
                        name="sportId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sport</FormLabel>
                            <FormControl>
                              <select 
                                className="w-full p-2 border rounded"
                                value={field.value || ''}
                                onChange={e => field.onChange(e.target.value || null)}
                              >
                                <option value="">Globale (tutti gli sport)</option>
                                {sports.map((sport) => (
                                  <option key={sport.id} value={sport.id}>
                                    {sport.name}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div>
                        <FormLabel>Permessi</FormLabel>
                        <div className="mt-2 space-y-2">
                          {availablePermissions.map((permission) => (
                            <label key={permission.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={roleForm.watch('permissions')?.includes(permission.id)}
                                onChange={(e) => {
                                  const permissions = [...(roleForm.watch('permissions') || [])];
                                  
                                  if (permission.id === 'all') {
                                    // If "all" is checked, remove all other permissions
                                    if (e.target.checked) {
                                      roleForm.setValue('permissions', ['all']);
                                    } else {
                                      roleForm.setValue('permissions', []);
                                    }
                                    return;
                                  }
                                  
                                  // If any other permission is checked, remove "all" permission
                                  if (permissions.includes('all')) {
                                    const index = permissions.indexOf('all');
                                    permissions.splice(index, 1);
                                  }
                                  
                                  if (e.target.checked) {
                                    permissions.push(permission.id);
                                  } else {
                                    const index = permissions.indexOf(permission.id);
                                    if (index !== -1) {
                                      permissions.splice(index, 1);
                                    }
                                  }
                                  
                                  roleForm.setValue('permissions', permissions);
                                }}
                              />
                              <span>{permission.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button type="submit">
                          {editingRole ? 'Aggiorna' : 'Aggiungi'}
                        </Button>
                        {editingRole && (
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setEditingRole(null);
                              roleForm.reset();
                            }}
                          >
                            Annulla
                          </Button>
                        )}
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DevSettings;
