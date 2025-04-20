
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemVariant, ItemAssignment, BaseItem } from '@/types/warehouse';
import { AlertTriangle, Package, UserCheck } from 'lucide-react';

interface WarehouseDashboardProps {
  lowStockItems: (BaseItem & { variants: ItemVariant[] })[];
  recentAssignments: (ItemAssignment & { variant?: ItemVariant, baseItem?: BaseItem })[];
}

export function WarehouseDashboard({ lowStockItems, recentAssignments }: WarehouseDashboardProps) {
  const navigate = useNavigate();
  
  const handleNavigate = (tab: string, filter?: string) => {
    if (filter) {
      navigate(`/warehouse?view=${tab}&filter=${filter}`);
    } else {
      navigate(`/warehouse?view=${tab}`);
    }
    
    // If we're already on the warehouse page, we need to update the active tab
    // This could be implemented in the warehouse context if needed
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card 
        className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer" 
        onClick={() => handleNavigate('catalog', 'low-stock')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Articoli sotto scorta
          </CardTitle>
          <CardDescription>Articoli che richiedono approvvigionamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun articolo sotto scorta</p>
            ) : (
              lowStockItems.slice(0, 5).map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.variants.filter(v => v.status !== 'available').length} varianti sotto scorta
                    </p>
                  </div>
                  <Badge variant="outline">
                    {item.variants.reduce((sum, v) => sum + v.quantity, 0)} pezzi totali
                  </Badge>
                </div>
              ))
            )}
            {lowStockItems.length > 5 && (
              <p className="text-xs text-right text-muted-foreground">
                + {lowStockItems.length - 5} altri articoli
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card 
        className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
        onClick={() => handleNavigate('assignments')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-500" />
            Ultime assegnazioni
          </CardTitle>
          <CardDescription>Materiale recentemente assegnato</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nessuna assegnazione recente</p>
            ) : (
              recentAssignments.slice(0, 5).map(assignment => (
                <div key={assignment.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{assignment.playerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.baseItem?.name} - {assignment.variant?.color}, {assignment.variant?.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={assignment.status === 'assigned' ? 'default' : 'secondary'}>
                      {assignment.status === 'assigned' ? 'Assegnato' : 
                       assignment.status === 'returned' ? 'Restituito' : 'In attesa'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(assignment.assignDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card 
        className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer"
        onClick={() => handleNavigate('movements')}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-green-500" />
            Situazione magazzino
          </CardTitle>
          <CardDescription>Panoramica generale dell'inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span>Articoli totali:</span>
              <Badge variant="outline" className="text-base font-medium">
                {lowStockItems.length}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Varianti totali:</span>
              <Badge variant="outline" className="text-base font-medium">
                {lowStockItems.reduce((sum, item) => sum + item.variants.length, 0)}
              </Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <span>Articoli assegnati:</span>
              <Badge variant="outline" className="text-base font-medium">
                {recentAssignments.filter(a => a.status === 'assigned').length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
