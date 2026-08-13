import dotenv from "dotenv";
dotenv.config();

const url =
  "https://jsearch.p.rapidapi.com/search?query=React%20Developer&page=1&num_pages=1";

const response = await fetch(url, {
  method: "GET",
  headers: {
    "x-rapidapi-key": process.env.JSEARCH_API_KEY,
    "x-rapidapi-host": "jsearch.p.rapidapi.com",
  },
});

console.log("Status:", response.status);

const data = await response.json();

console.log(JSON.stringify(data, null, 2));