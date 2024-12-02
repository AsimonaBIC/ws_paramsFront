import React from 'react';
import PropTypes from 'prop-types';
import { ValueContainer, FormLabel, FormInput } from './styles'; 

const ValueItem = ({ value, valueIndex, paramIndex, handleValueChange }) => {
    return (
        <ValueContainer>
            <FormLabel>
                Environment:
                <FormInput
                    type="text"
                    name="environment"
                    value={value.environment}
                    onChange={(e) => handleValueChange(paramIndex, valueIndex, e)}
                    required
                />
            </FormLabel>
            <FormLabel>
                Value:
                <FormInput
                    type="text"
                    name="value"
                    value={value.value}
                    onChange={(e) => handleValueChange(paramIndex, valueIndex, e)}
                    required
                />
            </FormLabel>
        </ValueContainer>
    );
};

ValueItem.propTypes = {
    value: PropTypes.shape({
        environment: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired,
    valueIndex: PropTypes.number.isRequired,
    paramIndex: PropTypes.number.isRequired,
    handleValueChange: PropTypes.func.isRequired
};

export default ValueItem;