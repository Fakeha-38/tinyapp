const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

chai.use(chaiHttp);

describe("Login and Access Control Test", () => {

  it('should return 403 status code for unauthorized access to "http://localhost:8080/urls/b6UTxQ"', () => {
    const agent = chai.request.agent("http://localhost:8080/urls");

    // Step 1: Login with valid credentials
    return agent
      .post("/login")
      .send({ email: "user2@example.com", password: "dishwasher-funk" })
      .then((loginRes) => {
        // Step 2: Make a GET request to a protected resource
        return agent.get("/urls/b6UTxQ").then((accessRes) => {
          // Step 3: Expect the status code to be 403
          expect(accessRes).to.have.status(403);
        });
      });
  });

  it('GET / should redirect to /login with status code 302', function() {
    return chai.request('http://localhost:8080')
      .get('/')
      .then(function(res) {
        expect(res).to.redirect;
        expect(res).to.redirectTo('http://localhost:8080/login');
        expect(res).to.have.status(302);
      });
  });
  
  it('GET /urls/new should redirect to /login with status code 302', function() {
    return chai.request('http://localhost:8080')
      .get('/urls/new')
      .then(function(res) {
        expect(res).to.redirect;
        expect(res).to.redirectTo('http://localhost:8080/login');
        expect(res).to.have.status(302);
      });
  });
  
  it('GET /urls/NOTEXISTS should return status code 404', function() {
    return chai.request('http://localhost:8080')
      .get('/urls/NOTEXISTS')
      .then(function(res) {
        expect(res).to.have.status(404);
      });
  });
  
  it('GET /urls/b6UTxQ should return status code 403', function() {
    return chai.request('http://localhost:8080')
      .get('/urls/b6UTxQ')
      .then(function(res) {
        expect(res).to.have.status(403);
      });
  });

});
