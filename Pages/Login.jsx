import React, { useEffect, useState } from 'react';
import { User } from '@/entities/User';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const list = await User.list();
      setUsers(list);
    };
    load();
  }, []);

  const handleLogin = async (id) => {
    await User.loginAs(id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl border-none shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Select an account to continue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-2xl border border-cyan-100 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-semibold">
                    {u.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{u.full_name}</p>
                    <p className="text-xs text-slate-500">{u.email} • {u.role}</p>
                  </div>
                </div>
                <Button onClick={() => handleLogin(u.id)} className="bg-gradient-to-r from-cyan-500 to-blue-600">Login</Button>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">Need a custom account? Ask me to seed more users.</p>
        </CardContent>
      </Card>
    </div>
  );
}


