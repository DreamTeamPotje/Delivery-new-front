import { toast } from "react-toastify";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from '@/services/api';
import useAppAuth from '@/data/hook/useAppAuth';

interface cofirmProps {
  id: number | null,
  categoria: string | null,
  open: boolean,
  handleClose: () => void,
  getCategorias: () => void
}

export default function AlertDialog(props: cofirmProps) {
  const { login } = useAppAuth();

  const delCategoria = async () => {
    await api.delete(`/categoria/delete/${props?.id}`, {
      headers: {
        Authorization: `Bearer ${login?.access_token}`,
      }
    })
      .then((res) => {
        toast.success('Categoria excluida com sucesso.')
        props.getCategorias()
      })
      .catch((err) => {
        toast.error('Não foi excluir a categoria.')
      })
    props.handleClose()
  }

  return (
    <>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Deseja realmente excluir a categoria?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`${props?.categoria}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose}>Cancelar</Button>
          <Button onClick={delCategoria} autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}