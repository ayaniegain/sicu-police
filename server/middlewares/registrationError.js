const registrationError = (err, req, res, next) => {
    console.error('Registration error:', err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ status: 'error', message: 'Invalid registration ID' });
    }

    if (err.name === 'ValidationError') {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(422).json({ status: 'error', message: 'Validation error', errors });
    }

    // Default error handling
    res.status(500).json({ status: 'error', message: 'Internal server error' });
};

module.exports = registrationError;
