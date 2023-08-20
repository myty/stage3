import { assertEquals } from "https://deno.land/std@0.198.0/assert/mod.ts";
import "./promise-with-resolvers.ts";

Deno.test(async function resolvesPromiseWithResult() {
  // Arrange
  const resolvedValue = 5;
  const { resolve, promise } = Promise.withResolvers<number>();

  // Act
  let result;
  const wait = promise.then((resolved) => {
    result = resolved;
  });
  resolve(resolvedValue);

  await wait;

  // Assert
  assertEquals(result, resolvedValue);
});

Deno.test(async function resolvesPromiseWithoutResult() {
  // Arrange
  const { resolve, promise } = Promise.withResolvers();

  // Act
  let result;
  const wait = promise.then((resolved) => {
    result = resolved;
  });
  resolve();

  await wait;

  // Assert
  assertEquals(result, undefined);
});

Deno.test(async function rejectsPromise() {
  // Arrange
  const rejectedReason = "rejected";
  const { reject, promise } = Promise.withResolvers<unknown, string>();

  // Act
  let result;
  const wait = promise.catch((reason) => {
    result = reason;
  });
  reject(rejectedReason);

  await wait;

  // Assert
  assertEquals(result, rejectedReason);
});

Deno.test(async function rejectsPromiseWithoutResult() {
  // Arrange
  const { reject, promise } = Promise.withResolvers();

  // Act
  let result;
  const wait = promise.catch((reason) => {
    result = reason;
  });
  reject();

  await wait;

  // Assert
  assertEquals(result, undefined);
});
