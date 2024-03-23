const axios = require('axios');
const dns = require('dns');

if(dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const letterTrains = {
  '2': 'a',
  '22': 'b',
  '222': 'c',
  '3': 'd',
  '33': 'e',
  '333': 'f',
  '4': 'g',
  '44': 'h',
  '5': 'j',
  '555': 'l',
  '6': 'm',
  '66': 'n',
  '7': 'q',
  '77': 'r',
  '777': 's',
  '888': 'v',
  '9': 'w'
}

const shuttleTrains = {
  '1': 'gs',
  '2': 'fr',
  '3': 'h',
  '4': 'si'
};

const key = 'qeqy84JE7hUKfaI0Lxm2Ttcm6ZA0bYrP'; // no idea how long this is good for
const url = `https://collector-otp-prod.camsys-apps.com/realtime/gtfsrt/ALL/alerts?type=json&apikey=${key}`;

const replacements = {
  'St George': 'Saint George',
  'St': 'Street',
  'Sts': 'Streets',
  'Av': 'Avenue',
  'Rd': 'Road',
  'Ln': 'Lane',
  'Blvd': 'Boulevard',
  'Hts': 'Heights',
  'SIR': 'Staten Island Railway',
};

const nameReplacements = {
  'h': 'Far Rockaway Shuttle',
  'si': 'Staten Island Railway',
  'fs': 'Franklin Shuttle',
  'GS': 'Grand Central Shuttle'
};

function replaceAbbreviations(text) {
  let replaced = text;
  for (let [from, to] of Object.entries(replacements)) {
    const regex = new RegExp(`${from}(?![a-zA-Z])`, 'g');
    replaced = replaced.replace(regex, to);
  }
  return replaced;
}

function replaceNumberWithOrdinal(text) {
  return text.replace(/(\d+)(?:\s+(Street|Avenue))/g, function(match, number, type) {
    let j = number % 10,
        k = number % 100;
    if (j == 1 && k != 11) {
      return number + "st " + type;
    }
    if (j == 2 && k != 12) {
      return number + "nd " + type;
    }
    if (j == 3 && k != 13) {
      return number + "rd " + type;
    }
    return number + "th " + type;
  });
}

function isActive(entity) {
  const activePeriods = entity.alert.active_period || [];
  return activePeriods.some(period => {
    const start = period.start || 0;
    const end = period.end || (Date.now() / 1000 + 1);
    return start < (Date.now() / 1000) && end > (Date.now() / 1000);
  });
}

function isSubway(entity) {
  const informedEntities = entity.alert.informed_entity || [];
  return informedEntities.some(informed => informed.agency_id === "MTASBWY");
}

(async () => {
  try {
    let trainId = process.argv[2];
    console.error(`Raw trainId: ${trainId}`);
    
    if (trainId && trainId.startsWith('letter:')) {
      trainId = letterTrains[trainId.slice('letter:'.length)];
    }

    if (trainId && trainId.startsWith('shuttle:')) {
      trainId = shuttleTrains[trainId.slice('shuttle:'.length)];
    }

    if (trainId) {
      console.error(`Fetching train information for ${trainId}...`);
    } else {
      console.error("Fetching train information...");
    }
    const response = await axios.get(url);
    const data = response.data;
    const entities = data.entity;
    //console.log(entities.filter(isSubway).filter(e => (e.alert.informed_entity || []).some(i => i.route_id?.match(/S/))).map(e => e.alert.informed_entity));
    const filteredEntities = entities.filter(isActive).filter(isSubway).filter(entity => {
      return (entity.alert.informed_entity || []).some(i => i.route_id && i.route_id.toLowerCase() == trainId.toLowerCase());
    });

    let routes = {};
    if (trainId) {
      routes[trainId.toUpperCase()] = [];
    } else {
      for (let entity of entities) {
        for (let informed of (entity.alert.informed_entity || [])) {
	        if (informed.agency_id === "MTASBWY") {
            routes[informed.route_id] = [];
          }
        }
      }
    }

    for (let entity of filteredEntities) {
      const informedEntities = (entity.alert.informed_entity || []).filter(informed => informed.agency_id === "MTASBWY");
      const routeIds = informedEntities.map(informed => informed.route_id).filter(Boolean);
      for (let routeId of routeIds) {
        routes[routeId] = routes[routeId] || [];
        routes[routeId].push(entity);
      }
    }
    const goodService = Object.entries(routes).filter(([routeId, entities]) => !entities.length);
    if (goodService.length) {
      const routeId = goodService.map(([routeId])=> routeId)[0] || '';
      const name = nameReplacements[routeId] || routeId;
      console.log('');
      console.log(`${name} train status: good service`);
      console.log('');
      return;
    }

    for (let [routeId, entities] of Object.entries(routes)) {
      if (!entities.length) {
	      continue;
      }

      if (trainId && trainId.toUpperCase() !== routeId) {
        continue;
      }

      const name = nameReplacements[routeId] || routeId;
      console.log(`${name} train status:`);

      if (!entities.length) {
	      console.log("  Good service");
      }

      for (let entity of entities) {
        const text = entity.alert.header_text.translation.find(translation => translation.language === 'en').text;
        const activePeriods = entity.alert.active_period.map(period => ({
          start: new Date(period.start * 1000).toLocaleString(),
          end: new Date(period.end * 1000).toLocaleString(),
        }));
        console.log("  " + replaceNumberWithOrdinal(replaceAbbreviations(text)));
      }
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
})();
