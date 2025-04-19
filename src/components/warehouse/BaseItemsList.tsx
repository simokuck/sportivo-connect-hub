import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BaseItem } from "@/types/warehouse";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BaseItemsListProps {
  items: (BaseItem & { variants: any[] })[];
  onSelectItem: (item: BaseItem) => void;
  onEditItem: (item: BaseItem) => void; // Make sure this accepts an item parameter
  onDeleteItem: (item: BaseItem) => void;
  onAddItem: () => void;
}

export function BaseItemsList({ items, onSelectItem, onEditItem, onDeleteItem, onAddItem }: BaseItemsListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  
  // Get unique categories from items
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    items.forEach(item => {
      if (item.category) {
        uniqueCategories.add(item.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [items]);
  
  // Filter items based on search term and category
  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  }, [items, searchTerm, categoryFilter]);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Catalogo Articoli</h2>
        <Button onClick={onAddItem}>
          <Plus className="mr-2 h-4 w-4" />
          Nuovo Articolo
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Cerca articoli..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutte le categorie</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nessun articolo trovato</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' ? 
                'Nessun articolo corrisponde ai filtri selezionati.' : 
                'Aggiungi il tuo primo articolo al catalogo.'}
            </p>
            <Button onClick={onAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Aggiungi Articolo
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Varianti</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onSelectItem(item)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="h-10 w-10 rounded object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div>{item.name}</div>
                        {item.brand && (
                          <div className="text-xs text-muted-foreground">{item.brand}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>{item.sku || '-'}</TableCell>
                  <TableCell>
                    <Badge>{item.variants.length}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditItem(item);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Modifica</span>
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Elimina</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
