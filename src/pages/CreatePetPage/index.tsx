import React, { useEffect, useState } from 'react'
import toast from "react-hot-toast";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { districts } from '../../utils/districts';
import { addPet } from '../../api';

const schema = yup.object({
    name: yup.string().trim().required("Please enter a pet name or a temporary name."),
    color: yup.string().trim(),
    breed: yup.string().trim(),
    age: yup.string(),
    description: yup.string().trim(),
    location: yup.string().trim().required("Please select your location."),
}).required();
type FormData = yup.InferType<typeof schema>;

const CreatePet = () => {
    const [submitting, setSubmitting] = useState(false);
    const [petPhoto, setPetPhoto] = useState<File | null>();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = handleSubmit(async data => {
        setSubmitting(true);
        const { name, age, color, breed, location } = data;
        const res = await addPet(name, age, color, breed, location, petPhoto);

        if (res?.success) {
            toast.success("Add new pet success", { position: "bottom-left" });
            setPetPhoto(null);
            reset({
                name: "",
                color: "",
                breed: "",
                age: "",
                location: ""
            });
        }
        setSubmitting(false);
    })

    return (
        <div className="h-screen bg-base-200 pt-20 px-10">
            <div className="text-sm breadcrumbs">
                <ul>
                    <li className='font-bold'><a href="/">Home</a></li>
                    <li className='font-light'>Add Pet</li>
                </ul>
            </div>

            <div className='flex justify-center'>
                <div className="card flex-shrink-0 w-full max-w-3xl shadow-2xl bg-base-100">
                    <div className="card-body gap-4">
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">Name (Temporary)</label>
                            <input type="text" placeholder="pet name" className="input input-bordered w-full max-w-lg" {...register("name")} />
                        </div>
                        {errors && errors?.name?.message &&
                            <span className="text-red-500 text-xs text-end">{errors.name.message}</span>
                        }
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">Color (Optional)</label>
                            <input type="text" placeholder="pet color" className="input input-bordered w-full max-w-lg" {...register("color")} />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">breed (Optional)</label>
                            <input type="text" placeholder="pet breed" className="input input-bordered w-full max-w-lg" {...register("breed")} />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">age (Optional)</label>
                            <input type="number" placeholder="pet age" className="input input-bordered w-full max-w-lg" {...register("age")} />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">description (Optional)</label>
                            <textarea className="textarea textarea-bordered w-full max-w-lg" placeholder="description" {...register("description")} />
                        </div>
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">location</label>
                            <select className="select select-bordered w-full max-w-lg" {...register("location")}>
                                <option disabled selected value="">Location</option>
                                {districts.map(d => (
                                    <option key={d.code} value={d.code}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors && errors?.location?.message &&
                            <span className="text-red-500 text-xs text-end">{errors.location.message}</span>
                        }
                        <div className='w-full flex justify-between items-center'>
                            <label htmlFor="">Photo</label>
                            <input type="file" onChange={e => setPetPhoto(e.target.files?.[0])} accept="image/*" className="file-input file-input-bordered file-input-warning w-full max-w-lg" />
                        </div>

                        <div className='mt-4'>
                            <button onClick={onSubmit} className={`btn btn-accent min-w-[100px] ${submitting ? "loading" : ""}`}>Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatePet