import React, { useState } from 'react';
import { Table, Input, Button, DatePicker, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // Use dayjs instead of moment

// Define the structure of a timesheet row
interface TimesheetRow {
  key: number;
  project: string;
  comments: string;
  [key: string]: string | number; // Dynamic keys for days (e.g., day0, day1, etc.)
}

const Timesheet: React.FC = () => {
  // State to manage the timesheet data
  const [dataSource, setDataSource] = useState<TimesheetRow[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(null); // Selected start date (Monday)

  // Generate dynamic columns for the selected week
  const generateColumns = () => {
    if (!startDate) return []; // Return empty columns if no start date is selected

    const columns: any[] = [
      {
        title: 'Project',
        dataIndex: 'project',
        key: 'project',
        render: (text: string, record: TimesheetRow, index: number) => (
          <Input
            value={text}
            onChange={(e) => handleProjectChange(e, index)}
            placeholder="Project Name"
          />
        ),
      },
    ];

    // Add columns for each day of the week
    for (let i = 0; i < 7; i++) {
      const day: Dayjs = startDate.add(i, 'day');
      const dayTitle: string = day.format('dddd, MMMM D'); // Format: Monday, September 1
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
        title: 'Comments',
        dataIndex: 'comments',
        key: 'comments',
        render: (text: string, record: TimesheetRow, index: number) => (
          <Input
            value={text}
            onChange={(e) => handleCommentsChange(e, index)}
            placeholder="Comments"
          />
        ),
      },
      {
        title: 'Action',
        key: 'action',
        render: (text: string, record: TimesheetRow, index: number) => (
          <Button type="link" danger onClick={() => handleDeleteRow(index)}>
            Delete
          </Button>
        ),
      }
    );

    return columns;
  };

  // Handle project name change
  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData[index].project = e.target.value;
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
  const handleCommentsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData[index].comments = e.target.value;
    setDataSource(newData);
  };

  // Add a new row
  const handleAddRow = () => {
    if (!startDate) {
      message.warning('Please select a start date first.');
      return;
    }

    const newRow: TimesheetRow = {
      key: dataSource.length + 1,
      project: '',
      comments: '',
    };

    // Initialize empty values for each day
    for (let i = 0; i < 7; i++) {
      newRow[`day${i}`] = '';
    }

    setDataSource([...dataSource, newRow]);
  };

  // Delete a row
  const handleDeleteRow = (index: number) => {
    const newData: TimesheetRow[] = [...dataSource];
    newData.splice(index, 1);
    setDataSource(newData);
  };

  // Handle date selection (only allow Mondays)
  const handleDateChange = (date: Dayjs | null) => {
    if (date && date.day() === 1) {
      setStartDate(date);
      setDataSource([]); // Clear existing data when a new date is selected
    } else {
      message.error('Please select a Monday.');
    }
  };

  // Disable dates that are not Mondays
  const disabledDate = (current: Dayjs) => {
    return current.day() !== 1; // Disable all days except Monday
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <DatePicker
          value={startDate}
          onChange={handleDateChange}
          disabledDate={disabledDate}
          disabled={startDate==null?false:true}
          placeholder="Select a Monday"
        />
      </div>
      <Button type="primary" onClick={handleAddRow} style={{ marginBottom: 16 }}>
        Add Project
      </Button>
      <Table
        columns={generateColumns()}
        dataSource={dataSource}
        pagination={false}
        bordered
      />
    </div>
  );
};

export default Timesheet;