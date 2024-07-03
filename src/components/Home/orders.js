import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure axios is imported
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export const getOrders = () => {
  return new Promise((onSuccess, onFail) => {
    const email =localStorage.getItem('email')
    axios
      .get(`/api/orders/${email}`)
      .then((response) => {
        if (response.data) {
          onSuccess(response.data);
        } else {
          onFail('No data received');
        }
      })
      .catch((err) => onFail(err.toString()));
  });
};

export default function Orders() {
  const [orders, setOrders] = useState([]); 

  useEffect(() => {
    getOrders().then(data => {
      console.log(data.results);
      setOrders(data.results); 
    }).catch(error => {
      console.error('Failed to fetch orders:', error);
    });
  }, []); 

  return (
    <TableContainer component={Paper} className="mt-5 mb-9">
      <Table sx={{ minWidth: 650 }} aria-label="simple table" className="mt-5 mb-9">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 && orders.map((order) =>
            order.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell component="th" scope="row">{item.name}</TableCell>
                <TableCell align="right">{item.price}</TableCell>
                <TableCell align="right">{item.quantity}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
