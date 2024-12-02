import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import logo from '../../assets/logo.svg';
import logo2 from '../../assets/logo2.png';
//if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#app');
//Modal.setAppElement('#root');

function Table() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [expandedPrograms, setExpandedPrograms] = useState({});
    const [expandedParameters, setExpandedParameters] = useState({});
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

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
            navigate('/');
        } else {
            try {
                const user = JSON.parse(atob(userCookie.split('.')[1]));
                setUsername(user.name);
                fetchPrograms();
            } catch (error) {
                console.error('Error decoding user cookie:', error);
                navigate('/');
            }
        }
    }, [navigate]);
    
    useEffect(() => {
        console.log('Programs state updated:', programs); 
    }, [programs]);

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
            await handleDelete(programToDelete.name);
            closeDeleteModal();
        }
    };
    
    const highlightText = (text, searchTerm) => {
        if (!searchTerm) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, `<span class="highlight">$1</span>`);
    };

    const fetchPrograms = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/program', { withCredentials: true });
            console.log('Full response:', response); 
            console.log('Fetched programs:', response.data.programs); 
            setPrograms(response.data.programs);
        } catch (error) {
            console.error('Error fetching programs:', error);
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
            alert(`Error deleting program: ${error.message}`);
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

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        try {
            if (modalType === 'insert') {
                const payload = {
                    ...formData,
                    version: 1,
                };
    
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
        }
    };

    return (
        <>
            <div className={isAnyModalOpen ? "blurred" : ""}>
                <Header>
                    <img src={logo} alt="Logo" className="logo" />
                    <div className="search-container">
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
                    {filteredPrograms?.map(program => (
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
                                    <DeleteButton name={"delete_button_program_" + program.name } onClick={() => openDeleteModal(program)}>Delete</DeleteButton>
                                </ButtonGroup>
                            </ProgramHeader>
                            {expandedPrograms[program.name] && (
                                <ProgramDetails>
                                    {program.parameters?.map(param => (
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
                                                    <p
                                                        dangerouslySetInnerHTML={{
                                                            __html: highlightText(param.description, searchTerm)
                                                        }}
                                                    />
                                                    <p>Ciphered: {param.ciphered ? 'Yes' : 'No'}</p>
                                                    {param.values?.map(value => (
                                                        <Value key={value.environment}>
                                                            <p
                                                                dangerouslySetInnerHTML={{
                                                                    __html: highlightText(value.environment, searchTerm)
                                                                }}
                                                            />
                                                            <p
                                                                dangerouslySetInnerHTML={{
                                                                    __html: highlightText(JSON.stringify(value.value), searchTerm)
                                                                }}
                                                            />
                                                        </Value>
                                                    ))}
                                                </ParameterDetails>
                                            )}
                                        </Parameter>
                                    ))}
                                </ProgramDetails>
                            )}
                        </Program>
                    ))}
                </TableContainer>
            </div>
            
<Modal
    isOpen={deleteModalIsOpen}
    onRequestClose={closeDeleteModal}
    contentLabel="Delete Confirmation"
    style={modalStyles}
>
    <h2>¿Estás seguro de eliminar el programa: {programToDelete?.name}?</h2>
    <p>El programa se eliminará permanentemente.</p>
    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={confirmDelete} style={{ padding: '10px 20px', backgroundColor: '#DC3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Eliminar</button>
        <button onClick={closeDeleteModal} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancelar</button>
    </div>
</Modal>

<Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Program Modal"
    style={modalStyles}
>
    <h2>{modalType.charAt(0).toUpperCase() + modalType.slice(1)} Program</h2>
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
                    <h4>Parameter {paramIndex + 1} {expandedSections.parameters[paramIndex] ? '▼' : '▶'}</h4>
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
                                    <input type="text" name="value" value={value.value} onChange={(e) => handleValueChange(paramIndex, valueIndex, e)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                                </label>
                            </div>
                        ))}
                    </>
                )}
            </div>
        ))}
        <button type="submit" style={{ padding: '12px', backgroundColor: '#28A745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>Submit</button>
    </form>
    <button onClick={closeModal} style={{ padding: '12px', backgroundColor: '#DC3545', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '15px' }}>Close</button>
</Modal>
    </>
    );
}

