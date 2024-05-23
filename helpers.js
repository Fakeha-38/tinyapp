/////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

// returns the complete user object from users dataase

const findUserByEmail = function (email, users) {
  for (const key in users) {
    if (users[key].email === email) {
      return users[key];
    }
  }
  return null;
};


module.exports = findUserByEmail;