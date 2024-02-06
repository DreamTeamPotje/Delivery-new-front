import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import ListItemText from '@mui/material/ListItemText';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import Divider from '@mui/material/Divider';
import api from '@/services/api';
import useAppAuth from '@/data/hook/useAppAuth';
import AlertDialog from './delCategoriaDialog';

interface categoriaProps {
  open: boolean,
  handleClose: () => void
}

export default function CategoriaDialog(props: categoriaProps) {
  const [id, setId] = useState<number | null>(null);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [value, setValue] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [load, setLoad] = useState(true);
  const [open, setOpen] = useState(false);
  const { login } = useAppAuth();

  const cofirmOpen = (id: number, categoria: string) => {
    setId(id);
    setCategoria(categoria);
    setOpen(true);
  }

  const cofirmClose = () => {
    setOpen(false);
  }

  const getCategorias = useCallback(() => {
    setLoad(true);
    api.get('/categoria/all', {
      headers: {
        Authorization: `Bearer ${login?.access_token}`,
      }
    })
      .then((res) => {
        setCategorias(res.data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error('Não foi possivel obter os dados dos produtos.')
      })
  },[login])

  const insertCategoria = async () => {
    if (value.length <= 1) {
      return toast.error('O campo categoria é obrigatório.')
    }

    await api.post('/categoria/create', {
      nameCategoria: value
    },
      {
        headers: {
          Authorization: `Bearer ${login?.access_token}`,
        },
      }
    )
      .then((res) => {
        toast.success(`Categoria ${value} cadastrada com sucesso.`)
        getCategorias();
        setValue('');
      })
      .catch((err) => {
        toast.error('Não foi possivel inserir uma nova categoria.')
      })
  }

  useEffect(() => {
    getCategorias()
  },[getCategorias]);

  return (
    <>
      <AlertDialog
        open={open}
        handleClose={cofirmClose}
        categoria={categoria}
        id={id}
        getCategorias={getCategorias}
      />
      <Dialog open={props.open} onClose={props.handleClose} fullWidth maxWidth={'sm'}>
        <DialogTitle sx={{ padding: 2, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
          <Stack direction="row" spacing={2} flexGrow={1}>
            <TextField
              autoFocus={true}
              required
              fullWidth
              margin="dense"
              id="categoria"
              name="categoria"
              label="categoria"
              type="text"
              variant="outlined"
              size="small"
              value={value}
              onChange={(e) => { setValue(e.target.value) }}
            />
          </Stack>
          <Stack direction="row" spacing={2} marginLeft={2}>
            <Button color="success" variant='contained' type="button" onClick={insertCategoria}>Adicionar</Button>
            <Button type='button' variant='contained' color='error' onClick={props.handleClose}>Fechar</Button>
          </Stack>
        </DialogTitle>
        {load ? (
          <DialogContent dividers>
            <>
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
              <Skeleton animation="wave" />
            </>
          </DialogContent>
        ) : (
          <DialogContent sx={{ padding: 1, backgroundColor: '#f0f0f0' }} dividers>
            <List dense sx={{ backgroundColor: '#fff' }}>
              {categorias.map((item: { id: number, nameCategoria: string }, index) => (
                <div key={item.id}>
                  <ListItem secondaryAction={
                    <IconButton onClick={() => { cofirmOpen(item.id, item.nameCategoria) }}>
                      <DeleteIcon color='error' />
                    </IconButton>
                  }>
                    <ListItemText>{item.nameCategoria}</ListItemText>
                  </ListItem>
                  {categorias.length - 1 === index ? ('') : (<Divider component="li" light />)}
                </div>
              ))}
            </List>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}