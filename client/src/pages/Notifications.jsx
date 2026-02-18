// // import React, { useEffect, useState } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import "../styles/notification.css";
// // import Empty from "../components/Empty";
// // import Footer from "../components/Footer";
// // import Navbar from "../components/Navbar";
// // import fetchData from "../helper/apiCall";
// // import { setLoading } from "../redux/reducers/rootSlice";
// // import Loading from "../components/Loading";
// // import "../styles/user.css";

// // const Notifications = () => {
// //   const [notifications, setNotifications] = useState([]);
// //   const dispatch = useDispatch();
// //   const { loading } = useSelector((state) => state.root);

// //   const getAllNotif = async (e) => {
// //     try {
// //       dispatch(setLoading(true));
// //       const temp = await fetchData(`/notification/getallnotifs`);
// //       dispatch(setLoading(false));
// //       setNotifications(temp);
// //     } catch (error) {}
// //   };

// //   useEffect(() => {
// //     getAllNotif();
// //   }, []);

// //   return (
// //     <>
// //       <Navbar />
// //       {loading ? (
// //         <Loading />
// //       ) : (
// //         <section className="container notif-section">
// //           <h2 className="page-heading">Your Notifications</h2>

// //           {notifications.length > 0 ? (
// //             <div className="notifications">
// //               <table>
// //                 <thead>
// //                   <tr>
// //                     <th>S.No</th>
// //                     <th>Content</th>
// //                     <th>Date</th>
// //                     <th>Time</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {notifications?.map((ele, i) => {
// //                     return (
// //                       <tr key={ele?._id}>
// //                         <td>{i + 1}</td>
// //                         <td>{ele?.content}</td>
// //                         <td>{ele?.updatedAt.split("T")[0]}</td>
// //                         <td>{ele?.updatedAt.split("T")[1].split(".")[0]}</td>
// //                       </tr>
// //                     );
// //                   })}
// //                 </tbody>
// //               </table>
// //             </div>
// //           ) : (
// //             <Empty />
// //           )}
// //         </section>
// //       )}
// //       <Footer />
// //     </>
// //   );
// // };

// // export default Notifications;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import Empty from "../components/Empty";
// import Loading from "../components/Loading";
// import "../styles/notification.css";

// axios.defaults.baseURL = "http://localhost:5002/api";

// const Notifications = () => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getAllNotifications = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem("token");
      
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       const { data } = await axios.get("/notification/getallnotifs", {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       setNotifications(data);
      
//       // Mark as seen
//       await axios.put("/notification/mark-seen", {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setLoading(false);
//     } catch (error) {
//       console.error(error);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getAllNotifications();
    
//     // Refresh notifications every 30 seconds
//     const interval = setInterval(getAllNotifications, 30000);
    
//     return () => clearInterval(interval);
//   }, []);

//   const getNotificationIcon = (type) => {
//     switch(type) {
//       case 'appointment': return '📅';
//       case 'doctor_application': return '👨‍⚕️';
//       default: return '📢';
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) return <Loading />;

//   return (
//     <>
//       <Navbar />
//       <section className="notifications-section">
//         <h2 className="page-heading">Notifications</h2>

//         {notifications.length > 0 ? (
//           <div className="notifications-list">
//             {notifications.map((notification) => (
//               <div 
//                 key={notification._id} 
//                 className={`notification-item ${!notification.seen ? 'unread' : ''}`}
//               >
//                 <div className="notification-icon">
//                   {getNotificationIcon(notification.type)}
//                 </div>
//                 <div className="notification-content">
//                   <p>{notification.content}</p>
//                   <span className="notification-time">
//                     {formatDate(notification.createdAt)}
//                   </span>
//                 </div>
//                 {!notification.seen && <span className="unread-badge">New</span>}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <Empty message="No notifications" />
//         )}
//       </section>
//       <Footer />
//     </>
//   );
// };

// export default Notifications;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Empty from "../components/Empty";
import Loading from "../components/Loading";
import "../styles/notification.css";

axios.defaults.baseURL = "http://localhost:5002/api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get("/notification/getallnotifs", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(data);
      
      // Mark as seen
      await axios.put("/notification/mark-seen", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(getAllNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'appointment': return '📅';
      case 'doctor_application': return '👨‍⚕️';
      default: return '📢';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <section className="notifications-section">
        <h2 className="page-heading">Notifications</h2>

        {notifications.length > 0 ? (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div 
                key={notification._id} 
                className={`notification-item ${!notification.seen ? 'unread' : ''}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p>{notification.content}</p>
                  <span className="notification-time">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>
                {!notification.seen && <span className="unread-badge">New</span>}
              </div>
            ))}
          </div>
        ) : (
          <Empty message="No notifications" />
        )}
      </section>
      <Footer />
    </>
  );
};

export default Notifications;