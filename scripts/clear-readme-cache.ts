type LineAttributes = { url: string; alt: string };

const response = await fetch("https://github.com/myty/stage3");
const body = await response.text();

const queue = body.split("<img ")
  .map(lineToAttributes)
  .filter((line): line is LineAttributes => line != null);

await Promise.allSettled(
  queue.map(async (obj) => {
    try {
      const response = await fetch(obj.url, { method: "PURGE" });
      const json = await response.json();

      if (json.status !== "ok") {
        throw new Error(json.status);
      }

      console.log("PURGE", { request: obj, result: json });
    } catch (error) {
      if (error) {
        console.error("Error: PURGE", { request: obj, result: error });
      }
    }
  }),
);

function lineToAttributes(line: string): LineAttributes | undefined {
  const [_, url, alt] = line.match(
    /^src="(https:\/\/camo\.githubusercontent\.com\/[a-f0-9]+\/[a-f0-9]+)" alt="([^"]+)"/,
  ) ?? [];
  if (url && alt) {
    return { url, alt };
  }
}
