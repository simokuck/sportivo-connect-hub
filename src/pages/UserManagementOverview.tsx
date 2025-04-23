
import React from "react";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Layers, History, FileText } from "lucide-react";
import { Link } from "react-router-dom";

const items = [
  {
    icon: <Users className="h-8 w-8 text-sportivo-blue" />,
    label: "Utenze",
    path: "/users",
    description: "Gestisci tutti gli utenti registrati",
  },
  {
    icon: <UserPlus className="h-8 w-8 text-green-600" />,
    label: "Registrazioni",
    path: "/player-registrations",
    description: "Gestisci le nuove registrazioni dei giocatori",
  },
  {
    icon: <Layers className="h-8 w-8 text-purple-700" />,
    label: "Gruppi Squadra",
    path: "/team-groups",
    description: "Amministra gruppi di squadra e categorie",
  },
  {
    icon: <History className="h-8 w-8 text-yellow-600" />,
    label: "Storico Giocatori",
    path: "/player-history",
    description: "Storico e movimenti dei giocatori",
  },
  {
    icon: <FileText className="h-8 w-8 text-pink-600" />,
    label: "Consensi",
    path: "/player-consents",
    description: "Gestione e verifica consensi firmati",
  },
];

const UserManagementOverview = () => (
  <div className="container py-6 mx-auto">
    <h1 className="text-3xl font-bold mb-4">Gestione Utenze</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Link key={item.path} to={item.path}>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
              {item.icon}
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  </div>
);
export default UserManagementOverview;
