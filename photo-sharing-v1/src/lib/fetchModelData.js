/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 * @return {Promise}        A Promise that resolves with the response data as a JSON object
 */
function fetchModel(url) {
  return fetch(url, {
    credentials: 'include', // Gửi cookies/session với mỗi request
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    });
}

export default fetchModel;
