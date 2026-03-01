import { createTrip, setActiveTripId } from './tripService';

const TRIP_DATA = {
  name: 'Myrtle Beach Classic',
  location: 'Myrtle Beach, SC',
  year: 2026,
  startDate: '2026-03-25',
  endDate: '2026-03-29',
  golfers: [
    { id: 'ryan-jones', name: 'Ryan Jones', handicapIndex: 17 },
    { id: 'noah-demarco', name: 'Noah DeMarco', handicapIndex: 20 },
    { id: 'pat-mccaughey', name: 'Pat McCaughey', handicapIndex: 20 },
    { id: 'jonathan-hale', name: 'Jonathan Hale', handicapIndex: 30 },
    { id: 'cameron-fels', name: 'Cameron Fels', handicapIndex: 24 },
    { id: 'jack-hall', name: 'Jack Hall', handicapIndex: 10 },
    { id: 'john-benson', name: 'John Benson', handicapIndex: 17 },
    { id: 'matt-bay', name: 'Matt Bay', handicapIndex: 20 },
    { id: 'richie-morris', name: 'Richie Morris', handicapIndex: 15 },
    { id: 'kevin-geneva', name: 'Kevin Geneva', handicapIndex: 20 },
    { id: 'danny-boileau', name: 'Danny Boileau', handicapIndex: 25 },
    { id: 'taylor-standiford', name: 'Taylor Standiford', handicapIndex: 20 },
    { id: 'ryan-bobbit', name: 'Ryan Bobbit', handicapIndex: 12 },
    { id: 'van-ly', name: 'Van Ly', handicapIndex: 16 },
    { id: 'eugene-flotteron', name: 'Eugene Flotteron', handicapIndex: 16 },
    { id: 'jason-de-leon', name: 'Jason de Leon', handicapIndex: 16 },
  ],
  rounds: [
    {
      id: 'dunes-club',
      name: 'Dunes Golf & Beach Club',
      shortName: 'Dunes Club',
      date: '2026-03-25',
      order: 0,
      countsToTotal: false,
      par: 72,
      courseRating: 70.7,
      slopeRating: 138,
      address: '9000 N Ocean Blvd, Myrtle Beach, SC 29572',
      foursomes: [
        { players: ['noah-demarco', 'ryan-jones', 'jack-hall', 'john-benson'], teeTime: '9:00 AM' },
      ],
    },
    {
      id: 'kings-north',
      name: "King's North at Myrtle Beach National",
      shortName: "King's North",
      date: '2026-03-26',
      order: 1,
      countsToTotal: true,
      par: 72,
      courseRating: 69.1,
      slopeRating: 128,
      address: '4900 National Dr, Myrtle Beach, SC 29579',
      foursomes: [
        { players: ['ryan-jones', 'noah-demarco', 'pat-mccaughey', 'jonathan-hale'], teeTime: '9:11 AM' },
        { players: ['cameron-fels', 'jack-hall', 'john-benson', 'matt-bay'], teeTime: '9:19 AM' },
        { players: ['richie-morris', 'kevin-geneva', 'danny-boileau', 'taylor-standiford'], teeTime: '9:27 AM' },
        { players: ['ryan-bobbit', 'van-ly', 'eugene-flotteron', 'jason-de-leon'], teeTime: '9:35 AM' },
      ],
    },
    {
      id: 'river-club',
      name: 'River Club',
      shortName: 'River Club',
      date: '2026-03-27',
      order: 2,
      countsToTotal: true,
      par: 72,
      courseRating: 70.2,
      slopeRating: 127,
      address: '6000 River Club Dr, Pawleys Island, SC 29585',
      foursomes: [
        { players: ['ryan-jones', 'cameron-fels', 'richie-morris', 'ryan-bobbit'], teeTime: '8:41 AM' },
        { players: ['noah-demarco', 'jack-hall', 'kevin-geneva', 'van-ly'], teeTime: '8:49 AM' },
        { players: ['pat-mccaughey', 'john-benson', 'danny-boileau', 'eugene-flotteron'], teeTime: '8:57 AM' },
        { players: ['jonathan-hale', 'matt-bay', 'taylor-standiford', 'jason-de-leon'], teeTime: '9:05 AM' },
      ],
    },
    {
      id: 'wild-wing-avocet',
      name: 'Wild Wing Avocet',
      shortName: 'Wild Wing',
      date: '2026-03-28',
      order: 3,
      countsToTotal: true,
      par: 72,
      courseRating: 70.1,
      slopeRating: 126,
      address: '1000 Wild Wing Blvd, Conway, SC 29526',
      foursomes: [
        { players: ['ryan-jones', 'jack-hall', 'danny-boileau', 'jason-de-leon'], teeTime: '8:15 AM' },
        { players: ['noah-demarco', 'cameron-fels', 'taylor-standiford', 'ryan-bobbit'], teeTime: '8:23 AM' },
        { players: ['pat-mccaughey', 'matt-bay', 'richie-morris', 'van-ly'], teeTime: '8:31 AM' },
        { players: ['jonathan-hale', 'john-benson', 'kevin-geneva', 'eugene-flotteron'], teeTime: '8:39 AM' },
      ],
    },
    {
      id: 'grande-dunes',
      name: 'Grande Dunes Resort Club',
      shortName: 'Grande Dunes',
      date: '2026-03-29',
      order: 4,
      countsToTotal: true,
      par: 72,
      courseRating: 70.5,
      slopeRating: 130,
      address: '8700 Golf Village Ln, Myrtle Beach, SC 29572',
      foursomes: [
        { players: ['ryan-jones', 'john-benson', 'taylor-standiford', 'van-ly'], teeTime: '8:30 AM' },
        { players: ['noah-demarco', 'matt-bay', 'danny-boileau', 'eugene-flotteron'], teeTime: '8:38 AM' },
        { players: ['pat-mccaughey', 'cameron-fels', 'kevin-geneva', 'jason-de-leon'], teeTime: '8:46 AM' },
        { players: ['jonathan-hale', 'jack-hall', 'richie-morris', 'ryan-bobbit'], teeTime: '8:54 AM' },
      ],
    },
  ],
};

export async function seedTrip() {
  const tripId = '2026-myrtle-beach';
  await createTrip(tripId, TRIP_DATA);
  await setActiveTripId(tripId);
  console.log('Trip seeded successfully:', tripId);
}

if (import.meta.env.DEV) {
  window.seedTrip = seedTrip;
}
