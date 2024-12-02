import React from 'react';
import PropTypes from 'prop-types';
import ValueItem from './ValueItem';
import { AddButton } from './styles'; 

const ValueList = ({ values, paramIndex, handleValueChange, handleAddValue }) => {
    return (
        <div>
            {values?.map((value, valueIndex) => (
                <ValueItem
                    key={valueIndex}
                    value={value}
                    valueIndex={valueIndex}
                    paramIndex={paramIndex}
                    handleValueChange={handleValueChange}
                />
            ))}
            <AddButton type="button" onClick={() => handleAddValue(paramIndex)}>Add Value</AddButton>
        </div>
    );
};

ValueList.propTypes = {
    values: PropTypes.arrayOf(
        PropTypes.shape({
            environment: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        })
    ).isRequired,
    paramIndex: PropTypes.number.isRequired,
    handleValueChange: PropTypes.func.isRequired,
    handleAddValue: PropTypes.func.isRequired
};

export default ValueList;