export function validateBody(requiredFields = []) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid request body format.",
      });
    }

    const missing = [];
    for (const field of requiredFields) {
      const val = req.body[field];
      if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Validation Error: Missing or empty required field(s): ${missing.join(", ")}`,
        missingFields: missing,
      });
    }

    next();
  };
}
