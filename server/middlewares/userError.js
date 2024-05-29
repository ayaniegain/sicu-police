const userError = (err, req, res, next) => {
    console.error('Error occurred:', err);
    
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }

    // Check error type and respond accordingly
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ status: 'error', message: 'Invalid JSON payload' });
    }
    if (err instanceof ValidationError) {
        return res.status(422).json({ status: 'error', message: err.message });
    }
    if (err.code === 'ENOENT') {
        return res.status(404).json({ status: 'error', message: 'Resource not found' });
    }
    if (err instanceof mongoose.Error.ValidationError) {
        const errors = {};
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        return res.status(422).json({ status: 'error', message: 'Validation error', errors });
    }
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    // Default error handling
    res.status(500).json({ status: 'error', message: 'Internal server error' });
};

module.exports = userError;
