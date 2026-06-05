interface IncidentCardProps {
  incident: {
    id: string;
    location: string;
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
    time: string;
    author: string;
  };
}

const severityConfig = {
  low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Low' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', label: 'Medium' },
  high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'High' },
};

export default function IncidentCard({ incident }: IncidentCardProps) {
  const config = severityConfig[incident.severity];

  return (
    <div className={`${config.bg} border-l-4 ${config.border} p-4 rounded-lg`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-800">{incident.location}</h4>
            <span className={`px-2 py-1 text-xs rounded font-medium ${config.text}`}>
              {config.label}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{incident.type}</p>
          <p className="text-gray-700 mb-2">{incident.description}</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>By {incident.author}</span>
            <span>{incident.time}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
