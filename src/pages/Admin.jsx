import { useState } from 'react';
import { useTrip } from '../hooks/useTrip';
import { useScores } from '../hooks/useScores';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../firebase/authService';
import Tabs from '../components/ui/Tabs';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import ScoreGrid from '../components/admin/ScoreGrid';
import RoundSettings from '../components/admin/RoundSettings';
import FoursomeEditor from '../components/admin/FoursomeEditor';
import GolferManager from '../components/admin/GolferManager';
import TripSettingsForm from '../components/admin/TripSettingsForm';
import NewTripForm from '../components/admin/NewTripForm';

const TABS = [
  { id: 'scores', label: 'Scores' },
  { id: 'rounds', label: 'Rounds' },
  { id: 'foursomes', label: 'Foursomes' },
  { id: 'golfers', label: 'Golfers' },
  { id: 'settings', label: 'Settings' },
  { id: 'new-trip', label: 'New Trip' },
];

export default function Admin() {
  const user = useAuth();
  const { trip, loading: tripLoading } = useTrip();
  const { scores, loading: scoresLoading } = useScores(trip?.id);
  const [activeTab, setActiveTab] = useState('scores');

  if (tripLoading || scoresLoading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading text-xl font-semibold text-masters-green">Admin Panel</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign Out</Button>
        </div>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'scores' && trip && (
          <ScoreGrid trip={trip} scores={scores} />
        )}
        {activeTab === 'rounds' && trip && (
          <RoundSettings trip={trip} />
        )}
        {activeTab === 'foursomes' && trip && (
          <FoursomeEditor trip={trip} />
        )}
        {activeTab === 'golfers' && trip && (
          <GolferManager trip={trip} />
        )}
        {activeTab === 'settings' && trip && (
          <TripSettingsForm trip={trip} />
        )}
        {activeTab === 'new-trip' && (
          <NewTripForm />
        )}
        {!trip && activeTab !== 'new-trip' && (
          <p className="text-gray-500 text-center py-8">
            No active trip. Create one in the "New Trip" tab.
          </p>
        )}
      </div>
    </div>
  );
}
