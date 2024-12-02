import React from 'react';
import PropTypes from 'prop-types';
import ParameterItem from './ParameterItem';
import { AddButton } from './styles'; 

const ParameterList = ({
    parameters,
    expandedSections,
    toggleParameterSection,
    handleParameterChange,
    handleValueChange,
    handleAddValue,
    handleAddParameter
}) => {
    return (
        <div>
            {parameters?.map((param, paramIndex) => (
                <ParameterItem
                    key={paramIndex}
                    param={param}
                    paramIndex={paramIndex}
                    expandedSections={expandedSections}
                    toggleParameterSection={toggleParameterSection}
                    handleParameterChange={handleParameterChange}
                    handleValueChange={handleValueChange}
                    handleAddValue={handleAddValue}
                />
            ))}
            <AddButton type="button" onClick={handleAddParameter}>Add Parameter</AddButton>
        </div>
    );
};

ParameterList.propTypes = {
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
    ).isRequired,
    expandedSections: PropTypes.object.isRequired,
    toggleParameterSection: PropTypes.func.isRequired,
    handleParameterChange: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddValue: PropTypes.func.isRequired,
    handleAddParameter: PropTypes.func.isRequired
};

export default ParameterList;