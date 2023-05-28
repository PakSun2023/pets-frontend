import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import { addPetToMyFavorites, getMyFavorites, getPets, removePetFromMyFavorites } from '../../api';
import IPetType from '../../types/petType';
import { Link } from 'react-router-dom';
import { districts } from '../../utils/districts';
import { AiOutlineHeart, AiFillHeart, AiOutlineSearch } from 'react-icons/ai';
import { MdClear } from 'react-icons/md';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<IPetType[]>([]);
  const [myList, setMyList] = useState<IPetType[]>([]);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const fetchPets = async () => {
    const res = await getPets();
    if (res?.success) {
      setPets(res?.petsData);
    }
  }

  const fetchMyList = async () => {
    const res = await getMyFavorites();
    if (res?.success) {
      setMyList(res?.myFavoriteList);
    }
  }

  useEffect(() => {
    fetchPets();
    fetchMyList();
  }, []);

  useEffect(() => {
    if (!sortBy) return;
    if (sortBy === "age_young") {
      const sortPets = [...pets].sort((a, b) => a.age - b.age);
      setPets(sortPets);
    }
    if (sortBy === "age_old") {
      const sortPets = [...pets].sort((a, b) => b.age - a.age);
      setPets(sortPets);
    }
  }, [sortBy]);

  useEffect(() => {
    if (!location) return;
    if (location === "all") {
      fetchPets();
    } else {
      const filterPets = pets.filter(p => p.location === location);
      setPets(filterPets);
    }
  }, [location]);

  const handleFavorite = async (petId: string) => {
    const isFavorite = myList.find(p => p._id === petId);
    if (isFavorite) {
      const res = await removePetFromMyFavorites(petId);
      if (res?.success) {
        fetchMyList();
      }
    } else {
      const res = await addPetToMyFavorites(petId);
      if (res?.success) {
        fetchMyList();
      }
    }
  }

  const handleSearch = async () => {
    if (!searchValue) return;
    const filterPets = pets.filter(p => p.name.toLowerCase().includes(searchValue.toLowerCase()));
    setPets(filterPets);
  }

  return (
    <div className="bg-base-200 pt-20 px-28 pb-96 min-h-screen">
      <div className='flex mb-4 w-full justify-between'>
        <div className="flex gap-4">
          <label htmlFor="sort_by" className='text-lg flex items-center'>Sort:</label>
          <select className="select" onChange={e => setSortBy(e.target.value)}>
            <option disabled selected>Age</option>
            <option value="age_old">Age (Old)</option>
            <option value="age_young">Age (Young)</option>
          </select>
          <label htmlFor="location" className='text-lg flex items-center'>Location:</label>
          <select className="select" onChange={e => setLocation(e.target.value)}>
            <option selected value="all">All</option>
            {districts.map(d => (
              <option key={d.code} value={d.code}>{d.name}</option>
            ))}
          </select>
        </div>
        <div className='flex gap-2'>
          <input type="text" placeholder="Search" className="input input-bordered w-full max-w-xs" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
          <button className='btn btn-primary' onClick={() => handleSearch()}>
            <AiOutlineSearch className='text-xl' />
          </button>
          {searchValue.length > 0 && <button className='btn btn-accent' onClick={() => {
            setSearchValue("");
            fetchPets();
          }}>
            <MdClear className='text-xl' />
          </button>}
        </div>
      </div>
      <div className='grid grid-cols-3'>
        {pets.map(pet => (
          <div key={pet._id} className="card w-96 bg-base-100 shadow-xl overflow-hidden">
            <div className="relative h-0 pb-48">
              {pet?.petImage ? (
                <img
                  src={`data:image/png;base64,${pet.petImage}`} alt={pet.name}
                  className={`absolute inset-0 w-full h-full object-cover object-center`}
                />
              ) : (
                <div className="absolute inset-0 bg-gray-100" />
              )}
            </div>
            <div className="card-body">
              <h2 className="card-title">{pet.name}</h2>
              <div>
                {pet?.breed && <p>Breed: {pet.breed}</p>}
                {pet?.color && <p>Color: {pet.color}</p>}
                {pet?.age && <p>Age: {pet.age}</p>}
                <p>Location: {districts.find(d => d.code === pet.location)?.name}</p>
              </div>
              <div className="card-actions justify-end">
                {user && <button className='h-full mr-4' onClick={() => handleFavorite(pet._id)}>
                  {myList.findIndex(p => p._id === pet._id) >= 0 ?
                    <AiFillHeart className='text-3xl text-red-400' />
                    : <AiOutlineHeart className='text-3xl text-red-400' />
                  }
                </button>}
                <Link to={`/pet/${pet._id}`} className="btn btn-primary">Detail</Link>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  )
}

export default Home