import React, { useState, useEffect } from 'react';
import { PackingListItem } from './types';
import { SAMPLE_CSV, parseCSV } from './constants';
import { DistributionCharts } from './components/DistributionCharts';
import { SupplyChainGraph } from './components/SupplyChainGraph';
import { AgentExecutor } from './components/AgentExecutor';

function App() {
  const [csvInput, setCsvInput] = useState<string>(SAMPLE_CSV);
  const [packingData, setPackingData] = useState<PackingListItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'agents'>('dashboard');

  useEffect(() => {
    // Initial load
    handleParse();
  }, []);

  const handleParse = () => {
    try {
      const data = parseCSV(csvInput);
      setPackingData(data);
    } catch (e) {
      alert("Failed to parse CSV. Please check the format.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setCsvInput(text);
        // Automatically parse after upload
        try {
          const data = parseCSV(text);
          setPackingData(data);
        } catch(e) { console.error(e) }
      };
      reader.readAsText(file);
    }
  };

  // Stats for the top cards
  const totalRecords = packingData.length;
  const uniqueCustomers = new Set(packingData.map(d => d.customer)).size;
  const uniqueDevices = new Set(packingData.map(d => d.DeviceName)).size;
  const totalUnits = packingData.reduce((acc, curr) => acc + (parseInt(curr.Numbers) || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🧬</span>
              <div>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  GUDID Chronicles
                </h1>
                <p className="text-xs text-gray-500">Medical Supply Chain AI</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Data Dashboard
              </button>
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'agents' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Agent Headquarters
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Data Input Section - Always visible but collapsible in real app, kept open for demo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">1. Data Ingestion (Packing List)</h2>
            <div className="flex items-center space-x-2">
               <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-sm transition-colors text-gray-700">
                  <span>Upload CSV</span>
                  <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
               </label>
               <button 
                onClick={handleParse}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm transition-colors shadow-sm"
              >
                Analyze Data
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-32 p-3 text-xs font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y custom-scrollbar"
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            placeholder="Paste your CSV data here..."
          />
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Records</p>
                <p className="text-2xl font-bold text-blue-600">{totalRecords}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Active Customers</p>
                <p className="text-2xl font-bold text-emerald-600">{uniqueCustomers}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Unique Devices</p>
                <p className="text-2xl font-bold text-indigo-600">{uniqueDevices}</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500">Total Units Shipped</p>
                <p className="text-2xl font-bold text-orange-600">{totalUnits}</p>
              </div>
            </div>

            {/* Tables Section (3 Tables as requested) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Table 1: Recent Transactions */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                 <div className="px-6 py-4 border-b border-gray-100">
                   <h3 className="font-semibold text-gray-800">Recent Transactions</h3>
                 </div>
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-600 font-medium">
                       <tr>
                         <th className="px-6 py-3">Date</th>
                         <th className="px-6 py-3">Customer</th>
                         <th className="px-6 py-3">Device Name</th>
                         <th className="px-6 py-3">Lot #</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {packingData.slice(0, 5).map((row, idx) => (
                         <tr key={idx} className="hover:bg-gray-50">
                           <td className="px-6 py-3">{row.deliverdate}</td>
                           <td className="px-6 py-3 font-medium text-gray-900">{row.customer}</td>
                           <td className="px-6 py-3 truncate max-w-[200px]">{row.DeviceName}</td>
                           <td className="px-6 py-3 font-mono text-xs">{row.LotNumber}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>

               {/* Table 2: Category Breakdown */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-100">
                   <h3 className="font-semibold text-gray-800">Category Stats</h3>
                 </div>
                 <div className="p-4">
                    <ul className="space-y-3">
                      {Array.from(new Set(packingData.map(d => d.DeviceCategory))).slice(0,5).map((cat, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 truncate w-2/3">{cat}</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            {packingData.filter(d => d.DeviceCategory === cat).length} items
                          </span>
                        </li>
                      ))}
                    </ul>
                 </div>
               </div>
            </div>
            
            {/* Third Table: License IDs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-gray-100">
                   <h3 className="font-semibold text-gray-800">Regulatory Licenses (Top Active)</h3>
                 </div>
                 <div className="overflow-x-auto max-h-60 custom-scrollbar">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-600 sticky top-0">
                       <tr>
                         <th className="px-6 py-3">License ID</th>
                         <th className="px-6 py-3">Usage Count</th>
                         <th className="px-6 py-3">Example Device</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {Object.entries(packingData.reduce((acc, i) => {
                          acc[i.licenseID] = (acc[i.licenseID] || 0) + 1;
                          return acc;
                       }, {} as Record<string, number>))
                       .sort((a,b) => (b[1] as number) - (a[1] as number))
                       .slice(0, 5)
                       .map(([id, count], idx) => (
                         <tr key={idx}>
                           <td className="px-6 py-3 font-mono">{id}</td>
                           <td className="px-6 py-3">{count}</td>
                           <td className="px-6 py-3 text-gray-500 truncate max-w-[150px]">
                              {packingData.find(d => d.licenseID === id)?.DeviceName}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
            </div>

            {/* Visualizations */}
            <h2 className="text-xl font-bold text-gray-800 mt-8">Analytical Visualizations</h2>
            <DistributionCharts data={packingData} />
            <SupplyChainGraph data={packingData} />
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="animate-fade-in">
             <AgentExecutor data={packingData} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;