import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const AboutMe = () => {

  return (
    <div>
   
        <div className=" h-[100vh] w-[100vw] flex items-center justify-center">
          <div className="transparent_blue px-7 mx-3 my-auto flex flex-col text-white p-6 rounded-lg max-w-[700px] w-full ">
            <h1 className=" sm:text-3xl text-5xl font-bold mb-6 self-center">About CHAT<span className='text-teal-300'>MATE</span></h1>
            <p className="text-lg mb-4">
              Welcome to <span className="font-bold">ChatMate</span>! Our platform allows you to connect with random people from around the world 
              Inspired by Omegle, our app focuses solely on text chat to keep the experience simple and engaging. By removing the pressure of video or audio, we make it easier for users to feel comfortable and express themselves freely.
            </p>
            <p className="text-lg mb-4 sm:hidden">
              We prioritize privacy, so none of your messages are stored on our servers. Once a conversation ends, it’s gone forever. Your chats remain completely anonymous and ephemeral.
            </p>
            <p className="text-lg mb-4">
              So, whether you're here to kill time, make new friends, or just see where random conversations take you, <span className="font-bold">ChatMate</span> is your go-to place for fun, anonymous chats!
            </p>
            <div className='flex justify-between mt-4 sm:flex-col  '>
            <Link to="/register" className='w-[49%] mx-auto sm:w-[70%] md:w-[70%]' >
                <button type="submit" className="flex sm:mb-4 self-center active:scale-[0.99]  items-center justify-center rounded-full bg-slate-600  px-12 h-12 hover:font-[600] py-1 text-[15px] w-[100%] font-medium leading-5 text-teal-300">
                        ChatNow
                </button>
            </Link>

            <Link to="/login" className='w-[49%] mx-auto sm:w-[70%] md:w-[70%]' >
                <button type="submit" className="flex self-center active:scale-[0.99]  items-center justify-center rounded-full bg-teal-600 px-12 h-12 hover:font-[600] py-1 text-[15px]  font-medium w-[100%] leading-5 text-white">
                          Login
                </button>
            </Link>
            </div>
          </div>
        </div>

    </div>
  );
};

export default AboutMe;
