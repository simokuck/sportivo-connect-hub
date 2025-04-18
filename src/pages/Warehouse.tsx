import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Shirt, Volleyball, Flag, Plus, Trash2, Edit, Image, Camera, Search, Filter, FileUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNotifications } from '@/context/NotificationContext';

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  details: string;
  image?: string;
  status?: 'available' | 'low' | 'out';
  lastUpdated?: string;
  location?: string;
  supplier?: string;
  color?: string;
  size?: string;
}

const mockKits: WarehouseItem[] = [
  { 
    id: '1', 
    name: 'Kit Gara Home', 
    category: 'kit', 
    quantity: 25, 
    details: 'Taglie: S(5), M(10), L(7), XL(3)',
    status: 'available',
    location: 'Armadio A',
    supplier: 'Nike',
    color: 'Blu/Bianco'
  },
  { 
    id: '2', 
    name: 'Kit Allenamento', 
    category: 'kit', 
    quantity: 30, 
    details: 'Taglie: S(8), M(12), L(10)',
    status: 'available',
    location: 'Armadio B',
    supplier: 'Adidas',
    color: 'Nero'
  },
  { 
    id: '3', 
    name: 'Kit Trasferta', 
    category: 'kit', 
    quantity: 5, 
    details: 'Taglie: S(1), M(2), L(2)',
    status: 'low',
    location: 'Armadio A',
    supplier: 'Nike',
    color: 'Rosso/Nero'
  },
];

const mockEquipment: WarehouseItem[] = [
  { 
    id: '1', 
    name: 'Palloni da gara', 
    category: 'palloni', 
    quantity: 15, 
    details: 'Taglia 5',
    status: 'available',
    location: 'Scaffale 1',
    supplier: 'Mikasa'
  },
  { 
    id: '2', 
    name: 'Cinesini', 
    category: 'allenamento', 
    quantity: 40, 
    details: 'Colori vari',
    status: 'available',
    location: 'Scaffale 2',
    supplier: 'Generic'
  },
  { 
    id: '3', 
    name: 'Conetti', 
    category: 'allenamento', 
    quantity: 30, 
    details: '30cm altezza',
    status: 'available',
    location: 'Scaffale 2',
    supplier: 'Generic'
  },
  { 
    id: '4', 
    name: 'Fratini', 
    category: 'allenamento', 
    quantity: 20, 
    details: '10 blu, 10 rossi',
    status: 'available',
    location: 'Armadio C',
    supplier: 'Generic'
  },
  { 
    id: '5', 
    name: 'Pali slalom', 
    category: 'allenamento', 
    quantity: 3, 
    details: 'Set da 6 pali',
    status: 'low',
    location: 'Magazzino esterno',
    supplier: 'Sports Pro'
  },
];

