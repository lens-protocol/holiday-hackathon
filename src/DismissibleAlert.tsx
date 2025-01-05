import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/material';

// Define the props interface
interface DismissibleAlertProps {
    type: 'success' | 'info' | 'warning' | 'error'; // Define the allowed types
    message: string; // Define the message type
}
const DismissibleAlert: React.FC<DismissibleAlertProps> = ({ type, message }) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        // Set a timer to dismiss the alert after 5 seconds
        const timer = setTimeout(() => {
            setOpen(false);
        }, 5000);

        // Cleanup the timer on component unmount
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {open && (
                <Alert
                    severity={type} // 'success' | 'info' | 'warning' | 'error'
                >
                    {message}
                </Alert>
            )}
        </>
    );
};

export default DismissibleAlert;