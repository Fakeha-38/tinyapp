const { assert } = require('chai');

// const { findUserByEmail } = require('../helpers.js');
const findUserByEmail = require("../helpers.js");

const testUsers = {
  "aJ48lW": {
    userId: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    userId: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
  "qwe321": {
    userId: "qwe321",
    email: "fakeha.iftikhar@gmail.com",
    password: "123"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function () {
    const user = findUserByEmail("fakeha.iftikhar@gmail.com", testUsers);
    const expectedUserID = 'qwe321';
    assert.deepStrictEqual(user, testUsers[expectedUserID]);
  });

  it('should return null with an non-existent email', function () {
    const user = findUserByEmail("fakeha@gmail.com", testUsers);
    assert.strictEqual(user, null)
  });

});


