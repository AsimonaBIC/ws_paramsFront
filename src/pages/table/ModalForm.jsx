import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FormLabel, FormInput, FormButton, SectionHeader, AddButton, ValueContainer, modalStyles } from './styles'; 

const ModalForm = ({
    isOpen,
    onRequestClose,
    onSubmit,
    formData,
    setFormData,
    modalType,
    expandedSections,
    toggleSection,
    toggleParameterSection,
    handleFormChange,
    handleParameterChange,
    handleValueChange,
    handleAddParameter,
    handleAddValue
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Program Modal"
            style={modalStyles}
        >
            <h2>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Program</h2>
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div onClick={() => toggleSection('program')} style={{ cursor: 'pointer' }}>
                    <SectionHeader>Program Details {expandedSections.program ? '▼' : '▶'}</SectionHeader>
                </div>
                {expandedSections.program && (
                    <>
                        <FormLabel>
                            Program Name:
                            <FormInput type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                        </FormLabel>
                        <FormLabel>
                            Version:
                            <FormInput type="number" name="version" value={formData.version} readOnly />
                        </FormLabel>
                    </>
                )}
                <AddButton type="button" onClick={handleAddParameter}>Add Parameter</AddButton>
                {formData.parameters?.map((param, paramIndex) => (
                    <ValueContainer key={paramIndex}>
                        <div onClick={() => toggleParameterSection(paramIndex)} style={{ cursor: 'pointer' }}>
                            <SectionHeader>Parameter {paramIndex + 1} {expandedSections.parameters[paramIndex] ? '▼' : '▶'}</SectionHeader>
                        </div>
                        {expandedSections.parameters[paramIndex] && (
                            <>
                                <FormLabel>
                                    Parameter Name:
                                    <FormInput type="text" name="name" value={param.name} onChange={(e) => handleParameterChange(paramIndex, e)} required />
                                </FormLabel>
                                <FormLabel>
                                    Description:
                                    <FormInput type="text" name="description" value={param.description} onChange={(e) => handleParameterChange(paramIndex, e)} required />
                                </FormLabel>
                                <FormLabel>
                                    Ciphered:
                                    <input type="checkbox" name="ciphered" checked={param.ciphered} onChange={(e) => handleParameterChange(paramIndex, { target: { name: 'ciphered', value: e.target.checked } })} />
                                </FormLabel>
                                <AddButton type="button" onClick={() => handleAddValue(paramIndex)}>Add Value</AddButton>
                                {param.values?.map((value, valueIndex) => (
                                    <ValueContainer key={valueIndex}>
                                        <FormLabel>
                                            Environment:
                                            <FormInput type="text" name="environment" value={value.environment} onChange={(e) => handleValueChange(paramIndex, valueIndex, e)} required />
                                        </FormLabel>
                                        <FormLabel>
                                            Value:
                                            <FormInput type="text" name="value" value={value.value} onChange={(e) => handleValueChange(paramIndex, valueIndex, e)} required />
                                        </FormLabel>
                                    </ValueContainer>
                                ))}
                            </>
                        )}
                    </ValueContainer>
                ))}
                <FormButton type="submit">Submit</FormButton>
            </form>
            <FormButton onClick={onRequestClose}>Close</FormButton>
        </Modal>
    );
};

ModalForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    modalType: PropTypes.string.isRequired,
    expandedSections: PropTypes.object.isRequired,
    toggleSection: PropTypes.func.isRequired,
    toggleParameterSection: PropTypes.func.isRequired,
    handleFormChange: PropTypes.func.isRequired,
    handleParameterChange: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddParameter: PropTypes.func.isRequired,
    handleAddValue: PropTypes.func.isRequired
};

export default ModalForm;