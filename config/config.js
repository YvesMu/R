exports.PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\s\w])[^\s]{12,63}$/;

exports.EMAIL_REGEX = /^[-+\w.]+@([\w-]+\.)+[\w-]{1,16}$/;

exports.ROLES = {
  user: "1",
  accountant: "10",
  admin: "100",
};
