import React, { useEffect, useState } from "react";
import { Table, Input, Button, DatePicker, Modal, Spin, Select } from "antd";
import dayjs, { Dayjs } from "dayjs"; // Use dayjs instead of moment
import axios from "axios"; // For making HTTP requests

// Define the structure of a timesheet row
interface TimesheetRow {
  key: number;
  project: string|number;
  comments: string;
  [key: string]: string | number; // Dynamic keys for days (e.g., day0, day1, etc.)
}

interface Project {
  id: number;
  project_name: string;
}

const Timesheet: React.FC = () => {
  // State to manage the timesheet data
  const [dataSource, setDataSource] = useState<TimesheetRow[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null); // Selected start date (Monday)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility state
  const [recordRow, setRecordRow] = useState<number>(0); // Modal visibility state
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({
    title: "",
    message: "",
  }); // Modal content

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/projects")
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Generate dynamic columns for the selected week
  const generateColumns = () => {
    if (!startDate) return []; // Return empty columns if no start date is selected

    const columns: any[] = [
      {
        title: "Project",
        dataIndex: "project",
        key: "project",
        render: (_: any, record: TimesheetRow, index: number) => (
          <>
            {index == recordRow ? (
              <Button disabled={true} />
            ) : (
              <Select
                placeholder="Select a project"
                loading={loading}
                onChange={(value) => handleProjectChange(value, index)}
                style={{ width: "100%" }}
              >
                {projects.map((project) => (
                  <Select.Option key={project.id} value={project.id}>
                    {project.project_name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </>
        ),
      },
    ];

    // Add columns for each day of the week
    for (let i = 0; i < 7; i++) {
      const day: Dayjs = startDate.add(i, "day");
      const dayTitle: string = day.format("dddd, MMMM D"); // Format: Monday, September 1
      columns.push({
        title: dayTitle,
        dataIndex: `day${i}`,
        key: `day${i}`,
        render: (text: string, record: TimesheetRow, index: number) => (
          <Input
            value={text}
            onChange={(e) => handleDayChange(e, index, `day${i}`)}
            placeholder="Hours"
          />
        ),
      });
    }

    // Add comments and action columns
    columns.push(
      {
        title: "Comments",
        dataIndex: "comments",
        key: "comments",
        render: (text: string, record: TimesheetRow, index: number) => (
          <>
            {index == recordRow ? (
              <Button disabled={true} />
            ) : (
              <Input
                value={text}
                onChange={(e) => handleCommentsChange(e, index)}
                placeholder="Comments"
              />
            )}
          </>
        ),
      },
      {
        title: "Action",
        key: "action",
        render: (text: string, record: TimesheetRow, index: number) => (
          <>
            {index == recordRow ? (
              <Button disabled={true} />
            ) : (
              <Button type="link" danger onClick={() => handleDeleteRow(index)}>
                Delete
              </Button>
            )}
          </>
        ),
      }
    );

    return columns;
  };

  // Calculate total hours for each day
  const calculateTotalHours = () => {
    const totals: { [key: string]: number } = {};

    // Initialize totals for each day
    for (let i = 0; i < 7; i++) {
      totals[`day${i}`] = 0;
    }

    // Sum up hours for each day
    dataSource.forEach((row) => {
      for (let i = 0; i < 7; i++) {
        const dayKey = `day${i}`;
        const hours = parseFloat(row[dayKey] as string) || 0; // Convert to number
        totals[dayKey] += hours;
      }
    });

    return totals;
  };

  // Add a total row to the data source
  const getDataSourceWithTotal = () => {
    const totals = calculateTotalHours();
    const totalRow: TimesheetRow = {
      key: -1, // Use a unique key for the total row
      project: "Total Hours",
      comments: "",
      ...totals,
    };

    return [...dataSource, totalRow];
  };

  // Handle project name change
  const handleProjectChange = (
    value: number,
    index: number
  ) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData[index].project = value;
    setDataSource(newData);
  };

  // Handle day hours change
  const handleDayChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    day: string
  ) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData[index][day] = e.target.value;
    setDataSource(newData);
  };

  // Handle comments change
  const handleCommentsChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData[index].comments = e.target.value;
    setDataSource(newData);
  };

  // Add a new row
  const handleAddRow = () => {
    if (!startDate) {
      showModal("Warning", "Please select a start date first.");
      return;
    }

    const newRow: TimesheetRow = {
      key: dataSource.length + 1,
      project: "",
      comments: "",
    };

    // Initialize empty values for each day
    for (let i = 0; i < 7; i++) {
      newRow[`day${i}`] = "";
    }

    setRecordRow(newRow.key);
    setDataSource([...dataSource, newRow]);
  };

  // Delete a row
  const handleDeleteRow = (index: number) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData.splice(index, 1);
    setRecordRow(recordRow - 1);
    setDataSource(newData);
  };

  // Handle date selection (only allow Mondays)
  const handleDateChange = (date: Dayjs | null) => {
    if (date && date.day() === 1) {
      setStartDate(date);
      setDataSource([]); // Clear existing data when a new date is selected
    } else {
      showModal("Error", "Please select a Monday.");
    }
  };

  // Disable dates that are not Mondays
  const disabledDate = (current: Dayjs) => {
    return current.day() !== 1; // Disable all days except Monday
  };

  // Show modal with title and message
  const showModal = (title: string, message: string) => {
    setModalContent({ title, message });
    setIsModalVisible(true);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  // Handle save button click
  const handleSave = async () => {
    if (!startDate) {
      showModal("Warning", "Please select a start date first.");
      return;
    }

    if (dataSource.length === 0) {
      showModal("Warning", "No data to save.");
      return;
    }

    // Prepare the payload
    const payload = {
      startDate: startDate.format("YYYY-MM-DD"), // Format the start date
      rows: dataSource, // Include all rows (excluding the total row)
      totals: calculateTotalHours(), // Include the total hours
    };

    try {
      // Send the data to the backend API
      const response = await axios.post(
        "http://localhost:3001/api/project/details",
        payload
      );
      showModal("Success", "Timesheet saved successfully!");
      console.log("API Response:", response.data);
    } catch (error) {
      showModal("Error", "Failed to save timesheet.");
      console.error("API Error:", error);
    }
  };

  return (
    <div>
      <Spin size="large" spinning={loading}>
        <div style={{ marginBottom: 16 }}>
          <DatePicker
            value={startDate}
            onChange={handleDateChange}
            disabledDate={disabledDate}
            placeholder="Select a Monday"
          />
        </div>
        <div>Total Project : {recordRow}</div>
        <Button
          type="primary"
          onClick={handleAddRow}
          style={{ marginBottom: 16, marginRight: 8 }}
        >
          Add Project
        </Button>
        <Button
          type="primary"
          onClick={handleSave}
          style={{ marginBottom: 16 }}
        >
          Save Timesheet
        </Button>
        <Table
          columns={generateColumns()}
          dataSource={getDataSourceWithTotal()} // Include the total row
          pagination={false}
          bordered
        />

        {/* Modal for displaying messages */}
        <Modal
          title={modalContent.title}
          open={isModalVisible}
          onOk={handleModalClose}
          onCancel={handleModalClose}
        >
          <p>{modalContent.message}</p>
        </Modal>
      </Spin>
    </div>
  );
};

export default Timesheet;
