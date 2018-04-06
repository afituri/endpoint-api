const axios = require('axios');
const { apiKey } = require('../../../config').google;

function getLocationInfo(result) {
  let location = {};
  const city = result.address_components.filter(address =>
    address.types.find(x => x === 'locality'))[0];
  location.city = city.long_name;
  location.cityShortName = city.short_name;
  const state = result.address_components.filter(address =>
    address.types.find(x => x === 'administrative_area_level_1'))[0];
  location.state = state.long_name;
  location.stateShortName = state.short_name;
  const country = result.address_components.filter(address =>
    address.types.find(x => x === 'country'))[0];
  location.country = country.long_name;
  location.countryShortName = country.short_name;
  location.formattedAddress = result.formatted_address;
  location.lat = result.geometry.location.lat;
  location.lng = result.geometry.location.lng;
  location.placeId = result.place_id;
  return location;
}

async function getJSONAsync(url) {
  let json = await axios.get(url);
  return json.data;
}

class LocationsService {
  constructor(req) {
    this.req = req;
  }

  fetchLocations() {
    const { Location } = this.req.models;
    return Location.find();
  }

  fetchLocationByPlaceId(placeId) {
    const { Location } = this.req.models;
    return Location.findOne({ placeId });
  }

  fetchLocationById(id) {
    const { Location } = this.req.models;
    return Location.findById(id);
  }

  createLocation(data) {
    const { Location } = this.req.models;
    return Location.create(data);
  }

  findByIdAndUpdate(id, body) {
    const { Location } = this.req.models;
    const { phone, language } = body;
    let updates = {};

    if (phone) {
      updates.phone = phone;
    }
    if (language) {
      updates.language = language;
    }
    return Location.findByIdAndUpdate(id, updates, { new: true });
  }

  deleteLocationById(id) {
    const { Location } = this.req.models;
    return Location.remove({ _id: id });
  }

  async fetchLocationFromGoogle(placeId) {
    const { Location } = this.req.models;
    let location = await this.fetchLocationByPlaceId(placeId);
    if (location) {
      return location;
    }
    let url = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${apiKey}`;
    let enLocation = await getJSONAsync(url);
    let arLocation = await getJSONAsync((url += '&language=ar'));
    location = new Location(getLocationInfo(enLocation.result));
    arLocation = getLocationInfo(arLocation.result);
    location.cityAr = arLocation.city;
    location.stateAr = arLocation.state;
    location.countryAr = arLocation.country;
    location.formattedAddressAr = arLocation.formattedAddress;
    location.save();
    return location;
  }
}

module.exports = LocationsService;
