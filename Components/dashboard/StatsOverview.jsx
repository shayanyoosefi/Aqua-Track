import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Waves, ClipboardList, Users, AlertTriangle, Activity } from "lucide-react";

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Pools",
      value: stats.totalPools,
      icon: Waves,
      color: "from-cyan-500 to-blue-500",
      bgColor: "from-cyan-50 to-blue-50"
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      icon: Activity,
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: ClipboardList,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-50"
    },
    {
      title: "Available Technicians",
      value: stats.availableTechs,
      icon: Users,
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      title: "Pools Needing Attention",
      value: stats.poolsNeedingAttention,
      icon: AlertTriangle,
      color: "from-red-500 to-rose-500",
      bgColor: "from-red-50 to-rose-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statCards.map((stat, index) => (
        <Card 
          key={index}
          className={`border-none shadow-lg overflow-hidden bg-gradient-to-br ${stat.bgColor}`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}