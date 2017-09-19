const PREFIX_URL = 'https://kitsu.io/api/edge/';

const AnimeReact = {

  fetchAnimeList: () =>
    (fetch(`${PREFIX_URL}anime`)
      .then(response => response.json())
      .catch(error => this.errorLog(error))),

  errorLog: (error) => {
    console.error(error);
    return null;
  },
};

export default AnimeReact;

//  {credentials: 'include'}