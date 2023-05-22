import React, { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import IPetType from "../../types/petType";
import { deletePet, getPetDetail, updatePet } from "../../api";
import { districts } from "../../utils/districts";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineHeart, AiOutlineRollback, AiOutlineUpload } from "react-icons/ai";
import { AuthContext } from "../../context/authContext";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup"
import toast from "react-hot-toast";

const schema = yup.object({
    name: yup.string().trim().required("Please enter a pet name or a temporary name."),
    description: yup.string().trim(),
    color: yup.string().trim(),
    breed: yup.string().trim(),
    age: yup.string(),
    location: yup.string().trim().required("Please select your location."),
}).required();
type FormData = yup.InferType<typeof schema>;

const DetailPage = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { pid } = useParams();
    const [petInfo, setPetInfo] = useState<IPetType>();
    const [isEditMode, setIsEditMode] = useState(false);
    const [petPhoto, setPetPhoto] = useState<File | null>();
    const [submitting, setSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const fetchPetInfo = async (id: string) => {
        const res = await getPetDetail(id);

        if (res?.success) {
            setPetInfo(res.pet);
        }
    }

    useEffect(() => {
        if (pid) fetchPetInfo(pid);
    }, [pid]);

    useEffect(() => {
        petInfo?.name && setValue("name", petInfo.name);
        petInfo?.description && setValue("description", petInfo.description);
        petInfo?.color && setValue("color", petInfo.color);
        petInfo?.breed && setValue("breed", petInfo.breed);
        petInfo?.age && setValue("age", petInfo.age.toString());
        petInfo?.location && setValue("location", petInfo.location);
    }, [petInfo, setValue, isEditMode]);

    const onSubmit = handleSubmit(async data => {
        if (!pid) return;
        setSubmitting(true);
        const { name, description, age, color, breed, location } = data;
        const res = await updatePet(pid, name, description, age, color, breed, location, petPhoto);

        if (res?.success) {
            toast.success("Update pet data success", { position: "bottom-left" });
            setPetPhoto(null);
            fetchPetInfo(pid);
            setIsEditMode(false);
        }
        setSubmitting(false);
    });

    const onDelete = async () => {
        if (!pid) return;

        const res = await deletePet(pid);
        if (res?.success) {
            toast.success("Delete pet data success", { position: "bottom-left" });
            navigate("/");
        }
    };

    return (
        <div className="bg-base-200 pt-20 px-10 pb-96">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li className="font-bold"><a href="/">Home</a></li>
                    {petInfo && <li className="font-light">{petInfo.name}</li>}
                </ul>
            </div>

            {petInfo ?
                <div className="card card-side bg-base-100 shadow-xl">
                    <figure className="w-1/4 ml-5 relative">
                        {isEditMode && <div className="absolute w-48 h-48 aspect-square rounded-full flex justify-center items-center bg-black/50">
                            <label htmlFor="uploadPhoto">
                                <div className="group w-12 h-12 rounded-full bg-white flex justify-center items-center cursor-pointer hover:bg-slate-400">
                                    <AiOutlineUpload className="text-xl group-hover:text-white" />
                                </div>
                                <input type="file" id="uploadPhoto" className="hidden" onChange={e => setPetPhoto(e.target.files?.[0])} accept="image/*" />
                            </label>
                        </div>}
                        {petInfo?.petImage ?
                            <img className="object-contain mx-auto my-2 border-2 rounded-lg" src={`data:image/png;base64,${petInfo?.petImage}`} alt={petInfo.name} />
                            : <div className="mx-auto my-2 border-2 rounded-lg bg-slate-400 flex justify-center items-center text-white">No Image</div>}
                    </figure>
                    <div className="card-body">
                        {isEditMode ?
                            <>
                                <div className="flex flex-col gap-4 w-3/4">
                                    <div className="w-full flex justify-between items-center">
                                        <label htmlFor="">Name (Temporary)</label>
                                        <input type="text" placeholder="pet name" className="input input-bordered w-full max-w-lg" {...register("name")} />
                                    </div>
                                    {errors && errors?.name?.message &&
                                        <span className="text-red-500 text-xs text-end">{errors.name.message}</span>
                                    }
                                    <div className='w-full flex justify-between items-center'>
                                        <label htmlFor="">description (Optional)</label>
                                        <textarea className="textarea textarea-bordered w-full max-w-lg" placeholder="description" {...register("description")} />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <label htmlFor="">Color (Optional)</label>
                                        <input type="text" placeholder="pet color" className="input input-bordered w-full max-w-lg" {...register("color")} />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <label htmlFor="">breed (Optional)</label>
                                        <input type="text" placeholder="pet breed" className="input input-bordered w-full max-w-lg" {...register("breed")} />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <label htmlFor="">age (Optional)</label>
                                        <input type="number" placeholder="pet age" className="input input-bordered w-full max-w-lg" {...register("age")} />
                                    </div>
                                    <div className="w-full flex justify-between items-center">
                                        <label htmlFor="">location</label>
                                        <select className="select select-bordered w-full max-w-lg" {...register("location")}>
                                            <option disabled selected value="">Location</option>
                                            {districts.map(d => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="card-actions flex-1 items-end justify-end">
                                    <button className={`btn btn-warning min-w-[200px] gap-4`} onClick={() => setIsEditMode(false)}>
                                        <AiOutlineRollback className="text-xl" />
                                        cancel
                                    </button>
                                    <button className={`btn btn-primary min-w-[200px] ${submitting ? "loading" : ""}`} onClick={onSubmit}>
                                        update
                                    </button>
                                </div>
                            </>
                            : <>
                                <div className="w-full flex justify-between items-start">
                                    <h2 className="card-title text-4xl mb-4">{petInfo?.name}</h2>
                                    {user && user.role === "staff" &&
                                        <div>
                                            <button className="btn btn-circle btn-outline border-0" onClick={() => setIsEditMode(true)}>
                                                <AiOutlineEdit className="text-3xl" />
                                            </button>
                                            <button className="btn btn-circle btn-outline border-0 ml-2" onClick={() => setIsDeleting(true)}>
                                                <AiOutlineDelete className="text-3xl" />
                                            </button>
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col space-y-4">
                                    {petInfo?.description && <p>{petInfo?.description}</p>}
                                    <p className="text-xl">Age: <span className="ml-4">{petInfo?.age}</span></p>
                                    <p className="text-xl">Color: <span className="ml-4">{petInfo?.color}</span></p>
                                    <p className="text-xl">Breed: <span className="ml-4">{petInfo?.breed}</span></p>
                                    <p className="text-xl">Location: <span className="ml-4">{petInfo?.location && districts.find(d => d.code === petInfo.location)?.name}</span></p>
                                </div>
                                <div className="card-actions flex-1 items-end justify-end">
                                    {user && <button className="btn btn-circle btn-outline border-0"><AiOutlineHeart className="text-3xl text-red-400" /></button>}
                                </div>
                            </>}
                    </div>
                </div>
                : null
            }

            {/* confirm delete modal */}
            {isDeleting ?
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Confirm delete this pet!</h3>
                        <p className="py-4">Please make sure you want to delete this pet data from system, this action is irreversible.</p>
                        <div className="modal-action">
                            <button className="btn btn-error" onClick={() => onDelete()}>Confirm</button>
                            <button className="btn btn-success" onClick={() => setIsDeleting(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export default DetailPage