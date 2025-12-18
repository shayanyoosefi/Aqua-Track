import React, { useState, useEffect } from "react";
import { Pool } from "@/entities/Pool";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PageHeader from "../Components/common/PageHeader";

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
      <PageHeader
        title="Pools"
        subtitle="Manage all registered pools"
        actions={(
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Pool
          </Button>
        )}
      />

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