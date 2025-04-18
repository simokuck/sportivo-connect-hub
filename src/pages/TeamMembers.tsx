
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleCheck, CircleX, FileText, CreditCard, XCircle, AlertCircle, Filter, Plus, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

type StatusType = 'complete' | 'incomplete' | 'pending';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  teamId: string;
  position?: string;
  status: {
    documents: StatusType;
    forms: StatusType;
    payments: StatusType;
  };
}

// Mock data for team members
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Marco Rossi',
    email: 'marco.rossi@example.com',
    role: 'player',
    avatar: '',
    teamId: 'team-1',
    position: 'Attaccante',
    status: {
      documents: 'complete',
      forms: 'incomplete',
      payments: 'complete',
    },
  },
  {
    id: '2',
    name: 'Luca Bianchi',
    email: 'luca.bianchi@example.com',
    role: 'player',
    avatar: '',
    teamId: 'team-1',
    position: 'Centrocampista',
    status: {
      documents: 'incomplete',
      forms: 'complete',
      payments: 'complete',
    },
  },
  {
    id: '3',
    name: 'Giuseppe Verdi',
    email: 'giuseppe.verdi@example.com',
    role: 'player',
    avatar: '',
    teamId: 'team-1',
    position: 'Difensore',
    status: {
      documents: 'complete',
      forms: 'complete',
      payments: 'incomplete',
    },
  },
  {
    id: '4',
    name: 'Antonio Ferrari',
    email: 'antonio.ferrari@example.com',
    role: 'coach',
    avatar: '',
    teamId: 'team-1',
    status: {
      documents: 'complete',
      forms: 'complete',
      payments: 'complete',
    },
  },
  {
    id: '5',
    name: 'Carla Romano',
    email: 'carla.romano@example.com',
    role: 'medical',
    avatar: '',
    teamId: 'team-1',
    status: {
      documents: 'incomplete',
      forms: 'incomplete',
      payments: 'complete',
    },
  },
];

// Mock data for teams
const mockTeams = [
  { id: 'team-1', name: 'Prima Squadra' },
  { id: 'team-2', name: 'Juniores' },
  { id: 'team-3', name: 'Allievi' },
];

type StatusType = 'complete' | 'incomplete' | 'pending';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  teamId: string;
  position?: string;
  status: {
    documents: StatusType;
    forms: StatusType;
    payments: StatusType;
  };
}

const TeamMembersPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedTeam, setSelectedTeam] = useState<string>('team-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [memberDetailsOpen, setMemberDetailsOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // Filter members by team, search query, role, and status
  const filteredMembers = members.filter(member => {
    const matchesTeam = member.teamId === selectedTeam;
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter ? member.role === roleFilter : true;
    const matchesStatus = statusFilter ? (
      statusFilter === 'complete' ? 
        member.status.documents === 'complete' && 
        member.status.forms === 'complete' && 
        member.status.payments === 'complete'
      : statusFilter === 'incomplete' ? 
        member.status.documents === 'incomplete' || 
        member.status.forms === 'incomplete' || 
        member.status.payments === 'incomplete'
      : true
    ) : true;
    
    return matchesTeam && matchesSearch && matchesRole && matchesStatus;
  });

  if (!user || (user.role !== 'admin' && user.role !== 'coach')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Accesso non consentito</h1>
          <p className="mt-2 text-muted-foreground">
            Solo amministratori e allenatori possono accedere a questa pagina.
          </p>
        </div>
      </div>
    );
  }

  const handleSelectTeam = (teamId: string) => {
    setSelectedTeam(teamId);
  };

  const handleViewMemberDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setMemberDetailsOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'complete':
        return <CircleCheck className="h-5 w-5 text-green-500" />;
      case 'incomplete':
        return <CircleX className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case 'complete':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completo</Badge>;
      case 'incomplete':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Incompleto</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In attesa</Badge>;
      default:
        return null;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'player':
        return 'Giocatore';
      case 'coach':
        return 'Allenatore';
      case 'medical':
        return 'Staff Medico';
      case 'admin':
        return 'Amministratore';
      default:
        return role;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sportivo-blue">Membri del Team</h1>
        
        <div className="flex gap-2">
          <Select value={selectedTeam} onValueChange={handleSelectTeam}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleziona squadra" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Squadre</SelectLabel>
                {mockTeams.map(team => (
                  <SelectItem key={team.id} value={team.id}>{team.name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Aggiungi Membro
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome o email..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <Filter className="h-4 w-4" /> Filtra
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filtri</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs">Ruolo</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setRoleFilter(null)} className={!roleFilter ? "bg-accent" : ""}>
                Tutti i ruoli
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('player')} className={roleFilter === 'player' ? "bg-accent" : ""}>
                Giocatori
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('coach')} className={roleFilter === 'coach' ? "bg-accent" : ""}>
                Allenatori
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRoleFilter('medical')} className={roleFilter === 'medical' ? "bg-accent" : ""}>
                Staff Medico
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="font-normal text-xs">Status</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setStatusFilter(null)} className={!statusFilter ? "bg-accent" : ""}>
                Tutti gli stati
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('complete')} className={statusFilter === 'complete' ? "bg-accent" : ""}>
                Completi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter('incomplete')} className={statusFilter === 'incomplete' ? "bg-accent" : ""}>
                Incompleti
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <Card 
              key={member.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewMemberDetails(member)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-medium">{member.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center mt-1 gap-2">
                      <Badge variant="secondary">{getRoleLabel(member.role)}</Badge>
                      {member.position && (
                        <Badge variant="outline">{member.position}</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center p-2 bg-accent rounded-lg">
                    <div className="flex items-center justify-center h-8">
                      {getStatusIcon(member.status.documents)}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">Documenti</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-accent rounded-lg">
                    <div className="flex items-center justify-center h-8">
                      {getStatusIcon(member.status.forms)}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">Modulistica</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-accent rounded-lg">
                    <div className="flex items-center justify-center h-8">
                      {getStatusIcon(member.status.payments)}
                    </div>
                    <span className="text-xs text-center text-muted-foreground">Pagamenti</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center p-8 text-muted-foreground border rounded-md">
            Nessun membro corrisponde ai criteri di ricerca.
          </div>
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aggiungi Nuovo Membro</DialogTitle>
            <DialogDescription>
              Inserisci i dettagli del nuovo membro del team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium flex">
                  Nome Completo<span className="text-red-500 ml-1">*</span>
                </label>
                <Input id="name" />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium flex">
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <Input id="email" type="email" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium flex">
                  Ruolo<span className="text-red-500 ml-1">*</span>
                </label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona ruolo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Giocatore</SelectItem>
                    <SelectItem value="coach">Allenatore</SelectItem>
                    <SelectItem value="medical">Staff Medico</SelectItem>
                    <SelectItem value="admin">Amministratore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">Posizione</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona posizione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="attaccante">Attaccante</SelectItem>
                    <SelectItem value="centrocampista">Centrocampista</SelectItem>
                    <SelectItem value="difensore">Difensore</SelectItem>
                    <SelectItem value="portiere">Portiere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Aggiungi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={memberDetailsOpen} onOpenChange={setMemberDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Dettagli Membro</DialogTitle>
          </DialogHeader>
          
          {selectedMember && (
            <div className="py-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                  <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h2 className="text-xl font-medium">{selectedMember.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                  <div className="flex items-center mt-1 gap-2">
                    <Badge variant="secondary">{getRoleLabel(selectedMember.role)}</Badge>
                    {selectedMember.position && (
                      <Badge variant="outline">{selectedMember.position}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue="status">
                <TabsList className="w-full">
                  <TabsTrigger value="status" className="flex-1">Status</TabsTrigger>
                  <TabsTrigger value="details" className="flex-1">Dettagli</TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>Documenti</span>
                      </div>
                      {getStatusBadge(selectedMember.status.documents)}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        <span>Modulistica</span>
                      </div>
                      {getStatusBadge(selectedMember.status.forms)}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Pagamenti</span>
                      </div>
                      {getStatusBadge(selectedMember.status.payments)}
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-sm text-muted-foreground">
                        {selectedMember.status.documents === 'incomplete' || 
                        selectedMember.status.forms === 'incomplete' || 
                        selectedMember.status.payments === 'incomplete' 
                          ? 'Ci sono elementi incompleti che richiedono attenzione.'
                          : 'Tutti gli elementi sono completi.'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Team</h3>
                      <p>{mockTeams.find(team => team.id === selectedMember.teamId)?.name || 'N/A'}</p>
                    </div>
                    
                    {selectedMember.role === 'player' && (
                      <div>
                        <h3 className="text-sm font-medium">Posizione</h3>
                        <p>{selectedMember.position || 'N/A'}</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium">Ruolo</h3>
                      <p>{getRoleLabel(selectedMember.role)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium">Email</h3>
                      <p>{selectedMember.email}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamMembersPage;
