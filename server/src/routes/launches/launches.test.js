const request = require("supertest");
const app = require("../../app");

describe("Test GET /launches", () => {
  test("It should respond with 200 success", async () => {
    // you can also chain the expect function here and
    //  also the second parameter in the first chain can be a
    //regular expression or a string
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);

    //expect(response.statusCode).toBe(200); you can also call the expect function separately like this
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "Test Mission 101",
    rocket: "Rocket NZ2459",
    target: "Kepler-186 f",
    launchDate: "January 4, 2028",
  };

  const launchDataWithoutDate = {
    mission: "Test Mission 101",
    rocket: "Rocket NZ2459",
    target: "Kepler-186 f",
  };

  const launchDataWitInvalidDate = {
    mission: "Test Mission 101",
    rocket: "Rocket NZ2459",
    target: "Kepler-186 f",
    launchDate: "January, cool",
  };

  //Here we use the send method to pass the data that needs to be sent
  // Note  that when you want to test the body of the response, you have use jest assertions i.e expect instead of the supertest own expect function
  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(requestDate).toBe(responseDate);

    //when comparing an object to another object the first object
    //does not need to have all the fields in the second object,
    // it just needs to have fields that are present in the second object
    expect(response.body).toMatchObject(launchDataWithoutDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    //toStrictEqual allows us to completely match the object and its fields
    //unlike toMatchObject which does not need all fields in the object to match
    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });

  test("It should catch invalid dates", async () => {
    const response = await request(app)
      .post("/launches")
      .send(launchDataWitInvalidDate)
      .expect("Content-Type", /json/)
      .expect(400);

    //toStrictEqual allows us to completely match the object and its fields
    //unlike toMatchObject which does not need all fields in the object to match
    expect(response.body).toStrictEqual({
      error: "Invalid lauch date",
    });
  });
});
