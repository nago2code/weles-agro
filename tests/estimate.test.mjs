import test from "node:test";
import assert from "node:assert/strict";
import { parsePrice, lineCost } from "../src/lib/estimate.ts";

test("accepts Russian decimal and thousands separators", () => {
  assert.equal(parsePrice("1 250,50"), 1250.5);
  assert.equal(parsePrice("0,01"), 0.01);
  assert.equal(lineCost(25, "250,50"), 6262.5);
});
test("rounds monetary line totals in kopecks", () => {
  assert.equal(lineCost(100, "0.29"), 29);
  assert.equal(lineCost(3, "123,45"), 370.35);
});
test("does not treat missing or invalid prices as a zero-priced order", () => {
  for (const value of [
    "",
    " ",
    "-10",
    "0",
    "Infinity",
    "1e4",
    "abc",
    "1,234",
    "1000001",
  ]) {
    assert.equal(parsePrice(value), null, value);
    assert.equal(lineCost(25, value), null, value);
  }
});
test("rejects invalid quantities", () => {
  for (const quantity of [0, -1, Infinity, NaN])
    assert.equal(lineCost(quantity, "250"), null);
});
