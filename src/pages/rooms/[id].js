import { userContext } from "@/context";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { supabase } from "services/supabaseClient";
import { AiOutlineSend } from 'react-icons/ai';

export async function getServerSideProps(context) {
  let roomID = context.params.id;
  return { props: { roomID: roomID } };
}
export default function Home({roomID}) {
  
  const { user, setUser } = useContext(userContext);
  const [roomDetails, setroomDetails] = useState(null);
  const [messages, setmessages] = useState([]);
  const [isloading, setisloading] = useState(true);
  const [sentMessage, setsentMessage] = useState("");
  const messagesRef = useRef(null);
  const router = useRouter();


  const fetchRoomDetails = async (roomID) => {
    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomID)
      .single();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      setroomDetails(data);
    }
    setisloading(false);
  }
  const fetchMessages = async (roomID) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomID)
      .order("timestamp", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      //console.log(data);
      // const details = {room: data[0]?.room, roomID:data[0]?.room_id};
      // setroomDetails(details);
      setmessages(data);
      
    }
    setisloading(false);
    // if(messagesRef.current)
    // { console.log('scrolling to bottom')
    //   // messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    //   // //Scroll to latest message at bottom
    //   messagesRef.current.scrollTo();
    //   messagesRef.current.scrollIntoView({ behavior: "smooth" });

    // }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sentMessage.trim() === "") {
      return;
    }
    if (!user) {
      return;
    }
    //generate random 5 digit id
    const id = Math.floor(10000 + Math.random() * 90000);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log("timestamp", timestamp);
    const { data, error } = await supabase
      .from("messages")
      .insert({id:id,content:sentMessage,sender_username:user,room:roomDetails.name,timestamp:timestamp, room_id:roomDetails.id }).single();

    if (error) {
      console.log("Error sending message:", error.message);
    }
    setsentMessage("");
  };

  useEffect(() => {
    if (!user) {
      setUser(localStorage.getItem("chat_user"));
      return;
    }
  
    if ((user && user.length > 0) || localStorage.getItem("chat_user")) {
      fetchRoomDetails(roomID);
      fetchMessages(roomID);
    } else {
      router.push("/");
    }
    
    // Return function to unsubscribe from realtime subscription

}, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    console.log('Run subscription');
    const subscription = supabase
    .channel("public:messages")
    .on("postgres_changes",{ event: '*', schema: 'public', table: 'messages' }, (payload) => {
        console.log('Payload: ',payload);
        // Update messages state on new message
      setmessages((messages) => [...messages, payload.new]);
    })
    .subscribe();
    

  // return a cleanup function to unsubscribe from the updates when the component is unmounted
  return () => {
    subscription.unsubscribe();
  };
  }, [user])

  
const handleLeaveRoom = async () => {
    //localStorage.removeItem("chat_user");
    //setUser(null);
    router.push("/joinPage");
}
useEffect(() => {
  if(messages && messages.length > 0)
  {
    if (messagesRef.current) {
      console.log('Scrolling down')
      
      messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight);
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }
  
}, [messages]);


function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function dateFormat(date) {
  return new Date(
    date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
  );
}

