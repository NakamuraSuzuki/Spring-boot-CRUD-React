// Hooks and Types React
import { ChangeEvent, useEffect, useState } from "react";
// React Router DOM
import { useNavigate, useParams } from "react-router-dom";
// Services
import { getItem, removeItem, updateItem } from "../services/UserService";
// Interfaces
import { IUserData } from "../types/User";
// Sweet Alert
import Swal from "sweetalert2";
// Material UI
import { Box, TextField, Button , Select , MenuItem, SelectChangeEvent , 
    ListItemText  , Theme , useTheme , Checkbox ,OutlinedInput , InputLabel , FormControl} from '@mui/material';

export const User = () => {

    const { id } = useParams();
    let navigate = useNavigate();

    const initialUserState: IUserData = {
        id: null,
        firstname: "",
        name: "",
        telephone: "",
        email : "",
        status : -1,
        role : "",
        position : -1,
    };

    const roles = [
        'Administrator',
        'Support',
        'Assistant'
    ];

    const [currentUser, setCurrentUser] = useState<IUserData>(initialUserState);
    const [errors, setErrors] = useState<Partial<IUserData>>({});

    const [personName, setPersonName] = useState<string[]>([]);

    const handleMultiChange = (event: SelectChangeEvent<typeof personName>) => {
        const {
          target: { value },
        } = event;
        setCurrentUser({...currentUser , role: typeof value === 'string' ? value : value.join(',')});
        setPersonName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const handleTelephoneChange = (event : ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/\D/g, '');
        setCurrentUser({ ...currentUser, [name]: numericValue });
    };

    const handleSelectChange = (event: SelectChangeEvent<number>) => {
        const { name, value } = event.target;
        setCurrentUser({ ...currentUser, [name]: value });
    };

    const getUser = (id: string) => {
        getItem(id)
            .then(({ data }) => {
                setCurrentUser(data);
                setPersonName(data.role.split(','));
            })
            .catch((e: Error) => {
                Swal.fire('Error', `Can't get data`, 'error');
                console.log(e);
            });
    };

    useEffect(() => {
        if (id) getUser(id);
    }, [id]);

    const validate = (): boolean => {
        const { firstname, name, telephone, email, role, status, position } = currentUser;
        const newErrors: Partial<IUserData> = {};

        if (!firstname || !name || !telephone || !email || !role || !status || !position) {
            Object.entries(currentUser).forEach(([key, value]) => {
                if ((value === "" || value == -1) && value !== 0) {
                    newErrors[key as keyof IUserData] = "This field is required";
                }
            });
        }

        if (telephone && !/^\d+$/.test(telephone)) {
            newErrors.telephone = "Please enter a valid telephone number";
        }

        if (email && !/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateUser = () => {
        const isValid = validate();

        if (isValid) {
            updateItem(currentUser.id, currentUser)
                .then(() => {
                    Swal.fire(`${currentUser.name} Updated Successfully.`, '', 'success');
                    navigate("/");
                })
                .catch((e: Error) => {
                    Swal.fire('Error', e.message, 'error');
                    console.log(e);
                });
        }
    };

    const deleteUser = () => {

        removeItem(currentUser.id)
            .then(() => {
                Swal.fire(`${currentUser.name} Successfully Deleted.`, '', 'success');
                navigate("/");
            })
            .catch((e: Error) => {
                Swal.fire('Error', e.message, 'error');
                console.log(e);
            });
    };

    return (
        <div className="edit-form">
            <h4 className="text-center">User</h4>

            <Box component='form' autoComplete='off' sx={{ '& > :not(style)': { m: 1 } }}>
                <TextField
                    label='Nombres'
                    name='firstname'
                    value={currentUser.firstname}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.firstname}
                    helperText={errors.firstname}
                />
                <TextField
                    label='Apellidos'
                    name='name'
                    value={currentUser.name}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <FormControl sx={{ m: 1, width: '100%' }}>
                    <Select
                        labelId="demo-Position-label"
                        name='position'
                        value={currentUser.position}
                        onChange={handleSelectChange}
                        fullWidth
                        error={!!errors.position}
                        displayEmpty
                    >
                        <MenuItem key = "-1" value="-1">Select Position</MenuItem>
                        <MenuItem key = "0" value="0">Auditor</MenuItem>
                        <MenuItem key = "1" value="1">Administrator</MenuItem>
                        <MenuItem key = "2" value="2">Developer</MenuItem>
                        <MenuItem key = "3" value="3">Manager</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label='Telefono'
                    name='telephone'
                    value={currentUser.telephone}
                    onChange={handleTelephoneChange}
                    fullWidth
                    error={!!errors.telephone}
                    helperText={errors.telephone}
                />
                <TextField
                    label='Correo'
                    name='email'
                    value={currentUser.email}
                    onChange={handleInputChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="demo-multiple-checkbox-label">Role</InputLabel>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        multiple
                        name="role"
                        renderValue={(selected) => selected.join(', ')}
                        style={{ width : '100%'}}
                        value={personName}
                        onChange={handleMultiChange}
                        input={<OutlinedInput label="Name" />}
                        error={!!errors.role}
                    >
                        {roles.map((role) => (
                            <MenuItem
                                key={role}
                                value={role}
                            >
                                <Checkbox checked={personName.indexOf(role) > -1} />
                                <ListItemText primary={role} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            
                <FormControl sx={{ m: 1, width: '100%' }}>
                    <Select
                        labelId="demo-Status-label"
                        name='status'
                        value={currentUser.status}
                        onChange={handleSelectChange}
                        fullWidth
                        error={!!errors.status}
                        displayEmpty
                    >
                        <MenuItem value="-1">Select Status</MenuItem>
                        <MenuItem value="0">InActive</MenuItem>
                        <MenuItem value="1">Active</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', '& > :not(style)': { m: 1 } }}>
                <Button variant='contained' color='error' onClick={deleteUser}>
                    Delete
                </Button>

                <Button variant='contained' color='success' onClick={updateUser}>
                    Update
                </Button>

                <Button variant='contained' color='primary' onClick = { () => navigate('/')}> 
                    Back
                </Button>
            </Box>
        </div>
    )
}
