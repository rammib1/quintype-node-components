import wretch from 'wretch';

const apiClient = wretch().options({credentials: 'same-origin'});

export function get(url, params) {
  return apiClient
    .url(url)
    .query(params || {})
    .get();
}

export default wretch().options({ credentials: "same-origin"});

