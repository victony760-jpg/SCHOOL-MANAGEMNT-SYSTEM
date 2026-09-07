const sanitize = (value) => {
  if (!value || typeof value !== "object") return;

  for (const key of Object.keys(value)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      continue;
    }

    if (typeof value[key] === "object") sanitize(value[key]);
  }
};

const mongoSanitize = () => (req, res, next) => {
  for (const key of ["body", "params", "headers", "query"]) {
    sanitize(req[key]);
  }
  next();
};

export default mongoSanitize;
