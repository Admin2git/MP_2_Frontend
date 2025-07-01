import { ListGroup, ListGroupItem } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="col-md-3 bg-light p-3 sidebar-container">
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="ms-3">
            <a href="/" style={{ textDecoration: "none" }}>
              Anvaya
            </a>
          </h3>

          <button
            className="btn btn-outline-secondary d-md-none"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarNav"
            aria-controls="sidebarNav"
            aria-expanded="false"
            aria-label="Toggle Sidebar"
          >
            <i className="bi bi-list"></i>
          </button>
        </div>

        <div className=" collapse d-md-block col-12 " id="sidebarNav">
          <ListGroup className="text-center bg-light">
            <ListGroupItem className="list-group py-3">
              <a href="/" className="sidebar-link" activeClassName="active">
                Home
              </a>
            </ListGroupItem>
            <ListGroupItem className="list-group py-3">
              <a
                href="/leadsOverview"
                className="sidebar-link py-3"
                activeClassName="active"
              >
                Leads
              </a>
            </ListGroupItem>
            <ListGroupItem className="list-group py-3">
              <a
                href="/salesAgent"
                className="sidebar-link"
                activeClassName="active"
              >
                Sales Agents
              </a>
            </ListGroupItem>

            <ListGroupItem className="list-group py-3">
              <a
                href="/leadsByStatus"
                className="sidebar-link"
                activeClassName="active"
              >
                Leads by Status
              </a>
            </ListGroupItem>

            <ListGroupItem className="list-group py-3">
              <a
                href="/leadsByAgent"
                className="sidebar-link"
                activeClassName="active"
              >
                Leads by Agent
              </a>
            </ListGroupItem>

            <ListGroupItem className="list-group py-3">
              <a
                href="/reports"
                className="sidebar-link"
                activeClassName="active"
              >
                Reports
              </a>
            </ListGroupItem>
          </ListGroup>
        </div>
      </div>
    </div>
  );
};
