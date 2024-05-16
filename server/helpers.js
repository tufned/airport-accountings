
exports.successObj = (data) => ({
  status: 'success',
  data: data
});

exports.failObj = (msg) => ({
  status: 'fail',
  message: msg
});