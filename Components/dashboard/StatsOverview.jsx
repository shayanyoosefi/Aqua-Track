import React from 'react';
import { Waves, ClipboardList, Users, AlertTriangle, Activity } from "lucide-react";

const accentStyles = {
  cyan: {
    icon: "bg-cyan-100 text-cyan-600",
    chip: "border-cyan-100 text-cyan-600",
    glow: "from-cyan-300/40 via-blue-300/20 to-transparent"
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-600",
    chip: "border-emerald-100 text-emerald-600",
    glow: "from-emerald-300/35 via-green-300/20 to-transparent"
  },
  amber: {
    icon: "bg-amber-100 text-amber-600",
    chip: "border-amber-100 text-amber-600",
    glow: "from-amber-300/40 via-orange-300/25 to-transparent"
  },
  violet: {
    icon: "bg-violet-100 text-violet-600",
    chip: "border-violet-100 text-violet-600",
    glow: "from-violet-300/35 via-fuchsia-300/25 to-transparent"
  },
  rose: {
    icon: "bg-rose-100 text-rose-600",
    chip: "border-rose-100 text-rose-600",
    glow: "from-rose-300/35 via-red-300/25 to-transparent"
  }
};

export default function StatsOverview({ stats }) {
  const statCards = [
    {
      title: "Total Pools",
      value: stats.totalPools,
      icon: Waves,
      accent: "cyan",
      hint: "Registered in your organisation"
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      icon: Activity,
      accent: "emerald",
      hint: "Currently scheduled or in progress"
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: ClipboardList,
      accent: "amber",
      hint: "Awaiting review or assignment"
    },
    {
      title: "Available Technicians",
      value: stats.availableTechs,
      icon: Users,
      accent: "violet",
      hint: "Ready to be assigned"
    },
    {
      title: "Pools Needing Attention",
      value: stats.poolsNeedingAttention,
      icon: AlertTriangle,
      accent: "rose",
      hint: "Marked as critical or needs attention"
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {statCards.map((stat) => {
        const styles = accentStyles[stat.accent];
        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white/90 p-5 shadow-sm backdrop-blur transition-transform hover:-translate-y-1 hover:shadow-md"
          >
            <div className={`absolute -top-14 right-0 h-28 w-28 rounded-full bg-gradient-to-br ${styles.glow} blur-2xl transition-opacity group-hover:opacity-100`} />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between">
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${styles.icon} text-lg font-semibold`}>
                  <stat.icon className="h-5 w-5" />
                </span>
                <span className={`rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${styles.chip}`}>
                  {stat.title.split(' ')[0]}
                </span>
              </div>
              <div>
                <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="mt-1 text-sm font-medium text-slate-500">{stat.title}</p>
              </div>
              <p className="text-xs text-slate-400">{stat.hint}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}