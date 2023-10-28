import React from "react";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";

import { FcGoogle } from "react-icons/fc";
import { BiUserCircle } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";

import { loaderAction } from "../../Store/loader-slice";
import useInput from "../../hooks/use-input";
import { loginAction } from "../../Store/login-slice";
import { message } from "antd";
import Logo from "../../assets/image/logo.png";

import { login } from "../../api";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let regex = /[-’/`~!#*$@%+=.,^&(){}[\]|;:”<>?\\]/g;

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordHasError,
    valueChangeHandler: enteredPasswordChangeHandler,
    inputBlurHandler: enteredPasswordBlurHandler,
  } = useInput((value) => value.trim().length > 6);

  const {
    value: enteredUsername,
    isValid: enteredUsernameIsValid,
    hasError: enteredUsernameHasError,
    valueChangeHandler: enteredUsernameChangeHandler,
    inputBlurHandler: enteredUsernameBlurHandler,
  } = useInput(
    (value) =>
      value.trim().length <= 15 &&
      value.trim().length >= 3 &&
      !value.includes(" ") &&
      !value.includes(".") &&
      !regex.test(value)
  );

  let formIsValid = false;

  if (enteredUsernameIsValid && enteredPasswordIsValid) {
    formIsValid = true;
  }

  const loginHandler = () => {
    if (formIsValid) {
      login(enteredUsername, enteredPassword)
        .then((res) => {
          console.log(res.data);
          if (res) {
            dispatch(
              loginAction.addLogin({
                username: res.data.user.userName,
                image_url: res.data.user.image_url,
                likes: res.data.user.likes,
                dislikes: res.data.user.dislike,
                reviews: res.data.user.reviews,
                ratings: res.data.user.ratings,
                _id: res.data.user._id,
                watchlist: res.data.user.watchlist,
              })
            );
            dispatch(loaderAction.changeLoaderStateFalse());
            message.success(" Login Successful ");
            navigate("/home");
          } else {
            message.error(" Redux error ");
          }
        })
        .catch((e) => {
          console.error("Error writing document: ", e);
          message.error(" Cannot Login ");
          dispatch(loaderAction.changeLoaderStateFalse());
        });
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 form-wrapper ">
      <div className=" md:w-[400px] flex flex-col rounded-2xl bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm shadow-2xl shadow-black ">
        <div className="text-center mt-4 p-2 ">
          <div className="flex items-center justify-center ">
            <img src={Logo} alt="Logo" className="h-[80px] w-auto" />
          </div>
          <h2 className="font-bold text-3xl tracking-tight ">
            Login to CINEFLIX
          </h2>
        </div>

        <div className="w-full max-w-xl p-2 ">
          <div className="flex flex-wrap mx-3 mb-4">
            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex flex-col">
                <label className="form-label relative block mb-1 text-white/50 focus-within:text-[#333]">
                  <BiUserCircle
                    className="label-icon 
                  transition pointer-events-none
                  [ w-6 h-6 ] text-white
                  [ absolute top-1/2 left-3 ] 
                  [ transform -translate-y-1/2 ]"
                  />

                  <input
                    id="email"
                    onChange={enteredUsernameChangeHandler}
                    onBlur={enteredUsernameBlurHandler}
                    value={enteredUsername}
                    className={`form-input 
                    block w-full rounded-lg leading-none focus:outline-none placeholder-white 
                    [ transition-colors duration-200 ] text-white
                    [ py-3 pr-3 md:py-4 md:pr-4 lg:py-4 lg:pr-4 pl-12 ] 
                    ${
                      enteredPasswordHasError
                        ? "[ bg-red-50 focus:bg-black/25 ] "
                        : "[ bg-black/20 focus:bg-black/25 ]"
                    }
                    [  focus:text-black ]`}
                    type="text"
                    placeholder="Username"
                  />
                </label>
                {enteredUsernameHasError && (
                  <p className="text-red-500 text-xs italic">
                    *Please Enter a valid Username.
                  </p>
                )}
              </div>
            </div>
            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex flex-col">
                <label className="form-label relative block mb-1 text-white/50 focus-within:text-[#333]">
                  <RiLockPasswordLine
                    className="label-icon 
                  transition pointer-events-none
                  [ w-6 h-6 ] text-white
                  [ absolute top-1/2 left-3 ] 
                  [ transform -translate-y-1/2 ]"
                  />
                  <input
                    id="password"
                    onChange={enteredPasswordChangeHandler}
                    onBlur={enteredPasswordBlurHandler}
                    value={enteredPassword}
                    className={`form-input 
                    block w-full rounded-lg leading-none focus:outline-none placeholder-white 
                    [ transition-colors duration-200 ] text-white
                    [ py-3 pr-3 md:py-4 md:pr-4 lg:py-4 lg:pr-4 pl-12 ] 
                    ${
                      enteredPasswordHasError
                        ? "[ bg-red-50 focus:bg-black/25 ] "
                        : "[ bg-black/20 focus:bg-black/25 ]"
                    }
                    [  focus:text-black ]`}
                    type="password"
                    placeholder="Password"
                  />
                </label>
                {enteredPasswordHasError && (
                  <p className="text-red-500 text-xs italic">
                    *Please Enter a valid Password.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full md:w-full px-3 mb-2 flex flex-row gap-1">
              <NavLink
                className="flex justify-center items-center appearance-none w-full text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight [ transform transition hover:-translate-y-1 ] active:bg-blue-200 bg-black cursor-pointer hover:bg-white hover:border-black hover:text-black"
                to="/signup"
              >
                Sign up
              </NavLink>
              <button
                className={` appearance-none block w-full  text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight [ transform transition  ]  ${
                  formIsValid
                    ? "bg-black cursor-pointer hover:-translate-y-1 hover:bg-white hover:border-black hover:text-black"
                    : "bg-gray-800"
                }`}
                disabled={!formIsValid}
                onClick={() => {
                  dispatch(loaderAction.changeLoaderStateTrue());
                  loginHandler();
                }}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
