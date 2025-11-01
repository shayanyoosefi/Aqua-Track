import React, { useState, useEffect } from "react";
import { Pool } from "@/entities/Pool";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import PoolsGrid from "../components/pools/PoolsGrid";
import CreatePoolModal from "../components/pools/CreatePoolModal";

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadPools();
  }, []);

  const loadPools = async () => {
    const data = await Pool.list('-updated_date');
    setPools(data);
    setLoading(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Pools
          </h1>
          <p className="text-gray-600 mt-1">Manage all registered pools</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Pool
        </Button>
      </div>

      <PoolsGrid pools={pools} loading={loading} onUpdate={loadPools} />

      {showCreateModal && (
        <CreatePoolModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={loadPools}
        />
      )}
    </div>
  );
}