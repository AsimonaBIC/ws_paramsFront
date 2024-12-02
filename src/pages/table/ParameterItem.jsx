import React from 'react';
import PropTypes from 'prop-types';
import ValueList from './ValueList';
import { Parameter, ParameterHeader, FormLabel, FormInput } from './styles'; 

const ParameterItem = ({
    param,
    paramIndex,
    expandedSections,
    toggleParameterSection,
    handleParameterChange,
    handleValueChange,
    handleAddValue
}) => {
    return (
        <Parameter>
            <ParameterHeader onClick={() => toggleParameterSection(paramIndex)} style={{ cursor: 'pointer' }}>
                <h4>Parameter {paramIndex + 1} {expandedSections.parameters[paramIndex] ? '▼' : '▶'}</h4>
            </ParameterHeader>
            {expandedSections.parameters[paramIndex] && (
                <>
                    <FormLabel>
                        Parameter Name:
                        <FormInput
                            type="text"
                            name="name"
                            value={param.name}
                            onChange={(e) => handleParameterChange(paramIndex, e)}
                            required
                        />
                    </FormLabel>
                    <FormLabel>
                        Description:
                        <FormInput
                            type="text"
                            name="description"
                            value={param.description}
                            onChange={(e) => handleParameterChange(paramIndex, e)}
                            required
                        />
                    </FormLabel>
                    <FormLabel>
                        Ciphered:
                        <input
                            type="checkbox"
                            name="ciphered"
                            checked={param.ciphered}
                            onChange={(e) => handleParameterChange(paramIndex, { target: { name: 'ciphered', value: e.target.checked } })}
                        />
                    </FormLabel>
                    <ValueList
                        values={param.values}
                        paramIndex={paramIndex}
                        handleValueChange={handleValueChange}
                        handleAddValue={handleAddValue}
                    />
                </>
            )}
        </Parameter>
    );
};

ParameterItem.propTypes = {
    param: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        ciphered: PropTypes.bool.isRequired,
        values: PropTypes.arrayOf(
            PropTypes.shape({
                environment: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired
            })
        ).isRequired
    }).isRequired,
    paramIndex: PropTypes.number.isRequired,
    expandedSections: PropTypes.object.isRequired,
    toggleParameterSection: PropTypes.func.isRequired,
    handleParameterChange: PropTypes.func.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddValue: PropTypes.func.isRequired
};

export default ParameterItem;