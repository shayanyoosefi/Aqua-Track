import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const users = await User.list();
    const techs = users.filter(u => u.role === 'technician' || u.email?.includes('tech'));
    setTechnicians(techs);
    setLoading(false);
  };

  const setStatus = async (id, status) => {
    await User.update(id, { status });
    setTechnicians(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const zones = Array.from(new Set(technicians.map(t => t.technician_zone || 'All')));

  const filtered = technicians.filter(t => {
    const matchesQuery = [t.full_name, t.email, t.technician_zone].join(' ').toLowerCase().includes(query.toLowerCase());
    const matchesZone = zone === 'all' || (t.technician_zone || 'All') === zone;
    return matchesQuery && matchesZone;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    );
  }

  const total = technicians.length;
  const available = technicians.filter(t => t.status === 'available').length;
  const busy = technicians.filter(t => t.status === 'busy').length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-2">
          Technicians
        </h1>
        <p className="text-gray-600">Manage technician roster, availability, and zones</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50"><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Total</p><p className="text-3xl font-bold">{total}</p></CardContent></Card>
        <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-green-50"><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Available</p><p className="text-3xl font-bold text-emerald-700">{available}</p></CardContent></Card>
        <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-yellow-50"><CardContent className="p-6"><p className="text-sm text-gray-600 mb-1">Busy</p><p className="text-3xl font-bold text-amber-700">{busy}</p></CardContent></Card>
      </div>

      <Card className="mb-6 border-none shadow-lg"><CardContent className="p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Input placeholder="Search name, email, zone..." value={query} onChange={(e)=>setQuery(e.target.value)} className="md:w-1/2" />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Zone</span>
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {zones.map(z => (<SelectItem key={z} value={z}>{z}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
      </CardContent></Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <Card key={t.id} className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-base">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                  {t.full_name?.charAt(0) || 'T'}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold">{t.full_name}</p>
                  <p className="truncate text-xs text-gray-500">{t.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Zone</span>
                <span className="font-medium">{t.technician_zone || 'All'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <div className="flex items-center gap-2">
                  <button onClick={()=>setStatus(t.id,'available')} className={`rounded-full px-3 py-1 text-xs ${t.status==='available'?'bg-emerald-50 text-emerald-700':'bg-gray-100 text-gray-600'}`}>available</button>
                  <button onClick={()=>setStatus(t.id,'busy')} className={`rounded-full px-3 py-1 text-xs ${t.status==='busy'?'bg-amber-50 text-amber-700':'bg-gray-100 text-gray-600'}`}>busy</button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}