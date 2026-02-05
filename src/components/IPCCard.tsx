'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IPCData, IPCStatus } from '@/types';

interface IPCCardProps {
  ipcData: IPCData | null;
}

const statusColorMap: Record<IPCStatus, { bg: string; text: string; label: string }> = {
  'released': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Released' },
  'in process': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Process' },
  'submitted': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Submitted' },
  'not submitted': { bg: 'bg-red-100', text: 'text-red-700', label: 'Not Submitted' },
};

export default function IPCCard({ ipcData }: IPCCardProps) {
  if (!ipcData || ipcData.records.length === 0) {
    return null;
  }

  const records = ipcData.records;
  
  // Count statuses
  const statusCounts = {
    released: records.filter(r => r.status === 'released').length,
    'in process': records.filter(r => r.status === 'in process').length,
    submitted: records.filter(r => r.status === 'submitted').length,
    'not submitted': records.filter(r => r.status === 'not submitted').length,
  };

  // Group records by package
  const recordsByPackage = records.reduce((acc, record) => {
    const packageName = record.packageName || 'Package';
    if (!acc[packageName]) {
      acc[packageName] = [];
    }
    acc[packageName].push(record);
    return acc;
  }, {} as Record<string, typeof records>);

  // Sort package names for consistent display
  const sortedPackages = Object.keys(recordsByPackage).sort();

  console.log('[IPCCard] Received ipcData:', ipcData);
  console.log('[IPCCard] Records count:', records.length);

  return (
    <Card className="mb-6 p-6">
      <div className="space-y-6">
        {/* Header with summary counts */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interim Payment Certificates (IPC)</h3>
            <p className="text-sm text-gray-500 mt-1">
              {statusCounts.released} Released • {statusCounts['in process']} In Process • {statusCounts.submitted} Submitted • {statusCounts['not submitted']} Not Submitted
            </p>
          </div>
        </div>

        {/* IPC Cards grouped by package */}
        {sortedPackages.map(packageName => (
          <div key={packageName}>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">{packageName}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {recordsByPackage[packageName].map((record, index) => {
                const statusColorInfo = record.status ? statusColorMap[record.status] : null;

                return (
                  <div
                    key={`${record.ipcNumber}-${record.packageId}-${index}`}
                    className={`p-4 rounded-lg border-2 text-center ${
                      statusColorInfo
                        ? `${statusColorInfo.bg} border-gray-200`
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 mb-2">{record.ipcNumber}</p>
                    {statusColorInfo && record.status ? (
                      <Badge className={`${statusColorInfo.bg} ${statusColorInfo.text} border-0 capitalize w-full text-center flex items-center justify-center`}>
                        {statusColorInfo.label}
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-200 text-gray-700 border-0 w-full text-center flex items-center justify-center">
                        Not Set
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
