import { userContext } from "@/context";
import { Button } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { supabase } from "services/supabaseClient";

export default function Joinpage() {
  const { user, setUser } = useContext(userContext);
  const [isloading, setisloading] = useState(true);
  const [chatRooms, setchatRooms] = useState([]);
  const router = useRouter();

  const fetchRooms = async () => {
    setisloading(true);
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setchatRooms(data);
    }
    setisloading(false);
  }
  useEffect(() => {
    if (!user) {
        setUser(localStorage.getItem("chat_user"));
        return;
      }
    
      if ((user && user.length > 0) || localStorage.getItem("chat_user")) {
        console.log('user found')
        fetchRooms();   
      } else {
        router.push("/");
      }
  
  }, [user])

  const handleJoinRoom = async (roomID) => {
    
    router.push(`/rooms/${roomID}`);

  }
  const handleLogout = async() => {
    console.log('Logging out');
    router.push("/");
    localStorage.removeItem("chat_user");
    setUser(null);
  }
  if(isloading)
  {
    return (
        <>
        <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center items-center h-screen bg-gray-900">
      <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 transition duration-300 delay-0"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-pink-400 to-yellow-300"></div>
          </div>

        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500"></div>
      </div>
      </>
    );
  }
  

  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-900">
        <div className="relative sm:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 transition duration-300 delay-0"
          >
            <div className="blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700"></div>
            <div className="blur-[106px] h-32 bg-gradient-to-r from-pink-400 to-yellow-300"></div>
          </div>
          
        <div className="fixed right-3 top-3 ">
           <Button onClick={handleLogout} colorScheme="red">Leave ChatApp</Button>
        </div>

          <div className="relative xl:container m-auto px-6 text-gray-500 md:px-12 ">
            <div className="m-auto space-y-8 sm:w-4/5 md:w-3/5 xl:w-2/5">
                <h2 className="mt-4 mb-8 text-3xl font-bold text-white text-center">
                  Welcome back to ChatApp.
                </h2>
            </div>
          </div>
          <div className="bg-white max-w-full md:max-w-2xl h-fit mx-auto p-2 rounded-md">
            <div className="my-4 text-center ">
                <p className="text-green-400 font-semibold text-2xl md:text-4xl">
                    Chat rooms
                </p>
            </div>

            <div className="my-2 text-center">
                <p className="text-indigo-600 text-lg md:text-xl">Choose among the below chat rooms to join</p>
            </div>

            <div className="my-2  flex flex-col items-center gap-2">
                {chatRooms.length > 0 && chatRooms.map((room) => (
                <div key={room.id} className="rounded-md shadow-md bg-gray-100 my-2 text-center flex items-center justify-between w-full px-4 py-3">
                <p className="text-indigo-600 text-lg md:text-xl font-medium">{room.name}</p>
                <Button colorScheme={"green"} onClick={() => handleJoinRoom(room.id)}>Join Room</Button>        
            </div>

                ))}
            </div>
            

          </div>
        </div>
      </div>
    </>
  );
}
