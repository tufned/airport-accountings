export const reqData = async (url) => {
  const res = await fetch(process.env.REACT_APP_API_URL + url);

  if (!res.ok) return new Error(res.statusText);

  return res.json();
}


export const postData = async (url, postData) => {
  const res = await fetch(process.env.REACT_APP_API_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData)
  });

  return res.json();
}


export const updateData = async (url, data) => {
  const res = await fetch(process.env.REACT_APP_API_URL + url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return res.json();
}