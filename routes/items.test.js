process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
let items = require("../fakeDB");

let newItem = { name: "Blue", price: 10.99 };

beforeEach(function () {
  items.push(newItem);
});

afterEach(function () {
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ items: [newItem] });
  });
});

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ name: "Red", price: 15.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ name: "Red", price: 15.99 });
  });

  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating an item's name and price", async () => {
    const res = await request(app).patch(`/items/${newItem.name}`).send({ name: "Green", price: 20.99 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ updated: { name: "Green", price: 20.99 } });
  });

  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/InvalidName`).send({ name: "Purple" });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${newItem.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' });
  });

  test("Responds with 404 for deleting an invalid item", async () => {
    const res = await request(app).delete(`/items/InvalidName`);
    expect(res.statusCode).toBe(404);
  });
});
