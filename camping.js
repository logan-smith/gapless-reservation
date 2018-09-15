/*
  Campinator Deluxe Reservation Software v1.0.0 (No one day gaps guaranteed)
  Author: Logan Smith

  TO RUN:
    * Ensure the 'test-case.json' file exists in the same directory as this file
    * Run 'node camp.js'
    * Output will be printed to the console
*/

// Parse the json file
var fs = require("fs");
try {
  var contents = fs.readFileSync("test-case.json");
  var jsonContent = JSON.parse(contents);
  main(jsonContent);
}
catch (err) {
  if (error.code === 'ENOENT') {
    console.log('File not found!');
    return;
  }
  else {
    throw err;
  }
}

function main(jsonContent) {
  // Load JSON data into objects
  var search = jsonContent.search;
  var campsites = jsonContent.campsites;
  var reservations = jsonContent.reservations;

  const msPerDay = 60*60*24*1000;
  var reservationSubset = null;
  var validCampsites = []

  // Convert all given dates to JS Date objects
  search.startDate = new Date(search.startDate);
  search.endDate = new Date(search.endDate);

  reservations.map(reservation => {
    reservation.startDate = new Date(reservation.startDate);
    reservation.endDate = new Date(reservation.endDate);
    return reservation;
  })

  // Begin work
  for (var index in campsites) {
    var campsite = campsites[index];

    // Filter reservations to current campsite
    var reservationSubset = reservations.filter(function (res) {
      return res.campsiteId == campsite.id;
    })

    // If no reservations exist for a campsite, it can be chosen
    if (reservationSubset.length == 0) {
      validCampsites.push(campsite.name);
    }
    else {
      // Iterate through reservations to find slot for search dates
      for (var i = 0; i < reservationSubset.length; i++) {
        var res = reservationSubset[i];

        // Check if Search dates can fit in before first reservation
        if ((i == 0) && (search.endDate < res.startDate) && noGap(search.endDate, res.startDate)) {
          validCampsites.push(campsite.name);
          break;
        }
        // Check if Search fits after current reservation
        else if ((search.startDate > res.endDate) && noGap(search.startDate, res.endDate)) {
          var nextRes = reservationSubset[i+1];

          // No future reservation to consider
          if (!nextRes) {
            validCampsites.push(campsite.name);
            break;
          }
          // Consider Search placement before the next reservation
          else if ((search.endDate < nextRes.startDate) && noGap(search.endDate, nextRes.startDate)) {
            validCampsites.push(campsite.name);
            break;
          }
        }
      }
    }
  }

  // Print list of valid campsites
  validCampsites.forEach(function(campsite) {
    console.log(campsite);
  })
}

/*
  This function determines whether a 1 day gap exists beteen two dates.
  Returns false if a 1 day gap exists, returns true otherwise.

  params: startDate - Date
          endDate   - Date
  return: Boolean
*/
function noGap(startDate, endDate) {
  var daysBetween = Math.floor( Math.abs(endDate - startDate) / msPerDay );

  if (daysBetween == 2) {
    return false;
  }
  else {
    return true;
  }
}
