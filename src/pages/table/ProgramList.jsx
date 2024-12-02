import React from 'react';
import PropTypes from 'prop-types';
import ProgramItem from './ProgramItem';
import { InsertButton } from './styles'; 

const ProgramList = ({
    programs,
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
    highlightText,
    handleInsert
}) => {
    return (
        <div>
            <InsertButton onClick={handleInsert}>New Program</InsertButton>
            {programs?.map(program => (
                <ProgramItem
                    key={program.name}
                    program={program}
                    expandedPrograms={expandedPrograms}
                    toggleProgram={toggleProgram}
                    handleEdit={handleEdit}
                    openDeleteModal={openDeleteModal}
                    expandedSections={expandedSections}
                    toggleParameterSection={toggleParameterSection}
                    handleParameterChange={handleParameterChange}
                    handleValueChange={handleValueChange}
                    handleAddValue={handleAddValue}
                    handleAddParameter={handleAddParameter}
                    searchTerm={searchTerm}
                    highlightText={highlightText}
                />
            ))}
        </div>
    );
};

ProgramList.propTypes = {
    programs: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
    ).isRequired,
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
    highlightText: PropTypes.func.isRequired,
    handleInsert: PropTypes.func.isRequired
};

export default ProgramList;