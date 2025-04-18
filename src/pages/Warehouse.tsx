
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Shirt, Volleyball, Flag, Plus, Trash2, Edit, Image, Camera } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  details: string;
  image?: string;
}

const mockKits: WarehouseItem[] = [
  { id: '1', name: 'Kit Gara Home', category: 'kit', quantity: 25, details: 'Taglie: S(5), M(10), L(7), XL(3)' },
  { id: '2', name: 'Kit Allenamento', category: 'kit', quantity: 30, details: 'Taglie: S(8), M(12), L(10)' },
];

const mockEquipment: WarehouseItem[] = [
  { id: '1', name: 'Palloni da gara', category: 'palloni', quantity: 15, details: 'Taglia 5' },
  { id: '2', name: 'Cinesini', category: 'allenamento', quantity: 40, details: 'Colori vari' },
  { id: '3', name: 'Conetti', category: 'allenamento', quantity: 30, details: '30cm altezza' },
  { id: '4', name: 'Fratini', category: 'allenamento', quantity: 20, details: '10 blu, 10 rossi' },
];

const Warehouse = () => {
  const [kits, setKits] = useState<WarehouseItem[]>(mockKits);
  const [equipment, setEquipment] = useState<WarehouseItem[]>(mockEquipment);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<WarehouseItem | null>(null);
  const { toast } = useToast();

  const handleDelete = (id: string, category: 'kits' | 'equipment') => {
    if (category === 'kits') {
      setKits(kits.filter(item => item.id !== id));
    } else {
      setEquipment(equipment.filter(item => item.id !== id));
    }
    toast({
      title: "Articolo eliminato",
      description: "L'articolo è stato rimosso dal magazzino",
    });
  };

  const handleEdit = (item: WarehouseItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const handleAdd = (newItem: Omit<WarehouseItem, 'id'>) => {
    const item = {
      ...newItem,
      id: Math.random().toString(36).substring(7),
    };
    if (newItem.category === 'kit') {
      setKits([...kits, item]);
    } else {
      setEquipment([...equipment, item]);
    }
    setIsAddDialogOpen(false);
    toast({
      title: "Articolo aggiunto",
      description: "Il nuovo articolo è stato aggiunto al magazzino",
    });
  };

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

      <Tabs defaultValue="kits" className="w-full">
        <TabsList className="w-full sm:w-auto flex overflow-x-auto">
          <TabsTrigger value="kits" className="flex-1 sm:flex-none">Kit</TabsTrigger>
          <TabsTrigger value="equipment" className="flex-1 sm:flex-none">Materiale Tecnico</TabsTrigger>
        </TabsList>

        <TabsContent value="kits">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kits.map((item) => (
              <Card key={item.id} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Shirt className="h-5 w-5" />
                      {item.name}
                    </CardTitle>
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
                        onClick={() => handleDelete(item.id, 'kits')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Quantità totale: {item.quantity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="equipment">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {equipment.map((item) => (
              <Card key={item.id} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      {item.category === 'palloni' ? (
                        <Volleyball className="h-5 w-5" />
                      ) : (
                        <Flag className="h-5 w-5" />
                      )}
                      {item.name}
                    </CardTitle>
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
                        onClick={() => handleDelete(item.id, 'equipment')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Quantità: {item.quantity}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.details}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
              <Input id="category" className="col-span-3" />
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
              <Label className="text-right">
                Immagine
              </Label>
              <div className="col-span-3 flex gap-2">
                <Button variant="outline" className="w-full">
                  <Image className="mr-2 h-4 w-4" />
                  Galleria
                </Button>
                <Button variant="outline" className="w-full">
                  <Camera className="mr-2 h-4 w-4" />
                  Fotocamera
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Warehouse;
