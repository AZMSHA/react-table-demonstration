"use client";

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { Table } from "./tableLayout";
import { columns } from "./columns";
import axios from "axios";

const TableWrapper = () => {
  const [users, setUsers] = useState(undefined);

  const fetchUsers = async () => {
    const { data } = await axios.get("https://gorest.co.in/public/v2/users");

    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box padding={6}>{users && <Table data={users} columns={columns} />}</Box>
  );
};

export default TableWrapper;
