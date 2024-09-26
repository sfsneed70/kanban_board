import { useEffect, useState } from "react";

import { retrieveTickets, deleteTicket } from "../api/ticketAPI";
import ErrorPage from "./ErrorPage";
import Swimlane from "../components/Swimlane";
import { TicketData } from "../interfaces/TicketData";
import { ApiMessage } from "../interfaces/ApiMessage";
import { useNavigate, useOutletContext } from "react-router-dom";
import LoginProps from "../interfaces/LoginProps";

import auth from "../utils/auth";

const boardStates = ["Todo", "In Progress", "Done"];

const Board = () => {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const {loggedIn, setLoggedIn}: LoginProps = useOutletContext();
  const fetchTickets = async () => {
    try {
      const data = await retrieveTickets();
      setTickets(data);
    } catch (err) {
      console.error("Failed to retrieve tickets:", err);
      setError(true);
    }
  };

  const deleteIndvTicket = async (ticketId: number): Promise<ApiMessage> => {
    // make sure user is still logged in (i.e. token is still valid)
    if (auth.loggedIn()) {
      try {
        const data = await deleteTicket(ticketId);
        fetchTickets();
        return data;
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      setLoggedIn(false);
      navigate("/login");
      return Promise.reject("User is not logged in");
    }
  };

  useEffect(() => {
    if (auth.loggedIn()) {
      fetchTickets();
    } else {
      setLoggedIn(false);
    }
  }, []);

  if (error) {
    return <ErrorPage />;
  }

  return (
    <>
      {!loggedIn ? (
        <div className="login-notice">
          <h1>Login to create & view tickets</h1>
        </div>
      ) : (
        <div className="board">
          <div className="board-display">
            {boardStates.map((status) => {
              const filteredTickets = tickets.filter(
                (ticket) => ticket.status === status
              );
              return (
                <Swimlane
                  title={status}
                  key={status}
                  tickets={filteredTickets}
                  deleteTicket={deleteIndvTicket}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Board;
