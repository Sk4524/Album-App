import React, { useState, useEffect } from 'react';
import './styles.css';

const Album = () => {
  const [albums, setAlbums] = useState([]);
  const [newAlbumData, setNewAlbumData] = useState({
    title: '',
    userId: '',
  });
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.log('Error fetching albums:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewAlbumData({
      ...newAlbumData,
      [name]: value,
    });
  };

  const handleAddAlbum = async e => {
    e.preventDefault();
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbumData),
      });
      const data = await response.json();
      setAlbums([...albums, data]);
      setNewAlbumData({
        title: '',
        userId: '',
      });
    } catch (error) {
      console.log('Error adding album:', error);
    }
  };

  const handleDeleteAlbum = async albumId => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
        method: 'DELETE',
      });
      const updatedAlbums = albums.filter(album => album.id !== albumId);
      setAlbums(updatedAlbums);
    } catch (error) {
      console.log('Error deleting album:', error);
    }
  };

  const handleUpdateAlbum = async () => {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/albums/${selectedAlbumId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAlbumData),
      });
      const updatedAlbums = albums.map(album =>
        album.id === selectedAlbumId ? { ...album, ...newAlbumData } : album
      );
      setAlbums(updatedAlbums);
      setSelectedAlbumId(null);
      setNewAlbumData({
        title: '',
        userId: '',
      });
    } catch (error) {
      console.log('Error updating album:', error);
    }
  };

  const handleEditAlbum = albumId => {
    const selectedAlbum = albums.find(album => album.id === albumId);
    setSelectedAlbumId(albumId);
    setNewAlbumData({
      title: selectedAlbum.title,
      userId: selectedAlbum.userId,
    });
  };

  return (
    <div id="root">
      <h1>Album</h1>
      <form onSubmit={handleAddAlbum}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={newAlbumData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            name="userId"
            value={newAlbumData.userId}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add Album</button>
      </form>
      <div className="album-container">
        {albums.map(album => (
          <div key={album.id} className="album">
            <h3>{album.title}</h3>
            <p>User ID: {album.userId}</p>
            <p>Album ID: {album.id}</p>
            {/* Replace the image URL with your actual image */}
            <img src={`https://via.placeholder.com/300/${album.id}`} alt={album.title} />
            <div className="update-form">
              <button onClick={() => handleEditAlbum(album.id)}>Update</button>
              <button onClick={() => handleDeleteAlbum(album.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      {selectedAlbumId && (
        <div className="form-container">
          <h3>Update Album</h3>
          <form>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={newAlbumData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>User ID:</label>
              <input
                type="text"
                name="userId"
                value={newAlbumData.userId}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="update-form">
              <button onClick={handleUpdateAlbum}>Save Update</button>
              <button onClick={() => setSelectedAlbumId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Album;
