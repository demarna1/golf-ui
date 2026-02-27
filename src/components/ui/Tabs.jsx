export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex gap-0 -mb-px overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`whitespace-nowrap px-4 py-3 text-sm font-medium font-body border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? 'border-masters-green text-masters-green'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
