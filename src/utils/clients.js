async function client(
  baseURL,
  endpoint,
  {data, token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      'Content-Type': data ? 'application/json' : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${baseURL}/${endpoint}`).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

async function espnClient( endpoint ) {
  const espnBaseURL = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football'
  return await client( espnBaseURL, endpoint )
}

export {client, espnClient}
