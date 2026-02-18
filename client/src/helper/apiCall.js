// // import axios from "axios";

// // // Backend URL from .env
// // axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

// // const fetchData = async (url) => {
// //   try {
// //     const token = localStorage.getItem("token");

// //     const { data } = await axios.get(url, {
// //       headers: {
// //         Authorization: `Bearer ${token}`,
// //       },
// //     });

// //     return data;
// //   } catch (error) {
// //     console.error("Fetch Error:", error);
// //     return null;
// //   }
// // };

// // export default fetchData;
// import axios from "axios";
// import toast from "react-hot-toast";

// // Set base URL - CHANGE THIS TO YOUR BACKEND URL
// axios.defaults.baseURL = "http://localhost:5002/api";

// const fetchData = async (url, method = "GET", data = null, headers = {}) => {
//   try {
//     const token = localStorage.getItem("token");
    
//     const config = {
//       method,
//       url,
//       headers: {
//         Authorization: token ? `Bearer ${token}` : "",
//         "Content-Type": "application/json",
//         ...headers,
//       },
//     };

//     if (data) {
//       config.data = data;
//     }

//     const response = await axios(config);
//     return response.data;
//   } catch (error) {
//     if (error.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//       toast.error("Session expired. Please login again.");
//     }
//     throw error;
//   }
// };

// export default fetchData;
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = "http://localhost:5002/api";

const fetchData = async (url, method = "GET", data = null, headers = {}) => {
  try {
    const token = localStorage.getItem("token");
    
    const config = {
      method,
      url,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      toast.error("Session expired. Please login again.");
    }
    throw error;
  }
};

export default fetchData;