var prevDate = null;
var messageDiv = null;


  return (
    <>
			<Head>
				<title>Chat</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='min-h-screen flex flex-col items-center justify-center bg-gray-900'>
				<div className='relative w-full'>
					<div className='absolute inset-0 grid grid-cols-2 -space-x-52 opacity-40 transition duration-300 delay-0'>
						<div className='blur-[106px] h-56 bg-gradient-to-br from-primary to-purple-400 dark:from-blue-700'></div>
						<div className='blur-[106px] h-32 bg-gradient-to-r from-pink-400 to-yellow-300'></div>
					</div>

					<div className='fixed right-3 top-3 '>
						<button
							type='button'
							onClick={handleLeaveRoom}
							className='bg-orange-500 text-black hover:bg-orange-600 hover:text-white hover:border-transparent transition ease-in duration-200 transform hover:-translate-y-1 active:translate-y-0  p-2 rounded-lg text-center font-semibold  group relative overflow-hidden '
						>
							Leave Room
						</button>
					</div>
					<div className='relative w-3/4 mx-auto flex flex-col h-[90vh] max-w-[800px] overflow-auto border border-white  rounded-lg shadow-lg'>
						{/* <!-- Chat header --> */}
						<div className='bg-slate-900 py-4 px-4 rounded-t-lg '>
							<h1 className='text-xl font-bold text-indigo-400 text-center '>
								{roomDetails?.name || 'Chat Room'}
							</h1>
						</div>

						{/* <!-- Chat messages --> */}
						<div className='flex-1 p-4 overflow-y-auto chat-message-screen justify-center items-center' ref={messagesRef}>
							{isloading && (
								<div className='animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 mx-auto'></div>
							)}

							<div
								className='flex flex-col space-y-2 list-none overflow-hidden overflow-y-auto'
							>
								{messages &&
									messages.length > 0 &&
									messages.map((message) => {
										const timestamp = message.timestamp;
										const date = new Date(timestamp);
										if (message.sender_username == user) {
											messageDiv = (
												<div
													key={message.id}
													className='bg-slate-900 border border-white border-opacity-40 flex flex-col items-end gap-1 rounded-lg p-2 w-fit self-end cursor-pointer transition duration-150 hover:scale-105'
												>
													<p className='text-white font-semibold self-center'>
														{message.content}
													</p>
													<p className='text-gray-400 text-xs text-right self-end'>
														{formatAMPM(date)}
													</p>
												</div>
											);
										} else {
											messageDiv = (
												<div
													key={message.id}
													className='bg-slate-900 border border-white border-opacity-40 flex flex-col items-end gap-1 rounded-lg p-2 w-fit cursor-pointer hover:scale-110 transition duration-150'
												>
													<p className='text-indigo-500 font-semibold self-center'>
														{message.content}
													</p>
													<p className='text-gray-400 text-xs text-right'>
														{formatAMPM(date)}
													</p>
												</div>
											);
										}
										if (
											!prevDate ||
											prevDate < dateFormat(date)
										) {
											prevDate = dateFormat(date);
											return (
												<>
													<div className='bg-gray-100 px-2 py-1 border border-white rounded-md border-opacity-40 w-fit self-center cursor-pointer transition duration-150 hover:scale-105'>
														{date.getDate() +
															'/' +
															date.getMonth() +
															'/' +
															date.getFullYear()}
													</div>
													{messageDiv}
												</>
											);
										} else {
											return <>{messageDiv}</>;
										}
									})}

								{!isloading &&
									messages &&
									messages.length == 0 && (
										<div className='flex flex-col items-center mx-auto justify-center gap-1 rounded-lg p-2 w-fit self-end cursor-pointer transition duration-150 hover:scale-105'>
											<p className='text-black text-center font-semibold'>
												No messages yet
											</p>
										</div>
									)}
							</div>
						</div>

						{/* <div ref={messagesRef} className='w-full h-0 hidden' /> */}
						{/* <!-- Chat input --> */}
						<form
							onSubmit={handleSubmit}
							className='bg-gray-900 backdrop-blur-md p-3 rounded-b-lg flex gap-2 justify-center items-center'
						>
							<input
								type='text'
								value={sentMessage}
								onChange={(e) => setsentMessage(e.target.value)}
								className='w-full border border-gray-300 rounded-full p-3 text-white bg-gray-800 backdrop-blur-md '
								placeholder='Type your message...'
							/>
							<button type='submit' className='p-2 cursor-pointer '>
								<AiOutlineSend fontSize='large' color='white' className="text-white hover:text-gray-200 transition duration-150" />
							</button>
						</form>
					</div>
				</div>
			</div>
		</>
  );



}

