
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { mockDocuments } from '@/data/mockData';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DocumentsPage = () => {
  const { user } = useAuth();

  const filteredDocuments = mockDocuments.filter(doc => {
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

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-sportivo-blue">Documenti</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <FileText className="h-8 w-8 text-sportivo-blue" />
              <CardTitle className="text-lg">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Caricato il: {new Date(doc.uploadDate).toLocaleDateString('it-IT')}
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <a href={doc.url} download>
                    <Download className="mr-2 h-4 w-4" />
                    Scarica
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DocumentsPage;
