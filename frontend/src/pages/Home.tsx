import ItemTable from "../components/ItemTable";
import ActionButton from "../components/ActionButton";
import { useUser } from "../auth/UserContext";


function Home(){
    const { role } = useUser();



    return (
        <div style={{ padding: "2rem" }}>
            <h1>Title</h1>
            {/* Custom view based on role */}
            {role === "original_admin" && (
                <p style={{ color: "purple" }}>You are an Original Admin</p>
            )}
            {role === "admin" && (
                <p style={{ color: "blue" }}>You are an Admin</p>
            )}
            {role === "user" && (
                <p style={{ color: "green" }}>You are a User</p>
            )}
            <ActionButton />
            <ItemTable />
        </div>
        
    );
}



export default Home;
