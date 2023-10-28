import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { MdAlternateEmail } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { BiUserCircle } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { BiCloudUpload } from "react-icons/bi";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { storage } from "../../config/firebase.config";
import useInput from "../../hooks/use-input";
import Logo from "../../assets/image/logo.png";
import { loaderAction } from "../../Store/loader-slice";
import { message } from "antd";
import { createUser } from "../../api";

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userImageCover, setUserImageCover] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const {
    value: enteredFirstName,
    isValid: enteredFirstNameIsValid,
    hasError: enteredFirstNameHasError,
    valueChangeHandler: enteredFirstNameChangeHandler,
    inputBlurHandler: enteredFirstNameBlurHandler,
  } = useInput((value) => value.trim().length > 2);

  const {
    value: enteredPassword,
    isValid: enteredPasswordIsValid,
    hasError: enteredPasswordHasError,
    valueChangeHandler: enteredPasswordChangeHandler,
    inputBlurHandler: enteredPasswordBlurHandler,
  } = useInput((value) => value.trim().length > 6);

  const {
    value: enteredCPassword,
    isValid: enteredCPasswordIsValid,
    hasError: enteredCPasswordHasError,
    valueChangeHandler: enteredCPasswordChangeHandler,
    inputBlurHandler: enteredCPasswordBlurHandler,
  } = useInput((value) => value.trim().length > 6 && value === enteredPassword);

  let formIsValid = false;

  if (
    enteredPasswordIsValid &&
    enteredCPasswordIsValid &&
    enteredFirstNameIsValid
  ) {
    formIsValid = true;
  }

  const deleteFileObject = (url) => {
    setIsImageLoading(true);

    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {
      setUserImageCover(null);
      setIsImageLoading(false);
      message.success(" Successfully deleted ");
    });
  };

  const signupHandler = () => {
    createUser(enteredFirstName, enteredCPassword, userImageCover).then(
      (res) => {
        console.log(res);
        if (res) {
          dispatch(loaderAction.changeLoaderStateFalse());
          navigate("/login");
        }
      }
    );
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 form-wrapper ">
      <div className="md:w-[400px] flex flex-col rounded-2xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm shadow-2xl shadow-black ">
        <div className="text-center mt-4 p-2">
          <div className="flex items-center justify-center ">
            <img src={Logo} alt="Logo" className="h-20 w-20" />
          </div>
          <h2 className="font-bold text-3xl tracking-tight ">
            Register to IMDB
          </h2>
        </div>

        <div className="w-full max-w-xl p-2">
          <div className="flex flex-wrap mx-3 mb-4">
            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex flex-col">
                <label className="form-label relative block mb-1 text-black/50 focus-within:text-[#333]">
                  <MdDriveFileRenameOutline
                    className="label-icon 
                    transition pointer-events-none
                    [ w-6 h-6 ] text-white
                    [ absolute top-1/2 left-3 ] 
                    [ transform -translate-y-1/2 ]"
                  />
                  <input
                    id="firstname"
                    onChange={enteredFirstNameChangeHandler}
                    onBlur={enteredFirstNameBlurHandler}
                    value={enteredFirstName}
                    className={`form-input 
                      block w-full rounded-lg leading-none focus:outline-none placeholder-white
                      [ transition-colors duration-200 ] 
                      [ py-3 pr-3 md:py-4 md:pr-4 lg:py-4 lg:pr-4 pl-12 ] 
                      [ text-[#333]  focus:text-black ]
                      ${
                        enteredFirstNameHasError
                          ? "[ bg-red-50 focus:bg-black/25 ] "
                          : "[ bg-black/20 focus:bg-black/25 ]"
                      }
                    `}
                    type="text"
                    placeholder="Username"
                  />
                </label>
                {enteredFirstNameHasError && (
                  <p className="text-red-500 text-xs italic ">
                    *Please Enter a valid Username.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex flex-col">
                <label className="form-label relative block mb-1 text-black/50 focus-within:text-[#333]">
                  <RiLockPasswordFill
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
                    [ transition-colors duration-200 ] 
                    [ py-3 pr-3 md:py-4 md:pr-4 lg:py-4 lg:pr-4 pl-12 ] 
                    ${
                      enteredPasswordHasError
                        ? "[ bg-red-50 focus:bg-black/25 ] "
                        : "[ bg-black/20 focus:bg-black/25 ]"
                    }
                    [ text-[#333]  focus:text-black ]
                  `}
                    type="password"
                    placeholder="Password"
                  />
                </label>
                {enteredPasswordHasError && (
                  <p className="text-red-500 text-xs italic">
                    *Please Enter a 6 characters Password.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex flex-col">
                <label className="form-label relative block mb-1 text-black/50 focus-within:text-[#333]">
                  <RiLockPasswordLine
                    className="label-icon 
                  transition pointer-events-none
                  [ w-6 h-6 ] text-white
                  [ absolute top-1/2 left-3 ] 
                  [ transform -translate-y-1/2 ]"
                  />

                  <input
                    id="password"
                    onChange={enteredCPasswordChangeHandler}
                    onBlur={enteredCPasswordBlurHandler}
                    value={enteredCPassword}
                    className={`form-input 
                    block w-full rounded-lg leading-none focus:outline-none placeholder-white
                    [ transition-colors duration-200 ] 
                    [ py-3 pr-3 md:py-4 md:pr-4 lg:py-4 lg:pr-4 pl-12 ] 
                    ${
                      enteredCPasswordHasError
                        ? "[ bg-red-50 focus:bg-black/25 ] "
                        : "[ bg-black/20 focus:bg-black/25 ]"
                    }
                    [ text-[#333]  focus:text-black ]
                  `}
                    type="password"
                    placeholder="Confirm Password"
                  />
                </label>
                {enteredCPasswordHasError && (
                  <p className="text-red-500 text-xs italic">
                    *Please Enter a valid Confirm Password.
                  </p>
                )}
              </div>
            </div>

            <div className="w-full md:w-full px-3 mb-3">
              <div className="flex items-center justify-center ">
                <div className=" backdrop-blur-md w-60 h-60 rounded-md border-2 border-dotted border-black black/20 cursor-pointer p-4 mb-4">
                  {isImageLoading && (
                    <FileLoader progress={imageUploadProgress} />
                  )}

                  {!isImageLoading && (
                    <>
                      {!userImageCover ? (
                        <FileUploader
                          updateState={setUserImageCover}
                          setProgress={setImageUploadProgress}
                          isLoading={setIsImageLoading}
                        />
                      ) : (
                        <div className="relative w-full h-full overflow-hidden rounded-md">
                          <img
                            src={userImageCover}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                          <button
                            type="button"
                            className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out "
                            onClick={() => deleteFileObject(userImageCover)}
                          >
                            <MdDelete className="text-white " />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full md:w-full px-3 mb-2">
              <div className="flex flex-row gap-1">
                <button
                  className={`appearance-none block w-full  text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight ${
                    formIsValid
                      ? "bg-black cursor-pointer hover:-translate-y-1 hover:bg-white hover:border-black hover:text-black"
                      : "bg-gray-800"
                  }`}
                  disabled={!formIsValid}
                  onClick={() => {
                    dispatch(loaderAction.changeLoaderStateTrue());
                    signupHandler();
                  }}
                >
                  Sign Up
                </button>

                <NavLink
                  to="/login"
                  className="appearance-none flex items-center justify-center w-full bg-black text-gray-100 font-bold border border-gray-200 rounded-lg py-3 px-3 leading-tight hover:bg-white hover:border-black hover:text-black cursor-pointer"
                >
                  Login
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FileLoader = ({ progress }) => {
  const chdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: "#7DF9FF",
    borderRadius: 5,
    textAlign: "right",
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex justify-center items-center h-20 ">
        <div className="grid gap-2">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="w-72 h-7 bg-gray-300 border-5 rounded-md m-5">
        <div style={chdiv}>
          <span className="text-xl font-semibold text-black p-2">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const FileUploader = ({
  updateState,
  setProgress,
  setUserImage,
  isLoading,
}) => {
  const uploadFile = (e) => {
    isLoading(true);
    let uploadedFile;

    uploadedFile = e.target.files[0];

    const storageRef = ref(
      storage,
      `Images/${Date.now()}-${uploadedFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateState(downloadURL);
          isLoading(false);
        });
      }
    );
  };

  return (
    <label>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <p className="font-bold text-2xl">
            <BiCloudUpload className="w-12 h-12 text-white" />
          </p>
          <p className="text-lg text-center text-white">
            Click to Upload an Profile Image
          </p>
        </div>
      </div>
      <input
        type="file"
        name="upload-file"
        accept={"image/*"}
        className={"w-0 h-0"}
        onChange={uploadFile}
      />
    </label>
  );
};
