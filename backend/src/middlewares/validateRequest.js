const { z } = require("zod");

const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      errors: error.errors,
    });
  }
};

const checkoutSchema = z.object({
  body: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    shippingAddress: z.string().min(10, "Address is too short"),
    orderItems: z
      .array(
        z.object({
          product: z.string(),
          quantity: z.number().min(1),
          price: z.number().min(1),
        }),
      )
      .min(1, "Cart cannot be empty"),
  }),
});

module.exports = { validateRequest, checkoutSchema };
