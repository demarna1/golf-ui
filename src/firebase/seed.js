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
      address: '5603 Granddaddy Dr, Myrtle Beach, SC 29577',
      foursomes: [
        { players: ['ryan-jones', 'mike-smith', 'dan-brown', 'chris-davis'], teeTime: '9:00 AM' },
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
      address: '4900 National Dr, Myrtle Beach, SC 29579',
      foursomes: [
        { players: ['ryan-jones', 'mike-smith', 'dan-brown', 'chris-davis'], teeTime: '8:00 AM' },
        { players: ['tom-wilson', 'jeff-martin', 'steve-clark', 'dave-taylor'], teeTime: '8:10 AM' },
        { players: ['pat-anderson', 'joe-thomas', 'mark-jackson', 'bill-white'], teeTime: '8:20 AM' },
        { players: ['jim-harris', 'bob-lewis', 'rick-walker', 'greg-hall'], teeTime: '8:30 AM' },
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
      address: '4901 Little River Neck Rd, North Myrtle Beach, SC 29582',
      foursomes: [
        { players: ['ryan-jones', 'tom-wilson', 'pat-anderson', 'jim-harris'], teeTime: '8:30 AM' },
        { players: ['mike-smith', 'jeff-martin', 'joe-thomas', 'bob-lewis'], teeTime: '8:40 AM' },
        { players: ['dan-brown', 'steve-clark', 'mark-jackson', 'rick-walker'], teeTime: '8:50 AM' },
        { players: ['chris-davis', 'dave-taylor', 'bill-white', 'greg-hall'], teeTime: '9:00 AM' },
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
      address: '369 Caledonia Dr, Pawleys Island, SC 29585',
      foursomes: [
        { players: ['ryan-jones', 'jeff-martin', 'mark-jackson', 'bob-lewis'], teeTime: '9:00 AM' },
        { players: ['mike-smith', 'tom-wilson', 'bill-white', 'rick-walker'], teeTime: '9:10 AM' },
        { players: ['dan-brown', 'dave-taylor', 'joe-thomas', 'greg-hall'], teeTime: '9:20 AM' },
        { players: ['chris-davis', 'steve-clark', 'pat-anderson', 'jim-harris'], teeTime: '9:30 AM' },
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
      address: '9000 N Ocean Blvd, Myrtle Beach, SC 29572',
      foursomes: [
        { players: ['ryan-jones', 'steve-clark', 'joe-thomas', 'greg-hall'], teeTime: '8:00 AM' },
        { players: ['mike-smith', 'dave-taylor', 'mark-jackson', 'jim-harris'], teeTime: '8:10 AM' },
        { players: ['dan-brown', 'jeff-martin', 'pat-anderson', 'rick-walker'], teeTime: '8:20 AM' },
        { players: ['chris-davis', 'tom-wilson', 'bob-lewis', 'bill-white'], teeTime: '8:30 AM' },
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
