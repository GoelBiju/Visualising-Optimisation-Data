const chai = require("chai");
const chaiHttp = require("chai-http");

const { server, stop } = require("../../server");

chai.use(chaiHttp);

suite("Integration Tests", () => {
  test("Test GET /", () => {
    chai
      .request(server)
      .get("/")
      .end((error, response) => {
        chai.assert.equal(response.status, 200, "Wrong status code");
        console.log("Got response: ", response.text);
      });
  });

  suiteTeardown(() => {
    stop();
  });
});
