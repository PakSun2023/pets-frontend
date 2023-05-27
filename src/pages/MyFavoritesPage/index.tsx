import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { getMyFavorites, removePetFromMyFavorites } from '../../api';
import IPetType from '../../types/petType';
import { AiOutlineDelete } from 'react-icons/ai';

const MyFavorites = () => {
    const [myList, setMyList] = useState<IPetType[]>([]);
    const [removePet, setRemovePet] = useState({ isRemove: false, petId: '' });

    const fetchMyList = async () => {
        const res = await getMyFavorites();
        if (res?.success) {
            setMyList(res?.myFavoriteList);
        }
    }

    useEffect(() => {
        fetchMyList();
    }, []);

    const onDelete = async () => {
        if (!removePet.petId) return;

        const res = await removePetFromMyFavorites(removePet.petId);
        if (res?.success) {
            toast.success('Remove pet success.');
            fetchMyList();
            setRemovePet({ isRemove: false, petId: '' });
        }
    };

    return (
        <div className="h-screen bg-base-200 pt-20 px-10">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li className='font-bold'><a href="/">Home</a></li>
                    <li className='font-light'>My Favorite list</li>
                </ul>
            </div>

            <div className='flex flex-col items-center'>
                {myList.length > 0 ?
                    myList.map(pet => (
                        <div key={pet._id} className="card flex-shrink-0 w-full max-w-3xl shadow-2xl bg-base-100">
                            <div className="card-body card-side gap-4">
                                {pet.petImage &&
                                    <div className='w-1/6 aspect-square rounded-full border-[1px] border-black/10 overflow-hidden'>
                                        <img
                                            src={`data:image/png;base64,${pet.petImage}`} alt={pet.name}
                                            className={`object-cover object-center`}
                                        />
                                    </div>
                                }
                                <div className='w-full flex flex-col'>
                                    <p className='font-bold text-xl'>{pet.name}</p>
                                    <p>{pet.description}</p>
                                </div>
                                <button
                                    className="btn btn-circle btn-outline btn-error border-0 absolute bottom-4 right-4"
                                    onClick={() => setRemovePet({ isRemove: true, petId: pet._id })}
                                >
                                    <AiOutlineDelete className="text-xl" />
                                </button>
                            </div>
                        </div>
                    ))
                    : <p className='font-bold text-3xl mt-32'>Your favorite list doesn't seem to include any pets.</p>
                }
            </div>

            {/* confirm delete modal */}
            {removePet.isRemove ?
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm this pet from your favorite list?</h3>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => onDelete()}>Confirm</button>
                            <button className="btn btn-success" onClick={() => setRemovePet({ isRemove: false, petId: '' })}>Cancel</button>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default MyFavorites