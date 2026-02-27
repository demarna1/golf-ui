import { createTrip, setActiveTripId } from './tripService';

const TRIP_DATA = {
  name: '2026 Myrtle Beach Classic',
  tagline: 'The boys are back',
  location: 'Myrtle Beach, SC',
  year: 2026,
  startDate: '2026-03-25',
  endDate: '2026-03-29',
  golfers: [
    { id: 'ryan-jones', name: 'Ryan Jones', handicapIndex: 17.0 },
    { id: 'mike-smith', name: 'Mike Smith', handicapIndex: 12.5 },
    { id: 'dan-brown', name: 'Dan Brown', handicapIndex: 22.3 },
    { id: 'chris-davis', name: 'Chris Davis', handicapIndex: 8.1 },
    { id: 'tom-wilson', name: 'Tom Wilson', handicapIndex: 15.4 },
    { id: 'jeff-martin', name: 'Jeff Martin', handicapIndex: 19.7 },
    { id: 'steve-clark', name: 'Steve Clark', handicapIndex: 10.2 },
    { id: 'dave-taylor', name: 'Dave Taylor', handicapIndex: 25.0 },
    { id: 'pat-anderson', name: 'Pat Anderson', handicapIndex: 14.8 },
    { id: 'joe-thomas', name: 'Joe Thomas', handicapIndex: 20.1 },
    { id: 'mark-jackson', name: 'Mark Jackson', handicapIndex: 6.5 },
    { id: 'bill-white', name: 'Bill White', handicapIndex: 18.3 },
    { id: 'jim-harris', name: 'Jim Harris', handicapIndex: 11.9 },
    { id: 'bob-lewis', name: 'Bob Lewis', handicapIndex: 27.4 },
    { id: 'rick-walker', name: 'Rick Walker', handicapIndex: 9.6 },
    { id: 'greg-hall', name: 'Greg Hall', handicapIndex: 16.0 },
  ],
  rounds: [
    {
      id: 'pine-lakes',
      name: 'Pine Lakes Country Club',
      shortName: 'Pine Lakes',
      date: '2026-03-25',
      order: 1,
      countsToTotal: false,
      par: 72,
      courseRating: 71.2,
      slopeRating: 130,
      foursomes: [
        { players: ['ryan-jones', 'mike-smith', 'dan-brown', 'chris-davis'] },
      ],
    },
    {
      id: 'kings-north',
      name: "King's North at Myrtle Beach National",
      shortName: "King's North",
      date: '2026-03-26',
      order: 2,
      countsToTotal: true,
      par: 72,
      courseRating: 69.1,
      slopeRating: 128,
      foursomes: [
        { players: ['ryan-jones', 'mike-smith', 'dan-brown', 'chris-davis'] },
        { players: ['tom-wilson', 'jeff-martin', 'steve-clark', 'dave-taylor'] },
        { players: ['pat-anderson', 'joe-thomas', 'mark-jackson', 'bill-white'] },
        { players: ['jim-harris', 'bob-lewis', 'rick-walker', 'greg-hall'] },
      ],
    },
    {
      id: 'tidewater',
      name: 'Tidewater Golf Club',
      shortName: 'Tidewater',
      date: '2026-03-27',
      order: 3,
      countsToTotal: true,
      par: 72,
      courseRating: 71.8,
      slopeRating: 134,
      foursomes: [
        { players: ['ryan-jones', 'tom-wilson', 'pat-anderson', 'jim-harris'] },
        { players: ['mike-smith', 'jeff-martin', 'joe-thomas', 'bob-lewis'] },
        { players: ['dan-brown', 'steve-clark', 'mark-jackson', 'rick-walker'] },
        { players: ['chris-davis', 'dave-taylor', 'bill-white', 'greg-hall'] },
      ],
    },
    {
      id: 'caledonia',
      name: 'Caledonia Golf & Fish Club',
      shortName: 'Caledonia',
      date: '2026-03-28',
      order: 4,
      countsToTotal: true,
      par: 70,
      courseRating: 69.5,
      slopeRating: 131,
      foursomes: [
        { players: ['ryan-jones', 'jeff-martin', 'mark-jackson', 'bob-lewis'] },
        { players: ['mike-smith', 'tom-wilson', 'bill-white', 'rick-walker'] },
        { players: ['dan-brown', 'dave-taylor', 'joe-thomas', 'greg-hall'] },
        { players: ['chris-davis', 'steve-clark', 'pat-anderson', 'jim-harris'] },
      ],
    },
    {
      id: 'dunes-club',
      name: 'The Dunes Golf & Beach Club',
      shortName: 'Dunes Club',
      date: '2026-03-29',
      order: 5,
      countsToTotal: true,
      par: 72,
      courseRating: 73.2,
      slopeRating: 139,
      foursomes: [
        { players: ['ryan-jones', 'steve-clark', 'joe-thomas', 'greg-hall'] },
        { players: ['mike-smith', 'dave-taylor', 'mark-jackson', 'jim-harris'] },
        { players: ['dan-brown', 'jeff-martin', 'pat-anderson', 'rick-walker'] },
        { players: ['chris-davis', 'tom-wilson', 'bob-lewis', 'bill-white'] },
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
