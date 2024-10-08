import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { createTicket } from "../api/ticketAPI";
import { TicketData } from "../interfaces/TicketData";
import { UserData } from "../interfaces/UserData";
import { retrieveUsers } from "../api/userAPI";
import auth from "../utils/auth";
import LoginProps from "../interfaces/LoginProps";

const CreateTicket = () => {
  const [newTicket, setNewTicket] = useState<TicketData | undefined>({
    id: 0,
    name: "",
    description: "",
    status: "Todo",
    assignedUserId: 1,
    assignedUser: null,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {setLoggedIn}: LoginProps = useOutletContext();

  const [users, setUsers] = useState<UserData[] | undefined>([]);

  const getAllUsers = async () => {
    try {
      const data = await retrieveUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to retrieve user info", err);
    }
  };

  useEffect(() => {
    // make sure user is still logged in (i.e. token is still valid)
    if (auth.loggedIn()) {
      getAllUsers();
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // make sure user is still logged in (i.e. token is still valid)
    if (auth.loggedIn()) {
      if (newTicket) {
        try {
          await createTicket(newTicket);
          navigate("/");
        } catch (err) {
          setErrorMessage("Name and Description are required.");
          // console.error('Failed to create ticket:', err);
        }
      }
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleTextChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleUserChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  return (
    <>
      <div className="container">
        <form className="form" onSubmit={handleSubmit}>
          <h1>Create Ticket</h1>
          <label htmlFor="tName">Ticket Name</label>
          <textarea
            id="tName"
            name="name"
            value={newTicket?.name || ""}
            onChange={handleTextAreaChange}
          />
          <label htmlFor="tStatus">Ticket Status</label>
          <select
            name="status"
            id="tStatus"
            value={newTicket?.status || ""}
            onChange={handleTextChange}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <label htmlFor="tDescription">Ticket Description</label>
          <textarea
            id="tDescription"
            name="description"
            value={newTicket?.description || ""}
            onChange={handleTextAreaChange}
          />
          <label htmlFor="tUserId">User's ID</label>
          <select
            name="assignedUserId"
            value={newTicket?.assignedUserId || ""}
            onChange={handleUserChange}
          >
            {users ? (
              users.map((user) => {
                return (
                  <option key={user.id} value={String(user.id)}>
                    {user.username}
                  </option>
                );
              })
            ) : (
              <textarea
                id="tUserId"
                name="assignedUserId"
                value={newTicket?.assignedUserId || 0}
                onChange={handleTextAreaChange}
              />
            )}
          </select>
          <p className="error">{errorMessage}</p>
          <button type="submit" onSubmit={handleSubmit}>
            Submit Form
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTicket;
