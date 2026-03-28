import { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import BetsList from '../components/bonus/BetsList';
import BonusRules from '../components/bonus/BonusRules';

const TABS = [
  { id: 'bets', label: 'Bets' },
  { id: 'rules', label: 'Rules' },
];

export default function Bonus() {
  const [activeTab, setActiveTab] = useState('bets');

  return (
    <div>
      <h2 className="font-heading text-xl font-semibold text-masters-green mb-4">
        Bonus
      </h2>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'bets' && <BetsList />}
        {activeTab === 'rules' && <BonusRules />}
      </div>
    </div>
  );
}
