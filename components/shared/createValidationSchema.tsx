import * as z from "zod";

export const createValidationSchema = (fields: any[]) => {
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    // Determine the type of the field
    switch (field.type) {
      case "text":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = z.string().min(4, `${field.name} is required`);
          //fieldSchema = fieldSchema.nonempty(`${field.name} is required`);
        }
        break;

      case "number":
        fieldSchema = z.number();
        if (field.required) {
          fieldSchema = z
            .number()
            .min(4, `${field.name} must be a positive number`);
        }
        break;

      case "select":
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum(field.options as [string, ...string[]]);
        } else {
          throw new Error(`Select field "${field.name}" must have options.`);
        }
        break;

      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    // Assign the field schema to the schema shape
    schemaShape[field.name] = fieldSchema;
  });

  // Return the zod schema
  return z.object(schemaShape);
};
