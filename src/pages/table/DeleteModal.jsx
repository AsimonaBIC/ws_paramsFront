import React from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { DeleteButton, CancelButton, modalStyles } from './styles'; 

const DeleteModal = ({ isOpen, onRequestClose, onConfirmDelete, programToDelete }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Delete Confirmation"
            style={modalStyles} 
        >
            <h2>¿Estás seguro de eliminar el programa: {programToDelete?.name}?</h2>
            <p>El programa se eliminará permanentemente.</p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <DeleteButton onClick={onConfirmDelete}>Eliminar</DeleteButton>
                <CancelButton onClick={onRequestClose}>Cancelar</CancelButton>
            </div>
        </Modal>
    );
};

DeleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onConfirmDelete: PropTypes.func.isRequired,
    programToDelete: PropTypes.object
};

export default DeleteModal;