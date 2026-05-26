class ApiResponse {

    // ───────────────────────────────────────────────────
    // Generic Success Response
    // ───────────────────────────────────────────────────
  
    static success(
      res,
      statusCode,
      message,
      data = null,
      meta = null
    ) {
  
      const body = {
        success: true,
        message,
      };
  
      // Attach data if provided
      if (data !== null) {
        body.data = data;
      }
  
      // Attach metadata if provided
      if (meta !== null) {
        body.meta = meta;
      }
  
      return res
        .status(statusCode)
        .json(body);
    }
  
  
    // ───────────────────────────────────────────────────
    // 200 OK
    // ───────────────────────────────────────────────────
  
    static ok(
      res,
      message,
      data = null,
      meta = null
    ) {
  
      return this.success(
        res,
        200,
        message,
        data,
        meta
      );
    }
  
  
    // ───────────────────────────────────────────────────
    // 201 Created
    // ───────────────────────────────────────────────────
  
    static created(
      res,
      message,
      data = null
    ) {
  
      return this.success(
        res,
        201,
        message,
        data
      );
    }
  
  
    // ───────────────────────────────────────────────────
    // Paginated Response
    // ───────────────────────────────────────────────────
  
    static paginated(
      res,
      message,
      items,
      pagination
    ) {
  
      return this.success(
        res,
        200,
        message,
        items,
        {
          pagination,
        }
      );
    }
  
  
    // ───────────────────────────────────────────────────
    // 204 No Content
    // ───────────────────────────────────────────────────
  
    static noContent(res) {
  
      return res
        .status(204)
        .end();
    }
  }


export {ApiResponse}