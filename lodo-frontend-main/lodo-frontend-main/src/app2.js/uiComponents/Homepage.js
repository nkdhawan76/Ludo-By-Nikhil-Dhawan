import React, { useEffect, useRef, useState } from "react";
import "../css/layout.css";
import css from "../Modulecss/Home.module.css";
import axios from "axios";
import { NavLink, useLocation } from "react-router-dom";
import Swal from "sweetalert2";


import BetCard from "./BetCard";
import RunningCard from "./RunningCard";
import DummyRunningCard from "./DummyRunningCard";

import Header from "../Components/Header";
//import { Alert } from "@mui/material";

export default function Homepage({walletUpdate}) {
  //const history = useHistory();

//   //Dummy running tables code start
//   let dummyTables = [];
//   let createDummyTables = async()=>{
//     console.log("in create dummy tables");
//     // while(true)
//     // {
      
//       await setTimeout( function() {
//         console.log("2 seconds loop");
//      }, 2000);
//     // }

//   }
//   let dummyTableUserId = "6559fda3b7ce915f4a50d179";
//   let dummyTableObject = {
//     "_id": "656d99447c81ec618aa6ebd9",
//     "Table_id": null,
//     "Game_type": "Ludo Classics",
//     "Game_Ammount": 50,
//     "Room_code": "111",
//     "Created_by": {
//         "_id": "6559fda3b7ce915f4a50d179",
//         "Name": "WciVv",
//         "Phone": 9782915908
//     },
//     "Accepetd_At": null,
//     "action_by": null,
//     "actionby_Date": null,
//     "Status": "running",
//     "Status_Update_By": null,
//     "Status_Reason": null,
//     "Creator_Status": null,
//     "Creator_Status_Reason": null,
//     "Creator_Screenshot": null,
//     "Creator_Status_Updated_at": null,
//     "Acceptor_status": null,
//     "Acceptor_status_reason": null,
//     "Acceptor_screenshot": null,
//     "Acceptor_status_Updated_at": null,
//     "Acceptor_by_Creator_at": "2023-12-04T09:19:22.031Z",
//     "Acceptor_seen": true,
//     "Room_join": false,
//     "Room_Status": "active",
//     "Winner_closingbalance": 9735,
//     "Loser_closingbalance": 190,
//     "creatorWithdrawDeducted": 50,
//     "acceptorWithdrawDeducted": 50,
//     "winnAmount": null,
//     "room_Code_shared": "2023-12-04T09:17:56.173Z",
//     "createdAt": "2023-12-04T09:17:56.174Z",
//     "updatedAt": "2023-12-04T09:19:30.570Z",
//     "__v": 0,
//     "Accepetd_By": {
//         "_id": "655b58a63b259a7d965c3b67",
//         "Name": "bYjjc",
//         "Phone": 9782915909
//     }
// }

//   //Dummy running tables code ends
//   // createDummyTables();

  let userID=useRef();
  const isMounted= useRef(true);
  const beckendLocalApiUrl = process.env.REACT_APP_BACKEND_LOCAL_API;
  const beckendLiveApiUrl = process.env.REACT_APP_BACKEND_LIVE_API;
  const socketLocalApiUrl = process.env.REACT_APP_SOCKET_LOCAL_API;
  const socketLiveApiUrl = process.env.REACT_APP_SOCKET_LIVE_API;
  const nodeMode = process.env.NODE_ENV;
  var socketUrl;
  if (nodeMode === "development") {
    var baseUrl = beckendLocalApiUrl;
    socketUrl = socketLocalApiUrl;
  } else {
    baseUrl = beckendLiveApiUrl;
    socketUrl = socketLiveApiUrl;
  }
  console.log(socketUrl, "socket");
  /// user details start

  const [user, setUser] = useState();
  const [created,setCreated]=useState([]);
  const [socket, setSocket] = useState();
  
  const [userAllData, setUserAllData] = useState()

  const role = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    await axios.get(baseUrl+`me`, { headers }).then((res) => {
      setUser(res.data._id);
      setUserAllData(res.data)
      userID.current=res.data._id;
      setMount(true);
    })
    .catch(e=>{
      if (e.response && e.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('token');
        window.location.reload()
        setTimeout(() => {
          //  history.push("/login")
        }, 500);
      }
      if (e.response && (e.response.status === 400 || e.response.status === 429)) {
        Swal.fire({
          title: 'Please refresh!',
          icon: "warning",
          confirmButtonText: "OK",
        });
      }
    })
  };

  /// user details end

  const [game_type, setGame_type] = useState(
    useLocation().pathname.split("/")[2]
  );
  const [Game_Ammount, setGame_Ammount] = useState();

  //   console.log(game_type);

  const ChallengeCreate = (e) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .post(
        baseUrl+`challange/create`,
        {
          Game_Ammount,
          Game_type: game_type,
        },
        { headers }
      )
      .then((res) => {
        if(res.data.msg==='you can not create same amount challenge.')
        {
          Swal.fire({
            title: 'you can not create same amount challenge.',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (res.data.msg === "you have already enrolled") {
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }else if (res.data.msg === "You can set maximum 2 battle.") {
          Swal.fire({
            title: "You can set maximum 2 battle.",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (res.data.msg === "Insufficient balance") {
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Game amount should be Greater then 50 and less then 10000"
        ) {
          Swal.fire({
            title: "Game amount should be Greater then 50 and less then 10000",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Set Battle in denomination of 50"
        ) {
          Swal.fire({
            title: "Set Battle in denomination of 50",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else if (
          res.data.msg ===
          "Technical Issue, Try after an hour!"
        ) {
          Swal.fire({
            title: "Technical Issue, Try after an hour!",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        else {
          // Allgames();
          socket.emit("gameCreated");

        }
      })
      .catch((e) => {
        if (e.response && e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status === 400 || e.response.status === 429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        console.log(e)
      });
  };

  const [allgame, setallgame] = useState([]);
  const [mount,setMount]=useState(false);
  //const [ALL, setALL] = useState();
  const [runningGames, setRunningGames] = useState();
  const [ownRunning,setOwnRunning]=useState([]);
  const [dummyRunning, setDummyRunning]=useState();


  const dummyGames = async() => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl+`dummychallenge/running/all`, { headers })
      .then((res) => {
        let dummyRunningGames=[],remainingRunning=[];
        res.data.forEach(function (ele) {
          console.log("dummy running ele", ele)
          dummyRunningGames.push(ele)
        });
        console.log("all dummyRunning", dummyRunningGames);
        setDummyRunning(dummyRunningGames);
        console.log("after setting dummyRunning", dummyRunningGames);


      })
      .catch((e)=>{
        console.log('error in getting dummy running',e)
        if (e.response && e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
          //    setTimeout(() => {
          // //  history.push("/login")
          // }, 500);
        }
          if (e.response && (e.response.status === 400||e.response.status === 429)) {
            Swal.fire({
              title: 'Please refresh!',
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
      })
  }

  const Allgames = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl+`challange/all`, { headers })
      .then((res) => {
        let owenedCreated=[],remainingGame=[];
        res.data.forEach(function (ele) {
            if((ele.Created_by._id===user)&&(ele.Status==="new"||ele.Status==="requested"))
            {
              owenedCreated.push(ele);
            }
            else{
              remainingGame.push(ele);
            }
          })
        setCreated(owenedCreated);
        setallgame(remainingGame);
      })
      .catch(e=>{
        if (e.response && e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status === 400 || e.response.status === 429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      })
  };

  const runningGame = async () => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .get(baseUrl+`challange/running/all`, { headers })
      .then((res) => {
        let owenedRunning=[],remainingRunning=[];
        res.data.forEach(function (ele) {
          console.log("running ele", ele)
          if(ele.Created_by&&ele.Accepetd_By)
          if((ele.Created_by._id === userID.current) || (ele.Accepetd_By._id === userID.current))
          {
            owenedRunning.push(ele);
          }
          else{
            remainingRunning.push(ele);
          }
        });
        
        setOwnRunning(owenedRunning);
        setRunningGames(remainingRunning);
      })
      .catch((e)=>{
        console.log('errror',e)
        if (e.response && e.response.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
          //    setTimeout(() => {
          // //  history.push("/login")
          // }, 500);
        }
          if (e.response && (e.response.status === 400||e.response.status === 429)) {
            Swal.fire({
              title: 'Please refresh!',
              icon: "warning",
              confirmButtonText: "OK",
            });
          }
      })
  };
  
  function winnAmount(gameAmount) {
    let profit = null;
    if (gameAmount >= 50 && gameAmount <= 250)
      profit = gameAmount * 10 / 100;
    else if (gameAmount > 250 && gameAmount <= 500)
      profit = 25;
    else if (gameAmount > 500)
      profit = gameAmount * 5 / 100;
    return gameAmount - profit;
  }
 
useEffect(() => {
    WebSocket.prototype.emit= function (event,data) { 
      if(this.readyState===WebSocket.OPEN)
      this.send(JSON.stringify({event,data}))
   }
    WebSocket.prototype.listen= function (eventName,callback) {  
      this._socketListeners = this._socketListeners ||  {}
      this._socketListeners[eventName] = callback
    }
      let socket = new WebSocket(socketUrl);
      function openFunc() {
        socket.onopen = ()=>{
          console.log('websocket is connected 👍');
          setSocket(socket);
          socket.pingTimeout = setTimeout(() => {
            socket.close();
            setSocket(undefined);
          }, 30000 + 1000);
        }
      }
    
    function listenFunc() {
      socket.onmessage = function (e) {
        try {
            const {event, data} = JSON.parse(e.data)
            socket._socketListeners[event](data);
        } catch (error) {
          console.log(error);
        }
      }

      socket.listen('ping',(data)=>{
        socket.emit('pong',2)
        clearTimeout(socket.pingTimeout);
        socket.pingTimeout = setTimeout(() => {
          console.log('ping terminate works 🏩');
          socket.close();
          setSocket(undefined);
        }, 30000 + 1000);
      })
  socket.listen("recieveGame", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id===userID.current)&&(ele.Status==="new"||ele.Status==="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        });
        // console.log('own',owenedCreated,'remiain',remainingGame);
      setCreated(owenedCreated);
      setallgame(remainingGame);
    });

  socket.listen("updateRunning", (data) => {
    let owenedCreated=[],remainingGame=[];
    data.forEach(function (ele) {
        if(ele.Created_by)
      if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
      {
          owenedCreated.push(ele);
        }
        else{
          remainingGame.push(ele);
        }
      });
    setCreated(owenedCreated);
    setallgame(remainingGame);
      walletUpdate();
  });

  socket.listen("acceptor_seen", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.openBattle.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        });
      setCreated(owenedCreated);
      setallgame(remainingGame);
      let owenedRunning=[],remainingRunning=[];
      data.runningBattle.forEach(function (ele) {
          if(ele.Created_by&&ele.Accepetd_By)
        if((ele.Created_by._id==userID.current)||(ele.Accepetd_By._id==userID.current))
        {
          owenedRunning.push(ele);
        }
        else{
          remainingRunning.push(ele);
        }
      });
      setOwnRunning(owenedRunning);
      setRunningGames(remainingRunning);
      walletUpdate();
  });

  socket.listen("resultUpdateReq", (data) => {
    let owenedRunning=[],remainingRunning=[];
    data.forEach(function (ele) {
        if(ele.Created_by&&ele.Accepetd_By)
      if((ele.Created_by._id==userID.current)||(ele.Accepetd_By._id==userID.current))
      {
        owenedRunning.push(ele);
      }
      else{
        remainingRunning.push(ele);
      }
    });
    setOwnRunning(owenedRunning);
    setRunningGames(remainingRunning);
      walletUpdate();
  });

  socket.listen("startAcepptor", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.forEach(function (ele) {
          if(ele.Created_by)
          if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
          {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        })
      setCreated(owenedCreated);
      setallgame(remainingGame);
      walletUpdate();
  });

  socket.listen("challengeAccepted", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        })
      setCreated(owenedCreated);
      setallgame(remainingGame);
  });

  socket.listen("updateReject", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        })
      setCreated(owenedCreated);
      setallgame(remainingGame);
  });

  socket.listen("ongoingChallenge", (data) => {
    let owenedCreated=[],remainingGame=[];
    data.openBattle.forEach(function (ele) {
        if(ele.Created_by)
      if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
      {
          owenedCreated.push(ele);
        }
        else{
          remainingGame.push(ele);
        }
      });
    setCreated(owenedCreated);
    setallgame(remainingGame);
    let owenedRunning=[],remainingRunning=[];
    data.runningBattle.forEach(function (ele) {
        if(ele.Created_by&&ele.Accepetd_By)
      if((ele.Created_by._id==userID.current)||(ele.Accepetd_By._id==userID.current))
      {
        owenedRunning.push(ele);
      }
      else{
        remainingRunning.push(ele);
      }
    });
    setOwnRunning(owenedRunning);
    setRunningGames(remainingRunning);
  });
  
  socket.listen("updateDelete", (data) => {
      let owenedCreated=[],remainingGame=[];
      data.forEach(function (ele) {
          if(ele.Created_by)
        if((ele.Created_by._id==userID.current)&&(ele.Status=="new"||ele.Status=="requested"))
        {
            owenedCreated.push(ele);
          }
          else{
            remainingGame.push(ele);
          }
        })
      setCreated(owenedCreated);
      setallgame(remainingGame);
  });
 }
 function closeFunc() {
  socket.onclose = ()=> {
    console.log('socket disconnected wow 😡');
    if(isMounted.current)
    {
      clearTimeout(socket.pingTimeout);
      setSocket(undefined);
      socket = new WebSocket(socketUrl);
      openFunc();
      listenFunc();
      closeFunc();
    }
  }
}
    openFunc();
    listenFunc();
    closeFunc();
    
  return ()=>{
    isMounted.current=false;
    clearTimeout(socket.pingTimeout);
    setSocket(undefined);
    socket.close();
  }
}, [])

  useEffect(() => {

    let access_token = localStorage.getItem('token');
    access_token = localStorage.getItem('token');
    if(!access_token)
    {
        window.location.reload()
           setTimeout(() => {
          //  history.push("/login")
        }, 500);;
    }
    role();
    if(mount)
    {
      Allgames();
      runningGame();
      dummyGames();
    }
   
  }, [mount]);
  //accept Challange

  const AcceptChallang = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };
    axios
      .put(
        baseUrl+`challange/accept/${id}`,
        {
          Accepetd_By: headers,
          Acceptor_by_Creator_at: Date.now(),
        },
        {
          headers,
        }
      )
      .then((res) => {
        if (res.data.msg === "you have already enrolled") {
          Swal.fire({
            title: "You have already enrolled",
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
        if (res.data.msg === "Insufficient balance") {
          Swal.fire({
            title: "Insufficient balance",
            icon: "warning",
            confirmButtonText: "OK",
          });
        } else {
          Allgames(res.data);
          socket.emit("acceptGame");
        }
      })
      .catch((e) => {
        console.log(e)
        if (e.response && e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status == 400||e.response.status==429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //reject Game
  const RejectGame = (id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl+`challange/reject/${id}`,
        {
          Accepetd_By: null,
          Status: "new",
          Acceptor_by_Creator_at: null,
        },
        { headers }
      )
      .then((res) => {

        socket.emit("gameRejected");
      })
      .catch((e) => {
        console.log(e);
        if (e.response && e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status == 400||e.response.status==429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  //delete
  const deleteChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .delete(baseUrl+`challange/delete/${_id}`, { headers })
      .then((res) => {
        socket.emit("deleteGame", _id);
      })
      .catch((e) => {
        //console.log(e);
        if (e.response && e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status == 400||e.response.status==429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }
      });
  };

  ///challange/running/update/

  const updateChallenge = (_id) => {
    const access_token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${access_token}`,
    };

    axios
      .put(
        baseUrl+`challange/running/update/${_id}`,
        {
          Acceptor_seen: true,
        },
        { headers }
      )
      .then((res) => {
        socket.emit("game_seen");
      })
      .catch((e) => {
        if (e.response && e.response.status == 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('token');
          window.location.reload()
             setTimeout(() => {
          //  history.push("/login")
        }, 500);
        }
        if (e.response && (e.response.status == 400||e.response.status==429)) {
          Swal.fire({
            title: 'Please refresh!',
            icon: "warning",
            confirmButtonText: "OK",
          });
        }        
        console.log(e)
      });
  };

  // const [roomCode, setRoomCode] = useState()

  const getPost = async (Id) => {
    if (game_type === 'Ludo Classics' || game_type === 'Ludo 1 Goti' || game_type === 'Ludo Ulta') {
      socket.emit('roomCode', { game_id: Id, status: 'running' })
      
    }
    else if(game_type==='Ludo Popular') {
      socket.emit('popularroomCode', { game_id: Id, status: 'running' })

     
    }
  }



  return (
    <>
        <Header user={userAllData} />
      <div className="leftContainer" style={{ minHeight:'100vh' }}>
        
        <div className={css.mainArea} style={{ paddingTop: "60px",minHeight:'100vh' }}>
<div style={{ padding: '16px', fontFamily: 'Arial, sans-serif' }}>
  {/* Box 1 */}
  <div
    style={{
      backgroundColor: '#FFECEC',
      padding: '10px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '14px',
      marginBottom: '10px',
      color: '#D8000C'
    }}
  >
    <span style={{ fontSize: '18px', marginRight: '8px' }}>❗</span>
    <span>
      अगर कोई ऑटो छोड़ता है तो उसके पेनल्टी लगाई जाएगी Instant withdrawal 24x7 Support
    </span>
  </div>

  {/* Box 2 */}
  <div
    style={{
      backgroundColor: '#FFECEC',
      padding: '10px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'flex-start',
      fontSize: '14px',
      color: '#D8000C'
    }}
  >
    <span style={{ fontSize: '18px', marginRight: '8px' }}>❗</span>
    <span>
      Loss होने पर रिजल्ट डाल नही दी तो पेनल्टी लगाई जाएगी Instant Withdraw
    </span>
  </div>

<span style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '16px', display: 'inline-block' }}>
  CREATE A BATTLE!
</span>

<div style={{ display: 'flex', marginTop: '10px', width: '100%'}}>
  <input
    type="tel"
    placeholder="Enter Amount"
    onChange={(e) => setGame_Ammount(e.target.value)}
    style={{
      flex: 1,
      padding: '12px',
      fontSize: '14px',
      border: '1px solid #E0CACA',
      borderTopLeftRadius: '10px',
      borderBottomLeftRadius: '10px',
      borderTopRightRadius: '0',
      borderBottomRightRadius: '0',
      outline: 'none'
    }}
  />

  <button
    onClick={(e) => {
      e.preventDefault();
      ChallengeCreate();
    }}
    style={{
      backgroundColor: '#6495ED',
      color: 'white',
      padding: '12px 50px',
      fontWeight: 'bold',
      border: 'none',
      borderTopRightRadius: '10px',
      borderBottomRightRadius: '10px',
      cursor: 'pointer'
    }}
  >
    Set
  </button>
</div>


          {/* <span className={`${css.cxy} ${css.battleInputHeader} mt-4`}>
            Create a Battle!
          </span>

          <div className="mx-auto d-flex my-2 w-50">
            <div>
              <input
                className={css.formControl}
                type="tel"
                placeholder="Amount"
                onChange={(e) => setGame_Ammount(e.target.value)}
              />
            </div>

            <div className="set ml-1 ">
              {" "}
              <button
                className={`bg-green ${css.playButton} cxy m-1 position-static `}
                style={{ margin: "20px !important" }}
                onClick={(e) => {
                  e.preventDefault();
                  ChallengeCreate();
                }}
              >
                Set
              </button>
            </div>

           
          </div> */}
          <div className={css.dividerX}></div>

          <div className="px-4 py-3">
            <div className="mb-3">
              <img
                src={process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"}
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Open Battles
              </span>
              <span
                className={`${css.gamesSectionHeadline} text-uppercase position-absolute mt-2 font-weight-bold`}
                style={{ right: "1.5rem" }}
              >
                Rules
                <NavLink to="/Rules">
                  <img
                    className="ml-2"
                    src={process.env.PUBLIC_URL + "/Images/Homepage/info.png"}
                    alt=""
                  />
                </NavLink>
              </span>
            </div>
            
           
            {created &&
              created.map((allgame) => 
              (allgame.Game_type == game_type)&&
                 (
                    <BetCard key={allgame._id} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                  )
                )}
            {allgame &&
              allgame.map((allgame) => 
               (
                  (allgame.Status=="new"||
                  (allgame.Status == "requested" && (user == allgame.Created_by._id || user == allgame.Accepetd_By._id))||
                  (allgame.Status == "running" && user == allgame.Accepetd_By._id && allgame.Acceptor_seen == false)) 
                  && allgame.Game_type == game_type
                )&&
                 (
                  <BetCard key={allgame._id} allgame={allgame} user={user} deleteChallenge={deleteChallenge} getPost={getPost} RejectGame={RejectGame} winnAmount={winnAmount} AcceptChallang={AcceptChallang} updateChallenge={updateChallenge} />
                  )
                )}
          </div>
          <div className={css.dividerX}></div>
          <div className="px-4 py-3">
            <div className="mb-2">
              <img
                src={
                  process.env.PUBLIC_URL + "/Images/Homepage/battleIcon.png"
                }
                alt=""
                width="20px"
              />
              <span className={`ml-2 ${css.gamesSectionTitle}`}>
                Running Battles
              </span>
            </div>
            {ownRunning&&ownRunning.map((runnig)=>{
              if (((user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending")) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" )))||runnig.Status=="conflict") && runnig.Game_type == game_type)
              return (
                <RunningCard key={runnig._id} runnig={runnig} user={user} winnAmount={winnAmount} />
              );
            })}


            {runningGames &&
              runningGames.map((runnig) => {
                if (((user == runnig.Accepetd_By._id || user == runnig.Created_by._id) ? (user == runnig.Accepetd_By._id ? ((runnig.Status === "running" && user == runnig.Accepetd_By._id && runnig.Acceptor_seen == true) || (runnig.Status === "pending" && runnig.Acceptor_status == null)) : ((runnig.Status === "running" && user == runnig.Created_by._id) || (runnig.Status === "pending" && runnig.Creator_Status == null))) : (runnig.Status === "running" || runnig.Status === "pending")) && runnig.Game_type == game_type)
                  return (
                    <RunningCard key={runnig._id} runnig={runnig} user={user} winnAmount={winnAmount} />
                  );
              })}
{/* dummy table Starts */}

            {dummyRunning&&dummyRunning.map((runnig)=>{
              if(game_type === 'Ludo Classics')
              return (
                <DummyRunningCard key={runnig._id} runnig={runnig} user={user} winnAmount={winnAmount} />
              );
            })}
{/* dummy table Starts */}

          </div>
          </div>
        </div>
      </div>

    </>
  );
}