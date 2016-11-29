exports.response = function (data, message, isSuccess) {
    isSuccess = isSuccess == undefined ? true : false;
    return { isSuccess: isSuccess, message: message, data: data };
};

exports.formatDate = function (val, format) {
    if (!format)
        return val.split("/")[2] + "/" + val.split("/")[1] + "/" + val.split("/")[0];

    return val.split("/")[2] + "/" + val.split("/")[0] + "/" + val.split("/")[1];
};

exports.isAuthenticate = function (req, res, next) {
    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.send(403);
    }
}