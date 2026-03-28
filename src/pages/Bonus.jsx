import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import BonusRules from '../components/bonus/BonusRules';

const TABS = [
  { id: 'rules', label: 'Rules' },
];

export default function Bonus() {
  const [activeTab, setActiveTab] = useState('rules');

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">
        Bonus
      </h2>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'rules' && <BonusRules />}
      </div>
    </div>
  );
}
