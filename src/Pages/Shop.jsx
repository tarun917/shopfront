import React, { useEffect, useState } from 'react';
import Hero from '../Components/Hero/Hero';
import Popular from '../Components/Popular/Popular';
import Offers from '../Components/Offers/Offers';
import NewCollections from '../Components/NewCollections/NewCollections';
import NewsLetter from '../Components/NewsLetter/NewsLetter';

const Shop = () => {
  const [popular, setPopular] = useState([]);
  const [newcollection, setNewCollection] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInfo = async () => {
    try {
      const popularResponse = await fetch('https://shopbackend-xqa6.onrender.com/popularinwomen');
      if (!popularResponse.ok) {
        throw new Error(`Failed to fetch popular items: ${popularResponse.statusText}`);
      }
      const popularData = await popularResponse.json();

      const newCollectionResponse = await fetch('https://shopbackend-xqa6.onrender.com/newcollections');
      if (!newCollectionResponse.ok) {
        throw new Error(`Failed to fetch new collections: ${newCollectionResponse.statusText}`);
      }
      const newCollectionData = await newCollectionResponse.json();

      setPopular(popularData);
      setNewCollection(newCollectionData);
    } catch (error) {
      setError(error.message);
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Hero />
      <Popular data={popular} />
      <Offers />
      <NewCollections data={newcollection} />
      <NewsLetter />
    </div>
  );
};

export default Shop;
