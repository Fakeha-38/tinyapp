/////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

// returns the complete user object from users dataase

const findUserByEmail = function (useremail, users) {
  for (const key in users) {
    if (users[key].email === useremail) {
      return users[key];
    }
  }
  return null;
};

// Checks if the id in /urls/:id exists or not
const checkShortUrl = function (shortUrl, urlDatabase) {
  for (let short in urlDatabase) {
    if (short === shortUrl) {
      return shortUrl;
    }
  }
  return undefined;
};

// Returns an object of all the URLs of particular user
const urlsForUser = function (id, urlDatabase){
  if (id === undefined) {
    return undefined;
  }
  const currentUserUrls = {};
  for (let ids in urlDatabase) {
    if (urlDatabase[ids].userID === id) {
      currentUserUrls[ids] = urlDatabase[ids];
    }
  }
  return currentUserUrls;
};

module.exports = { findUserByEmail, checkShortUrl, urlsForUser};