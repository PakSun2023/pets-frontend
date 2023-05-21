import React, { useContext, useEffect } from 'react'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  email: yup.string().email("Please enter correct email.").required("Please enter your email."),
  password: yup.string().required("Please enter your password."),
}).required();
type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async data => {
    await login(data.email, data.password);
  })

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  return (
    <div className="hero h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login</h1>
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
              <label className="flex space-x-2 py-4 label-text-alt text-gray-500">
                <span>Not a Member?</span>
                <a href="/register" className="link">Sign Up</a>
              </label>
            </div>
            <div className="form-control mt-2">
              <button className="btn btn-primary" onClick={onSubmit}>Login</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login