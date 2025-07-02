import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import UseLeadContext from "../contexts/LeadContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import useFetch from "../useFetch";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Reports = () => {
  const { data: leads, loading, error } = UseLeadContext();
  const { data: agents } = useFetch(
    `${import.meta.env.VITE_BASE_API_URL}/agents`
  );

  const [salesAgentData, setSalesAgentData] = useState({
    labels: [],
    data: [],
  });
  const [statusDistribution, setStatusDistribution] = useState({
    labels: [],
    data: [],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    if (leads && leads.length > 0) {
      const closedLeads = leads.filter(
        (lead) => lead.status === "Closed"
      ).length;
      const pipelineLeads = leads.filter(
        (lead) => lead.status !== "Closed"
      ).length;

      const labels = ["Leads Closed", "Leads in Pipeline"];
      const data = [closedLeads, pipelineLeads];

      setChartData({
        labels,
        data,
      });
    }
  }, [leads]);

  const closedAndPipline = {
    labels: chartData.labels,
    datasets: [
      {
        data: chartData.data,
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: [" rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
      },
    ],
  };

  useEffect(() => {
    if (!loading && leads) {
      const statusCountObj = leads.reduce((acc, lead) => {
        if (lead.status) {
          acc[lead.status] = (acc[lead.status] || 0) + 1;
        }
        return acc;
      }, {});

      const labels = Object.keys(statusCountObj);
      const data = Object.values(statusCountObj);
      setStatusDistribution({ labels, data });
    }
  }, [leads, loading]);

  const data1 = {
    labels: statusDistribution.labels,
    datasets: [
      {
        label: "no. of status",
        data: statusDistribution.data,
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (leads && leads.length > 0 && agents && agents.length > 0) {
      const closedLeads = leads?.filter((lead) => lead.status === "Closed");

      const closedByAgent = closedLeads?.reduce((acc, lead) => {
        const agentName = lead?.salesAgent?.name;
        if (!acc[agentName]) {
          acc[agentName] = 0;
        }
        acc[agentName] += 1;
        return acc;
      }, {});

      const labels = agents?.map((agent) => agent.name);
      const data = labels.map((agentName) => closedByAgent[agentName] || 0);

      setSalesAgentData({
        labels,
        data,
      });
    } else {
      <div>No valid Leads Closed by Sales Agent found.</div>;
    }
  }, [leads, agents]);

  const { labels, data } = salesAgentData;

  const chartDataByAgent = {
    labels: labels,
    datasets: [
      {
        label: "Leads Closed",
        data: data,
        backgroundColor: "rgb(146, 208, 250)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row ">
          <Sidebar />

          <div
            className="col-12 col-md-8 d-flex   ms-0 ms-md-5"
            style={{ minHeight: "100vh", flexDirection: "column" }}
          >
            <h2 className="text-center pt-4 fw-normal">Anvaya CRM Reports </h2>
            <h4 className=" pb-4 fw-normal text-center mt-4">
              Report Overview
            </h4>

            {data1 && !loading && agents ? (
              <div className="d-flex flex-column  align-items-center  col-12 text-center ">
                <h5 className=" pb-4 fw-normal  ">
                  Total Leads closed and in Pipeline:
                </h5>

                <div class=" col-5 pb-5 ">
                  <Pie
                    data={closedAndPipline}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Total Leads Closed and in Pipeline",
                        },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            label: (context) => {
                              return `${context.label}: ${context.raw}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <h5 className=" pb-4 fw-normal  ">
                  Leads Closed by Sales Agent:
                </h5>
                <div class=" col-7  pb-5">
                  <Bar
                    data={chartDataByAgent}
                    options={{
                      responsive: true,
                      plugins: {
                        title: {
                          display: true,
                          text: "Leads Closed by Sales Agent",
                        },
                        tooltip: {
                          enabled: true,
                          callbacks: {
                            label: (context) => {
                              return `Leads Closed: ${context.raw}`;
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>

                <h5 className=" pb-4 fw-normal  ">Lead Status Distribution:</h5>
                <div class=" col-5 pb-5 ">
                  <Pie data={data1} />
                </div>
              </div>
            ) : (
              <p
                className="d-flex justify-content-center align-items-center"
                style={{ height: "50vh" }}
              >
                Loading...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
