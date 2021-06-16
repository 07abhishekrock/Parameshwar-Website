import "@babel/polyfill";
import axios from "axios";
import {
    assign
} from "nodemailer/lib/shared";

export const addproduct = async (form) => {

    // var ws = new WebSocket("ws://localhost:3000/alok/api/v1/login");
    try {
        const res = await axios({
            method: "POST",
            url: "/api/v1/videos",
            data: form
            // headers: {
            //     Authorization: `Bearer ${req.cookies.jwt}`,
            // },
            // data: {
            //     name,
            //     price,
            //     maxprice,
            //     category,
            //     subcategory,
            //     availableQty,
            //     productWeight,
            //     productDescription,
            //     approvedBy,
            //     enableDisplay,
            //     photo
            // },

        });
        if (res.data.status === "Success") {
            document.getElementById("SuccessAddproduct").classList.remove("hidden")
            document.getElementById("SuccessAddproduct").style.color = "green"
            document.getElementById("SuccessAddproduct").innerHTML = "Product Added Successfully"
            setTimeout(function () {
                document.getElementById("SuccessAddproduct").classList.add("hidden")

            }, 5 * 1000)

        }

        console.log(res);
    } catch (err) {
        document.getElementById("SuccessAddproduct").classList.remove("hidden")
        document.getElementById("SuccessAddproduct").style.color = "red"
        document.getElementById("SuccessAddproduct").innerHTML = "<b>ERROR IN ADDING PRODUCT!!!</b> <br><br>" + err.response.data.message

        setTimeout(function () {
            document.getElementById("SuccessAddproduct").classList.add("hidden")

        }, 5 * 1000)
    }

};

export const videoUpload = async (email, password) => {
    // var ws = new WebSocket("ws://localhost:3000/alok/api/v1/login");
    try {
        const res = await axios({
            method: "POST",
            url: "https://api.vimeo.com/me/videos",
            contentType: 'application/json',
          headers: {
                    "Authorization": "Bearer " + '24a98156eb1c61566e571e26d2b7fecf'
                },
                 Accept:'application/vnd.vimeo.*+json;version=3.4'
                 ,
            
            data: {
                
                    "upload": {
                      "approach": "post",
                      "size": 100000,
                      "redirect_url": "https://codewick.net"
                    }
                  
            },
        });

        if (res.data.status === "Success") {
            location.assign("/");
        }

    } catch (err) {
        document.querySelector(".hideAlert").classList.remove("alert");
        document.getElementById("alert").innerHTML = err.response.data.message;
    }
};



export const login = async (email, password) => {
    // var ws = new WebSocket("ws://localhost:3000/alok/api/v1/login");
    try {
        const res = await axios({
            method: "POST",
            url: "/alok/api/v1/users/login",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === "Success") {
            location.assign("/");
        }

    } catch (err) {
        document.querySelector(".hideAlert").classList.remove("alert");
        document.getElementById("alert").innerHTML = err.response.data.message;
    }
};

export const signup = async (name, email, phone, password, passwordConf) => {
    // var ws = new WebSocket("ws://localhost:3000/alok/api/v1/login");
    try {
        const res = await axios({
            method: "POST",
            url: "/alok/api/v1/users/signup",
            data: {
                name,
                email,
                phone,
                password,
                passwordConf,
            },
        });
        if (res.data.status === "Success") {
            location.assign("/");
        }

    } catch (err) {
        if (err.response.status === 500) {
            document.querySelector(".hideAlert").classList.remove("alert");
            document.getElementById("alert").innerHTML =
                "Cannot Submit Form Please Fill Required Field Correctly";
        } else {
            document.querySelector(".hideAlert").classList.remove("alert");
            document.getElementById("alert").innerHTML = err.response.data.message;
        }
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "/alok/api/v1/users/logout",
        });

        if (res.data.status === "success") {
            location.reload(true);
            location.assign("/");
        }
    } catch (error) {
        alert("Error in Logging Out. Please Try Again!!!");
    }
};