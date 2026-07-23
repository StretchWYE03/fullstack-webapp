import { useState, useEffect } from "react";
import { apiClient } from "../api/v1/client";

type Item = {
    id: number;
    text: string;
    number: number;
    binary: boolean;
};

function ItemTable(){
    const [items, setItems] = useState<Item[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingText, setEditingText] = useState<string>("");

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await apiClient.get("/items/");
            setItems(response.data);
        } catch (error) {
            console.error("Failed to fetch items:" , error);

        }
    };


const handleSave = async (id: number) => {
    try {
      await apiClient.put(`/items/${id}`, { text: editingText });
      setEditingId(null);
      fetchItems();
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  

  
};
return (
    <table border={1} style={{ marginTop: "2rem", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ padding: "0.5rem" }}>ID</th>
          <th style={{ padding: "0.5rem" }}>Text</th>
          <th style={{ padding: "0.5rem" }}>Number</th>
          <th style={{ padding: "0.5rem" }}>Binary</th>
          <th style={{ padding: "0.5rem" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td style={{ padding: "0.5rem" }}>{item.id}</td>
            <td style={{ padding: "0.5rem" }}>
              {editingId === item.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
              ) : (
                item.text
              )}
            </td>
            <td style={{ padding: "0.5rem" }}>{item.number}</td>
            <td style={{ padding: "0.5rem" }}>{item.binary ? "Yes" : "No"}</td>
            <td style={{ padding: "0.5rem" }}>
              {editingId === item.id ? (
                <button onClick={() => handleSave(item.id)}>Save</button>
              ) : (
                <button onClick={() => { setEditingId(item.id); setEditingText(item.text); }}>
                  Edit
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ItemTable;