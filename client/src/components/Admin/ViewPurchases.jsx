import { useState, useEffect } from 'react';
import { CircleCheck as CheckCircle, Circle as XCircle, RefreshCw, Package } from 'lucide-react';


function ViewPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPurchases(data || []);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updatePurchaseStatus = async (purchaseId, newStatus) => {
    try {
      const { error } = await supabase
        .from('purchases')
        .update({ status: newStatus })
        .eq('id', purchaseId);

      if (error) throw error;

      setPurchases(purchases.map(purchase =>
        purchase.id === purchaseId ? { ...purchase, status: newStatus } : purchase
      ));
    } catch (error) {
      console.error('Error updating purchase status:', error);
      alert('Failed to update purchase status. Please try again.');
    }
  };

  const filteredPurchases = filterStatus === 'all'
    ? purchases
    : purchases.filter(p => p.status === filterStatus);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="animate-spin text-blue-600" size={32} />
        <span className="ml-3 text-gray-600">Loading purchases...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">View Purchases</h2>
        <button
          onClick={fetchPurchases}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="mb-6 flex gap-3">
        {['all', 'pending', 'approved', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filterStatus === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 bg-white bg-opacity-30 px-2 py-0.5 rounded-full text-sm">
                {purchases.filter(p => p.status === status).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">No purchases found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Purchase ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Buyer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {purchase.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    {purchase.product_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">{purchase.buyer_name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{purchase.buyer_email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{purchase.buyer_phone || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="max-w-xs">
                      <div>{purchase.buyer_address}</div>
                      <div className="text-xs text-gray-500">
                        {purchase.buyer_city}, {purchase.buyer_state} - {purchase.buyer_pincode}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ₹{purchase.purchase_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getStatusBadge(purchase.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(purchase.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {purchase.status === 'pending' && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => updatePurchaseStatus(purchase.id, 'approved')}
                          className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => updatePurchaseStatus(purchase.id, 'rejected')}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ViewPurchases;
