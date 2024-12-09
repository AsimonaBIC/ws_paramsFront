import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Header, SubHeader, TableContainer, ValueHeader, ValueDetails, Program, ProgramHeader, ProgramTitle, Arrow, VersionText, ButtonGroup, EditButton, DeleteButton, ProgramDetails, Parameter, ParameterHeader, ParameterDetails, Value, InsertButton, UserInfo, ExitButton, modalStyles } from './TableStyles';
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/logo2.png';
import Modal from 'react-modal';

function Table() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [expandedPrograms, setExpandedPrograms] = useState({});
    const [expandedParameters, setExpandedParameters] = useState({});
    const [expandedValues, setExpandedValues] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [currentProgram, setCurrentProgram] = useState(null);
    const [formData, setFormData] = useState({ name: '', version: '', parameters: [] });
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [programToDelete, setProgramToDelete] = useState(null);
    const isAnyModalOpen = deleteModalIsOpen || showModal;
    const [errorMessage, setErrorMessage] = useState(''); 
    const [fetchError, setFetchError] = useState('');
    const [deleteError, setDeleteError] = useState('');

    useEffect(() => {
        const userCookie = Cookies.get('user');
        console.log('User cookie:', userCookie);
        if (!userCookie) {
            navigate('/');
        } else {
            try {
                const base64Url = userCookie.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const user = JSON.parse(jsonPayload);
                setUsername(user.name);
                fetchPrograms();
            } catch (error) {
                console.error('Error decoding user cookie:', error);
                navigate('/');
            }
        }
    }, [navigate]);

    const handleToggleJsonEditor = (paramIndex, valueIndex) => {
        const updatedParameters = [...(formData.parameters || [])];
        const updatedValues = [...(updatedParameters[paramIndex].values || [])];
    
        updatedValues[valueIndex] = {
            ...updatedValues[valueIndex],
            isJsonEditorEnabled: !updatedValues[valueIndex].isJsonEditorEnabled,
        };
        updatedParameters[paramIndex] = { ...updatedParameters[paramIndex], values: updatedValues };
    
        setFormData((prevState) => ({
            ...prevState,
            parameters: updatedParameters,
        }));
    };
    

    const filteredPrograms = programs.map(program => {
        const filteredParameters = program.parameters?.map(param => {
            const filteredValues = param.values?.filter(value => {
                const valueString = typeof value.value === 'string' ? value.value : JSON.stringify(value.value);
                return value.environment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       valueString.toLowerCase().includes(searchTerm.toLowerCase());
            });
    
            if (
                param.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                param.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                filteredValues.length > 0
            ) {
                return { ...param, values: filteredValues };
            }
            return null;
        }).filter(param => param !== null);
    
        if (
            program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            filteredParameters.length > 0
        ) {
            return { ...program, parameters: filteredParameters };
        }
        return null;
    }).filter(program => program !== null);

    const openDeleteModal = (program) => {
        setProgramToDelete(program);
        setDeleteModalIsOpen(true);
    };
    
    const closeDeleteModal = () => {
        setDeleteModalIsOpen(false);
        setProgramToDelete(null);
    };
    
    const confirmDelete = async () => {
        if (programToDelete) {
            setDeleteError('');
            try {
                await handleDelete(programToDelete.name);
                closeDeleteModal();
            } catch (error) {
                console.error('Error deleting program:', error);
                setDeleteError('Error deleting program');

            }
        };
    };
    
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, `<span class="highlight">$1</span>`);
    };

    const fetchPrograms = async () => {
        setFetchError('');
        try {
            const response = await axios.get('http://localhost:3001/api/program', { withCredentials: true });
            console.log('Full response:', response); 
            if (response && response.data && response.data.programs) {
                console.log('Fetched programs:', response.data.programs); 
                setPrograms(response.data.programs);
            } else {
                console.error('Invalid response structure:', response);
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
            setFetchError('Error fetching programs');
            if (error.response) {
                console.error('Error response data:', error.response.data);
            }
        }
    };

    const toggleProgram = (programName) => {
        setExpandedPrograms(prevState => ({
            ...prevState,
            [programName]: !prevState[programName]
        }));
    };

    const toggleParameter = (programName, parameterName) => {
        setExpandedParameters(prevState => ({
            ...prevState,
            [programName]: {
                ...prevState[programName],
                [parameterName]: !prevState[programName]?.[parameterName]
            }
        }));
    };

    const handleExitClick = () => {
        Cookies.remove('user');
        navigate('/');
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setCurrentProgram(null);
        setShowModal(false);
    };

    const handleInsert = () => {
        setFormData({ name: '', version: 1, parameters: [] });
        setModalType('insert');
        setModalIsOpen(true);
        setShowModal(true);
    };
    
    const handleEdit = (program) => {
        setFormData({
            name: program.name,
            version: program.version + 1, 
            parameters: program.parameters || []
        });
        setCurrentProgram(program);
        setModalType('edit');
        setModalIsOpen(true);
        setShowModal(true);
    };

    const handleDelete = async (programName) => {
    try {
        await axios.delete(`http://localhost:3001/api/program/${programName}`, { withCredentials: true });
        setPrograms(prevPrograms => prevPrograms.filter(program => program.name !== programName));
    } catch (error) {
        console.error('Error deleting program:', error);
        throw error;
    }
};
    
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    
    const handleParameterChange = (index, event) => {
        const { name, value } = event.target;
        const updatedParameters = [...(formData.parameters || [])];
        updatedParameters[index] = { ...updatedParameters[index], [name]: value };
        setFormData(prevState => ({
            ...prevState,
            parameters: updatedParameters
        }));
    };
    
    const handleValueChange = (paramIndex, valueIndex, event) => {
        const { name, value } = event.target;
        const updatedParameters = [...(formData.parameters || [])];
        const updatedValues = [...(updatedParameters[paramIndex].values || [])];
        updatedValues[valueIndex] = { ...updatedValues[valueIndex], [name]: value };
        updatedParameters[paramIndex] = { ...updatedParameters[paramIndex], values: updatedValues };
        setFormData(prevState => ({
            ...prevState,
            parameters: updatedParameters
        }));
    };
    
    const handleAddParameter = () => {
        setFormData(prevState => ({
            ...prevState,
            parameters: [...(prevState.parameters || []), { name: '', description: '', ciphered: false, values: [] }]
        }));
    };
    
    const handleAddValue = (paramIndex) => {
        const updatedParameters = [...(formData.parameters || [])];
        updatedParameters[paramIndex].values = [...(updatedParameters[paramIndex].values || []), { environment: '', value: '' }];
        setFormData(prevState => ({
            ...prevState,
            parameters: updatedParameters
        }));
    };

    const [expandedSections, setExpandedSections] = useState({
        program: true,
        parameters: {}
    });

    const toggleSection = (section) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [section]: !prevState[section]
        }));
    };
    
    const toggleParameterSection = (paramIndex) => {
        setExpandedSections(prevState => ({
            ...prevState,
            parameters: {
                ...prevState.parameters,
                [paramIndex]: !prevState.parameters[paramIndex]
            }
        }));
    };

    const toggleValueSection = (paramIndex, valueIndex) => {
        setExpandedValues((prevState) => ({
            ...prevState,
            [paramIndex]: {
                ...prevState[paramIndex],
                [valueIndex]: !prevState[paramIndex]?.[valueIndex]
            }
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        try {
            if (modalType === 'insert') {
                const payload = {
                    ...formData,
                    version: 1,
                };
    
                const isDuplicate = programs.some(program => program.name === payload.name);
                if (isDuplicate) {
                    alert('A program with this name already exists. Please choose a different name.');
                    return; 
                }
    
                const response = await axios.post(
                    'http://localhost:3001/api/program',
                    payload,
                    { withCredentials: true }
                );
    
                const newProgram = response.data.program;
                newProgram.parameters = newProgram.Parameters.map(param => ({
                    ...param,
                    values: param.Values.map(value => ({
                        environment: value.environment,
                        value: JSON.parse(value.value)
                    }))
                }));
                delete newProgram.Parameters;
    
                setPrograms((prevPrograms) => [...prevPrograms, newProgram]);
                await fetchPrograms(); 
            } else if (modalType === 'edit') {
                const updatedProgram = {
                    ...formData,
                    version: currentProgram.version + 1,
                    parameters: formData.parameters.map(param => ({
                        ...param,
                        values: param.values.map(value => ({
                            environment: value.environment,
                            value: value.value 
                        }))
                    }))
                };
    
                console.log('Updating program with payload:', JSON.stringify(updatedProgram, null, 2));
    
                const response = await axios.put(
                    `http://localhost:3001/api/program/${currentProgram.name}`,
                    updatedProgram,
                    { withCredentials: true }
                );
    
                const updatedProgramData = response.data.program;
                updatedProgramData.parameters = updatedProgramData.Parameters.map(param => ({
                    ...param,
                    values: param.Values.map(value => ({
                        environment: value.environment,
                        value: JSON.parse(value.value)
                    }))
                }));
                delete updatedProgramData.Parameters;
    
                setPrograms((prevPrograms) =>
                    prevPrograms.map((p) =>
                        p.name === currentProgram.name ? updatedProgramData : p
                    )
                );
            }
            closeModal();
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Error creating program');
        }
    };

    return (
        <>
            <div className={isAnyModalOpen ? "blurred" : ""}>
                <Header>
                    <img src={logo} alt="Logo" className="logo" />
                    <div className="search-container">
                    {fetchError && <div role="alert" style={{ color: 'red' }}>{fetchError}</div>} {}
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <UserInfo>{username}</UserInfo>
                    <ExitButton onClick={handleExitClick}>🔴</ExitButton> 
                </Header>
                <SubHeader>
                    <img src={logo2} alt="Logo2" className="logo2" />
                    <h1>Parameters Repository</h1>
                </SubHeader>
                <TableContainer>
    <InsertButton onClick={handleInsert}>New Program</InsertButton>
    {filteredPrograms.length === 0 ? (
        <div>No results found</div>
    ) : (
        filteredPrograms.map(program => (
            <Program key={program.name}>
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
                        <DeleteButton name={program.name} onClick={() => openDeleteModal(program)}>Delete</DeleteButton>
                    </ButtonGroup>
                </ProgramHeader>
                {expandedPrograms[program.name] && (
                    <ProgramDetails>
                        {program.parameters?.map((param, paramIndex) => (
                            <Parameter key={param.name}>
                                <ParameterHeader onClick={() => toggleParameter(program.name, param.name)}>
                                    <h3
                                        dangerouslySetInnerHTML={{
                                            __html: highlightText(param.name, searchTerm)
                                        }}
                                    />
                                    <Arrow>{expandedParameters[program.name]?.[param.name] ? '▼' : '▶'}</Arrow>
                                </ParameterHeader>
                                {expandedParameters[program.name]?.[param.name] && (
                                    <ParameterDetails>
                                        <p>
                                            <strong>Description:</strong>
                                            <span dangerouslySetInnerHTML={{ __html: highlightText(param.description, searchTerm) }} />
                                        </p>
                                        <p><strong>Ciphered:</strong> {param.ciphered ? 'Yes' : 'No'}</p>
                                        {param.values?.map((value, valueIndex) => (
                                            <Value key={value.environment}>
                                                <ValueHeader onClick={() => toggleValueSection(paramIndex, valueIndex)}>
                                                    <p>
                                                        <strong>Environment:</strong>
                                                        <span dangerouslySetInnerHTML={{ __html: highlightText(value.environment, searchTerm) }} />
                                                    </p>
                                                    <Arrow>
                                                        {expandedValues[paramIndex]?.[valueIndex] ? '▼' : '▶'}
                                                    </Arrow>
                                                </ValueHeader>
                                                {expandedValues[paramIndex]?.[valueIndex] && (
                                                    <ValueDetails>
                                                        <p>
                                                            <strong>Value:</strong>
                                                            <span dangerouslySetInnerHTML={{ __html: highlightText(JSON.stringify(value.value), searchTerm) }} />
                                                        </p>
                                                    </ValueDetails>
                                                )}
                                            </Value>
                                        ))}
                                    </ParameterDetails>
                                )}
                            </Parameter>
                        ))}
                    </ProgramDetails>
                )}
            </Program>
        ))
    )}
</TableContainer>
</div>
            
<Modal
    isOpen={deleteModalIsOpen}
    onRequestClose={closeDeleteModal}
    contentLabel="Delete Confirmation"
    ariaHideApp={false}
    style={modalStyles}
>
    <h2>¿Estás seguro de eliminar el programa: {programToDelete?.name}?</h2>
    <p>El programa se eliminará permanentemente.</p>
    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
    {deleteError && <div role="alert" style={{ color: 'red' }}>{deleteError}</div>} {}
        <button onClick={confirmDelete} data-testid="confirm-delete-button" style={{ padding: '10px 20px', backgroundColor: '#DC3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
        <button onClick={closeDeleteModal} data-testid="cancel-delete-button" style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Close</button>
    </div>
</Modal>

<Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Program Modal"
    ariaHideApp={false}
    style={modalStyles}
>
    <h2>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Program</h2>
    {errorMessage && <div role="alert" style={{ color: 'red' }}>{errorMessage}</div>} {}
    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div onClick={() => toggleSection('program')} style={{ cursor: 'pointer' }}>
            <h3>Program Details {expandedSections.program ? '▼' : '▶'}</h3>
        </div>
        {expandedSections.program && (
            <>
                <label>
                    Program Name:
                    <input type="text" name="name" value={formData.name} onChange={handleFormChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                </label>
                <label>
                    Version:
                    <input type="number" name="version" value={formData.version} readOnly style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }} />
                </label>
            </>
        )}
        <button type="button" onClick={handleAddParameter} style={{ padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Parameter</button>
        {formData.parameters?.map((param, paramIndex) => (
            <div key={paramIndex} style={{ marginTop: '15px', border: '1px solid #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                <div onClick={() => toggleParameterSection(paramIndex)} style={{ cursor: 'pointer' }}>
                    <h4>{param.name} {expandedSections.parameters[paramIndex] ? '▼' : '▶'}</h4>
                </div>
                {expandedSections.parameters[paramIndex] && (
                    <>
                        <label>
                            Parameter Name:
                            <input type="text" name="name" value={param.name} onChange={(e) => handleParameterChange(paramIndex, e)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </label>
                        <label>
                            Description:
                            <input type="text" name="description" value={param.description} onChange={(e) => handleParameterChange(paramIndex, e)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </label>
                        <label>
                            Ciphered:
                            <input type="checkbox" name="ciphered" checked={param.ciphered} onChange={(e) => handleParameterChange(paramIndex, { target: { name: 'ciphered', value: e.target.checked } })} />
                        </label>
                        <button type="button" onClick={() => handleAddValue(paramIndex)} style={{ marginLeft: '10px', marginTop: '10px', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add Value</button>
                        {param.values?.map((value, valueIndex) => (
                            <div key={valueIndex} style={{ marginTop: '10px', padding: '10px', border: '1px dashed #ccc', borderRadius: '5px', backgroundColor: '#f1f1f1' }}>
                                <label>
                                    Environment:
                                    <input type="text" name="environment" value={value.environment} onChange={(e) => handleValueChange(paramIndex, valueIndex, e)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                </label>
                                <label>
                            Value:
                            {!value.isJsonEditorEnabled ? (
                                <>
                                    <input
                                        type="text"
                                        name="value"
                                        value={typeof value.value === 'string' ? value.value : JSON.stringify(value.value, null, 2)}
                                        onChange={(e) => handleValueChange(paramIndex, valueIndex, e)}
                                        required
                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={value.isJsonEditorEnabled || false}
                                            onChange={() => handleToggleJsonEditor(paramIndex, valueIndex)}
                                        />
                                        <span style={{ marginLeft: '5px' }}>Enable JSON Editor</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <textarea
                                        name="value"
                                        value={typeof value.value === 'string' ? value.value : JSON.stringify(value.value, null, 2)}
                                        onChange={(e) => handleValueChange(paramIndex, valueIndex, e, true)}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            padding: '10px',
                                            borderRadius: '5px',
                                            border: '1px solid #ccc',
                                            fontFamily: 'monospace',
                                        }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                                        <input
                                            type="checkbox"
                                            checked={value.isJsonEditorEnabled || false}
                                            onChange={() => handleToggleJsonEditor(paramIndex, valueIndex)}
                                        />
                                        <span style={{ marginLeft: '5px' }}>Disable JSON Editor</span>
                                    </div>
                                </>
                            )}
                        </label>
                            </div>
                        ))}
                    </>
                )}
            </div>
        ))}
        <button type="submit" data-testid="submit-button" style={{ padding: '12px', backgroundColor: '#28A745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>Submit</button>
    </form>
    <button onClick={closeModal} style={{ padding: '12px', backgroundColor: '#DC3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>Close</button>
</Modal>
    </>
    );
}

export default Table;
