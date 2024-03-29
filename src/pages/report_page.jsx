import { IoSearchSharp } from "react-icons/io5";
import CardsGridManagement from "../components1/cardsgridmanagement";
import emapping from "../assets1/images/emapping.png";
import pic1 from "../assets1/pic1.png";
import pic2 from "../assets1/pic1.png";
import pic3 from "../assets1/pic1.png";

import { IoAddCircle } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api_root, bearer_token, keep_json_data } from "../api/api_variables";
import SessionExpired from "../components1/session_expired";
import { handleDeleteCookie } from "../api/delete_cookie";
import SuperCardsGridManagement from "../components1/super_cards_grid";



export let selected_models= [];

export default function SuperAdminReport() {
    var access_token;

    const [is_expired, set_is_expired]= useState(false);
    const is_expired_ = (e) => {
        if (e.code === "ERR_BAD_REQUEST"){
            handleDeleteCookie();
            set_is_expired(true)
        }
        else{set_is_expired(false)}
    }


    const getCookie = (name) => {
        const cookies = document.cookie.split(';');

        for (const cookie of cookies) {
            const [cookieName, cookieValue] = cookie.trim().split('=');

            if (cookieName === name) {
            return decodeURIComponent(cookieValue);
            }
        }

        return null;
    };

    const handleGetCookie = () => {
        // Retrieve the value of the "exampleCookie" cookie
        access_token = getCookie('access_token');
    };



    const navigate= useNavigate();
    const handleLogout= () => {
        handleDeleteCookie();
        navigate('/user-login', {relative: true});
    }


    function model_add_(event){
        // If you want to rewrite current page in history with the target page, use replace: true. Otherwise, leave out the config object or set replace: false.
        navigate('/admin-add-model', {relative: true});
    }

    function view_admin_(event){
        navigate('/view-admin', {relative: true});
    }

    function dashboard_(event){
        // If you want to rewrite current page in history with the target page, use replace: true. Otherwise, leave out the config object or set replace: false.
        navigate('/admin-super-management', {relative: true});
    }

    function home_page_(event){
        // If you want to rewrite current page in history with the target page, use replace: true. Otherwise, leave out the config object or set replace: false.
        navigate('/', {relative: true});
    }


    function report_page(event){
        navigate('/admin-super-report', {relative: true});
    }




    const [is_model_delete, set_is_model_delete]= useState(false);
    const [model_json_data, set_model_json_data]= useState([]);
    const model_json_data_= (res) => {
        keep_json_data.length= 0;
        keep_json_data.push(res.data);
        set_model_json_data(res.data);
    };

    

    useEffect(() => {
        selected_models=[];

        handleGetCookie();
        if (access_token === null){
            navigate('/admin-login------', {relative: true});
        }

        else{
            axios.get(api_root + 'admin/get-all-users', {
                headers: {
                    'Authorization': access_token,
                    'Content-Type': 'application/json', // Add other headers if needed
                  },
            }).then(res => model_json_data_(res))
            .catch(e => is_expired_(e));
        }
    }, [is_model_delete]); //the empty array is very important at the back, which means we are saying the effect does not depends on anything so as to prevent it from autorefiring by itself after first run of the page loading, even if there is any varibale or thing that changes in it



    function allow_search(){
        document.getElementById('search_input').focus();
    }

    const [cancel_delete, setDelete]= useState(false);
    const cancel_delete_= () => {
        setDelete(!cancel_delete);
    }

    const [continue_delete, setContinueDelete]= useState(false);
    const continue_delete_= () => {
        // console.log(selected_models);
        // setContinueDelete(!continue_delete);


        setContinueDelete(!continue_delete);

        handleGetCookie();
        if (access_token === null){
            navigate('/admin-login---', {relative: true});
        }
        
        else{
            axios.request(
                {
                    method: 'delete',
                    url: api_root + `admin/delete-model-super-admin?id=[${selected_models}]`,
                    headers: { 
                        'Authorization': access_token,
                        'Content-Type': 'application/json'
                    },

                    data: selected_models
                    // params: {
                    //     id: selected_models
                    // },
                }
            )
            .then((response) => {
                setContinueDelete(false);
                cancel_delete_();
                
                set_is_model_delete(!is_model_delete);
            })
            .catch((error) => {
                console.log(error);
                setContinueDelete(false);
                cancel_delete_();
            });

        }
    }

    

    return (
        !is_expired 
            ? <div className="max-h-screen grid grid-cols-4 justify-center items-center mx-auto bg-[#C3B598] pb-10">
            
            <div className= "text-white relative overflow-hidden h-screen justify-start justify-items-start items-start text-start bg-[#714E2C]"> 
                <img alt="/" src={emapping}  onClick={home_page_} className="cursor-pointer absolute top-5 left-0 right-0 mx-auto w-[158px]"/>

                <div className="absolute top-32  left-0 right-0 w-full space-y-5">
                    <h1 onClick={dashboard_} className="cursor-pointer text-center">Dashboard</h1>
                    <h1 onClick={view_admin_} className="cursor-pointer text-center -ml-[1.5rem]">Admins</h1>
                    <h1 onClick={report_page} className="cursor-pointer text-center -ml-[2.0rem]">Report</h1>
                </div>

                <h1 onClick={handleLogout} className="cursor-pointer -ml-[2.0rem] text-center absolute bottom-10 left-0 right-0 underline">Logout</h1>
            </div>
            
            <div className="relative overflow-y-auto overflow-hidden h-screen col-span-3  items-center justify-center">
               <img alt="" src={pic1} />
               <img alt="" src={pic2} />
               <img alt="" src={pic3} />
            </div>


            {continue_delete 
                ? 
                    <div className="h-screen bg-black/70 text-center text-white flex flex-col justify-center items-center absolute top-0 bottom-0 left-0 right-0">
                        <svg className="animate-spin h-10 w-10 bg-blue-700 mb-4" viewBox="0 0 24 24">
                        </svg>
                        Deleting data
                    </div>
                
                :   <div> </div>
            }
        </div>

        
        : <SessionExpired />
    );
  }
