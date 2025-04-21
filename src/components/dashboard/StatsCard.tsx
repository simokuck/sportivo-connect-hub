
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsProps {
  title: string;
  description: string;
  stats: {
    label: string;
    value: number | string;
  }[];
  icon: React.ReactNode;
  onClick?: () => void;
}

export const StatsCard = ({ title, description, stats, icon, onClick }: StatsProps) => {
  return (
    <Card className="hover-card-highlight cursor-pointer transition-all hover:shadow-md hover:border-primary/50" onClick={onClick}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-2 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