const VersionText = styled.span`
    font-size: 0.8rem;
    color: #ccc;
    padding: 0.5rem 1rem;
`;

const DeleteButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #EC122C; 
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #DC143C; 
    }
    &:focus {
        outline: none;
    }
`;

const EditButton = styled.button`
    padding: 0.5rem 1rem;
    background-color: #6495ED;
    color: #fff;
    border: none;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #4495ED; 
    }
    &:focus {
        outline: none;
    }
`;

const InsertButton = styled.button`
    position: absolute;
    top: 1rem; 
    right: 2rem; 
    z-index: 2; 
    padding: 0.5rem 1rem;
    background-color: #28a745;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #218838; 
    }
    &:focus {
        outline: none;
    }
`;

const UserInfo = styled.div`
    color: white;
    margin-right: 3rem;
`;

const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#fff',
        maxWidth: '800px',
        maxHeight: '600px',
        margin: 'auto',
        border: 'none',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
        fontFamily: '"Funnel Sans", sans-serif',
    },
};

const ExitButton = styled.button`
    position: absolute;
    top: 0.8rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;

    &:hover {
        opacity: 0.8;
    }
`;

const Header = styled.div`
    width: 100%;
    background-color: black;
    padding: 1rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative; 

    .logo {
        height: 1rem;
    }

    .search-container {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 25%; 
        display: flex;
        justify-content: center;
    }

    .search-input {
        width: 100%; 
        padding: 0.2rem;
        border: 1px solid #555;
        border-radius: 0.5rem;
        background-color: white;
        color: black;
        font-size: 1rem;
    }
`;

const SubHeader = styled.div`
    width: 100%;
    background-color: #F19321;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;

    .logo2 {
        height: 2.5rem; 
    }

    h1 {
        color: white;
        font-size: 2rem;
        margin: 0;
    }
`;

const TableContainer = styled.div`
    position: relative;
    margin: 4rem auto;
    padding: 2rem;
    background-color: #7c7c7c;
    border-radius: 2rem;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 1);
    border: 0.2rem solid black;
    max-width: 90%;
    max-height: 70vh; 
    overflow-y: auto;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 5rem;
        background-color: black;
        border-top-left-radius: 1.5rem;
        border-top-right-radius: 1.5rem;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0.5rem;
        left: 1rem;
        width: 2.5rem;
        height: 2.5rem;
        background-color: #F19321;
        border-radius: 50%;
        z-index: 1;
    }
`;

const Program = styled.div`
    margin-bottom: 2rem;
    padding: 0.5rem; 
    border-radius: 0.5rem;
    margin-top: 4rem;
`;

const ProgramHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #4a4a4a;
    color: white;
    padding: 0.5rem 1rem; 
    border-radius: 0.5rem;
`;

const ProgramTitle = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    h2 {
        margin: 0;
        margin-right: 0.5rem;
    }
`;

const ProgramDetails = styled.div`
    margin-left: 1rem;
    padding: 0.5rem;
`;

const Parameter = styled.div`
    margin-left: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ParameterHeader = styled.div`
    display: flex;
    justify-content: space-between;
    cursor: pointer;
    background-color: #6a6a6a;
    color: white;
    padding: 0.5rem;
    border-radius: 0.5rem;
`;

const ParameterDetails = styled.div`
    margin-left: 1rem;
    padding: 0.5rem;
    border-left: 2px solid #000;
    background-color: #d0d0d0;
`;

const Value = styled.div`
    margin-left: 2rem;
    padding: 0.5rem;
    border-left: 2px solid #000;
    background-color: #d0d0d0;
    border-radius: 0.5rem;
`;

const Arrow = styled.span`
    font-size: 1.5rem;
`;
const styles = `
    .highlight {
        background-color: yellow;
        color: black;
        font-weight: bold;
    }
`;
const ButtonGroup = styled.div`
    display: flex;
    gap: 0.5rem;
`;
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default Table;
