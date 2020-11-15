/* @flow */

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Album, AlbumSimplified, Artist } from 'spotify-web-sdk';

import { getSeveralAlbums } from '../../api/SpotifyWebAPI';
import Rating from '../common/rating/Rating';

import './ArtistPageContent.css';

type Props = {
  artist: Artist;
  albums: AlbumSimplified[];
  singles: AlbumSimplified[];
};

const ArtistPageContent = ({ artist, albums, singles }: Props) => {
  const [completeAlbums, setCompleteAlbums] = useState([]);
  const [completeSingles, setCompleteSingles] = useState([]);

  useEffect(() => {
    async function fetchCompleteAlbums() {
      const albumIds = albums.map(album => album.id);
      const albumsResponse = await getSeveralAlbums(albumIds);
      const singleIds = singles.map(single => single.id);
      const singlesResponse = await getSeveralAlbums(singleIds);

      setCompleteAlbums(albumsResponse);
      setCompleteSingles(singlesResponse);
    }

    fetchCompleteAlbums();
  }, [albums, singles]);

  return completeAlbums && completeSingles && (
    <div className="artist-page-content col-lg-8">
      <h1 className="discography-title">Discography</h1>
      <h2 className="discography-section-title">ALBUMS</h2>
      <DiscographySection albums={completeAlbums} />
      <h2 className="discography-section-title">SINGLES</h2>
      <DiscographySection albums={completeSingles} />
    </div>
  );
};

const filterMaxPopularity = (albums: Album[]): Album[] => (
  Object.values(albums.reduce((prev, curr) => {
    prev[curr.name] = prev[curr.name] && prev[curr.name].popularity > curr.popularity ? prev[curr.name] : curr
    return prev
  }, {}))
);

const DiscographySection = ({ albums }: { albums: Album[] }) => {
  const { push } = useHistory();
  return (
    <table className="table discography-section-table">
      {filterMaxPopularity(albums).map(album => (
        <tr className="clickable p-2" onClick={() => push(`/album/${album.id}/`)}>
          <td className="discography-section-table-data">
            <img className="artist-discography-album-cover" src={album.imageUrl} />
          </td>
          <td className="p-2">
            <span className="discography-section-album-name">{album.name}</span>
            <br />
            <span className="discography-section-album-details">
              {`${album.totalTracks} track${album.totalTracks > 1 ? 's' : ''} • ${album.releaseYear}`}
            </span>
          </td>
          <td className="discography-section-table-data text-center">
            Your Rating
            <br />
            <Rating initialValue={4} />
          </td>
          <td className="discography-section-table-data text-center">
            Average Rating
            <br />
            <Rating initialValue={4} displayOnly />
          </td>
        </tr>
      ))}
    </table>
  );
}

export default ArtistPageContent;
