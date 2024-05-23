/////////////////////////////////////////////////////////////////////////////////
// FUNCTIONS
/////////////////////////////////////////////////////////////////////////////////

// returns the complete user object from users dataase

const findUserByEmail = function (useremail, users) {
  console.log('We are in the helper findUserByEmail');
  for (const key in users) {
    console.log('key in user database: ', key);
    if (users[key].email === useremail) {
      console.log('Users key from function findUserBtEmail: ', users[key]);
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
  console.log('current User urls from function', currentUserUrls);
  return currentUserUrls;
};

module.exports = { findUserByEmail, checkShortUrl, urlsForUser};
// module.exports = checkShortUrl;
// module.exports = urlsForUser;