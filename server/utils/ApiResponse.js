class ApiResponse {
  constructor(statusCode, message = "", data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  toObject({ includeError = true, flattenData = true } = {}) {
    const response = {
      success: this.success,
    };

    if (includeError) response.error = !this.success;
    if (this.message) response.message = this.message;

    if (this.data !== null && this.data !== undefined) {
      if (
        flattenData &&
        typeof this.data === "object" &&
        !Array.isArray(this.data)
      ) {
        Object.assign(response, this.data);
      } else {
        response.data = this.data;
      }
    }

    return response;
  }

  toJSON() {
    return this.toObject();
  }
}

export default ApiResponse;
