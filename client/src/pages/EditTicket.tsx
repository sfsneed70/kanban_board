import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { retrieveTicket, updateTicket } from "../api/ticketAPI";
import { TicketData } from "../interfaces/TicketData";
import auth from "../utils/auth";
import LoginProps from "../interfaces/LoginProps";

const EditTicket = () => {
  const [ticket, setTicket] = useState<TicketData | undefined>();
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { state } = useLocation();
  const { setLoggedIn }: LoginProps = useOutletContext();

  const fetchTicket = async (ticketId: TicketData) => {
    try {
      const data = await retrieveTicket(ticketId.id);
      setTicket(data);
    } catch (err) {
      console.error("Failed to retrieve ticket:", err);
    }
  };

  useEffect(() => {
    // make sure user is still logged in (i.e. token is still valid)
    if (auth.loggedIn()) {
      fetchTicket(state);
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // make sure user is still logged in (i.e. token is still valid)
    if (auth.loggedIn()) {
      if (ticket && ticket.id !== null) {
        try {
          await updateTicket(ticket.id, ticket);
          navigate("/");
        } catch (err) {
          setErrorMessage("Name and Description are required.");
          // console.error('Failed to update ticket:', err);
        }
      } else {
        console.error("Ticket data is undefined.");
      }
    } else {
      setLoggedIn(false);
      navigate("/login");
    }
  };

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTicket((prev) => (prev ? { ...prev, [name]: value } : undefined));
  };

  return (
    <>
      <div className="container">
        {ticket ? (
          <form className="form" onSubmit={handleSubmit}>
            <h1>Edit Ticket</h1>
            <label htmlFor="tName">Ticket Name</label>
            <textarea
              id="tName"
              name="name"
              value={ticket.name || ""}
              onChange={handleTextAreaChange}
            />
            <label htmlFor="tStatus">Ticket Status</label>
            <select
              name="status"
              id="tStatus"
              value={ticket.status || ""}
              onChange={handleChange}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <label htmlFor="tDescription">Ticket Description</label>
            <textarea
              id="tDescription"
              name="description"
              value={ticket.description || ""}
              onChange={handleTextAreaChange}
            />
            <p className="error">{errorMessage}</p>
            <button type="submit">Submit Form</button>
          </form>
        ) : (
          // <div className="error">Issues fetching ticket</div>
          <div></div>
        )}
      </div>
    </>
  );
};

export default EditTicket;
