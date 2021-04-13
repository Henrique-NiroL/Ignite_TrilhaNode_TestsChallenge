import request from "supertest";
import { Connection } from "typeorm";

import { app } from "../../../../app";
import createConnection from "../../../../database/index";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection;
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to post User session", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User Test",
      email: "test@email.com",
      password: "admin",
    });

    const response = await request(app).post("/api/v1/sessions/").send({
      email: "test@email.com",
      password: "admin",
    });

    const { user } = response.body;
    const { name, email } = user;

    expect(response.status).toBe(200);
    expect(name).toEqual("User Test");
    expect(email).toEqual("test@email.com");
  });

  it("Should not be able to post User session of an invalid user", async () => {
    await request(app).post("/api/v1/users/").send({
      name: "User1 Test",
      email: "test1@email.com",
      password: "admin1",
    });

    const response = await request(app).post("/api/v1/sessions/").send({
      email: "notuser@email.com",
      password: "notuser",
    });

    expect(response.status).toBe(401);
  });
});
