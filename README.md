# gapless-reservation

## What it does
Returns a list of campsites that can accomadate the searched reservation. Dissallows reservation gaps of one day.

## Running app
Ensure 'test-case.json' exists in the same directory

Run with 'node camping.js'

## Input JSON
The input JSON takes the form of:
{
  "search": {
    "startDate": "2018-06-04",
    "endDate": "2018-06-06"
  },
  "campsites": [
    {
      "id": 1,
      "name": "Cozy Cabin"
    }
  ],
  "reservations": [
    {"campsiteId": 1, "startDate": "2018-06-01", "endDate": "2018-06-03"},
  ]
}
