import React, { useState } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { userSignUp } from '../../api';

const schema = yup.object({
  email: yup.string().trim().email("Please enter correct email.").required("Please enter your email."),
  password: yup.string().trim().required("Please enter your password.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
  confirmPassword: yup.string().trim().oneOf([yup.ref('password'), ''], 'Passwords must match').required("Please re-enter your password."),
  staffCode: yup.string().trim().nullable()
}).required();
type FormData = yup.InferType<typeof schema>;

const Register = () => {
  const [isStaff, setIsStaff] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, getValues, setError, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async data => {
    const staffCode = getValues("staffCode") ?? "";
    if (isStaff && (!staffCode || staffCode === "")) {
      setError("staffCode", {
        type: "manual",
        message: "Please enter staff code if you are a staff"
      });
    }

    const role = isStaff ? "staff" : "user";

    const res = await userSignUp(data.email, data.confirmPassword, role, staffCode);
    if (res && res?.success && res?.user) {
      setSuccess(true);
    }
  })

  if (success) return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Successfully</h1>
          <p className="py-6">Sign up success, please login and meet your pet.</p>
          <a href='/login' className="btn btn-primary">Login</a>
        </div>
      </div>
    </div>
  )

  return (
    <div className="hero h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up</h1>
          <p className="py-6">Find your purr-fect match with The Pet Shelter - where every cat deserves a loving home.</p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="text"
                placeholder="email"
                className="input input-bordered"
                {...register("email")}
              />
              {errors && errors?.email?.message &&
                <span className="text-red-500 text-xs pt-1 pl-1">{errors.email.message}</span>
              }
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password")}
              />
              {errors && errors?.password?.message &&
                <span className="text-red-500 text-xs pt-1 pl-1">{errors.password.message}</span>
              }
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
                {...register("confirmPassword")}
              />
              {errors && errors?.confirmPassword?.message &&
                <span className="text-red-500 text-xs pt-1 pl-1">{errors.confirmPassword.message}</span>
              }
            </div>

            <div className="flex items-center justify-between">
              <label className="label cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary" defaultChecked={isStaff} onChange={e => setIsStaff(e.target.checked)} />
                <span className="label-text pl-2">Is Staff</span>
              </label>
              <input
                type="text"
                placeholder="staff code"
                className="input input-bordered"
                disabled={!isStaff}
                {...register("staffCode")}
              />
            </div>
            {errors && errors?.staffCode?.message &&
              <span className="text-red-500 text-xs pt-1 pl-1">{errors.staffCode.message}</span>
            }

            <label className="flex space-x-2 py-4 label-text-alt text-gray-500">
              <span>Already a Member?</span>
              <a href="/login" className="link">Login</a>
            </label>

            <div className="form-control mt-2">
              <button className="btn btn-primary" onClick={onSubmit}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register