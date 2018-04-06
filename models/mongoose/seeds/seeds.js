/* eslint-disable */
let faker = require('faker');
module.exports = () => {
  // ----------------------------------------
  // Create Users
  // ----------------------------------------
  console.log('Creating Users');
  let users = [];
  users.push(
    new User({
      fname: 'Ahmed',
      lname: 'Fituri',
      email: 'ahmed.fituri@gmail.com',
      facebookId: '111111'
    })
  );

  for (let i = 0; i < 5; i += 1) {
    let user = new User({
      fname: faker.name.firstName(),
      lname: faker.name.lastName(),
      email: faker.internet.email(),
      facebookId: i
    });
    users.push(user);
  }

  // ----------------------------------------
  // Finish
  // ----------------------------------------
  let promises = [];
  [users].forEach(collection => {
    collection.forEach(model => {
      promises.push(model.save());
    });
  });
  return Promise.all(promises);
};
