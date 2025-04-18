
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Shirt, Volleyball, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  details: string;
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
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Magazzino</h1>

      <Tabs defaultValue="kits" className="w-full">
        <TabsList>
          <TabsTrigger value="kits">Kit</TabsTrigger>
          <TabsTrigger value="equipment">Materiale Tecnico</TabsTrigger>
        </TabsList>

        <TabsContent value="kits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockKits.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="h-5 w-5" />
                    {item.name}
                  </CardTitle>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEquipment.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {item.category === 'palloni' ? (
                      <Volleyball className="h-5 w-5" />
                    ) : (
                      <Flag className="h-5 w-5" />
                    )}
                    {item.name}
                  </CardTitle>
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
    </div>
  );
};

export default Warehouse;
