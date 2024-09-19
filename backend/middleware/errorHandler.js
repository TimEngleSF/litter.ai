const errorHandler = (error, req, res, next) => {
    if (error) {
        console.error('Error:', error);

        const statusCode = error.statusCode || 500;

        const message =
            statusCode === 500 ? 'Internal Service Error' : error.message;

        // Send a consistent error structure
        return res.status(statusCode).json({
            status: 'error',
            message,
            ...(process.env.NODE_ENV === 'dev' && { stack: error.stack }),
        });
    }

    return next();
};

export default errorHandler;
