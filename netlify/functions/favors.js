exports.handler = async function(event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN; 
  const BASE_ID = "appC9AFAxKuIJgdFH";
  const TABLE_NAME = "Favors";
  
  const recordId = event.queryStringParameters.recordId || "";
  const sort = event.queryStringParameters.sort || "";
  
  let airtableUrl = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}`;
  if (recordId) {
    airtableUrl += `/${recordId}`;
  } else if (sort) {
    airtableUrl += `?sort[0][field]=CreatedTime&sort[0][direction]=desc`;
  }

  try {
    const options = {
      method: event.httpMethod,
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      }
    };
    
    if (event.httpMethod === "POST" || event.httpMethod === "PATCH") {
      options.body = event.body;
    }

    const response = await fetch(airtableUrl, options);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: { ...headers, "Content-Type": "application/json" },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
