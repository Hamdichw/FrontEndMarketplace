import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const getProducts = () => {
  return new Promise((onSuccess, onFail) => {
    axios
      .get('/api/products')
      .then((response) => {
        if (response.data) {
          console.log(response.data);
          onSuccess(response.data);
        } else {
          onFail('No data received');
        }
      })
      .catch((err) => onFail(err.toString()));
  });
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openModifyDialog, setOpenModifyDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '' });
  const [currentProduct, setCurrentProduct] = useState({ id: 0, name: '', price: '', category: ''});
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getProducts().then(data => {
      console.log(data);
      setProducts(data);
    }).catch(error => {
      console.error('Failed to fetch products:', error);
    });
  }, []);

  const handleOpenAddDialog = () => setOpenAddDialog(true);
  const handleCloseAddDialog = () => setOpenAddDialog(false);

  const handleOpenModifyDialog = (product) => {

    setCurrentProduct(product);
    setOpenModifyDialog(true);
  };
  const handleCloseModifyDialog = () => setOpenModifyDialog(false);

  const handleInputChange = (e, setter) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setSelectedImage(files[0]);
    } else {
      setter(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleAddProduct = () => {
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    axios.post('/api/products/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }).then(() => {
      getProducts().then(data => setProducts(data)); // Refresh product list
      handleCloseAddDialog();
    }).catch(error => {
      console.error('Failed to add product:', error);
    });
  };

  const handleModifyProduct = () => {
    currentProduct.image = ""
    axios.put(`/api/products/update/${currentProduct.id}`, currentProduct).then(() => {
      setProducts(products.map(product => product.id === currentProduct.id ? currentProduct : product));
      handleCloseModifyDialog();
    }).catch(error => {
      console.error('Failed to modify product:', error);
    });
  };

  const handleDeleteProduct = (id) => {
    axios.delete(`/api/products/delete/${id}`).then(() => {
      setProducts(products.filter(product => product.id !== id));
    }).catch(error => {
      console.error('Failed to delete product:', error);
    });
  };

  return (
    <>
      

      {/* Add Product Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add a new product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill in the details of the new product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, setNewProduct)}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, setNewProduct)}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => handleInputChange(e, setNewProduct)}
          />
          <input
            type="file"
            name="image"
            onChange={(e) => handleInputChange(e, setNewProduct)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddProduct}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* Modify Product Dialog */}
      <Dialog open={openModifyDialog} onClose={handleCloseModifyDialog}>
        <DialogTitle>Modify product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please modify the details of the product.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Product Name"
            type="text"
            fullWidth
            variant="standard"
            value={currentProduct.name}
            onChange={(e) => handleInputChange(e, setCurrentProduct)}
          />
          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="standard"
            value={currentProduct.price}
            onChange={(e) => handleInputChange(e, setCurrentProduct)}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="standard"
            value={currentProduct.category}
            onChange={(e) => handleInputChange(e, setCurrentProduct)}
          />
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModifyDialog}>Cancel</Button>
          <Button onClick={handleModifyProduct}>Modify</Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper} className="mt-5 mb-9">
        <div  className="mt-3 mb-9"> 
        <Button variant="outlined" onClick={handleOpenAddDialog} className="mt-5 mb-9">
        Add Product
      </Button>
        </div>
      
        <Table sx={{ minWidth: 650, maxHeight:10 , overflow:'auto'}} aria-label="simple table" className="mt-5 mb-9">
          <TableHead>
            <TableRow>
             
              <TableCell>Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 && products.map((product) => (
              <TableRow key={product.id}>
                
                <TableCell component="th" scope="row">{product.name}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
                <TableCell align="right">{product.category}</TableCell>
                <TableCell align="right">
                  <Button onClick={() => handleOpenModifyDialog(product)}>Modify</Button>
                  <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </>
  );
}
