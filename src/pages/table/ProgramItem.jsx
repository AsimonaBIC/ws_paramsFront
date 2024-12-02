import React from 'react';
import PropTypes from 'prop-types';
import ParameterList from './ParameterList';
import { ProgramContainer, ProgramHeader, ProgramTitle, Arrow, ButtonGroup, EditButton, DeleteButton, VersionText } from './styles'; 

const ProgramItem = ({
    program,
    expandedPrograms,
    toggleProgram,
    handleEdit,
    openDeleteModal,
    expandedSections,
    toggleParameterSection,
    handleParameterChange,
    handleValueChange,
    handleAddValue,
    handleAddParameter,
    searchTerm,
    highlightText
}) => {
    return (
        <ProgramContainer>
            <ProgramHeader>
                <ProgramTitle onClick={() => toggleProgram(program.name)}>
                    <h2
                        dangerouslySetInnerHTML={{
                            __html: highlightText(program.name, searchTerm)
                        }}
                    />
                    <Arrow>{expandedPrograms[program.name] ? '▼' : '▶'}</Arrow>
                    <VersionText>v{program.version}</VersionText>
                </ProgramTitle>
                <ButtonGroup>
                    <EditButton onClick={() => handleEdit(program)}>Edit</EditButton>
                    <DeleteButton name={"delete_button_program_" + program.name} onClick={() => openDeleteModal(program)}>Delete</DeleteButton>
                </ButtonGroup>
            </ProgramHeader>
            {expandedPrograms[program.name] && (
                <ParameterList
                    parameters={program.parameters}
                    expandedSections={expandedSections}
                    toggleParameterSection={toggleParameterSection}
                    handleParameterChange={handleParameterChange}
                    handleValueChange={handleValueChange}
                    handleAddValue={handleAddValue}
                    handleAddParameter={handleAddParameter}
                />
            )}
        </ProgramContainer>
    );
};

ProgramItem.propTypes = {
    program: PropTypes.shape({
        name: PropTypes.string.isRequired,
        version: PropTypes.number.isRequired,
        parameters: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                ciphered: PropTypes.bool.isRequired,
                values: PropTypes.arrayOf(
                    PropTypes.shape({
                        environment: PropTypes.string.isRequired,
                        value: PropTypes.string.isRequired
                    })
                ).isRequired
            })
        ).isRequired
    }).isRequired,
    expandedPrograms: PropTypes.object.isRequired,
    toggleProgram: PropTypes.func.isRequired,
    handleEdit: PropTypes.func.isRequired,
    openDeleteModal: PropTypes.func.isRequired,
    expandedSections: PropTypes.object.isRequired,
    toggleParameterSection: PropTypes.func.isRequired,
    handleParameterChange: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddValue: PropTypes.func.isRequired,
    handleAddParameter: PropTypes.func.isRequired,
    searchTerm: PropTypes.string.isRequired,
    highlightText: PropTypes.func.isRequired
};

export default ProgramItem;