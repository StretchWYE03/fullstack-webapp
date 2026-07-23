import { useState } from "react";
import { apiClient } from "../api/v1/client";

function ActionButton() {
    const [status, setStatus] = useState<string>("");

    const handleClick = async () => {
        setStatus("Loading...");
        try {
            const response = await apiClient.post("/items/", {
                text: "New Item",
                number: 0,
                binary: false,
            });
            setStatus(`Created item with ID: ${response.data.id}`);
        } catch (error) {
            setStatus("Error - is the backend running?");
        }

    };

    return (
        <div>
            <button onClick={handleClick}>Create Item</button>
            <p>{status}</p>
        </div>
    );
}

export default ActionButton;
