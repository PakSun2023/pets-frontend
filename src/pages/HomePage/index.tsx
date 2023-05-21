import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import { getPets } from '../../api';
import IPetType from '../../types/petType';
import { Link } from 'react-router-dom';
import { districts } from '../../utils/districts';
import {AiOutlineHeart} from 'react-icons/ai';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState<IPetType[]>([]);

  const fetchPets = async () => {
    const res = await getPets();
    if (res?.success) {
      console.log(res);
      setPets(res?.petsData);
    }
  }

  useEffect(() => {
    fetchPets();
  }, []);

  return (
    <div className="bg-base-200 pt-20 px-28 pb-96">
      <div className='grid grid-cols-3'>
        {pets.map(pet => (
          <div className="card w-96 bg-base-100 shadow-xl overflow-hidden">
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
                {user && <button className='h-full mr-4'><AiOutlineHeart className='text-3xl text-red-400'/></button>}
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