const Warehouse = () => {
  const [kits, setKits] = useState<WarehouseItem[]>(mockKits);
  const [equipment, setEquipment] = useState<WarehouseItem[]>(mockEquipment);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  const { showNotification } = useNotifications();

  const handleDelete = (id: string, category: 'kits' | 'equipment') => {
    setIsDeleteModalOpen(false);
    if (category === 'kits') {
      setKits(kits.filter(item => item.id !== id));
    } else {
      setEquipment(equipment.filter(item => item.id !== id));
    }
    showNotification('success', 'Articolo eliminato', {
      description: "L'articolo è stato rimosso dal magazzino",
    });
  };

  const handleEdit = (item: WarehouseItem) => {
    setCurrentItem(item);
    setTempImageUrl(item.image || null);
    setIsEditDialogOpen(true);
  };

  const handleAdd = (newItem: Omit<WarehouseItem, 'id'>) => {
    const item = {
      ...newItem,
      id: Math.random().toString(36).substring(7),
      lastUpdated: new Date().toISOString(),
      image: tempImageUrl || undefined
    };
    if (newItem.category === 'kit') {
      setKits([...kits, item as WarehouseItem]);
    } else {
      setEquipment([...equipment, item as WarehouseItem]);
    }
    setIsAddDialogOpen(false);
    setTempImageUrl(null);
    showNotification('success', 'Articolo aggiunto', {
      description: "Il nuovo articolo è stato aggiunto al magazzino",
    });
  };

  const handleUpdate = (updatedItem: WarehouseItem) => {
    const itemWithImage = {
      ...updatedItem,
      image: tempImageUrl || updatedItem.image,
      lastUpdated: new Date().toISOString()
    };
    
    if (updatedItem.category === 'kit') {
      setKits(kits.map(item => item.id === updatedItem.id ? itemWithImage : item));
    } else {
      setEquipment(equipment.map(item => item.id === updatedItem.id ? itemWithImage : item));
    }
    setIsEditDialogOpen(false);
    setTempImageUrl(null);
    showNotification('success', 'Articolo aggiornato', {
      description: "Le modifiche sono state salvate",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In una vera applicazione, qui carichiamo il file su un server
      // Per ora, creiamo un URL temporaneo
      const imageUrl = URL.createObjectURL(file);
      setTempImageUrl(imageUrl);
      showNotification('info', 'Immagine caricata', {
        description: "L'immagine verrà associata all'articolo al salvataggio",
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const filteredKits = kits.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.supplier?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesLocation = filterLocation === 'all' || item.location === filterLocation;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  const allItems = [...kits, ...equipment];
  const categories = Array.from(new Set(allItems.map(item => item.category)));
  const statuses = Array.from(new Set(allItems.map(item => item.status).filter(Boolean)));
  const locations = Array.from(new Set(allItems.map(item => item.location).filter(Boolean)));

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-6 content-wrapper">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold">Magazzino</h1>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Aggiungi Articolo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca articoli..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsFilterVisible(!isFilterVisible)}
          className="sm:w-auto w-full"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtri {isFilterVisible ? '▲' : '▼'}
        </Button>
      </div>

      {isFilterVisible && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-background rounded-md border">
          <div>
            <Label htmlFor="category-filter">Categoria</Label>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger id="category-filter" className="w-full">
                <SelectValue placeholder="Seleziona categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status-filter">Stato</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger id="status-filter" className="w-full">
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutti gli stati</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === 'available' ? 'Disponibile' : 
                     status === 'low' ? 'Scorta bassa' : 
                     status === 'out' ? 'Esaurito' : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location-filter">Posizione</Label>
            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger id="location-filter" className="w-full">
                <SelectValue placeholder="Seleziona posizione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le posizioni</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Tabs defaultValue="kits" className="w-full">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="kits" className="flex-1 sm:flex-none">Kit</TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1 sm:flex-none">Materiale Tecnico</TabsTrigger>
        </TabsList>

        <TabsContent value="kits">
          {filteredKits.length === 0 ? (
            <Alert>
              <AlertDescription>Nessun kit corrisponde ai criteri di ricerca.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredKits.map((item) => (
                <Card key={item.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          <Shirt className="h-5 w-5" />
                          {item.name}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 mt-1">
                          <Badge variant={
                            item.status === 'low' ? "secondary" : 
                            item.status === 'out' ? "destructive" : 
                            "outline"
                          }>
                            {item.status === 'available' ? 'Disponibile' : 
                             item.status === 'low' ? 'Scorta bassa' : 
                             item.status === 'out' ? 'Esaurito' : item.status}
                          </Badge>
                          <Badge variant="secondary">Qt. {item.quantity}</Badge>
                          {item.color && <Badge variant="outline">{item.color}</Badge>}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {item.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{item.details}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Posizione: {item.location}</p>
                          <p>Fornitore: {item.supplier}</p>
                          {item.lastUpdated && (
                            <p>Ultimo aggiornamento: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="equipment">
          {filteredEquipment.length === 0 ? (
            <Alert>
              <AlertDescription>Nessun materiale tecnico corrisponde ai criteri di ricerca.</AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                          {item.category === 'palloni' ? (
                            <Volleyball className="h-5 w-5" />
                          ) : (
                            <Flag className="h-5 w-5" />
                          )}
                          {item.name}
                        </CardTitle>
                        <CardDescription className="flex flex-wrap gap-2 mt-1">
                          <Badge variant={
                            item.status === 'low' ? "secondary" : 
                            item.status === 'out' ? "destructive" : 
                            "outline"
                          }>
                            {item.status === 'available' ? 'Disponibile' : 
                             item.status === 'low' ? 'Scorta bassa' : 
                             item.status === 'out' ? 'Esaurito' : item.status}
                          </Badge>
                          <Badge variant="secondary">Qt. {item.quantity}</Badge>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentItem(item);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {item.image && (
                        <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{item.details}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          <p>Posizione: {item.location}</p>
                          <p>Fornitore: {item.supplier}</p>
                          {item.lastUpdated && (
                            <p>Ultimo aggiornamento: {new Date(item.lastUpdated).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Articolo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input id="name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select defaultValue="kit">
                <SelectTrigger id="category" className="col-span-3">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kit">Kit</SelectItem>
                  <SelectItem value="palloni">Palloni</SelectItem>
                  <SelectItem value="allenamento">Attrezzatura Allenamento</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantità
              </Label>
              <Input id="quantity" type="number" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="details" className="text-right">
                Dettagli
              </Label>
              <Input id="details" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Stato
              </Label>
              <Select defaultValue="available">
                <SelectTrigger id="status" className="col-span-3">
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponibile</SelectItem>
                  <SelectItem value="low">Scorta bassa</SelectItem>
                  <SelectItem value="out">Esaurito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Posizione
              </Label>
              <Input id="location" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="supplier" className="text-right">
                Fornitore
              </Label>
              <Input id="supplier" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Immagine
              </Label>
              <div className="col-span-3 space-y-4">
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full" onClick={triggerFileInput}>
                    <FileUp className="mr-2 h-4 w-4" />
                    Carica immagine
                  </Button>
                </div>
                {tempImageUrl && (
                  <div className="w-full h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                    <img src={tempImageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddDialogOpen(false);
              setTempImageUrl(null);
            }}>
              Annulla
            </Button>
            <Button onClick={() => handleAdd({
              name: (document.getElementById('name') as HTMLInputElement).value,
              category: (document.querySelector('#category [data-value]') as HTMLElement)?.getAttribute('data-value') || 'kit',
              quantity: parseInt((document.getElementById('quantity') as HTMLInputElement).value) || 0,
              details: (document.getElementById('details') as HTMLInputElement).value,
              status: (document.querySelector('#status [data-value]') as HTMLElement)?.getAttribute('data-value') as any || 'available',
              location: (document.getElementById('location') as HTMLInputElement).value,
              supplier: (document.getElementById('supplier') as HTMLInputElement).value,
              lastUpdated: new Date().toISOString()
            })}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifica Articolo</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Nome
                </Label>
                <Input id="edit-name" defaultValue={currentItem.name} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">
                  Quantità
                </Label>
                <Input id="edit-quantity" type="number" defaultValue={currentItem.quantity} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-details" className="text-right">
                  Dettagli
                </Label>
                <Input id="edit-details" defaultValue={currentItem.details} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Stato
                </Label>
                <Select defaultValue={currentItem.status || 'available'}>
                  <SelectTrigger id="edit-status" className="col-span-3">
                    <SelectValue placeholder="Seleziona stato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponibile</SelectItem>
                    <SelectItem value="low">Scorta bassa</SelectItem>
                    <SelectItem value="out">Esaurito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-location" className="text-right">
                  Posizione
                </Label>
                <Input id="edit-location" defaultValue={currentItem.location} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-supplier" className="text-right">
                  Fornitore
                </Label>
                <Input id="edit-supplier" defaultValue={currentItem.supplier} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Immagine
                </Label>
                <div className="col-span-3 space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={triggerFileInput}>
                      <FileUp className="mr-2 h-4 w-4" />
                      {currentItem.image || tempImageUrl ? 'Cambia immagine' : 'Carica immagine'}
                    </Button>
                  </div>
                  {(tempImageUrl || currentItem.image) && (
                    <div className="w-full h-32 rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <img src={tempImageUrl || currentItem.image} alt="Preview" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setTempImageUrl(null);
            }}>
              Annulla
            </Button>
            <Button onClick={() => {
              if (currentItem) {
                handleUpdate({
                  ...currentItem,
                  name: (document.getElementById('edit-name') as HTMLInputElement).value,
                  quantity: parseInt((document.getElementById('edit-quantity') as HTMLInputElement).value) || 0,
                  details: (document.getElementById('edit-details') as HTMLInputElement).value,
                  status: (document.querySelector('#edit-status [data-value]') as HTMLElement)?.getAttribute('data-value') as any || currentItem.status,
                  location: (document.getElementById('edit-location') as HTMLInputElement).value,
                  supplier: (document.getElementById('edit-supplier') as HTMLInputElement).value,
                });
              }
            }}>
              Salva modifiche
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => currentItem && handleDelete(currentItem.id, currentItem.category === 'kit' ? 'kits' : 'equipment')}
        title="Conferma eliminazione"
        description={`Sei sicuro di voler eliminare ${currentItem?.name}? Questa azione non può essere annullata.`}
        confirmText="Elimina"
        cancelText="Annulla"
        toastMessage="Articolo eliminato"
        toastDescription="L'articolo è stato rimosso dal magazzino"
      />
    </div>
  );
};

export default Warehouse;
