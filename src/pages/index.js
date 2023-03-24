import { userContext } from "@/context";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { supabase } from "services/supabaseClient";

export default function Home() {
  const { user, setUser } = useContext(userContext);
  const [username, setusername] = useState("");
  const router = useRouter();
  const handleUserLogin = async (e) => {
    e.preventDefault();
    console.log(username);

    if (username.trim() === "") {
      alert("Please enter a valid username");
      return;
    }
    //Generate 4 digit user id
    const id = Math.floor(1000 + Math.random() * 9000);
    
    const { data, error } = await supabase
    .from('users')
    .upsert({ id: id, username: username }, { onConflict: 'username' });
    if(error)
    {
      console.log('Error :',error);
    }
    else{
      const userName = username;
      setusername("");
      setUser(userName);
      localStorage.setItem("chat_user", userName);
      router.push(`/joinPage`);
  
    }
    

  };

  return (
    <>
      <Head>
        <title>Chat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col justify-center  dark:bg-gray-900">
        <div className="relative sm:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 transition duration-300 delay-0"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-pink-400 to-yellow-300"></div>
          </div>
          <div className="relative xl:container m-auto px-6 text-gray-500 md:px-12">
            <div className="m-auto space-y-8 sm:w-4/5 md:w-3/5 xl:w-2/5">
              <div className="p-8 md:py-12">
                {/* <img src="images/icon.svg" loading="lazy" className="w-10" alt="tailus logo" /> */}
                <h2 className="mt-20 mb-8 text-3xl font-bold text-gray-800 dark:text-white">
                  Welcome back to ChatApp.
                </h2>
                <form
                  onSubmit={handleUserLogin}
                  action=""
                  className="space-y-8"
                >
                  <div className="space-y-4">
                    <label
                      htmlFor="username"
                      className="text-gray-600 dark:text-gray-300"
                    >
                      Please give us a name
                    </label>
                    <div className="relative flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6 absolute left-4 inset-y-0 my-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        id="username"
                        autoComplete="username"
                        placeholder="Type your username here"
                        className="focus:outline-none block w-full rounded-full placeholder-gray-500   bg-gray-800 border-gray-600 pl-12 pr-4 h-12 text-gray-100 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-primary"
                      />
                      <div className="absolute right-1">
                        <button
                          type="submit"
                          className="relative flex h-10 w-10 sm:w-max ml-auto items-center justify-center sm:px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95"
                        >
                          <span className="hidden relative text-base font-semibold text-white  sm:block">
                            Next
                          </span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="relative w-5 h-5 text-white  sm:hidden"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="border-t border-gray-100 dark:border-gray-700 pt-6 text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account ?
                    <a href="#" className="text-primary">
                      Sign up
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}