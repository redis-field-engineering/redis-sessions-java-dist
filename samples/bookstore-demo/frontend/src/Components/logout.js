import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function Logout(){
    let navigate = useNavigate();
    useEffect(()=>{
        const signOut = async()=>{
            await fetch("/api/account/logout", {
                method: 'POST'
            })
            navigate('/')
        }

        signOut()
    }, [])
    return(<div></div>)
}

export default Logout