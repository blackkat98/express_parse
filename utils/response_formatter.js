const format = (successful = true, data = null, meta = null, message = '') => {
    if (successful) {
        return {
            success: true,
            message: message,
            data: data,
            meta: meta,
        }
    }

    return {
        success: false,
        message: message,
        data: null,
        meta: null,
    }
}

module.exports = format
